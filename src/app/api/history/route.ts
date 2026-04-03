import { NextResponse } from "next/server";

// Fetch supply changes from DeFiLlama
async function fetchSupplyChanges() {
  const res = await fetch("https://stablecoins.llama.fi/stablecoins?includePrices=true", {
    next: { revalidate: 600 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  const assets = data.peggedAssets || [];

  const changes: any[] = [];

  for (const asset of assets) {
    const supply = asset.circulating?.peggedUSD || 0;
    if (supply < 50_000_000) continue;

    const prevDay = asset.circulatingPrevDay?.peggedUSD || 0;
    const prevWeek = asset.circulatingPrevWeek?.peggedUSD || 0;
    const prevMonth = asset.circulatingPrevMonth?.peggedUSD || 0;

    const dayChange = prevDay > 0 ? supply - prevDay : 0;
    const weekChange = prevWeek > 0 ? supply - prevWeek : 0;
    const monthChange = prevMonth > 0 ? supply - prevMonth : 0;

    const dayPct = prevDay > 0 ? (dayChange / prevDay) * 100 : 0;
    const weekPct = prevWeek > 0 ? (weekChange / prevWeek) * 100 : 0;
    const monthPct = prevMonth > 0 ? (monthChange / prevMonth) * 100 : 0;

    changes.push({
      symbol: asset.symbol,
      name: asset.name || asset.symbol,
      geckoId: asset.gecko_id || "",
      supply,
      dayChange,
      dayPct: Math.round(dayPct * 100) / 100,
      weekChange,
      weekPct: Math.round(weekPct * 100) / 100,
      monthChange,
      monthPct: Math.round(monthPct * 100) / 100,
    });
  }

  return changes;
}

export async function GET() {
  try {
    const changes = await fetchSupplyChanges();

    // Sort by absolute day change to find biggest movers
    const bigMoves = [...changes]
      .sort((a, b) => Math.abs(b.dayChange) - Math.abs(a.dayChange))
      .slice(0, 20);

    // Recent mints (positive day change > $1M)
    const recentMints = changes
      .filter((c) => c.dayChange > 1_000_000)
      .sort((a, b) => b.dayChange - a.dayChange);

    // Recent burns (negative day change > $1M)
    const recentBurns = changes
      .filter((c) => c.dayChange < -1_000_000)
      .sort((a, b) => a.dayChange - b.dayChange);

    // Biggest monthly growers
    const monthlyGrowers = [...changes]
      .filter((c) => c.monthChange > 0 && c.supply > 100_000_000)
      .sort((a, b) => b.monthPct - a.monthPct)
      .slice(0, 10);

    // Biggest monthly shrinkers
    const monthlyShrinkers = [...changes]
      .filter((c) => c.monthChange < 0 && c.supply > 100_000_000)
      .sort((a, b) => a.monthPct - b.monthPct)
      .slice(0, 10);

    return NextResponse.json({
      bigMoves,
      recentMints,
      recentBurns,
      monthlyGrowers,
      monthlyShrinkers,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
