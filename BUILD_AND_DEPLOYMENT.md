# SSO-TS Dashboard - Build & Deployment Guide

## Project Status: Production Ready ✅

This document provides the complete build and deployment workflow for the SSO-TS Dashboard.

---

## Table of Contents
1. [Pre-Build Checklist](#pre-build-checklist)
2. [Local Development Build](#local-development-build)
3. [Production Build](#production-build)
4. [Deployment Guide](#deployment-guide)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Troubleshooting](#troubleshooting)

---

## Pre-Build Checklist

### Environment Setup
- [ ] Node.js 18+ installed
- [ ] Python 3.8+ installed (for Kaggle training)
- [ ] Git repository cloned from `Loofy147/Grok-supreme`
- [ ] Current branch: `v0/limiteddjango-7029-90543003`

### Environment Variables
Copy `.env.local.example` to `.env.local` and configure:

```bash
cp .env.local.example .env.local
```

Required variables:
```env
# Required for Grok AI features
XAI_API_KEY=your_xai_api_key_here

# Optional for Kaggle training
KAGGLE_USERNAME=your_kaggle_username
KAGGLE_API_TOKEN=your_kaggle_api_token
```

### Project Structure Verification
```
✅ app/                          # Next.js app directory
✅ components/                   # React components
✅ hooks/                        # React hooks
✅ lib/                          # Utilities
✅ data/                         # JSON data files
✅ docs/                         # Documentation
✅ scripts/                      # Python/shell scripts
✅ package.json                  # Dependencies
✅ tsconfig.json                 # TypeScript config
✅ tailwind.config.ts            # Tailwind CSS config
✅ next.config.js                # Next.js config
```

---

## Local Development Build

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Development Server

```bash
npm run dev
```

- Server starts at `http://localhost:3000`
- Hot Module Replacement (HMR) enabled
- Changes reflect immediately

### 3. Verify Pages Load

Visit these URLs to verify everything works:

- [ ] Dashboard: `http://localhost:3000`
- [ ] Strategy Simulator: `http://localhost:3000/simulator`
- [ ] Skill Orchestrator: `http://localhost:3000/orchestrator`
- [ ] Model Training: `http://localhost:3000/training`
- [ ] Business Management: `http://localhost:3000/business`
- [ ] About: `http://localhost:3000/about`

### 4. Test API Routes

```bash
# Test Grok API
curl -X POST http://localhost:3000/api/grok \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello"}'

# Test BTC Price API
curl http://localhost:3000/api/btc-price

# Test Backtest API
curl -X POST http://localhost:3000/api/backtest \
  -H "Content-Type: application/json" \
  -d '{"strategy":"momentum","timeWindow":"6m"}'
```

---

## Production Build

### 1. Build Optimization

```bash
npm run build
```

What the build does:
- Compiles TypeScript to JavaScript
- Optimizes React components
- Bundles CSS with Tailwind purging
- Minifies assets
- Generates static pages where possible

### 2. Build Output

Expected output directory: `.next/`

Verify build succeeded:
```bash
ls -la .next/
# Should contain: server/, static/, public/
```

### 3. Production Start

```bash
npm run start
```

- Runs optimized production server
- Compressed assets
- Full error handling

### 4. Build Size Check

```bash
# Check bundle size
du -sh .next/

# Typical size: 2-5 MB
```

---

## Deployment Guide

### Deployment Methods

#### Option A: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "SSO-TS Dashboard: Production ready build"
   git push origin v0/limiteddjango-7029-90543003
   ```

2. **Deploy via Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Select `Loofy147/Grok-supreme`
   - Set environment variables:
     - `XAI_API_KEY` = your API key
     - `KAGGLE_USERNAME` = optional
     - `KAGGLE_API_TOKEN` = optional
   - Click "Deploy"

3. **Automatic Deployments**
   - Any push to `main` or `v0/*` branches auto-deploys
   - Pull requests get preview URLs
   - Deploy logs visible in dashboard

#### Option B: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t sso-ts-dashboard .
docker run -p 3000:3000 \
  -e XAI_API_KEY=your_key \
  sso-ts-dashboard
```

#### Option C: Traditional Server

```bash
# On your server:
git clone https://github.com/Loofy147/Grok-supreme.git
cd Grok-supreme
git checkout v0/limiteddjango-7029-90543003
npm install
npm run build

# Using PM2 for process management
npm install -g pm2
pm2 start "npm start" --name "sso-ts-dashboard"
pm2 save
```

### Environment Variables (Production)

Set these in your deployment platform:

```env
# Grok AI
XAI_API_KEY=your_production_xai_api_key

# Kaggle (optional)
KAGGLE_USERNAME=your_username
KAGGLE_API_TOKEN=your_token

# Optional production settings
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.com
```

---

## Post-Deployment Verification

### 1. Health Checks

```bash
# Basic health check
curl https://your-domain.com
# Should return HTML with status 200

# API health
curl https://your-domain.com/api/btc-price
# Should return JSON with Bitcoin price data
```

### 2. Page Verification

Verify all pages load:
- [ ] Dashboard loads with metrics
- [ ] Charts render correctly
- [ ] Navigation links work
- [ ] API calls succeed
- [ ] Responsive design works on mobile

### 3. API Verification

```bash
# Test each API endpoint
curl https://your-domain.com/api/btc-price
curl -X POST https://your-domain.com/api/grok \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test"}'
```

### 4. Performance Check

- [ ] Lighthouse score > 80
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 4s
- [ ] Cumulative Layout Shift < 0.1

Use: https://pagespeed.web.dev

### 5. Security Audit

- [ ] HTTPS enabled
- [ ] Security headers set
- [ ] No hardcoded secrets
- [ ] API keys properly configured
- [ ] CORS configured correctly

### 6. Monitoring Setup

Set up uptime monitoring:
- Healthchecks.io
- UptimeRobot
- Datadog
- New Relic

---

## Troubleshooting

### Build Fails with "Module not found"

**Problem**: `error - Failed to compile ./app/page.tsx`

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Routes Not Working

**Problem**: 404 on API calls

**Solution**:
1. Verify file is at `app/api/route-name/route.ts`
2. Check import paths use `@/` alias
3. Restart dev server: `npm run dev`

### Environment Variables Not Loaded

**Problem**: `process.env.XAI_API_KEY` is undefined

**Solution**:
1. Restart dev server
2. Check `.env.local` exists in root
3. Use `NEXT_PUBLIC_` prefix only for client-side vars

### Out of Memory During Build

**Problem**: `JavaScript heap out of memory`

**Solution**:
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Slow Build Times

**Problem**: Build takes > 5 minutes

**Solution**:
1. Update dependencies: `npm update`
2. Clear cache: `rm -rf .next`
3. Check disk space: `df -h`
4. Use SSD for better I/O

---

## Deployment Commands Reference

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build production
npm start                      # Start production server
npm run lint                   # Run linter

# Kaggle Setup
pip install -r requirements.txt
python3 scripts/setup_kaggle.py

# Docker
docker build -t sso-ts .
docker run -p 3000:3000 sso-ts

# Git Operations
git push origin v0/limiteddjango-7029-90543003
git pull origin v0/limiteddjango-7029-90543003
```

---

## Performance Optimization

### 1. Image Optimization
- Use `<Image>` component from Next.js
- Set optimal width/height
- Enable lazy loading

### 2. Bundle Analysis
```bash
ANALYZE=true npm run build
```

### 3. Cache Strategy
- Set appropriate Cache-Control headers
- Use ISR (Incremental Static Regeneration) for static content
- Leverage browser caching

### 4. Code Splitting
- Automatic via Next.js
- Dynamic imports for large components

---

## Monitoring & Logging

### Application Logs
```bash
# View logs in production
npm start 2>&1 | tee app.log

# Or use PM2
pm2 logs sso-ts-dashboard
```

### Error Tracking
Integrate with:
- Sentry: Error monitoring
- LogRocket: Session replay
- DataDog: Comprehensive monitoring

---

## Rollback Procedure

If deployment fails:

```bash
# Vercel: Automatic rollback available
# Or manual rollback:

git revert HEAD
git push origin v0/limiteddjango-7029-90543003

# Then redeploy
```

---

## Success Criteria

Deployment is successful when:

✅ All pages load without errors
✅ API routes respond correctly
✅ Grok AI integration works
✅ Charts render properly
✅ Mobile responsive
✅ HTTPS/SSL working
✅ Performance metrics acceptable
✅ No console errors
✅ All features functional
✅ Monitoring active

---

## Support & Documentation

- Deployment Guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Getting Started: [GETTING_STARTED.md](./GETTING_STARTED.md)
- Training Guide: [TRAINING_GUIDE.md](./TRAINING_GUIDE.md)
- Developer Reference: [DEVELOPER_REFERENCE.md](./DEVELOPER_REFERENCE.md)
- Architecture: [ARCHITECTURE_VISUAL.md](./ARCHITECTURE_VISUAL.md)

---

**Last Updated**: February 10, 2026
**Status**: Production Ready ✅
**Next.js Version**: 16.1.6
**React Version**: 19.0.0
