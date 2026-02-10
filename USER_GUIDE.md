# SSO-TS Dashboard - User Guide

Welcome to the SSO-TS (Skill-Selective Orchestration Trading Strategy) Dashboard! This guide walks you through using all features.

## Table of Contents

1. [Dashboard Overview](#dashboard-overview)
2. [Strategy Simulator](#strategy-simulator)
3. [Skill Orchestrator](#skill-orchestrator)
4. [Business Management](#business-management)
5. [Tips & Tricks](#tips--tricks)
6. [FAQ](#faq)

---

## Dashboard Overview

The main dashboard provides real-time cryptocurrency trading insights.

### Real-Time BTC Price

- **Live Update**: Bitcoin price refreshes every 30 seconds
- **24h Change**: Shows percentage change over the last 24 hours
- **Market Cap**: Total market capitalization in USD
- **Trading Volume**: 24-hour trading volume

### Q-Score Metrics

These metrics reflect AI capability quality based on the OMEGA Framework:

- **Overall Q-Score**: 0-1 scale (higher is better)
- **Multi-Domain Synthesis**: Ability to integrate knowledge across domains
- **Transfer Learning**: Capability to apply knowledge to new domains
- **Universal Problem Solving**: General problem-solving capability

### Portfolio Summary

6-month historical performance with:

- **ROI Line Chart**: Return on investment trend over time
- **Sharpe Ratio Line Chart**: Risk-adjusted return metric
- **ROI Bar Chart**: Monthly ROI distribution
- **Key Metrics**:
  - Total ROI: Cumulative return
  - Sharpe Ratio: Risk-adjusted performance (target > 1.2)
  - Max Drawdown: Largest peak-to-trough decline
  - Win Rate: Percentage of profitable trades

---

## Strategy Simulator

Run backtests on different trading strategies to evaluate performance.

### Getting Started

1. Click **"Strategy Simulator"** in the sidebar
2. Select a strategy from the dropdown
3. Configure parameters
4. Click **"Run Backtest"**

### Available Strategies

- **Momentum Crossover (MA-20/50)**: Uses moving average crossovers
- **RSI-Enhanced Evolution**: Relative Strength Index optimization
- **Bollinger Bands Breakout**: Range-based breakout signals
- **MACD Signal Crossover**: Moving Average Convergence Divergence
- **Volume-Weighted Moving Average**: Volume-adjusted trends

### Configuration Parameters

#### Time Window
- **3 Months**: Recent performance (shorter history)
- **6 Months**: Standard analysis period
- **1 Year**: Extended performance tracking
- **2 Years**: Long-term analysis

#### Initial Capital
- Enter the starting capital in USD
- Higher values may show more realistic trading fees
- Typical values: $1,000 - $100,000

#### Trading Fees (%)
- Usually 0.05% - 0.5% depending on exchange
- Default: 0.1%
- Higher fees reduce profitability

#### Slippage (%)
- Price impact of your trades
- Usually 0.01% - 0.1%
- Default: 0.05%
- Larger orders = higher slippage

### Interpreting Results

#### Return Metrics

| Metric | Meaning | Target |
|--------|---------|--------|
| ROI (%) | Percentage return on investment | >50% |
| Sharpe Ratio | Risk-adjusted returns (0-3 scale) | >1.2 |
| Max Drawdown (%) | Largest losing streak | <10% |

#### Trade Statistics

| Metric | Meaning |
|--------|---------|
| Win Rate (%) | % of profitable trades |
| Trade Count | Total trades executed |
| Best Trade | Largest single profit |
| Worst Trade | Largest single loss |

### Tips

- Run multiple strategies to compare performance
- Adjust fees/slippage to match your exchange
- Longer time windows provide more reliable results
- Consider strategy combination in the Skill Orchestrator

---

## Skill Orchestrator

Combine multiple AI skills to create emergent trading capabilities.

### Available Skills

1. **Market Analysis**
   - Comprehensive market trend analysis
   - Q-Score: 0.92

2. **RSI-Enhanced Evolution**
   - Relative Strength Index optimization
   - Q-Score: 0.88

3. **Transfer Learning**
   - Apply knowledge across domains
   - Q-Score: 0.94

4. **Sentiment Analysis**
   - Social media sentiment tracking
   - Q-Score: 0.85

5. **Risk Management**
   - Portfolio risk assessment
   - Q-Score: 0.91

6. **Momentum Detection**
   - Market momentum pattern recognition
   - Q-Score: 0.87

### How to Orchestrate

1. **Select Skills**: Click on skill cards to toggle selection
   - Selected skills show blue highlight
   - Can select 2-8 skills

2. **Review Orchestration**: 
   - See all selected skills listed
   - View combined Q-Score
   - Each skill shows its category and Q-Score

3. **Analyze**:
   - Click "Analyze Orchestration" button
   - System discovers emergent capabilities

### Understanding Emergent Capabilities

When you combine skills, new capabilities emerge:

- **Synergistic Analysis**: Combined insights create new perspectives
- **Cross-Domain Transfer**: Knowledge flows between analytical domains
- **Adaptive Strategy**: Dynamic adjustment based on conditions
- **Risk-Adjusted Returns**: Multi-perspective risk optimization

Each capability shows:
- **Name**: Emergent capability type
- **Strength**: 0-100% capability effectiveness
- **Description**: How the capability works

### Best Practices

- Start with 2-3 complementary skills
- Market Analysis + RSI-Enhanced Evolution: Good for technical trading
- Transfer Learning + Risk Management: Good for adaptive strategies
- Sentiment Analysis + Market Analysis: Good for hybrid approaches

---

## Business Management

Administrative tools for tracking system performance and users.

### Overview Tab

System statistics:
- **Total Backtests**: Number of simulations run
- **Avg Sharpe Ratio**: Average risk-adjusted performance
- **Active Users**: Current active platform users
- **Skill Combinations**: Total unique skill combinations tested

### Activity Logs

Real-time system activity:

- **Backtest Completed**: Strategy simulations
- **Skill Orchestration Analyzed**: Skill combinations tested
- **Q-Score Updated**: Metric updates
- **BTC Price Fetched**: Data updates

Each log entry shows:
- **Timestamp**: When the action occurred
- **Status**: Success ✓, Error ✗, or Info ℹ
- **Details**: What was performed
- **Status Badge**: Color-coded result

### Q-Deltas (Achievements)

Tracks improvements in AI capability metrics:

- **Sharpe Ratio Improvement**: Enhanced risk-adjusted returns
- **Drawdown Reduction**: Reduced losing streaks
- **Win Rate Boost**: Improved trade success rate

Each achievement shows:
- **Before/After Values**: Metric improvements
- **Q-Delta**: Quantified improvement
- **Date Achieved**: When milestone reached

### User Management

Role-based access control:

#### User Roles

1. **Simulator User**
   - Run backtests
   - View results
   - Orchestrate skills
   - 12 active users

2. **Analyst**
   - All simulator permissions
   - View activity logs
   - 5 active users

3. **Admin**
   - Full access
   - Manage users
   - System configuration
   - 2 active users

Each role lists:
- **Role Name**
- **Permissions**: What actions are allowed
- **User Count**: Active users in role

---

## Tips & Tricks

### Dashboard

- **Refresh Price**: Close and reopen the page for immediate update
- **Export Charts**: Right-click charts to save as image
- **Metric Targets**: Green = exceeds target, Red = below target

### Strategy Simulator

- **Multiple Tests**: Run different strategies back-to-back for comparison
- **Parameter Sensitivity**: Test extreme values (high fees, slippage) for worst-case analysis
- **Win Rate Focus**: Strategies with 60%+ win rates are generally reliable

### Skill Orchestrator

- **Start Simple**: Begin with 2 complementary skills
- **Gradual Addition**: Add skills one at a time to see impact
- **Record Combinations**: Note high-performing combinations
- **Q-Score Tracking**: Compare Q-Scores across combinations

### Business Management

- **Monitor Logs**: Check activity logs for system health
- **Achievement Tracking**: Use Q-Deltas to measure improvement over time
- **User Analytics**: Monitor active users and system load

---

## FAQ

### General

**Q: Is this a real trading platform?**
A: No, this is simulation-only for educational purposes. No real trades are executed.

**Q: Can I use this to trade actual cryptocurrency?**
A: Not directly. Use this to test strategies, then implement them on real exchanges separately.

**Q: How often is BTC price updated?**
A: Every 30 seconds from CoinGecko API.

### Strategy Simulator

**Q: What does Sharpe Ratio mean?**
A: Risk-adjusted returns. Higher is better. >1.2 is considered good.

**Q: Why does my win rate matter?**
A: Win rate shows consistency. 50%+ is breakeven; 60%+ is solid.

**Q: Can I test strategies on other cryptocurrencies?**
A: Currently focused on Bitcoin. Expansion planned for altcoins.

**Q: What's the difference between slippage and fees?**
A: Fees are exchange costs. Slippage is price impact of your order size.

### Skill Orchestrator

**Q: What's a Q-Score?**
A: 0-1 quality metric for AI capabilities. Higher = better.

**Q: How are emergent capabilities discovered?**
A: Through analysis of skill interactions using the OMEGA Framework.

**Q: Can I create custom skills?**
A: Not yet. Contact support for custom skill development.

### Business Management

**Q: What's a Q-Delta?**
A: Quantified improvement in capability metrics over time.

**Q: How do I change user permissions?**
A: Contact admin. User management is admin-only feature.

**Q: Where can I see detailed logs?**
A: Activity Logs tab shows recent actions. Extended history available on request.

### Technical

**Q: What data is stored about my simulations?**
A: Only aggregated metrics for analytics. No personal data stored.

**Q: Is my API key secure?**
A: Yes. Keys are stored server-side in secure environment variables.

**Q: Can I use this offline?**
A: No, internet connection required for API calls.

**Q: What browsers are supported?**
A: Chrome, Firefox, Safari, Edge (latest versions).

---

## Support

Need help?

- Check the **About** page for system information
- Review error messages carefully
- Refresh your browser if experiencing issues
- Contact support for technical problems

---

**Last Updated**: February 2026
**Version**: 1.0.0
