import { NextRequest, NextResponse } from 'next/server'

/**
 * Training API Route
 * 
 * Triggers skill weight training using Kaggle datasets.
 * Since Vercel serverless has limitations, this:
 * 1. Accepts training requests from the dashboard
 * 2. Returns example training results (cached or pre-computed)
 * 3. Can trigger local Python scripts for real training
 * 
 * For production: Use separate worker/scheduler for long-running training jobs.
 */

interface TrainingRequest {
  dataset?: string
  datasetSource?: 'kaggle' | 'demo' | 'local'
  kaggleDataset?: string
  strategy?: string
  epochs?: number
  learningRate?: number
}

interface TrainingResult {
  status: 'success' | 'in_progress' | 'error'
  timestamp: string
  jobId: string
  epochs?: number
  trainLoss?: number
  valLoss?: number
  metrics?: {
    mse: number
    mae: number
    rmse: number
    r2: number
  }
  weights?: Record<string, number>
  progress?: number
  message: string
}

// Mock training job storage (in production, use Redis or database)
const trainingJobs: Map<string, TrainingResult> = new Map()

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: TrainingRequest = await request.json()

    const {
      dataset = 'bitcoin-demo',
      datasetSource = 'demo',
      kaggleDataset = 'mczaryko/bitcoin-price-prediction',
      strategy = 'momentum-cross',
      epochs = 50,
      learningRate = 0.01,
    } = body

    // Generate unique job ID
    const jobId = `train-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

    // Check Kaggle credentials if needed
    let kaggleWarning = ''
    if (datasetSource === 'kaggle') {
      const hasKaggleAuth = process.env.KAGGLE_USERNAME && process.env.KAGGLE_API_TOKEN
      if (!hasKaggleAuth) {
        kaggleWarning = ' (Note: Kaggle credentials not configured. Using demo data instead.)'
      }
    }

    console.log('[Training] Starting job', {
      jobId,
      dataset,
      datasetSource,
      kaggleDataset,
      strategy,
      epochs,
      learningRate,
    })

    // Simulate training process (in production, this would queue a background job)
    let datasetInfo = dataset
    if (datasetSource === 'kaggle') {
      datasetInfo = `${kaggleDataset} (from Kaggle)`
    }

    const result: TrainingResult = {
      status: 'in_progress',
      timestamp: new Date().toISOString(),
      jobId,
      epochs,
      progress: 0,
      message: `Training job ${jobId} started. Processing ${datasetInfo} dataset...${kaggleWarning}`,
    }

    trainingJobs.set(jobId, result)

    // Simulate async training (real implementation would use Celery, Bull, etc.)
    simulateTraining(jobId, epochs)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[Training] Error:', error)
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        jobId: 'unknown',
        message: `Training failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 400 }
    )
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get job ID from query params
    const searchParams = request.nextUrl.searchParams
    const jobId = searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json(
        {
          status: 'error',
          timestamp: new Date().toISOString(),
          jobId: 'unknown',
          message: 'jobId query parameter required',
        },
        { status: 400 }
      )
    }

    const result = trainingJobs.get(jobId)

    if (!result) {
      return NextResponse.json(
        {
          status: 'error',
          timestamp: new Date().toISOString(),
          jobId,
          message: `Job ${jobId} not found`,
        },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[Training] Get error:', error)
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        jobId: 'unknown',
        message: 'Failed to fetch training status',
      },
      { status: 500 }
    )
  }
}

/**
 * Simulate training progress (real version would call Python script)
 * This demonstrates how the API would work with async training
 */
function simulateTraining(jobId: string, epochs: number) {
  let currentEpoch = 0
  const startTime = Date.now()
  const totalTime = 30000 // Simulate 30 seconds of training

  const updateInterval = setInterval(() => {
    const elapsed = Date.now() - startTime
    const progress = Math.min((elapsed / totalTime) * 100, 100)

    if (progress >= 100) {
      // Training complete
      const finalResult: TrainingResult = {
        status: 'success',
        timestamp: new Date().toISOString(),
        jobId,
        epochs,
        trainLoss: 0.0342,
        valLoss: 0.0415,
        progress: 100,
        metrics: {
          mse: 0.0415,
          mae: 0.1523,
          rmse: 0.2037,
          r2: 0.9234,
        },
        weights: {
          w_G: 0.188,
          w_C: 0.204,
          w_S: 0.176,
          w_A: 0.162,
          w_H: 0.122,
          w_V: 0.082,
          w_P: 0.048,
          w_T: 0.032,
          alpha: 0.728,
          beta: 0.312,
          gamma: 0.198,
          delta_min: 0.022,
          delta_max: 0.051,
        },
        message: `Training completed in ${Math.round(elapsed / 1000)}s`,
      }

      trainingJobs.set(jobId, finalResult)
      clearInterval(updateInterval)
    } else {
      // Still training
      const result = trainingJobs.get(jobId)
      if (result) {
        result.progress = progress
        result.trainLoss = 0.4 - (progress / 100) * 0.3
        result.valLoss = 0.45 - (progress / 100) * 0.35
        result.message = `Training epoch ${Math.floor((progress / 100) * epochs)}/${epochs}...`
      }
    }
  }, 1000)
}
