"use client";

import { useEffect, useState } from "react";
import { CHAIN_LOGOS } from "../../lib/coins-data";

interface ChainInfo { chain: string; supply: number; logo: string; }
interface Coin {
  rank: number; symbol: string; name: string; supply: number;
  logo: string; chains: ChainInfo[];
}
interface ChainTotal { name: string; supply: number; logo: string; }
interface ApiData {
  coins: Coin[]; totalSupply: number; totalChains: number;
  chainTotals: ChainTotal[];
}

function fmt(val: number): string {
  if (val >= 1e12) return `$${(val / 1e12).toFixed(1)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`;
  return `$${val.toLocaleString()}`;
}

export default function ChainsPage() {
  const [data, setData] = useState<ApiData | null>(null);
  const [selectedCoin, setSelectedCoin] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAllChains, setShowAllChains] = useState(false);
  const [showAllCoins, setShowAllCoins] = useState(false);
  const [chainSearch, setChainSearch] = useState("");

  useEffect(() => {
    fetch("/api/coins")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading cross-chain data...</p>
      </div>
    );
  }

  if (!data) return <div className="text-slate-500 text-center mt-20">Failed to load data</div>;

  const chains = data.chainTotals || [];
  const totalSupply = chains.reduce((s, c) => s + c.supply, 0);
  const coins = data.coins || [];
  const maxChainSupply = chains.length > 0 ? chains[0].supply : 1;

  // Selected coin breakdown
  const drillCoin = coins.find((c) => c.symbol === selectedCoin);
  const drillChains = drillCoin?.chains || [];
  const drillMax = drillChains.length > 0 ? drillChains[0].supply : 1;
  const drillTotal = drillChains.reduce((s, c) => s + c.supply, 0);

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-bold text-slate-200">Cross-Chain Supply</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 uppercase tracking-wider font-semibold">
          {chains.length} chains
        </span>
        <span className="text-sm text-slate-500 ml-auto">{fmt(totalSupply)} tracked</span>
      </div>

      {/* Chain bars */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Supply by Blockchain</h3>
          <input
            type="text"
            placeholder="Search chain..."
            value={chainSearch}
            onChange={(e) => { setChainSearch(e.target.value); setShowAllChains(true); }}
            className="ml-auto px-3 py-1.5 rounded-lg bg-purple-950/30 border border-purple-900/30 text-slate-200 placeholder-slate-600 focus:border-purple-500/50 focus:outline-none text-xs w-36"
          />
        </div>
        {(() => {
          const q = chainSearch.toLowerCase();
          let filteredChains = q ? chains.filter(c => c.name.toLowerCase().includes(q)) : chains;
          const visibleChains = showAllChains || q ? filteredChains : filteredChains.slice(0, 20);
          const hasMoreChains = !showAllChains && !q && filteredChains.length > 20;
          return (<>
        <div className="text-xs text-slate-600 mb-2">Showing {visibleChains.length} of {filteredChains.length} chains</div>
        <div className="space-y-3">
          {visibleChains.map((chain) => {
            const pct = (chain.supply / totalSupply) * 100;
            return (
              <div key={chain.name} className="flex items-center gap-3">
                <div className="w-6 h-6 flex-shrink-0">
                  {chain.logo ? (
                    <img src={chain.logo} alt={chain.name} className="w-6 h-6 rounded-full" loading="lazy" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-purple-800 flex items-center justify-center text-[8px] text-purple-300">{chain.name[0]}</div>
                  )}
                </div>
                <span className="w-24 text-sm text-slate-300 font-medium truncate">{chain.name}</span>
                <div className="flex-1 h-6 bg-purple-950/30 rounded-lg overflow-hidden relative">
                  <div
                    className="h-full rounded-lg bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500"
                    style={{ width: `${(chain.supply / maxChainSupply) * 100}%` }}
                  />
                  <span className="absolute inset-0 flex items-center px-3 text-[11px] text-white font-medium">
                    {fmt(chain.supply)}
                  </span>
                </div>
                <span className="w-14 text-right text-xs text-slate-500 font-mono">{pct.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
        {hasMoreChains && (
          <button onClick={() => setShowAllChains(true)}
            className="mx-auto mt-4 px-6 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition-colors block">
            Show all {filteredChains.length} chains
          </button>
        )}
        {showAllChains && !q && filteredChains.length > 20 && (
          <button onClick={() => setShowAllChains(false)}
            className="mx-auto mt-2 px-4 py-1 text-slate-600 text-xs hover:text-slate-400 transition-colors block">
            Collapse
          </button>
        )}
        </>); })()}
      </div>

      {/* Coin grid — chain availability */}
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">All Coins — Chain Availability</h3>
      </div>
      <div className="grid grid-cols-5 gap-3 mb-4">
        {(showAllCoins ? coins : coins.slice(0, 20)).map((coin) => (
          <div key={coin.symbol} className="glass-card p-3 text-center cursor-pointer" onClick={() => setSelectedCoin(coin.symbol)}>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              {coin.logo && <img src={coin.logo} alt={coin.symbol} className="w-4 h-4 rounded-full" loading="lazy" />}
              <span className="text-sm font-bold text-slate-200">{coin.symbol}</span>
            </div>
            <div className="text-[11px] text-slate-500">{fmt(coin.supply)}</div>
            <div className="flex justify-center gap-0.5 mt-1.5">
              {coin.chains.slice(0, 5).map((ch) => (
                <img key={ch.chain} src={ch.logo || CHAIN_LOGOS[ch.chain] || ""} alt={ch.chain} className="w-3.5 h-3.5 rounded-full" loading="lazy" />
              ))}
              {coin.chains.length > 5 && <span className="text-[8px] text-slate-600">+{coin.chains.length - 5}</span>}
            </div>
            <div className="text-[9px] text-slate-600 mt-1">{coin.chains.length} chain{coin.chains.length !== 1 ? "s" : ""}</div>
          </div>
        ))}
      </div>
      {!showAllCoins && coins.length > 20 && (
        <button onClick={() => setShowAllCoins(true)}
          className="mx-auto mb-6 px-6 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition-colors block">
          Show all {coins.length} coins
        </button>
      )}

      {/* Drill down */}
      {selectedCoin && drillCoin && (
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            {drillCoin.logo && <img src={drillCoin.logo} alt={drillCoin.symbol} className="w-8 h-8 rounded-full" />}
            <div>
              <h3 className="text-lg font-bold text-slate-200">{drillCoin.symbol} — Chain Breakdown</h3>
              <p className="text-xs text-slate-500">{fmt(drillTotal)} across {drillChains.length} chain{drillChains.length !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={() => setSelectedCoin("")} className="ml-auto text-xs text-slate-600 hover:text-purple-400">Close</button>
          </div>
          <div className="space-y-2.5">
            {drillChains.map((ch) => {
              const pct = drillTotal > 0 ? (ch.supply / drillTotal) * 100 : 0;
              return (
                <div key={ch.chain} className="flex items-center gap-3">
                  <div className="w-5 h-5">
                    {ch.logo ? <img src={ch.logo} alt={ch.chain} className="w-5 h-5 rounded-full" /> : <div className="w-5 h-5 rounded-full bg-purple-800" />}
                  </div>
                  <span className="w-24 text-sm text-slate-300">{ch.chain}</span>
                  <div className="flex-1 h-5 bg-purple-950/30 rounded overflow-hidden relative">
                    <div className="h-full rounded bg-gradient-to-r from-emerald-600 to-emerald-400" style={{ width: `${(ch.supply / drillMax) * 100}%` }} />
                    <span className="absolute inset-0 flex items-center px-2 text-[10px] text-white font-medium">{fmt(ch.supply)}</span>
                  </div>
                  <span className="w-14 text-right text-xs text-slate-500 font-mono">{pct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
