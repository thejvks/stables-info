"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Peg Monitor", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
  { href: "/chains", label: "Chain X-Ray", icon: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" },
  { href: "/wiki", label: "Coin Wiki", icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" },
  { href: "/history", label: "Past Crises", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const THEMES = ["dark", "midnight", "emerald", "slate"] as const;
  const THEME_ICONS: Record<string, string> = {
    dark: "🌑", midnight: "🌊", emerald: "🌿", slate: "🪨",
  };
  const [theme, setTheme] = useState<string>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const [mobileOpen, setMobileOpen] = useState(false);

  const cycleTheme = () => {
    const idx = THEMES.indexOf(theme as any);
    const next = THEMES[(idx + 1) % THEMES.length];
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  // Close mobile menu on nav
  const handleNav = () => setMobileOpen(false);

  return (
    <>
    {/* Mobile top bar */}
    <div className="md:hidden fixed top-0 left-0 right-0 h-14 flex items-center px-4 z-50" style={{ background: "var(--bg-primary)", borderBottom: "1px solid var(--glass-border)" }}>
      <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg" style={{ color: "var(--text-primary)" }}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          {mobileOpen
            ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          }
        </svg>
      </button>
      <span className="font-black text-sm ml-2" style={{ color: "var(--text-primary)" }}>stables <span className="text-purple-500 text-xs">info</span></span>
      <div className="live-dot ml-2" />
      <button onClick={cycleTheme} className="theme-toggle ml-auto !w-8 !h-8 text-sm">
        {THEME_ICONS[theme] || "🎨"}
      </button>
    </div>

    {/* Backdrop */}
    {mobileOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileOpen(false)} />}

    {/* Sidebar */}
    <div className={`sidebar fixed left-0 top-0 h-screen w-[220px] flex flex-col py-6 px-4 z-50 transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
      {/* Logo + theme toggle */}
      <div className="mb-8 px-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black tracking-tight">
            <span style={{ color: "var(--text-primary)" }}>stables</span>
            <span className="text-purple-500 text-sm font-bold ml-1">info</span>
          </h1>
          <button onClick={cycleTheme} className="theme-toggle hidden md:flex" title={`Theme: ${theme} — click to change`}>
            {THEME_ICONS[theme] || "🎨"}
          </button>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="live-dot" />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>Live monitoring</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        <span className="text-[10px] uppercase tracking-widest px-2 mb-2" style={{ color: "var(--text-muted)" }}>
          Dashboard
        </span>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`sidebar-item ${pathname === item.href ? "active" : ""}`}
            onClick={handleNav}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            {item.label}
          </Link>
        ))}

        <span className="text-[10px] uppercase tracking-widest px-2 mt-6 mb-2" style={{ color: "var(--text-muted)" }}>
          Resources
        </span>
        <a href="https://github.com/thejvks/stables-info" target="_blank" rel="noopener noreferrer" className="sidebar-item">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
      </nav>

      {/* Footer */}
      <div className="px-2 pt-4 border-t" style={{ borderColor: "var(--glass-border)" }}>
        <p className="text-[10px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
          <span style={{ opacity: 0.6 }}>not financial advice</span>
        </p>
      </div>
    </div>
    </>
  );
}
