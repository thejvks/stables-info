"use client";

export default function AlertsPage() {
  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-bold text-slate-200">Alert Feed</h2>
        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">0 alerts</span>
      </div>

      <div className="flex flex-col items-center justify-center py-20 glass-card">
        <div className="text-5xl mb-4">🔔</div>
        <h3 className="text-lg font-bold text-slate-200 mb-2">No alerts yet</h3>
        <p className="text-sm text-slate-500 text-center max-w-md">
          When something looks sus — a peg deviation spike, supply anomaly, or liquidity drain —
          it&apos;ll show up here. The system scans every 15 minutes.
        </p>
        <p className="text-xs text-slate-700 mt-4">Patience, anon.</p>
      </div>

      {/* How alerts work */}
      <div className="glass-card p-6 mt-6">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">How Alerts Work</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { level: "LOW", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", desc: "Minor deviation detected. Probably noise." },
            { level: "MEDIUM", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", desc: "Notable anomaly. Worth monitoring." },
            { level: "HIGH", color: "text-red-400 bg-red-500/10 border-red-500/20", desc: "Significant deviation. Pay attention." },
            { level: "CRITICAL", color: "text-red-500 bg-red-600/10 border-red-600/20", desc: "Major event. Potential depeg or crisis." },
          ].map((a) => (
            <div key={a.level} className={`rounded-xl border p-4 ${a.color}`}>
              <div className="font-bold text-sm mb-1">{a.level}</div>
              <p className="text-[11px] opacity-70">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
