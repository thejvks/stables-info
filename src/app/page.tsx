"use client";

import { useEffect, useState } from "react";
import { CHAIN_LOGOS } from "../lib/coins-data";

interface ChainInfo { chain: string; supply: number; logo: string; }
interface Coin {
  rank: number; symbol: string; name: string; price: number;
  deviation: number; supply: number; volume24h: number;
  yieldBearing: boolean; type: string; logo: string;
  geckoId: string; geckoUrl: string; whitepaperUrl: string;
  chains: ChainInfo[]; tldr: string;
}
interface ApiData {
  coins: Coin[]; totalSupply: number; totalCoins: number;
  totalChains: number; avgDeviation: number; maxDeviation: number;
  updatedAt: string;
}

function fmt(val: number): string {
  if (val >= 1e12) return `$${(val / 1e12).toFixed(1)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`;
  if (val >= 1e3) return `$${(val / 1e3).toFixed(0)}K`;
  if (val > 0) return `$${val.toFixed(0)}`;
  return "—";
}

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="stat-card">
      <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
      <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/coins")
      .then((r) => { if (!r.ok) throw new Error("API error"); return r.json(); })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Fetching live stablecoin data from DeFiLlama + CoinGecko...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <div className="text-4xl">📡</div>
        <p className="text-slate-400">Failed to fetch data: {error}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm">Retry</button>
      </div>
    );
  }

  const coins = data.coins || [];

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Stats bar */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <StatCard value={fmt(data.totalSupply)} label="Total Supply" color="text-emerald-400" />
        <StatCard value={String(data.totalCoins)} label="Stablecoins" color="text-blue-400" />
        <StatCard value={String(data.totalChains)} label="Blockchains" color="text-purple-400" />
        <StatCard value={`${data.avgDeviation}%`} label="Avg Deviation" color="text-amber-400" />
        <StatCard value={`${data.maxDeviation}%`} label="Max Deviation" color={data.maxDeviation > 1 ? "text-red-400" : "text-emerald-400"} />
      </div>

      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-bold text-slate-200">Peg Status</h2>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="live-dot" />
          <span className="text-[10px] text-emerald-400 uppercase font-semibold tracking-wider">Live</span>
        </div>
        <span className="text-xs text-slate-600 ml-auto">
          Updated {new Date(data.updatedAt).toLocaleTimeString()}
        </span>
      </div>

      {/* Table header */}
      <div className="flex items-center px-4 py-2 text-[10px] uppercase tracking-widest text-slate-600 border-b border-purple-900/20 sticky top-0 bg-[#0f0b1e] z-10">
        <span className="w-10">#</span>
        <span className="w-7"></span>
        <span className="flex-1 min-w-0">Coin</span>
        <span className="w-[90px] text-right">Price</span>
        <span className="w-[80px] text-right">Dev</span>
        <span className="w-[85px] text-right">Supply</span>
        <span className="w-[75px] text-right">Vol 24h</span>
        <span className="w-[120px] text-center">Chains</span>
        <span className="w-[90px] text-center">Links</span>
      </div>

      {/* Coin rows */}
      <div className="flex flex-col">
        {coins.map((coin, i) => {
          const devClass = coin.yieldBearing ? "safe" : coin.deviation < 0.1 ? "safe" : coin.deviation < 0.5 ? "warn" : "danger";
          const volColor = coin.volume24h > 1e8 ? "text-emerald-400" : coin.volume24h > 1e6 ? "text-slate-400" : "text-slate-600";

          return (
            <div
              key={coin.symbol}
              className={`coin-row ${devClass} ${i % 2 === 0 ? "" : "bg-purple-950/10"}`}
              title={coin.tldr}
            >
              <span className="w-10 text-xs text-slate-600 font-semibold">#{coin.rank}</span>

              <span className="w-7">
                {coin.logo ? (
                  <img src={coin.logo} alt={coin.symbol} className="w-5 h-5 rounded-full" loading="lazy" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-purple-800 flex items-center justify-center text-[8px] text-purple-300">{coin.symbol[0]}</div>
                )}
              </span>

              <span className="flex-1 min-w-0 flex items-center gap-1.5">
                <a href={coin.geckoUrl || "#"} target="_blank" rel="noopener noreferrer"
                   className="text-slate-200 font-bold text-sm hover:text-purple-300 transition-colors">
                  {coin.symbol}
                </a>
                <span className="text-slate-600 text-[11px] truncate">{coin.name}</span>
                {coin.yieldBearing && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 font-medium">YIELD</span>
                )}
              </span>

              <span className="w-[90px] text-right text-white font-mono font-bold text-sm">
                ${coin.price.toFixed(4)}
              </span>

              <span className="w-[80px] text-right">
                {coin.yieldBearing ? (
                  <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400">{coin.deviation.toFixed(1)}%</span>
                ) : (
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                    coin.deviation < 0.1 ? "dev-safe" : coin.deviation < 0.5 ? "dev-warn" : "dev-danger"
                  }`}>
                    {coin.deviation.toFixed(3)}%
                  </span>
                )}
              </span>

              <span className="w-[85px] text-right text-slate-400 text-sm font-medium">{fmt(coin.supply)}</span>

              <span className={`w-[75px] text-right text-sm ${volColor}`}>{fmt(coin.volume24h)}</span>

              <span className="w-[120px] flex justify-center gap-0.5 items-center">
                {coin.chains.slice(0, 4).map((ch) => {
                  const logo = ch.logo || CHAIN_LOGOS[ch.chain] || "";
                  return logo ? (
                    <img
                      key={ch.chain}
                      src={logo}
                      alt={ch.chain}
                      title={`${ch.chain}: ${fmt(ch.supply)}`}
                      className="w-4 h-4 rounded-full"
                      loading="lazy"
                    />
                  ) : (
                    <span
                      key={ch.chain}
                      title={`${ch.chain}: ${fmt(ch.supply)}`}
                      className="w-4 h-4 rounded-full bg-purple-800 flex items-center justify-center text-[7px] text-purple-300 font-bold"
                    >
                      {ch.chain[0]}
                    </span>
                  );
                })}
                {coin.chains.length > 4 && (
                  <span className="text-[9px] text-slate-600 ml-0.5">+{coin.chains.length - 4}</span>
                )}
                {coin.chains.length === 0 && <span className="text-[10px] text-slate-700">—</span>}
              </span>

              <span className="w-[90px] flex justify-center gap-2 items-center">
                {coin.geckoUrl && (
                  <a href={coin.geckoUrl} target="_blank" rel="noopener noreferrer" title="CoinGecko"
                     className="text-[10px] text-slate-600 hover:text-emerald-400 transition-colors font-semibold">
                    CG
                  </a>
                )}
                <a href="https://defillama.com/stablecoins" target="_blank" rel="noopener noreferrer" title="DeFiLlama"
                   className="text-[10px] text-slate-600 hover:text-blue-400 transition-colors font-semibold">
                  DL
                </a>
                {coin.whitepaperUrl && (
                  <a href={coin.whitepaperUrl} target="_blank" rel="noopener noreferrer" title="Docs / Whitepaper"
                     className="text-[10px] text-slate-600 hover:text-purple-400 transition-colors font-semibold">
                    docs
                  </a>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-700 mt-8 pb-4">
        stables info — {data.totalCoins} stablecoins · {data.totalChains} chains · {fmt(data.totalSupply)} monitored · not financial advice · dyor
      </div>
    </div>
  );
}
