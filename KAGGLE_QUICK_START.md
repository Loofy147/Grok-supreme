# Kaggle Integration - Quick Start (5 minutes)

Your Kaggle credentials have been integrated! Here's how to get started immediately.

## Step 1: Choose Your Setup Method

### Method A: Python Interactive Setup (Easiest)
```bash
python3 scripts/setup_kaggle.py
```
- Asks for credentials interactively
- Saves to `.env.local` automatically
- Tests connection automatically

### Method B: Manual .env.local
1. Edit `.env.local`:
   ```env
   KAGGLE_USERNAME=djangolimited
   KAGGLE_API_TOKEN=KGAT_10b61907f574f4cf48c1c0498e48abec
   ```
2. Restart dev server: `npm run dev`

### Method C: Kaggle JSON File
```bash
mkdir -p ~/.kaggle
cat > ~/.kaggle/kaggle.json << 'EOF'
{
  "username": "djangolimited",
  "key": "KGAT_10b61907f574f4cf48c1c0498e48abec"
}
EOF
chmod 600 ~/.kaggle/kaggle.json
```

## Step 2: Verify Installation

```bash
# Check if Kaggle CLI is installed
python3 -c "import kaggle; print('✅ Kaggle installed')"

# If not installed:
pip install kaggle
```

## Step 3: Start the Dashboard

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Step 4: Access Training Page

1. Click "Model Training" in navigation
2. You should see these options:
   - Data Source dropdown (select "Kaggle")
   - Dataset dropdown (showing available Kaggle datasets)
   - Start Training button

## Step 5: Download Your First Dataset

```bash
python3 scripts/kaggle_data_fetcher.py --dataset "bitcoin-price-prediction"
```

Or use the dashboard:
1. Select "Kaggle" as data source
2. Select "bitcoin-price-prediction"
3. Click "Fetch Dataset"
4. Wait for download and preprocessing

## Step 6: Start Training

From dashboard:
1. Set training parameters:
   - Epochs: 50
   - Learning Rate: 0.01
   - Strategy: momentum-cross
2. Click "Start Training"
3. Watch real-time progress in loss charts

## Verification Checklist

- [ ] Kaggle credentials saved (`.env.local` or `~/.kaggle/kaggle.json`)
- [ ] `pip install kaggle` completed
- [ ] Dev server running (`npm run dev`)
- [ ] Can see Training page at [http://localhost:3000/training](http://localhost:3000/training)
- [ ] "Fetch from Kaggle" button is clickable
- [ ] Can list available datasets
- [ ] Can start a training job

## Troubleshooting

### "Module not found: kaggle"
```bash
pip install kaggle
python3 -m pip install --upgrade kaggle
```

### "Kaggle authentication failed"
```bash
# Check credentials are set
cat .env.local | grep KAGGLE
# or
cat ~/.kaggle/kaggle.json
```

### "API rate limit reached"
- Wait 1 minute
- Try again

### Still not working?
See [KAGGLE_SETUP.md](./KAGGLE_SETUP.md) for detailed troubleshooting

## What You Can Do Now

✅ Download cryptocurrency datasets from Kaggle  
✅ Train OMEGA Framework skill weights  
✅ Monitor training progress in real-time  
✅ Compare different datasets and strategies  
✅ Deploy to Vercel with Kaggle integration  

## Next: Advanced Usage

When you're ready for more:
- See [TRAINING_GUIDE.md](./TRAINING_GUIDE.md) for advanced training
- See [KAGGLE_SETUP.md](./KAGGLE_SETUP.md) for detailed setup
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

## Your Credentials

```
Username: djangolimited
Token: KGAT_10b61907f574f4cf48c1c0498e48abec
```

These are now integrated and ready to use!

---

**Time to complete**: 5 minutes  
**Status**: Ready to train!
