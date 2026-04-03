// All stablecoin metadata — ported from Python config.py
// This makes the Next.js app self-contained (no Python backend needed)

export interface CoinMeta {
  name: string;
  type: string;
  issuer: string;
  launched: string;
  tldr: string;
  backing: string;
  risk: string;
  geckoId: string;
  logo: string;
  whitepaperUrl: string;
  yieldBearing: boolean;
  defillamaId: string;
}

export const COIN_META: Record<string, CoinMeta> = {
  USDT: { name: "Tether", type: "Centralized / Fiat-backed", issuer: "Tether Holdings", launched: "2014", tldr: "The original stablecoin. Largest by market cap. Backed by cash, T-bills, and commercial paper.", backing: "US Treasury bills, cash, cash equivalents, commercial paper", risk: "Transparency concerns. Concentrated issuer risk. Regulatory scrutiny.", geckoId: "tether", logo: "https://coin-images.coingecko.com/coins/images/325/small/Tether.png", whitepaperUrl: "https://tether.to/en/whitepaper/", yieldBearing: false, defillamaId: "1" },
  USDC: { name: "USD Coin", type: "Centralized / Fiat-backed", issuer: "Circle", launched: "2018", tldr: "Regulated US dollar stablecoin by Circle. Full reserves in cash and short-term T-bills.", backing: "Cash and US Treasury bills held at regulated financial institutions", risk: "Centralized issuer. March 2023 SVB depeg event ($0.87). Single-entity redemption.", geckoId: "usd-coin", logo: "https://coin-images.coingecko.com/coins/images/6319/small/usdc.png", whitepaperUrl: "https://www.circle.com/usdc", yieldBearing: false, defillamaId: "2" },
  USDS: { name: "Sky Dollar (formerly DAI/USDS)", type: "Decentralized / Crypto-backed", issuer: "Sky (formerly MakerDAO)", launched: "2024", tldr: "Rebranded from DAI's successor. Backed by crypto collateral and RWA.", backing: "Crypto collateral (ETH, stETH) + Real World Assets", risk: "Smart contract risk. Governance risk. Collateral volatility.", geckoId: "usds", logo: "https://coin-images.coingecko.com/coins/images/39926/small/usds.png", whitepaperUrl: "https://sky.money/", yieldBearing: false, defillamaId: "118" },
  USDe: { name: "Ethena USDe", type: "Synthetic / Delta-neutral", issuer: "Ethena Labs", launched: "2024", tldr: "Synthetic dollar backed by delta-neutral hedging. Long stETH + short ETH perps.", backing: "Delta-neutral position: staked ETH + short perpetual futures", risk: "Funding rate risk. Custodian/exchange risk. Novel mechanism, untested in major crashes.", geckoId: "ethena-usde", logo: "https://coin-images.coingecko.com/coins/images/33613/small/usde.png", whitepaperUrl: "https://docs.ethena.fi/solution-overview/usde-overview", yieldBearing: false, defillamaId: "130" },
  DAI: { name: "Dai", type: "Decentralized / Crypto-backed", issuer: "MakerDAO", launched: "2019", tldr: "The OG decentralized stablecoin. Over-collateralized by crypto + RWA.", backing: "ETH, stETH, USDC, Real World Assets via MakerDAO vaults", risk: "Smart contract risk. RWA concentration. Governance attacks.", geckoId: "dai", logo: "https://coin-images.coingecko.com/coins/images/9956/small/Badge_Dai.png", whitepaperUrl: "https://makerdao.com/en/whitepaper/", yieldBearing: false, defillamaId: "3" },
  USD1: { name: "World Liberty Financial USD", type: "Centralized / Fiat-backed", issuer: "World Liberty Financial (Trump-affiliated)", launched: "2025", tldr: "Stablecoin by World Liberty Financial. Backed by T-bills and cash.", backing: "US Treasury bills and cash equivalents", risk: "Political risk. New issuer. Regulatory uncertainty.", geckoId: "usd1-wlfi", logo: "https://coin-images.coingecko.com/coins/images/55081/small/USD1_200x200.png", whitepaperUrl: "https://docs.worldlibertyfinancial.com/resources/gold-paper", yieldBearing: false, defillamaId: "146" },
  PYUSD: { name: "PayPal USD", type: "Centralized / Fiat-backed", issuer: "PayPal / Paxos", launched: "2023", tldr: "PayPal's stablecoin. Issued by Paxos. Regulated, backed by cash and T-bills.", backing: "US dollar deposits, US Treasury bills, reverse repo agreements", risk: "Centralized issuer. PayPal platform dependency. Freeze capability.", geckoId: "paypal-usd", logo: "https://coin-images.coingecko.com/coins/images/31212/small/PYUSD_Token_Logo_2x.png", whitepaperUrl: "https://www.paypalobjects.com/devdoc/community/PYUSD-Solana-White-Paper.pdf", yieldBearing: false, defillamaId: "115" },
  BUIDL: { name: "BlackRock USD Institutional Digital Liquidity Fund", type: "Tokenized Money Market Fund", issuer: "BlackRock (tokenized by Securitize)", launched: "2024", tldr: "BlackRock's tokenized money market fund. $1 per share. Institutional only.", backing: "US Treasury bills, cash, repo agreements — managed by BlackRock", risk: "Institutional access only. Centralized. Regulatory framework evolving.", geckoId: "build-on-bitcoin", logo: "https://coin-images.coingecko.com/coins/images/36831/small/buidl.jpg", whitepaperUrl: "https://securitize.io/blackrock/buidl", yieldBearing: false, defillamaId: "131" },
  USYC: { name: "Hashnote USYC", type: "Yield-bearing / Tokenized T-Bills", issuer: "Hashnote", launched: "2023", tldr: "Yield-bearing token backed by US Treasury bills. Price rises over time as yield accrues.", backing: "Short-term US Treasury bills", risk: "Centralized issuer. Regulatory risk. Interest rate sensitivity.", geckoId: "hashnote-usyc", logo: "https://coin-images.coingecko.com/coins/images/34123/small/USYC.png", whitepaperUrl: "https://usyc.docs.hashnote.com/", yieldBearing: true, defillamaId: "133" },
  USDY: { name: "Ondo US Dollar Yield", type: "Yield-bearing / Tokenized T-Bills", issuer: "Ondo Finance", launched: "2023", tldr: "Yield-bearing token backed by Treasuries. Value accrues above $1.", backing: "Short-term US Treasuries and bank demand deposits", risk: "Centralized issuer. Regulatory risk. Redemption delays possible.", geckoId: "ondo-us-dollar-yield", logo: "https://coin-images.coingecko.com/coins/images/31617/small/usdy.png", whitepaperUrl: "https://docs.ondo.finance/general-access-products/usdy", yieldBearing: true, defillamaId: "120" },
  USDG: { name: "Global Dollar", type: "Centralized / Fiat-backed", issuer: "Paxos", launched: "2024", tldr: "Paxos-issued stablecoin designed for global payments.", backing: "US dollar reserves, Treasury bills", risk: "New entrant. Adoption risk. Centralized.", geckoId: "global-dollar", logo: "https://coin-images.coingecko.com/coins/images/51281/small/GDN_USDG_Token_200x200.png", whitepaperUrl: "https://424565.fs1.hubspotusercontent-na1.net/hubfs/424565/USDGWhitePaper.pdf", yieldBearing: false, defillamaId: "145" },
  USDf: { name: "Falcon USD", type: "Centralized / Fiat-backed", issuer: "Falcon Finance", launched: "2025", tldr: "Stablecoin by Falcon Finance.", backing: "Fiat reserves", risk: "New protocol. Limited track record.", geckoId: "falcon-usd", logo: "https://coin-images.coingecko.com/coins/images/54098/small/USDf_200x200.png", whitepaperUrl: "https://falcon.finance/whitepaper-en.pdf", yieldBearing: false, defillamaId: "147" },
  RLUSD: { name: "Ripple USD", type: "Centralized / Fiat-backed", issuer: "Ripple", launched: "2024", tldr: "Ripple's stablecoin. Issued on Ethereum and XRP Ledger.", backing: "US dollar deposits, US Treasury bills", risk: "Regulatory risk (Ripple's SEC history). Centralized.", geckoId: "ripple-usd", logo: "https://coin-images.coingecko.com/coins/images/52332/small/rlusd.png", whitepaperUrl: "https://ripple.com/solutions/stablecoin/", yieldBearing: false, defillamaId: "142" },
  USDD: { name: "USDD", type: "Algorithmic / Crypto-backed", issuer: "TRON DAO Reserve", launched: "2022", tldr: "TRON's algorithmic stablecoin. Over-collateralized after UST collapse.", backing: "TRX, BTC, USDC in TRON DAO Reserve", risk: "Algorithmic history. Justin Sun centralization. TRX collateral volatility.", geckoId: "usdd", logo: "https://coin-images.coingecko.com/coins/images/25380/small/usdd.png", whitepaperUrl: "https://docs.usdd.io/", yieldBearing: false, defillamaId: "65" },
  GHO: { name: "GHO", type: "Decentralized / Crypto-backed", issuer: "Aave DAO", launched: "2023", tldr: "Aave's native stablecoin. Minted by Aave borrowers against their collateral.", backing: "Aave protocol collateral (ETH, wstETH, WBTC, etc.)", risk: "Smart contract risk. Aave protocol dependency. Governance risk.", geckoId: "gho", logo: "https://coin-images.coingecko.com/coins/images/30663/small/gho-token-logo.png", whitepaperUrl: "https://docs.gho.xyz/", yieldBearing: false, defillamaId: "113" },
  USD0: { name: "Usual USD0", type: "Decentralized / RWA-backed", issuer: "Usual Protocol", launched: "2024", tldr: "RWA-backed stablecoin with yield redistribution via USUAL token.", backing: "Real World Assets (US Treasury bills)", risk: "Smart contract risk. Governance token dependency. New protocol.", geckoId: "usual-usd", logo: "https://coin-images.coingecko.com/coins/images/38272/small/USD0_logo.png", whitepaperUrl: "https://docs.usual.money/usual-products/usd0-stablecoin", yieldBearing: false, defillamaId: "135" },
  TUSD: { name: "TrueUSD", type: "Centralized / Fiat-backed", issuer: "Techteryx / Archblock", launched: "2018", tldr: "One of the early regulated stablecoins. Has faced reserve transparency issues.", backing: "US dollars held in escrow accounts", risk: "Ownership changes. Reserve attestation gaps. Declining market share.", geckoId: "true-usd", logo: "https://coin-images.coingecko.com/coins/images/3449/small/tusd.png", whitepaperUrl: "https://tusd.io/docs/trueusd-white-paper-202602.pdf", yieldBearing: false, defillamaId: "4" },
  FDUSD: { name: "First Digital USD", type: "Centralized / Fiat-backed", issuer: "First Digital Labs", launched: "2023", tldr: "Hong Kong-based fiat-backed stablecoin. Popular on Binance.", backing: "Cash and cash equivalents in regulated custodians", risk: "Single exchange dependency (Binance). Hong Kong regulatory framework.", geckoId: "first-digital-usd", logo: "https://coin-images.coingecko.com/coins/images/31079/small/firstdigitalusd.jpg", whitepaperUrl: "https://firstdigitallabs.com/workspace/uploads/FDUSD-Whitepaper-25216064ca0cc8.pdf", yieldBearing: false, defillamaId: "116" },
  crvUSD: { name: "Curve USD", type: "Decentralized / Crypto-backed", issuer: "Curve Finance", launched: "2023", tldr: "Curve's native stablecoin using LLAMMA soft-liquidation mechanism.", backing: "Crypto collateral with continuous liquidation (LLAMMA)", risk: "Novel liquidation mechanism. Smart contract risk. Curve dependency.", geckoId: "crvusd", logo: "https://coin-images.coingecko.com/coins/images/30118/small/crvusd.png", whitepaperUrl: "https://docs.curve.fi/references/whitepapers/curve-stablecoin/", yieldBearing: false, defillamaId: "108" },
  FRAX: { name: "Frax", type: "Hybrid / Algorithmic + Collateral", issuer: "Frax Finance", launched: "2020", tldr: "Originally fractional-algorithmic. Now fully collateralized. Pioneer of hybrid stablecoins.", backing: "USDC, crypto collateral, Frax-owned liquidity", risk: "Complex protocol. Governance risk. Collateral strategy changes.", geckoId: "frax", logo: "https://coin-images.coingecko.com/coins/images/13422/small/FRAX_icon.png", whitepaperUrl: "https://docs.frax.finance/", yieldBearing: false, defillamaId: "6" },
  DOLA: { name: "DOLA", type: "Decentralized / Crypto-backed", issuer: "Inverse Finance", launched: "2021", tldr: "Inverse Finance's stablecoin. Minted via FiRM fixed-rate lending.", backing: "Crypto collateral via FiRM protocol", risk: "Past exploit history. Small protocol. Smart contract risk.", geckoId: "dola-usd", logo: "https://coin-images.coingecko.com/coins/images/14287/small/dola.png", whitepaperUrl: "https://docs.inverse.finance/", yieldBearing: false, defillamaId: "48" },
  GUSD: { name: "Gemini Dollar", type: "Centralized / Fiat-backed", issuer: "Gemini Trust Company", launched: "2018", tldr: "Regulated US stablecoin by Gemini exchange. NY trust company.", backing: "US dollars in FDIC-insured banks and money market funds", risk: "Exchange dependency. Small market share. Centralized.", geckoId: "gemini-dollar", logo: "https://coin-images.coingecko.com/coins/images/5992/small/gemini-dollar-gusd.png", whitepaperUrl: "https://www.gemini.com/static/dollar/gemini-dollar-whitepaper.pdf", yieldBearing: false, defillamaId: "24" },
  JUPUSD: { name: "JupUSD", type: "Decentralized", issuer: "Jupiter", launched: "2025", tldr: "Jupiter DEX's stablecoin on Solana.", backing: "Protocol reserves", risk: "New. Solana ecosystem dependency.", geckoId: "jupusd", logo: "https://coin-images.coingecko.com/coins/images/55368/small/jupusd-icon.png", whitepaperUrl: "https://jupusd.jup.ag/", yieldBearing: false, defillamaId: "150" },
  TBILL: { name: "OpenEden TBILL", type: "Yield-bearing / Tokenized T-Bills", issuer: "OpenEden", launched: "2023", tldr: "Tokenized US Treasury bill vault. Yield-bearing, price accrues above $1.", backing: "US Treasury bills", risk: "Centralized issuer. Regulatory risk. Interest rate sensitivity.", geckoId: "openeden-tbill", logo: "", whitepaperUrl: "https://docs.openeden.com/tbill/introduction", yieldBearing: true, defillamaId: "119" },
};

