# Getting Started with SSO-TS Dashboard

Welcome! This guide will get you up and running in 5 minutes.

## ⚡ Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment
```bash
cp .env.local.example .env.local
```

### 3. Add API Key
Edit `.env.local` and paste your xAI API key:
```
XAI_API_KEY=your_xai_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Open in Browser
Visit: [http://localhost:3000](http://localhost:3000)

**That's it!** The dashboard is now running locally.

---

## 📖 What's What?

### Pages

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/` | Home - BTC price, Q-scores, portfolio |
| Strategy Simulator | `/simulator` | Backtest trading strategies |
| Skill Orchestrator | `/orchestrator` | Combine AI skills |
| Business | `/business` | Admin panel & logs |
| About | `/about` | System info & architecture |

### Navigation

Click the logo to access the sidebar menu. Navigate between pages using the sidebar.

---

## 🧪 Try These First

### 1. View Real BTC Price
- Go to Dashboard (home page)
- See live Bitcoin price at top-left
- Price refreshes every 30 seconds

### 2. Run a Backtest
- Go to "Strategy Simulator"
- Strategy already selected (Momentum Crossover)
- Click "Run Backtest"
- View results in 5-10 seconds

### 3. Combine Skills
- Go to "Skill Orchestrator"
- Click 2 skills to select them
- Click "Analyze Orchestration"
- See emergent capabilities

### 4. Check Admin Panel
- Go to "Business"
- Tab through Overview, Logs, Q-Deltas, Users
- See system activity

### 5. Learn More
- Go to "About"
- Read system overview
- Learn about OMEGA Framework

---

## 🛠️ Commands Reference

```bash
# Development
npm run dev          # Start dev server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Useful
npm run build        # Check for build errors
npm install          # Install dependencies
npm update           # Update dependencies
```

---

## 🔑 Environment Variables

You need one environment variable to get started:

**XAI_API_KEY**
- Get from: [xAI/Grok platform](https://grok.ai)
- Where to add: `.env.local` file
- Format: Paste directly, no quotes needed

### Create .env.local

```bash
# Copy example file
cp .env.local.example .env.local

# Edit with your editor
nano .env.local          # Linux/Mac
notepad .env.local       # Windows

# Or just copy-paste this and add your key:
XAI_API_KEY=your_key_here
```

---

## 📱 Browser Support

Works on:
- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

**Note**: Best on desktop for charts and tables.

---

## 🚀 Deploy to Vercel (Optional)

When ready to go live:

```bash
# Push to GitHub
git add .
git commit -m "SSO-TS Dashboard ready"
git push origin main

# Then in Vercel dashboard:
# 1. Import repository
# 2. Add XAI_API_KEY environment variable
# 3. Deploy!
```

See **DEPLOYMENT.md** for detailed instructions.

---

## ⚠️ Important Notes

### ❗ Simulation Only
- This does **NOT** execute real trades
- Results are simulated for learning
- Not financial advice

### 🔒 Your API Key
- Keep it secret!
- Never commit `.env.local` to Git
- It's already in `.gitignore`

### 🌐 Internet Required
- Needs internet for BTC prices
- Needs API key for Grok AI
- Works offline after initial load (limited)

---

## 🐛 Troubleshooting

### "Module not found" error
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### "XAI_API_KEY is not defined"
```bash
# Check .env.local file exists
# Verify your key is pasted correctly
# No quotes needed: key_here (not "key_here")
```

### BTC Price not loading
- Check internet connection
- Verify CoinGecko API is up
- Try refreshing browser

### Grok API errors
- Verify API key is valid
- Check xAI service status
- Try again in a few seconds

### Slow performance
- Refresh page
- Close other browser tabs
- Check internet speed

---

## 📚 Learn More

| Document | Purpose |
|----------|---------|
| README.md | Full feature documentation |
| USER_GUIDE.md | How to use every feature |
| DEVELOPER_REFERENCE.md | For developers/customization |
| DEPLOYMENT.md | How to deploy production |
| PROJECT_SUMMARY.md | Project overview |

---

## 💡 Tips & Tricks

### Dashboard
- Charts are interactive - hover to see values
- Click metric cards to see more detail
- Scroll right on mobile for full charts

### Strategy Simulator
- Try different time windows (3m, 6m, 1y, 2y)
- Higher fees = lower returns
- Run multiple strategies to compare

### Skill Orchestrator
- Start with 2 skills, add more gradually
- Markets Analysis + RSI = good combo
- Watch Q-Score change

### Business
- Activity log updates in real-time
- Q-Delta shows your improvements
- User management is admin-only

---

## ❓ FAQ

**Q: Do I need a Grok/xAI account?**
A: Yes, to get an API key. Free tier available.

**Q: Can I use this on mobile?**
A: Yes, but desktop is better for charts.

**Q: Can I modify the strategies?**
A: Yes! Edit `app/simulator/page.tsx` strategy list.

**Q: How do I add more skills?**
A: Edit `app/orchestrator/page.tsx` skills array.

**Q: Is there a database?**
A: No, simulation-only. Data resets on refresh.

**Q: Can I run this without Grok API?**
A: No, Grok is required for backtests & analysis.

**Q: How do I deploy?**
A: See DEPLOYMENT.md for easy Vercel deployment.

---

## 🎯 Next Steps

1. ✅ Follow "Quick Start" above
2. ✅ Try all 5 features listed
3. ✅ Read USER_GUIDE.md for details
4. ✅ Deploy to Vercel when ready
5. ✅ Customize for your needs

---

## 📞 Need Help?

1. Check **Troubleshooting** section above
2. Read relevant documentation file
3. Check browser console for errors (F12)
4. Review README.md FAQ section

---

## 🎉 You're Ready!

You now have everything you need to explore the SSO-TS Dashboard. Start with the Dashboard page, try a backtest, combine some skills, and have fun!

**Happy trading (simulating)!** 🚀

---

**Last Updated**: February 2026
**Version**: 1.0.0
