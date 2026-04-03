"use client";

import { useEffect, useState } from "react";
import { GECKO_LOGOS } from "../../lib/coins-data";

interface SupplyChange {
  symbol: string; name: string; geckoId: string; supply: number;
  dayChange: number; dayPct: number; weekChange: number; weekPct: number;
  monthChange: number; monthPct: number;
}
interface HistoryData {
  bigMoves: SupplyChange[]; recentMints: SupplyChange[];
  recentBurns: SupplyChange[]; monthlyGrowers: SupplyChange[];
  monthlyShrinkers: SupplyChange[]; updatedAt: string;
}

function fmt(val: number): string {
  const abs = Math.abs(val);
  if (abs >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `$${(val / 1e6).toFixed(0)}M`;
  if (abs >= 1e3) return `$${(val / 1e3).toFixed(0)}K`;
  return `$${val.toFixed(0)}`;
}

function fmtChange(val: number): string {
  const prefix = val > 0 ? "+" : "";
  const abs = Math.abs(val);
  if (abs >= 1e9) return `${prefix}$${(val / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${prefix}$${(val / 1e6).toFixed(0)}M`;
  if (abs >= 1e3) return `${prefix}$${(val / 1e3).toFixed(0)}K`;
  return `${prefix}$${val.toFixed(0)}`;
}

function CoinLogo({ symbol, geckoId }: { symbol: string; geckoId: string }) {
  const url = GECKO_LOGOS[geckoId] || "";
  return url ? (
    <img src={url} alt={symbol} className="w-6 h-6 rounded-full" loading="lazy" />
  ) : (
    <div className="w-6 h-6 rounded-full bg-purple-800 flex items-center justify-center text-[8px] text-purple-300 font-bold">{symbol[0]}</div>
  );
}

// Historical crisis events as news items
const PAST_EVENTS = [
  {
    date: "March 11, 2023",
    headline: "USDC crashes to $0.87 after Silicon Valley Bank collapse",
    body: "Circle disclosed $3.3B of USDC reserves were stuck at SVB. Panic selling crashed USDC to $0.87. DAI followed to $0.89 due to USDC backing. Curve 3pool went heavily imbalanced. The peg restored after the Fed guaranteed all SVB deposits.",
    coins: ["USDC", "DAI"],
    severity: "critical" as const,
    impact: "-13% depeg",
  },
  {
    date: "May 9, 2022",
    headline: "UST death spiral wipes out $40B — USDT briefly wobbles",
    body: "Terra's algorithmic stablecoin UST lost its peg and spiraled to $0.01 over 3 days. Luna went from $80 to $0. USDT briefly hit $0.95 as contagion fears spread. The event triggered global regulatory scrutiny of all stablecoins.",
    coins: ["USDT"],
    severity: "critical" as const,
    impact: "$40B wiped",
  },
  {
    date: "November 8, 2022",
    headline: "FTX collapses — USDT briefly depegs to $0.97",
    body: "FTX filed for bankruptcy after a bank run. SBF arrested. USDT dropped to $0.97 as traders panic-sold into USDC. Binance's BUSD saw massive inflows. Trust in centralized exchanges shattered.",
    coins: ["USDT", "BUSD"],
    severity: "high" as const,
    impact: "-3% USDT depeg",
  },
  {
    date: "March 12, 2020",
    headline: "COVID Black Thursday — DAI spikes above $1.10",
    body: "Global markets crashed. ETH dropped 50% in hours, triggering massive MakerDAO liquidations. DAI spiked to $1.10+ due to liquidity crunch. MakerDAO was forced to add USDC as emergency collateral — a controversial decision that saved the protocol.",
    coins: ["DAI"],
    severity: "high" as const,
    impact: "+10% above peg",
  },
  {
    date: "June 2023",
    headline: "TUSD loses attestation partner — transparency concerns mount",
    body: "TrueUSD's attestation provider stopped publishing reports. Questions about actual reserves emerged. TUSD traded at a slight discount for weeks. Market cap began declining from $3B toward under $500M.",
    coins: ["TUSD"],
    severity: "medium" as const,
    impact: "Lost $2.5B mcap",
  },
  {
    date: "February 2023",
    headline: "Paxos ordered to stop minting BUSD — Binance stablecoin era ends",
    body: "The SEC and NYDFS ordered Paxos to stop issuing new BUSD tokens. Binance's flagship stablecoin began its sunset. $16B market cap shrank to under $300M within a year as redemptions accelerated.",
    coins: ["BUSD"],
    severity: "medium" as const,
    impact: "-$16B supply",
  },
];

const SEV_STYLE = {
  critical: "border-red-500/30 bg-red-500/5",
  high: "border-amber-500/30 bg-amber-500/5",
  medium: "border-blue-500/30 bg-blue-500/5",
};
const SEV_LABEL_STYLE = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  medium: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default function HistoryPage() {
  const [data, setData] = useState<HistoryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"live" | "past">("live");

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-[1100px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-bold text-slate-200">Coin History</h2>
        <div className="flex gap-1 ml-4">
          <button onClick={() => setTab("live")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${tab === "live" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "text-slate-600 border border-transparent"}`}>
            Recent Activity
          </button>
          <button onClick={() => setTab("past")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${tab === "past" ? "bg-purple-600/30 text-purple-300 border border-purple-500/30" : "text-slate-600 border border-transparent"}`}>
            Past Crises
          </button>
        </div>
        {data?.updatedAt && (
          <span className="text-xs text-slate-600 ml-auto">Updated {new Date(data.updatedAt).toLocaleTimeString()}</span>
        )}
      </div>

      {tab === "live" && (
        <>
          {loading ? (
            <div className="flex items-center justify-center h-[50vh]">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !data ? (
            <div className="text-slate-500 text-center mt-20">Failed to load data</div>
          ) : (
            <div className="space-y-6">

              {/* Recent Mints */}
              {data.recentMints.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Recently Minted (last 24h)
                  </h3>
                  <div className="space-y-2">
                    {data.recentMints.slice(0, 10).map((coin) => (
                      <div key={coin.symbol} className="flex items-center gap-3 py-2 border-b border-purple-900/10 last:border-0">
                        <CoinLogo symbol={coin.symbol} geckoId={coin.geckoId} />
                        <span className="font-bold text-slate-200 w-16">{coin.symbol}</span>
                        <span className="text-xs text-slate-500 flex-1">{coin.name}</span>
                        <span className="text-emerald-400 font-mono font-bold text-sm">{fmtChange(coin.dayChange)}</span>
                        <span className="text-[10px] text-emerald-400/70 w-14 text-right">+{coin.dayPct}%</span>
                        <span className="text-xs text-slate-500 w-20 text-right">Total: {fmt(coin.supply)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Burns */}
              {data.recentBurns.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    Recently Burned (last 24h)
                  </h3>
                  <div className="space-y-2">
                    {data.recentBurns.slice(0, 10).map((coin) => (
                      <div key={coin.symbol} className="flex items-center gap-3 py-2 border-b border-purple-900/10 last:border-0">
                        <CoinLogo symbol={coin.symbol} geckoId={coin.geckoId} />
                        <span className="font-bold text-slate-200 w-16">{coin.symbol}</span>
                        <span className="text-xs text-slate-500 flex-1">{coin.name}</span>
                        <span className="text-red-400 font-mono font-bold text-sm">{fmtChange(coin.dayChange)}</span>
                        <span className="text-[10px] text-red-400/70 w-14 text-right">{coin.dayPct}%</span>
                        <span className="text-xs text-slate-500 w-20 text-right">Total: {fmt(coin.supply)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Monthly Growers */}
              <div className="grid grid-cols-2 gap-6">
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-3">Fastest Growing (30d)</h3>
                  <div className="space-y-2">
                    {data.monthlyGrowers.map((coin) => (
                      <div key={coin.symbol} className="flex items-center gap-2 py-1.5">
                        <CoinLogo symbol={coin.symbol} geckoId={coin.geckoId} />
                        <span className="font-bold text-slate-200 text-sm w-14">{coin.symbol}</span>
                        <div className="flex-1 h-3 bg-purple-950/30 rounded overflow-hidden">
                          <div className="h-full rounded bg-emerald-500/60" style={{ width: `${Math.min(coin.monthPct, 100)}%` }} />
                        </div>
                        <span className="text-emerald-400 text-xs font-mono w-14 text-right">+{coin.monthPct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">Fastest Shrinking (30d)</h3>
                  <div className="space-y-2">
                    {data.monthlyShrinkers.map((coin) => (
                      <div key={coin.symbol} className="flex items-center gap-2 py-1.5">
                        <CoinLogo symbol={coin.symbol} geckoId={coin.geckoId} />
                        <span className="font-bold text-slate-200 text-sm w-14">{coin.symbol}</span>
                        <div className="flex-1 h-3 bg-purple-950/30 rounded overflow-hidden">
                          <div className="h-full rounded bg-red-500/60" style={{ width: `${Math.min(Math.abs(coin.monthPct), 100)}%` }} />
                        </div>
                        <span className="text-red-400 text-xs font-mono w-14 text-right">{coin.monthPct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Big Moves Table */}
              <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Biggest Supply Moves (24h)</h3>
                <div className="text-[10px] uppercase tracking-widest text-slate-600 flex items-center px-2 py-1 border-b border-purple-900/15 mb-2">
                  <span className="w-8"></span><span className="w-16">Coin</span><span className="flex-1"></span>
                  <span className="w-24 text-right">24h Change</span>
                  <span className="w-20 text-right">7d Change</span>
                  <span className="w-20 text-right">30d Change</span>
                  <span className="w-20 text-right">Supply</span>
                </div>
                {data.bigMoves.map((coin) => (
                  <div key={coin.symbol} className="flex items-center gap-2 px-2 py-2 border-b border-purple-900/5 last:border-0">
                    <CoinLogo symbol={coin.symbol} geckoId={coin.geckoId} />
                    <span className="font-bold text-slate-200 text-sm w-16">{coin.symbol}</span>
                    <span className="text-xs text-slate-600 flex-1 truncate">{coin.name}</span>
                    <span className={`w-24 text-right text-xs font-mono font-bold ${coin.dayChange > 0 ? "text-emerald-400" : coin.dayChange < 0 ? "text-red-400" : "text-slate-600"}`}>
                      {fmtChange(coin.dayChange)}
                    </span>
                    <span className={`w-20 text-right text-[11px] font-mono ${coin.weekChange > 0 ? "text-emerald-400/70" : coin.weekChange < 0 ? "text-red-400/70" : "text-slate-600"}`}>
                      {fmtChange(coin.weekChange)}
                    </span>
                    <span className={`w-20 text-right text-[11px] font-mono ${coin.monthChange > 0 ? "text-emerald-400/70" : coin.monthChange < 0 ? "text-red-400/70" : "text-slate-600"}`}>
                      {fmtChange(coin.monthChange)}
                    </span>
                    <span className="w-20 text-right text-xs text-slate-500">{fmt(coin.supply)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {tab === "past" && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500 mb-4">Major stablecoin events that shaped the market.</p>
          {PAST_EVENTS.map((event, i) => (
            <div key={i} className={`glass-card border ${SEV_STYLE[event.severity]} overflow-hidden`}>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs text-slate-500">{event.date}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full border font-semibold uppercase ${SEV_LABEL_STYLE[event.severity]}`}>
                    {event.severity}
                  </span>
                  <span className="text-xs text-slate-600 font-mono ml-auto">{event.impact}</span>
                </div>
                <h3 className="text-base font-bold text-slate-200 mb-2">{event.headline}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{event.body}</p>
                <div className="flex gap-2 mt-3">
                  {event.coins.map((sym) => (
                    <a key={sym} href={`https://www.coingecko.com/en/coins/${sym.toLowerCase()}`} target="_blank" rel="noopener noreferrer"
                       className="text-[10px] px-2 py-1 rounded-lg bg-purple-900/30 text-purple-300 hover:bg-purple-900/50 transition-colors">
                      {sym} chart
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