export const CHAIN_LOGOS: Record<string, string> = {
  Ethereum: "https://coin-images.coingecko.com/asset_platforms/images/279/small/ethereum.png",
  Tron: "https://coin-images.coingecko.com/coins/images/1094/small/tron-logo.png",
  Solana: "https://coin-images.coingecko.com/coins/images/4128/small/solana.png",
  BSC: "https://coin-images.coingecko.com/coins/images/825/small/bnb-icon2_2x.png",
  Hyperliquid: "https://coin-images.coingecko.com/coins/images/37967/small/hyperliquid_logo.png",
  Base: "https://coin-images.coingecko.com/asset_platforms/images/131/small/base-network.png",
  Arbitrum: "https://coin-images.coingecko.com/coins/images/16547/small/arb.jpg",
  Polygon: "https://coin-images.coingecko.com/coins/images/4713/small/polygon.png",
  Avalanche: "https://coin-images.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  "OP Mainnet": "https://coin-images.coingecko.com/coins/images/25244/small/Optimism.png",
  Aptos: "https://coin-images.coingecko.com/coins/images/26455/small/aptos_round.png",
  TON: "https://coin-images.coingecko.com/coins/images/17980/small/ton_symbol.png",
  Sui: "https://coin-images.coingecko.com/coins/images/26375/small/sui-ocean-square.png",
  Mantle: "https://coin-images.coingecko.com/coins/images/30980/small/token-logo.png",
  Sonic: "https://coin-images.coingecko.com/asset_platforms/images/22192/small/128xS_token_Black-BG_2x.png",
};

