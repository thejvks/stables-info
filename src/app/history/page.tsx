"use client";

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
  return (
    <div className="max-w-[1100px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-bold text-slate-200">Past Crises</h2>
      </div>

      <p className="text-sm text-slate-500 mb-6">Major stablecoin events that shaped the market.</p>

      <div className="space-y-4">
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
    </div>
  );
}
