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
  if (val >= 1e3) return `$${(val / 1e3).toFixed(0)}K`;
  return `$${val.toLocaleString()}`;
}

export default function ChainsPage() {
  const [data, setData] = useState<ApiData | null>(null);
  const [selectedChain, setSelectedChain] = useState("");
  const [loading, setLoading] = useState(true);
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

  // Filter chains by search
  const q = chainSearch.toLowerCase();
  const filteredChains = q ? chains.filter(c => c.name.toLowerCase().includes(q)) : chains;

  // When a chain is selected, find all coins on that chain with their supply
  const chainCoins = selectedChain
    ? coins
        .map((coin) => {
          const chainEntry = coin.chains.find((ch) => ch.chain === selectedChain);
          if (!chainEntry || chainEntry.supply <= 0) return null;
          return { ...coin, chainSupply: chainEntry.supply };
        })
        .filter(Boolean)
        .sort((a: any, b: any) => b.chainSupply - a.chainSupply) as (Coin & { chainSupply: number })[]
    : [];
  const selectedChainTotal = chainCoins.reduce((s, c) => s + c.chainSupply, 0);
  const selectedChainData = chains.find((c) => c.name === selectedChain);

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-bold text-slate-200">Chain X-Ray</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 uppercase tracking-wider font-semibold">
          {chains.length} chains
        </span>
        <span className="text-sm text-slate-500 ml-auto">{fmt(totalSupply)} tracked</span>
      </div>

      {/* Two-column layout: chain list left, detail right */}
      <div className="grid grid-cols-[1fr_1fr] gap-6">

        {/* LEFT — Chain list */}
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Blockchains</h3>
            <input
              type="text"
              placeholder="Search..."
              value={chainSearch}
              onChange={(e) => setChainSearch(e.target.value)}
              className="ml-auto px-2 py-1 rounded-lg bg-purple-950/30 border border-purple-900/30 text-slate-200 placeholder-slate-600 focus:border-purple-500/50 focus:outline-none text-xs w-28"
            />
          </div>
          <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
            {filteredChains.map((chain) => {
              const pct = (chain.supply / totalSupply) * 100;
              const isSelected = selectedChain === chain.name;
              return (
                <div
                  key={chain.name}
                  onClick={() => setSelectedChain(isSelected ? "" : chain.name)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "bg-purple-600/20 border border-purple-500/30"
                      : "hover:bg-purple-900/15 border border-transparent"
                  }`}
                >
                  <div className="w-5 h-5 flex-shrink-0">
                    {chain.logo ? (
                      <img src={chain.logo} alt={chain.name} className="w-5 h-5 rounded-full" loading="lazy" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-purple-800 flex items-center justify-center text-[7px] text-purple-300 font-bold">{chain.name[0]}</div>
                    )}
                  </div>
                  <span className={`text-sm font-medium flex-1 truncate ${isSelected ? "text-purple-300" : "text-slate-300"}`}>
                    {chain.name}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{fmt(chain.supply)}</span>
                  <span className="text-[10px] text-slate-600 w-10 text-right">{pct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — Selected chain detail */}
        <div>
          {!selectedChain ? (
            <div className="glass-card p-8 flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="text-4xl mb-4">👈</div>
              <p className="text-slate-400 text-sm">Click a chain to see which stablecoins live on it</p>
              <p className="text-slate-600 text-xs mt-1">and how much supply each one has</p>
            </div>
          ) : (
            <div className="glass-card p-6">
              {/* Chain header */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-purple-900/20">
                <div className="w-10 h-10 flex-shrink-0">
                  {selectedChainData?.logo ? (
                    <img src={selectedChainData.logo} alt={selectedChain} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center text-lg text-purple-300 font-bold">{selectedChain[0]}</div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-200">{selectedChain}</h3>
                  <p className="text-xs text-slate-500">
                    {fmt(selectedChainTotal)} across {chainCoins.length} stablecoin{chainCoins.length !== 1 ? "s" : ""}
                    {" · "}{((selectedChainTotal / totalSupply) * 100).toFixed(1)}% of total
                  </p>
                </div>
                <button onClick={() => setSelectedChain("")} className="ml-auto text-xs text-slate-600 hover:text-purple-400 px-2 py-1">
                  Close
                </button>
              </div>

              {/* Coins on this chain */}
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
                {chainCoins.map((coin, i) => {
                  const pct = selectedChainTotal > 0 ? (coin.chainSupply / selectedChainTotal) * 100 : 0;
                  const maxSupply = chainCoins[0]?.chainSupply || 1;
                  return (
                    <div key={coin.symbol} className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-600 w-5 text-right">#{i + 1}</span>
                      <div className="w-5 h-5 flex-shrink-0">
                        {coin.logo ? (
                          <img src={coin.logo} alt={coin.symbol} className="w-5 h-5 rounded-full" loading="lazy" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-purple-800 flex items-center justify-center text-[7px] text-purple-300">{coin.symbol[0]}</div>
                        )}
                      </div>
                      <span className="w-16 text-sm text-slate-200 font-bold truncate">{coin.symbol}</span>
                      <div className="flex-1 h-5 bg-purple-950/30 rounded overflow-hidden relative">
                        <div
                          className="h-full rounded bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300"
                          style={{ width: `${(coin.chainSupply / maxSupply) * 100}%` }}
                        />
                        <span className="absolute inset-0 flex items-center px-2 text-[10px] text-white font-medium">
                          {fmt(coin.chainSupply)}
                        </span>
                      </div>
                      <span className="w-12 text-right text-[10px] text-slate-500 font-mono">{pct.toFixed(1)}%</span>
                    </div>
                  );
                })}
                {chainCoins.length === 0 && (
                  <p className="text-slate-600 text-sm text-center py-4">No stablecoins found on this chain</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
