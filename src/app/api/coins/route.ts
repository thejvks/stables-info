import { NextResponse } from "next/server";
import { COIN_META, CHAIN_LOGOS, YIELD_BEARING_SYMBOLS } from "../../../lib/coins-data";

// Fetch stablecoin data from DeFiLlama (free, no API key)
async function fetchDefiLlama() {
  const res = await fetch("https://stablecoins.llama.fi/stablecoins?includePrices=true", {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("DeFiLlama API failed");
  const data = await res.json();
  return data.peggedAssets || [];
}

// Fetch chain breakdown from DeFiLlama
async function fetchChainData() {
  const res = await fetch("https://stablecoins.llama.fi/stablecoins?includePrices=true", {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.peggedAssets || [];
}

// Fetch 24h volume AND logos from CoinGecko (free tier)
async function fetchCoinGeckoData(geckoIds: string[]): Promise<{ volumes: Record<string, number>; logos: Record<string, string> }> {
  const volumes: Record<string, number> = {};
  const logos: Record<string, string> = {};
  try {
    for (let i = 0; i < geckoIds.length; i += 50) {
      const batch = geckoIds.slice(i, i + 50).join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${batch}`,
        { next: { revalidate: 600 } }
      );
      if (res.ok) {
        const coins = await res.json();
        for (const coin of coins) {
          volumes[coin.id] = coin.total_volume || 0;
          if (coin.image) logos[coin.id] = coin.image;
        }
      }
      // Rate limit
      if (i + 50 < geckoIds.length) await new Promise((r) => setTimeout(r, 1500));
    }
  } catch {
    // Volume is optional, don't fail the whole request
  }
  return { volumes, logos };
}

function fmtSupply(val: number): string {
  if (val >= 1e12) return `$${(val / 1e12).toFixed(1)}T`;
  if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
  if (val >= 1e6) return `$${(val / 1e6).toFixed(0)}M`;
  return `$${val.toLocaleString()}`;
}

export async function GET() {
  try {
    const assets = await fetchDefiLlama();

    // Filter to stablecoins with >$50M supply
    const filtered = assets.filter((a: any) => {
      const supply =
        a.circulating?.peggedUSD ||
        Object.values(a.chainCirculating || {}).reduce(
          (sum: number, ch: any) => sum + (ch?.current?.peggedUSD || 0),
          0
        );
      return supply > 50_000_000;
    });

    // Get all gecko IDs for volume fetch
    const geckoIds = filtered
      .map((a: any) => a.gecko_id || COIN_META[a.symbol]?.geckoId || "")
      .filter(Boolean);

    const { volumes, logos: geckoLogos } = await fetchCoinGeckoData(geckoIds);

    // Build coin list
    const coins = filtered.map((asset: any, idx: number) => {
      const sym = asset.symbol;
      const meta = COIN_META[sym];
      const geckoId = asset.gecko_id || meta?.geckoId || "";
      const price = asset.price || 1.0;
      const supply =
        asset.circulating?.peggedUSD ||
        Object.values(asset.chainCirculating || {}).reduce(
          (sum: number, ch: any) => sum + (ch?.current?.peggedUSD || 0),
          0
        );
      const isYield = YIELD_BEARING_SYMBOLS.has(sym);
      const deviation = isYield
        ? Math.abs(price - 1.0) * 100
        : Math.abs(price - 1.0) * 100;

      // Chain breakdown
      const chains: { chain: string; supply: number; logo: string }[] = [];
      if (asset.chainCirculating) {
        for (const [chainKey, chainData] of Object.entries(asset.chainCirculating)) {
          const chainSupply = (chainData as any)?.current?.peggedUSD || 0;
          if (chainSupply > 0) {
            const displayName = chainKey.charAt(0).toUpperCase() + chainKey.slice(1);
            chains.push({
              chain: displayName,
              supply: chainSupply,
              logo: CHAIN_LOGOS[displayName] || CHAIN_LOGOS[chainKey] || "",
            });
          }
        }
        chains.sort((a, b) => b.supply - a.supply);
      }

      return {
        rank: 0, // will set after sorting
        symbol: sym,
        name: meta?.name || asset.name || sym,
        price: Math.round(price * 10000) / 10000,
        deviation: Math.round(deviation * 1000) / 1000,
        supply,
        volume24h: volumes[geckoId] || 0,
        yieldBearing: isYield,
        type: meta?.type || "Unknown",
        issuer: meta?.issuer || "",
        launched: meta?.launched || "",
        tldr: meta?.tldr || "",
        backing: meta?.backing || "",
        risk: meta?.risk || "",
        logo: meta?.logo || geckoLogos[geckoId] || "",
        geckoId,
        geckoUrl: geckoId ? `https://www.coingecko.com/en/coins/${geckoId}` : "",
        whitepaperUrl: meta?.whitepaperUrl || "",
        chains,
        pegMechanism: asset.pegMechanism || "",
      };
    });

    // Sort by supply descending and assign ranks
    coins.sort((a: any, b: any) => b.supply - a.supply);
    coins.forEach((c: any, i: number) => (c.rank = i + 1));

    // Build chain totals
    const chainTotals: Record<string, number> = {};
    for (const coin of coins) {
      for (const ch of coin.chains) {
        chainTotals[ch.chain] = (chainTotals[ch.chain] || 0) + ch.supply;
      }
    }

    const totalSupply = coins.reduce((s: number, c: any) => s + c.supply, 0);
    const deviations = coins.filter((c: any) => !c.yieldBearing).map((c: any) => c.deviation);
    const avgDev = deviations.length > 0 ? deviations.reduce((s: number, d: number) => s + d, 0) / deviations.length : 0;
    const maxDev = deviations.length > 0 ? Math.max(...deviations) : 0;
    const uniqueChains = new Set<string>();
    coins.forEach((c: any) => c.chains.forEach((ch: any) => uniqueChains.add(ch.chain)));

    return NextResponse.json({
      coins,
      totalSupply,
      totalCoins: coins.length,
      totalChains: uniqueChains.size,
      avgDeviation: Math.round(avgDev * 1000) / 1000,
      maxDeviation: Math.round(maxDev * 1000) / 1000,
      chainTotals: Object.entries(chainTotals)
        .map(([name, supply]) => ({ name, supply, logo: CHAIN_LOGOS[name] || "" }))
        .sort((a, b) => b.supply - a.supply),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
