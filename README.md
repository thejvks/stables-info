# stables info

Real-time stablecoin risk intelligence dashboard — 62 stablecoins, 141 blockchains.

**[Live Dashboard](https://stablecoin-risk-intelligence-bnpk4c9zjtwenhlbyvrqzw.streamlit.app)**

## What It Does

- Monitors 62+ stablecoins across 141 blockchains in real-time
- Tracks peg deviations, supply, 24h volume, and chain distribution
- Detects anomalies: peg breaks, supply spikes, liquidity drains
- Coin Wiki with whitepaper links, backing info, and risk analysis
- War Room with historical crisis replays (USDC SVB, UST, FTX, COVID)

## Tech Stack

- **Frontend:** Next.js + React + Tailwind CSS
- **Data:** DeFiLlama + CoinGecko APIs (free, no API keys needed)
- **Hosting:** Vercel (free)

## Run Locally

```bash
npm install
npm run dev
```

## Pages

- **Peg Monitor** — live leaderboard of all stablecoins sorted by market cap
- **Chain X-Ray** — cross-chain supply distribution across 141 blockchains
- **Alert Feed** — anomaly detection alerts
- **Coin Wiki** — searchable encyclopedia with type, issuer, backing, risks
- **War Room** — historical crisis stress tests
