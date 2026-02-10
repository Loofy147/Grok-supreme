# SSO-TS Dashboard - Deployment Checklist

Complete checklist for deploying to production.

## Pre-Deployment (Day Before)

### Code Quality
- [ ] Run `npm run build` - No errors
- [ ] Run `npm run lint` - No warnings
- [ ] Test all pages locally: `/`, `/simulator`, `/orchestrator`, `/business`, `/about`
- [ ] Test BTC price loading
- [ ] Test backtest execution
- [ ] Test skill orchestration
- [ ] Verify responsive design (mobile/tablet)

### Documentation
- [ ] README.md is up-to-date
- [ ] USER_GUIDE.md covers all features
- [ ] DEVELOPER_REFERENCE.md has examples
- [ ] DEPLOYMENT.md has no broken links
- [ ] PROJECT_SUMMARY.md reflects current state

### Repository
- [ ] All changes committed: `git status` is clean
- [ ] Branch is up-to-date: `git pull origin main`
- [ ] No uncommitted files: `git add -A && git status`
- [ ] Commit message is descriptive
- [ ] Ready to push: `git log --oneline` shows clean history

---

## Deployment Day

### Before Pushing
- [ ] Final `npm run build` test
- [ ] Test production build locally: `npm start`
- [ ] Stop dev server
- [ ] Clear node_modules cache if issues: `npm cache clean --force`

### Push to GitHub
- [ ] All changes staged: `git add .`
- [ ] Commit with message: `git commit -m "SSO-TS v1.0.0 - Production Ready"`
- [ ] Push to main: `git push origin main`
- [ ] Verify push succeeded (check GitHub)

### Vercel Setup

#### Option A: Vercel Dashboard (Recommended)
- [ ] Log in to Vercel.com
- [ ] Click "New Project"
- [ ] Select "Import Git Repository"
- [ ] Select "Loofy147/Grok-supreme"
- [ ] Configure project:
  - [ ] Framework Preset: **Next.js**
  - [ ] Build Command: `npm run build` (default)
  - [ ] Start Command: `npm start` (default)
  - [ ] Install Command: `npm install` (default)

#### Environment Variables
- [ ] Add `XAI_API_KEY`:
  - Name: `XAI_API_KEY`
  - Value: `[your-api-key]`
  - Environments: Production, Preview, Development
- [ ] Click "Add"

#### Final Steps
- [ ] Review settings (all look correct?)
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Check for any build errors in logs

### Post-Deployment Testing

#### Immediate (First 5 min)
- [ ] Access dashboard URL (e.g., `sso-ts-dashboard.vercel.app`)
- [ ] Page loads without 500 errors
- [ ] Sidebar navigation renders
- [ ] Logo is visible

#### Dashboard Page (Home)
- [ ] BTC price displays
- [ ] Price value is numeric and reasonable
- [ ] Q-Score cards display
- [ ] Portfolio charts render
- [ ] No console errors (F12)

#### Strategy Simulator
- [ ] Page loads
- [ ] Strategy dropdown populated
- [ ] Run backtest button functional
- [ ] Results appear after clicking button
- [ ] All metrics display correctly

#### Skill Orchestrator
- [ ] Skill cards display
- [ ] Can select multiple skills
- [ ] Analyze button works
- [ ] Results show emergent capabilities
- [ ] Q-score calculates

#### Business Management
- [ ] All 4 tabs visible
- [ ] Overview tab shows metrics
- [ ] Logs tab shows activity
- [ ] Q-Deltas tab shows achievements
- [ ] Users tab shows roles

#### About Page
- [ ] Loads without errors
- [ ] Disclaimer is visible and prominent
- [ ] System information displays
- [ ] Framework explanation is clear

### API Testing
- [ ] `https://[domain].vercel.app/api/btc-price` returns data
- [ ] Response includes: price, change24h, marketCap, volume
- [ ] Backtest generates results
- [ ] Grok integration works

### Performance Check
- [ ] Page load time < 3 seconds
- [ ] Charts render smoothly
- [ ] No layout shifts (CLS issues)
- [ ] Mobile responsive (test on phone)

### Error Handling
- [ ] Refresh page works
- [ ] Go back/forward navigation works
- [ ] Click links between pages
- [ ] No 404 errors on valid routes

---

## Post-Deployment (First 24 Hours)

