"use client";

import { useEffect, useState } from "react";
import { CHAIN_LOGOS } from "../../lib/coins-data";

interface ChainInfo { chain: string; supply: number; logo: string; }
interface Coin {
  rank: number; symbol: string; name: string; price: number;
  deviation: number; supply: number; yieldBearing: boolean;
  type: string; issuer: string; launched: string; tldr: string;
  backing: string; risk: string; logo: string; geckoUrl: string;
  whitepaperUrl: string; chains: ChainInfo[];
}

function fmt(val: number): string {
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`;
  return `$${val.toLocaleString()}`;
}

export default function WikiPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/coins")
      .then((r) => r.json())
      .then((d) => { setCoins(d.coins || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filtered = coins.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.symbol.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q) ||
      c.tldr.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-bold text-slate-200">Coin Wiki</h2>
        <span className="text-xs text-slate-500">{filtered.length} stablecoins</span>
      </div>

      {/* Explainer */}
      <div className="glass-card p-4 mb-6 border-l-4 border-purple-500">
        <p className="text-sm text-slate-400">
          <strong className="text-slate-200">What does deviation mean?</strong> It measures how far a stablecoin&apos;s price is from $1.00. Under 0.1% = rock solid. 0.1-0.5% = minor wobble. Over 0.5% = pay attention.
          Yield-bearing coins (USYC, USDY, TBILL) trade ABOVE $1 by design — the extra % is your yield.
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by symbol, name, issuer, type..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 px-4 py-3 rounded-xl bg-purple-950/30 border border-purple-900/30 text-slate-200 placeholder-slate-600 focus:border-purple-500/50 focus:outline-none transition-colors text-sm"
      />

      {/* Coin entries */}
      <div className="space-y-2">
        {filtered.map((coin) => {
          const isOpen = expanded === coin.symbol;
          const totalChainSupply = coin.chains.reduce((s, c) => s + c.supply, 0);

          return (
            <div key={coin.symbol} className="glass-card overflow-hidden">
              {/* Header row — always visible */}
              <div
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-purple-900/10 transition-colors"
                onClick={() => setExpanded(isOpen ? null : coin.symbol)}
              >
                <span className="text-slate-600 text-xs w-4">{isOpen ? "▼" : "▶"}</span>
                {coin.logo ? (
                  <img src={coin.logo} alt={coin.symbol} className="w-8 h-8 rounded-full" loading="lazy" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-800 flex items-center justify-center text-xs text-purple-300">{coin.symbol[0]}</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{coin.symbol}</span>
                    <span className="text-slate-500 text-sm truncate">{coin.name}</span>
                    {coin.yieldBearing && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400 font-medium">YIELD</span>
                    )}
                  </div>
                </div>
                <span className="text-white font-mono font-bold text-sm">${coin.price.toFixed(4)}</span>
                <span className="text-slate-500 text-sm w-20 text-right">{fmt(coin.supply)}</span>
              </div>

              {/* Expanded detail — side by side layout */}
              {isOpen && (
                <div className="px-4 pb-4 pt-0 border-t border-purple-900/20">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-4 mt-4 mb-4">
                    <div className="stat-card !p-3">
                      <div className="text-lg font-bold text-white font-mono">${coin.price.toFixed(4)}</div>
                      <div className="text-[10px] text-slate-500 uppercase">Price</div>
                    </div>
                    <div className="stat-card !p-3">
                      <div className="text-lg font-bold text-white font-mono">{fmt(coin.supply)}</div>
                      <div className="text-[10px] text-slate-500 uppercase">Supply</div>
                    </div>
                    <div className="stat-card !p-3">
                      <div className={`text-lg font-bold font-mono ${coin.deviation < 0.1 ? "text-emerald-400" : coin.deviation < 0.5 ? "text-amber-400" : "text-red-400"}`}>
                        {coin.deviation.toFixed(3)}%
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase">Deviation</div>
                    </div>
                  </div>

                  {/* Two columns: Info left, Chains right */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* LEFT — coin info */}
                    <div>
                  {coin.type && (
                    <div className="mb-3">
                      <span className="text-[10px] text-slate-600 uppercase tracking-wider">Type</span>
                      <p className="text-sm text-slate-300">{coin.type}</p>
                    </div>
                  )}
                  {coin.issuer && (
                    <div className="mb-3">
                      <span className="text-[10px] text-slate-600 uppercase tracking-wider">Issuer</span>
                      <p className="text-sm text-slate-300">{coin.issuer}</p>
                    </div>
                  )}
                  {coin.tldr && (
                    <div className="mb-3">
                      <span className="text-[10px] text-slate-600 uppercase tracking-wider">What is it</span>
                      <p className="text-sm text-slate-400">{coin.tldr}</p>
                    </div>
                  )}
                  {coin.backing && (
                    <div className="mb-3">
                      <span className="text-[10px] text-slate-600 uppercase tracking-wider">Backing</span>
                      <p className="text-sm text-slate-400">{coin.backing}</p>
                    </div>
                  )}
                  {coin.risk && (
                    <div className="mb-3">
                      <span className="text-[10px] text-slate-600 uppercase tracking-wider">Key Risks</span>
                      <p className="text-sm text-amber-400/80">{coin.risk}</p>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-3 mt-4">
                    {coin.geckoUrl && (
                      <a href={coin.geckoUrl} target="_blank" rel="noopener noreferrer"
                         className="text-xs px-3 py-1.5 rounded-lg bg-purple-900/30 text-purple-300 hover:bg-purple-900/50 transition-colors">
                        CoinGecko
                      </a>
                    )}
                    {coin.whitepaperUrl && (
                      <a href={coin.whitepaperUrl} target="_blank" rel="noopener noreferrer"
                         className="text-xs px-3 py-1.5 rounded-lg bg-purple-900/30 text-purple-300 hover:bg-purple-900/50 transition-colors">
                        Whitepaper / Docs
                      </a>
                    )}
                  </div>
                    </div>

                    {/* RIGHT — chain distribution */}
                    <div>
                  {coin.chains.length > 0 && (
                    <div>
                      <span className="text-[10px] text-slate-600 uppercase tracking-wider">Chain Distribution</span>
                      <div className="mt-2 space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                        {coin.chains.slice(0, 10).map((ch) => {
                          const pct = totalChainSupply > 0 ? (ch.supply / totalChainSupply) * 100 : 0;
                          return (
                            <div key={ch.chain} className="flex items-center gap-2">
                              {ch.logo ? <img src={ch.logo} className="w-4 h-4 rounded-full" alt={ch.chain} /> : <div className="w-4 h-4 rounded-full bg-purple-800 flex items-center justify-center text-[6px] text-purple-300">{ch.chain[0]}</div>}
                              <span className="text-xs text-slate-400 w-20 truncate">{ch.chain}</span>
                              <div className="flex-1 h-2 bg-purple-950/30 rounded overflow-hidden">
                                <div className="h-full rounded bg-purple-500" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-[10px] text-slate-500 w-12 text-right">{pct.toFixed(1)}%</span>
                            </div>
                          );
                        })}
                        {coin.chains.length > 10 && (
                          <div className="text-[10px] text-slate-600 text-center mt-1">+{coin.chains.length - 10} more chains</div>
                        )}
                      </div>
                    </div>
                  )}
                  {coin.chains.length === 0 && (
                    <div className="text-sm text-slate-600 italic">No chain data available</div>
                  )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