export const YIELD_BEARING_SYMBOLS = new Set([
  "USYC", "USDY", "TBILL", "reUSD", "YLDS",
]);

// Hardcoded logos from CoinGecko — keyed by gecko_id
// This avoids runtime CoinGecko API calls that get rate-limited on Vercel
export const GECKO_LOGOS: Record<string, string> = {
  "tether": "https://coin-images.coingecko.com/coins/images/325/large/Tether.png",
  "usd-coin": "https://coin-images.coingecko.com/coins/images/6319/large/USDC.png",
  "usds": "https://coin-images.coingecko.com/coins/images/39926/large/usds.webp",
  "ethena-usde": "https://coin-images.coingecko.com/coins/images/33613/large/usde.png",
  "dai": "https://coin-images.coingecko.com/coins/images/9956/large/Badge_Dai.png",
  "usd1-wlfi": "https://coin-images.coingecko.com/coins/images/54977/large/USD1_1000x1000_transparent.png",
  "paypal-usd": "https://coin-images.coingecko.com/coins/images/31212/large/PYUSD_Token_Logo_2x.png",
  "hashnote-usyc": "https://coin-images.coingecko.com/coins/images/51054/large/Hashnote_SDYC_200x200.png",
  "blackrock-usd-institutional-digital-liquidity-fund": "https://coin-images.coingecko.com/coins/images/36291/large/blackrock.png",
  "global-dollar": "https://coin-images.coingecko.com/coins/images/51281/large/GDN_USDG_Token_200x200.png",
  "falcon-finance": "https://coin-images.coingecko.com/coins/images/54558/large/ff_200_X_200.png",
  "ripple-usd": "https://coin-images.coingecko.com/coins/images/39651/large/RLUSD_200x200_%281%29.png",
  "ondo-us-dollar-yield": "https://coin-images.coingecko.com/coins/images/31700/large/usdy_%281%29.png",
  "usdd": "https://coin-images.coingecko.com/coins/images/25380/large/UUSD.jpg",
  "united-stables": "https://coin-images.coingecko.com/coins/images/71157/large/united-stables-logo.jpg",
  "usdtb": "https://coin-images.coingecko.com/coins/images/52804/large/76357aa8-4ef7-446c-bad3-a3f944eeec7a.jpeg",
  "ylds": "https://coin-images.coingecko.com/coins/images/66486/large/YLDS.png",
  "gho": "https://coin-images.coingecko.com/coins/images/30663/large/gho-token-logo.png",
  "usual-usd": "https://coin-images.coingecko.com/coins/images/38272/large/USD0LOGO.png",
  "true-usd": "https://coin-images.coingecko.com/coins/images/3449/large/tusd.png",
  "first-digital-usd": "https://coin-images.coingecko.com/coins/images/31079/large/FDUSD_icon_black.png",
  "usx": "https://coin-images.coingecko.com/coins/images/68429/large/Solstice_Icons_for_DEX_512x512_USX.png",
  "usdai": "https://coin-images.coingecko.com/coins/images/55857/large/USDai_Token_Full_Glyph.png",
  "binance-peg-busd": "https://coin-images.coingecko.com/coins/images/31273/large/new_binance-peg-busd.png",
  "frax": "https://coin-images.coingecko.com/coins/images/13422/large/LFRAX.png",
  "crvusd": "https://coin-images.coingecko.com/coins/images/30118/large/crvusd.jpg",
  "usda-2": "https://coin-images.coingecko.com/coins/images/51599/large/SUSDA.png",
  "agora-dollar": "https://coin-images.coingecko.com/coins/images/39284/large/AUSD_1024px.png",
  "re-protocol-reusd": "https://coin-images.coingecko.com/coins/images/66291/large/Points_Program_Group_91.png",
  "nusd-2": "https://coin-images.coingecko.com/coins/images/70027/large/NUSD-200x200.png",
  "satoshi-stablecoin": "https://coin-images.coingecko.com/coins/images/37760/large/Instagram_post_-_25.png",
  "gusd": "https://coin-images.coingecko.com/coins/images/68725/large/gusd-logo.jpeg",
  "avant-usd": "https://coin-images.coingecko.com/coins/images/53527/large/token-avusd.png",
  "astherus-usdf": "https://coin-images.coingecko.com/coins/images/54133/large/USDF_LOGO.png",
  "frax-usd": "https://coin-images.coingecko.com/coins/images/53963/large/frxUSD.png",
  "cash-4": "https://coin-images.coingecko.com/coins/images/69679/large/cash.jpg",
  "pleasing-usd": "https://coin-images.coingecko.com/coins/images/70448/large/%E7%BE%8E%E5%85%83_%281%29.png",
  "infinifi-usd": "https://coin-images.coingecko.com/coins/images/67385/large/iusd.jpg",
  "cap-usd": "https://coin-images.coingecko.com/coins/images/68272/large/cUSD_ab_500%C3%97500.png",
  "mnee-usd-stablecoin": "https://coin-images.coingecko.com/coins/images/39459/large/MNEE_logo_no_BG.png",
  "standx-dusd": "https://coin-images.coingecko.com/coins/images/55984/large/output-onlinepngtools.png",
  "precious-metals-usd": "https://coin-images.coingecko.com/coins/images/71149/large/pmUSD.png",
  "usdu": "https://coin-images.coingecko.com/coins/images/67726/large/USDu_Icon_512x512.png",
  "jupusd": "https://coin-images.coingecko.com/coins/images/70636/large/icon.png",
  "helio-protocol-hay": "https://coin-images.coingecko.com/coins/images/26947/large/Coingecko_profile_lisUSD_200x200_%281%29.png",
  "dola-usd": "https://coin-images.coingecko.com/coins/images/14287/large/dola.png",
  "usdh-2": "https://coin-images.coingecko.com/coins/images/69484/large/usdh.png",
  "openeden-tbill": "https://coin-images.coingecko.com/coins/images/30576/large/OE_Logo_200x200_Transparent.png",
  "us-permissionless-dollar": "https://coin-images.coingecko.com/coins/images/69917/large/logo_uspd_200_200.png",
  "cygnus-finance-global-usd": "https://coin-images.coingecko.com/coins/images/35628/large/cgUSD.png",
  "yuzu-usd": "https://coin-images.coingecko.com/coins/images/70558/large/yzusd.png",
  "megausd": "https://coin-images.coingecko.com/coins/images/69955/large/USDm.png",
  "quantoz-usdq": "https://coin-images.coingecko.com/coins/images/51852/large/exchange-logo_USDQ.png",
  "elixir-deusd": "https://coin-images.coingecko.com/coins/images/39849/large/deUSD200x200.png",
};
