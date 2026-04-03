const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Coin {
  rank: number;
  symbol: string;
  name: string;
  price: number;
  deviation: number;
  supply: number;
  yieldBearing: boolean;
  logo: string;
  geckoId: string;
  geckoUrl: string;
  whitepaperUrl: string;
  chains: { chain: string; supply: number }[];
}

export interface CoinsResponse {
  coins: Coin[];
  totalSupply: number;
  totalCoins: number;
  totalChains: number;
  avgDeviation: number;
  maxDeviation: number;
  updatedAt: string;
}

export interface ChainData {
  name: string;
  supply: number;
  share: number;
  logo: string;
}

export interface ChainsResponse {
  chains: ChainData[];
  total: number;
}

export async function fetchCoins(): Promise<CoinsResponse> {
  const res = await fetch(`${API_BASE}/api/coins`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Failed to fetch coins");
  return res.json();
}

export async function fetchChains(): Promise<ChainsResponse> {
  const res = await fetch(`${API_BASE}/api/chains`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error("Failed to fetch chains");
  return res.json();
}

export function fmtSupply(val: number): string {
  if (val >= 1e12) return `$${(val / 1e12).toFixed(1)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`;
  return `$${val.toLocaleString()}`;
}

export function fmtVol(val: number): string {
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`;
  if (val >= 1e3) return `$${(val / 1e3).toFixed(0)}K`;
  if (val > 0) return `$${val.toFixed(0)}`;
  return "—";
}