### Monitoring
- [ ] Check Vercel Analytics
  - [ ] No spike in errors
  - [ ] Response times reasonable
  - [ ] Usage metrics normal

### User Testing
- [ ] Ask colleagues to test
- [ ] Try from different networks (home, mobile, etc.)
- [ ] Test on different browsers
- [ ] Report any issues

### Logs Review
- [ ] Check Vercel logs for errors
- [ ] Look for failed API calls
- [ ] Verify Grok API is responding
- [ ] Monitor CoinGecko API calls

### First Updates
- [ ] If bugs found, create issues
- [ ] Document in GitHub issues
- [ ] Plan fixes if critical

---

## Domain Setup (Optional)

If using custom domain:

- [ ] Domain purchased
- [ ] DNS provider accessible
- [ ] Copy DNS records from Vercel
- [ ] Add CNAME record to DNS
- [ ] Add TXT record for verification
- [ ] Wait for DNS propagation (5-48 hours)
- [ ] Test custom domain
- [ ] SSL certificate auto-provisioned
- [ ] Verify HTTPS working

---

## Security Checklist

### Environment Variables
- [ ] XAI_API_KEY is present
- [ ] No sensitive data in code
- [ ] .env.local not committed to Git
- [ ] .gitignore includes `.env.local`

### HTTPS/SSL
- [ ] HTTPS is enforced
- [ ] SSL certificate valid
- [ ] No mixed content warnings

### API Security
- [ ] API keys use environment variables
- [ ] No API keys in client code
- [ ] CORS configured correctly
- [ ] No sensitive data in URLs

---

## Documentation Updates

- [ ] README.md has deployment link
- [ ] DEPLOYMENT.md reflects actual deployment
- [ ] GETTING_STARTED.md works for production
- [ ] About page links to docs
- [ ] All docs have current version number

---

## Success Criteria - ALL MET?

- [ ] ✅ Dashboard loads and works
- [ ] ✅ BTC price updates
- [ ] ✅ Backtests run
- [ ] ✅ Skills can be orchestrated
- [ ] ✅ Business admin functions work
- [ ] ✅ No critical errors
- [ ] ✅ Performance acceptable
- [ ] ✅ Mobile responsive
- [ ] ✅ Documentation accurate
- [ ] ✅ Monitoring active

---

## Rollback Plan

If serious issues occur:

1. [ ] Note the issue (screenshot, error message)
2. [ ] Check Vercel deployment history
3. [ ] Click "Rollback" for previous version
4. [ ] Verify previous version works
5. [ ] Create GitHub issue to track problem
6. [ ] Fix locally and redeploy

**Rollback command:**
```bash
vercel rollback
```

---

## Post-Launch Communication

### Notify Team
- [ ] Send announcement with link
- [ ] Share USER_GUIDE.md
- [ ] Provide feedback email/contact

### Social/Sharing (Optional)
- [ ] Update GitHub README with live link
- [ ] Share on dev communities
- [ ] Post in relevant forums

---

## First Week Monitoring

### Daily
- [ ] Check error logs in Vercel
- [ ] Verify BTC price updates
- [ ] Test backtest at least once
- [ ] No new GitHub issues

### Weekly
- [ ] Review analytics
- [ ] Check performance metrics
- [ ] Plan any improvements
- [ ] Update documentation if needed

---

## Follow-Up Tasks

After successful deployment:

- [ ] Create GitHub release: `v1.0.0`
- [ ] Tag commit: `git tag v1.0.0`
- [ ] Push tags: `git push origin --tags`
- [ ] Create GitHub release with notes
- [ ] Archive deployment notes

---

## Sign-Off

- [ ] Deployed by: ________________________
- [ ] Deployment date: ___________________
- [ ] Status: ✅ DEPLOYED / ❌ ISSUES
- [ ] Notes: _____________________________

---

## Troubleshooting Quick Links

### If Build Fails
→ Check DEPLOYMENT.md "Issue: Build fails"

### If API Doesn't Work
→ Check env vars in Vercel dashboard

### If Performance is Slow
→ Check Vercel Analytics, monitor external APIs

### If Pages Don't Load
→ Check browser console (F12) for errors

### If Grok Not Working
→ Verify XAI_API_KEY is correct and active

---

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Troubleshooting: DEPLOYMENT.md
- FAQ: USER_GUIDE.md

---

**Deployment Checklist Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: Ready to use
