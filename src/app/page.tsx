"use client";

import { useEffect, useState } from "react";
import { CHAIN_LOGOS } from "../lib/coins-data";

interface ChainInfo { chain: string; supply: number; logo: string; }
interface Coin {
  rank: number; symbol: string; name: string; price: number;
  deviation: number; supply: number; marketCap: number; volume24h: number;
  pegCurrency: string; pegSymbol: string;
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

const TIERS = [
  { label: "All", filter: () => true },
  { label: "USD", filter: (c: Coin) => (c.pegCurrency || "USD") === "USD" },
  { label: "EUR", filter: (c: Coin) => c.pegCurrency === "EUR" },
  { label: "JPY", filter: (c: Coin) => c.pegCurrency === "JPY" },
  { label: "GBP", filter: (c: Coin) => c.pegCurrency === "GBP" },
  { label: ">$1B", filter: (c: Coin) => c.supply >= 1e9 },
  { label: "Yield", filter: (c: Coin) => c.yieldBearing },
];

export default function Home() {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("/api/coins")
      .then((r) => { if (!r.ok) throw new Error("API error"); return r.json(); })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-3">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-purple-300 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
        <StatCard value={fmt(data.totalSupply)} label="Total Supply" color="text-emerald-400" />
        <StatCard value={String(data.totalCoins)} label="Stablecoins" color="text-blue-400" />
        <StatCard value={String(data.totalChains)} label="Blockchains" color="text-purple-400" />
        <StatCard value={`${data.avgDeviation}%`} label="Avg Deviation" color="text-amber-400" />
        <StatCard value={`${data.maxDeviation}%`} label="Max Deviation" color={data.maxDeviation > 1 ? "text-red-400" : "text-emerald-400"} />
      </div>

      {/* Search + Filter bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <h2 className="text-lg font-bold text-slate-200">Peg Status</h2>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="live-dot" />
          <span className="text-[10px] text-emerald-400 uppercase font-semibold tracking-wider">Live</span>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search coin..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setShowAll(true); }}
          className="ml-4 px-3 py-1.5 rounded-lg bg-purple-950/30 border border-purple-900/30 text-slate-200 placeholder-slate-600 focus:border-purple-500/50 focus:outline-none text-xs w-40"
        />

        {/* Tier tabs */}
        <div className="flex gap-1 ml-2">
          {TIERS.map((t, idx) => (
            <button
              key={t.label}
              onClick={() => { setTier(idx); setShowAll(false); }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                tier === idx
                  ? "bg-purple-600/30 text-purple-300 border border-purple-500/30"
                  : "text-slate-600 hover:text-slate-400 border border-transparent"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-600 ml-auto">
          Updated {new Date(data.updatedAt).toLocaleTimeString()}
        </span>
      </div>

      {/* Table header */}
      <div className="flex items-center px-2 md:px-4 py-2 text-[10px] uppercase tracking-widest text-slate-400 font-semibold border-b border-purple-900/20 sticky top-0 z-10" style={{ background: "var(--bg-primary)" }}>
        <span className="w-8 md:w-10">#</span>
        <span className="w-6 md:w-7"></span>
        <span className="flex-1 min-w-0">Coin</span>
        <span className="w-[70px] md:w-[90px] text-right">Price</span>
        <span className="w-[60px] md:w-[80px] text-right">Dev</span>
        <span className="w-[70px] md:w-[80px] text-right hidden sm:block">Supply</span>
        <span className="w-[70px] md:w-[80px] text-right hidden lg:block">MCap</span>
        <span className="w-[75px] text-right hidden lg:block">Vol 24h</span>
        <span className="w-[120px] text-center hidden md:block">Chains</span>
        <span className="w-[90px] text-center hidden md:block">Links</span>
      </div>

      {/* Coin rows */}
      {(() => {
        const q = search.toLowerCase();
        let filtered = coins.filter(TIERS[tier].filter);
        if (q) filtered = filtered.filter(c =>
          c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
        );
        const DEFAULT_SHOW = 20;
        const visible = showAll || q ? filtered : filtered.slice(0, DEFAULT_SHOW);
        const hasMore = !showAll && !q && filtered.length > DEFAULT_SHOW;

        return (
      <div className="flex flex-col">
        <div className="text-xs text-slate-600 px-4 py-1">
          Showing {visible.length} of {filtered.length} stablecoins
        </div>
        {visible.map((coin, i) => {
          const devClass = coin.yieldBearing ? "safe" : coin.deviation < 0.1 ? "safe" : coin.deviation < 0.5 ? "warn" : "danger";
          const volColor = coin.volume24h > 1e8 ? "text-emerald-400" : coin.volume24h > 1e6 ? "text-slate-400" : "text-slate-600";

          return (
            <div
              key={coin.symbol}
              className={`coin-row ${devClass} ${i % 2 === 0 ? "" : "bg-purple-950/10"}`}
              title={coin.tldr}
            >
              <span className="w-8 md:w-10 text-[10px] md:text-xs text-slate-600 font-semibold">#{coin.rank}</span>

              <span className="w-6 md:w-7">
                {coin.logo ? (
                  <img src={coin.logo} alt={coin.symbol} className="w-5 h-5 rounded-full" loading="lazy" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-purple-800 flex items-center justify-center text-[8px] text-purple-300">{coin.symbol[0]}</div>
                )}
              </span>

              <span className="flex-1 min-w-0 flex items-center gap-1.5">
                <span className="text-slate-200 font-bold text-sm">
                  {coin.symbol}
                </span>
                <span className="text-slate-600 text-[11px] truncate">{coin.name}</span>
                {coin.yieldBearing && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 font-medium">YIELD</span>
                )}
                {coin.pegCurrency && coin.pegCurrency !== "USD" && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 font-medium">{coin.pegCurrency}</span>
                )}
              </span>

              <span className="w-[70px] md:w-[90px] text-right text-white font-mono font-bold text-xs md:text-sm">
                {coin.pegSymbol || "$"}{coin.price.toFixed(4)}
              </span>

              <span className="w-[60px] md:w-[80px] text-right">
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

              <span className="w-[70px] md:w-[80px] text-right text-slate-400 text-xs md:text-sm font-medium hidden sm:block">{fmt(coin.supply)}</span>
              <span className="w-[70px] md:w-[80px] text-right text-slate-500 text-xs hidden lg:block">{fmt(coin.marketCap || coin.supply)}</span>

              <span className={`w-[75px] text-right text-sm hidden lg:block ${volColor}`}>{fmt(coin.volume24h)}</span>

              <span className="w-[120px] justify-center gap-0.5 items-center hidden md:flex">
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

              <span className="w-[90px] justify-center gap-2 items-center hidden md:flex">
                {coin.geckoUrl && (
                  <a href={coin.geckoUrl} target="_blank" rel="noopener noreferrer" title="CoinGecko">
                    <img src="https://www.coingecko.com/favicon.ico" className="w-4 h-4 rounded opacity-50 hover:opacity-100 transition-opacity" alt="CG" />
                  </a>
                )}
                <a href="https://defillama.com/stablecoins" target="_blank" rel="noopener noreferrer" title="DeFiLlama">
                  <img src="https://defillama.com/defillama-press-kit/defi/SVG/defillama-dark.svg" className="w-4 h-4 rounded opacity-50 hover:opacity-100 transition-opacity" alt="DL"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://icons.llamao.fi/icons/protocols/defillama"; }} />
                </a>
                {coin.whitepaperUrl && (
                  <a href={coin.whitepaperUrl} target="_blank" rel="noopener noreferrer" title="Whitepaper / Docs">
                    <svg className="w-4 h-4 opacity-50 hover:opacity-100 transition-opacity" fill="none" stroke="#a78bfa" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </a>
                )}
              </span>
            </div>
          );
        })}
        {hasMore && (
          <button
            onClick={() => setShowAll(true)}
            className="mx-auto mt-4 px-6 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition-colors"
          >
            Show all {filtered.length} stablecoins
          </button>
        )}
        {showAll && !q && filtered.length > 20 && (
          <button
            onClick={() => setShowAll(false)}
            className="mx-auto mt-4 px-6 py-2 rounded-xl bg-purple-950/30 border border-purple-900/30 text-slate-500 text-xs hover:text-slate-400 transition-colors"
          >
            Collapse to top 20
          </button>
        )}
      </div>
        );
      })()}

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-700 mt-8 pb-4">
        stables info — {data.totalCoins} stablecoins · {data.totalChains} chains · {fmt(data.totalSupply)} monitored · not financial advice · dyor
      </div>
    </div>
  );
}
