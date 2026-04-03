"use client";

const CRISES = [
  {
    name: "March 2023 — The Day USDC Broke",
    date: "March 11, 2023",
    color: "border-amber-500/30 bg-amber-500/5",
    titleColor: "text-amber-400",
    desc: "Silicon Valley Bank collapsed. Circle had $3.3B stuck there. USDC cratered to $0.87. DAI followed. Curve pools went haywire. The whole stablecoin stack wobbled.",
    bottom: "$0.87",
    drop: "-13%",
    cmd: "python evals/backtest.py --coin usd-coin --start 2023-03-08 --end 2023-03-15",
  },
  {
    name: "May 2022 — UST Death Spiral",
    date: "May 7-14, 2022",
    color: "border-red-500/30 bg-red-500/5",
    titleColor: "text-red-400",
    desc: "Luna's algorithmic stablecoin UST collapsed from $1 to $0.01. $40B evaporated in days. USDT briefly wobbled to $0.95. The event that changed stablecoin regulation forever.",
    bottom: "$0.01 (UST)",
    drop: "-99%",
    cmd: "python evals/backtest.py --coin tether --start 2022-05-07 --end 2022-05-14",
  },
  {
    name: "November 2022 — FTX Collapse",
    date: "Nov 6-13, 2022",
    color: "border-orange-500/30 bg-orange-500/5",
    titleColor: "text-orange-400",
    desc: "FTX went boom. SBF arrested. USDT briefly hit $0.97 as panic selling hit. Trust in the entire crypto industry shaken to its core.",
    bottom: "$0.97 (USDT)",
    drop: "-3%",
    cmd: "python evals/backtest.py --coin tether --start 2022-11-06 --end 2022-11-13",
  },
  {
    name: "March 2020 — COVID Black Thursday",
    date: "March 12, 2020",
    color: "border-purple-500/30 bg-purple-500/5",
    titleColor: "text-purple-400",
    desc: "Global markets crashed. ETH dropped 50% in hours. DAI spiked to $1.10+ due to liquidation cascade. MakerDAO had to emergency-add USDC as collateral.",
    bottom: "$1.10 (DAI)",
    drop: "+10% above peg",
    cmd: "python evals/backtest.py --coin usd-coin --start 2020-03-10 --end 2020-03-17",
  },
];

export default function WarRoomPage() {
  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-bold text-slate-200">War Room</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 uppercase tracking-wider font-semibold">
          Stress Testing
        </span>
      </div>

      <p className="text-sm text-slate-500 mb-8">
        Historical crisis replays. Would the anomaly detector have caught these events? Run the backtest scripts to find out.
      </p>

      <div className="space-y-4">
        {CRISES.map((crisis) => (
          <div key={crisis.name} className={`glass-card border ${crisis.color} overflow-hidden`}>
            <div className="p-6">
              <h3 className={`text-lg font-bold ${crisis.titleColor} mb-1`}>{crisis.name}</h3>
              <p className="text-xs text-slate-600 mb-3">{crisis.date}</p>
              <p className="text-sm text-slate-400 mb-4">{crisis.desc}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="stat-card !p-3">
                  <div className="text-xl font-bold text-white font-mono">{crisis.bottom}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Crisis Bottom</div>
                </div>
                <div className="stat-card !p-3">
                  <div className="text-xl font-bold text-red-400 font-mono">{crisis.drop}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Max Drop</div>
                </div>
              </div>

              <div className="bg-purple-950/30 rounded-lg p-3">
                <span className="text-[10px] text-slate-600 uppercase tracking-wider">Run Backtest</span>
                <code className="block mt-1 text-xs text-purple-300 font-mono">{crisis.cmd}</code>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
