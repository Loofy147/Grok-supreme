# SSO-TS Dashboard - Deployment Guide

This guide covers deploying the SSO-TS Dashboard to production.

## Prerequisites

- GitHub account with the Grok-supreme repository
- Vercel account (free tier available)
- xAI API key for Grok integration

## Deployment Options

### Option 1: Deploy via Vercel (Recommended)

#### Step 1: Prepare Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "SSO-TS Dashboard - Ready for deployment"
git push origin main
```

#### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Search for and select "Loofy147/Grok-supreme"
4. Click "Import"

#### Step 3: Configure Environment Variables

In the "Configure Project" step:

1. **Environment Variables**: Click "Add"
2. Add the following:
   - **Name**: `XAI_API_KEY`
   - **Value**: Your xAI API key
   - **Environments**: Production, Preview, Development

3. Click "Deploy"

#### Step 4: Monitor Deployment

- Vercel will automatically start the deployment
- You'll receive an email when deployment is complete
- Access your dashboard at the provided URL (e.g., `sso-ts-dashboard.vercel.app`)

### Option 2: Deploy via CLI

#### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

#### Step 2: Deploy

```bash
# From project root
vercel

# For production deployment
vercel --prod
```

#### Step 3: Add Environment Variables

During the CLI flow, you'll be prompted for environment variables:

```
XAI_API_KEY: [your-api-key]
```

Or add them after deployment:

```bash
vercel env add XAI_API_KEY
# Enter your xAI API key when prompted

# Then redeploy
vercel --prod
```

### Option 3: Manual Docker Deployment

#### Create Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./.next
COPY public ./public
COPY package.json ./

EXPOSE 3000
ENV NODE_ENV=production

CMD ["npm", "start"]
```

#### Build and Deploy

```bash
# Build Next.js
npm run build

# Build Docker image
docker build -t sso-ts-dashboard .

# Run locally
docker run -p 3000:3000 -e XAI_API_KEY=your_key sso-ts-dashboard
```

## Production Optimization

### 1. Build Optimization

```bash
# Analyze bundle size
npm run build

# Check production builds
npm run start
```

### 2. Performance Monitoring

Enable Vercel Analytics:

1. Go to Project Settings
2. Click "Analytics"
3. Enable "Web Analytics"

### 3. Security Headers

The dashboard includes security best practices:

- CORS configured for API routes
- Environment variables secured
- No sensitive data in client-side code

### 4. Rate Limiting

For production use, consider rate limiting:

- CoinGecko API: 10-50 calls/minute (free tier)
- xAI Grok API: Check your plan limits

## Monitoring & Maintenance

### Health Checks

After deployment, verify:

1. **Dashboard Page**: https://your-domain.vercel.app
   - BTC price loading
   - Charts rendering

2. **API Endpoints**:
   ```bash
   curl https://your-domain.vercel.app/api/btc-price
   ```

3. **Grok Integration**:
   - Test in Strategy Simulator
   - Check console for errors

### Environment Variables

If you need to update API keys:

1. Go to Project Settings → Environment Variables
2. Click the key to edit
3. Update value
4. Redeploy: `vercel --prod`

### Rollback

If something goes wrong:

```bash
# View deployment history
vercel deployments

# Rollback to previous version
vercel rollback
```

## Troubleshooting

### Issue: Build fails with module not found

```bash
# Ensure dependencies are correct
npm install
npm run build
```

### Issue: XAI_API_KEY not recognized

1. Check environment variables in Vercel dashboard
2. Verify key is correctly formatted (no extra spaces)
3. Redeploy after updating

### Issue: Slow performance

1. Check Vercel Analytics for bottlenecks
2. Monitor CoinGecko API response times
3. Consider caching strategies

### Issue: Grok API returning errors

1. Verify API key is valid
2. Check xAI service status
3. Review API request logs in Vercel dashboard

## Custom Domain

### Add Custom Domain

1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., trading.example.com)
4. Follow DNS configuration instructions

### SSL Certificate

Vercel automatically provisions SSL certificates. Certificate details appear in the Domains section.

## Database (Optional Future)

If you want to add persistent storage:

1. **Supabase** (PostgreSQL):
   ```bash
   npm install @supabase/supabase-js
   ```

2. Add credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   SUPABASE_SECRET_KEY=your_key
   ```

## Scaling

### Auto-scaling

Vercel automatically scales based on traffic. Monitor:

- CPU usage
- Memory usage
- Request count

### Rate Limiting

Add API rate limiting for production:

```typescript
// app/api/middleware/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'),
})
```

## Best Practices

1. **Secrets Management**:
   - Never commit `.env.local` to Git
   - Use Vercel environment variables
   - Rotate API keys regularly

2. **Error Handling**:
   - Monitor error logs in Vercel dashboard
   - Set up error alerts
   - Implement proper error boundaries

3. **Performance**:
   - Enable compression
   - Optimize images
   - Minimize bundle size

4. **Security**:
   - Keep dependencies updated
   - Use HTTPS only
   - Validate all inputs

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **xAI Support**: https://grok.ai

---

**Last Updated**: February 2026
