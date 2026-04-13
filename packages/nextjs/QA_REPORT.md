# Stage 7 QA Audit Report -- CLAWD Token Dashboard (Job #51)

Audited: 2026-04-13
Auditor: clawdbotatg (Stage 7 -- read-only)

---

## SHIP-BLOCKERS

| # | Item | Verdict | Notes |
|---|------|---------|-------|
| 1 | Wallet connect shows a button, not text | **N/A** | Read-only dashboard -- no wallet connection needed per spec ("Single page component, no wallet connection needed") |
| 2 | Wrong network shows a Switch button | **N/A** | No wallet connection, no network switching needed |
| 3 | Approve button stays disabled through block confirmation + cooldown | **N/A** | No contract writes, no approvals |
| 4 | Contracts verified on Basescan/block explorer | **N/A** | Dashboard reads from DexScreener API, not from contracts directly. The CLAWD token contract at `0x9f86dB9fc6f7c9408e8Fda3Ff8ce4e78ac7a6b07` is an external token, not deployed by this project. |
| 5 | SE2 footer branding removed (Fork me, BuidlGuidl, Support links) | **PASS** | `Footer.tsx` is fully custom -- shows "CLAWD Token Dashboard" and DexScreener attribution only. No BuidlGuidl, Fork me, or Support links. |
| 6 | SE2 footer `nativeCurrencyPrice` badge removed | **PASS** | Not present in `Footer.tsx`. |
| 7 | SE2 tab title removed (`"%s | Scaffold-ETH 2"` -> `"%s"`) | **PASS** | `getMetadata.ts:8` sets `titleTemplate = "%s"`. HTML output confirms `<title>CLAWD Token Dashboard</title>`. |
| 8 | SE2 README replaced with project content | **PASS** | Root `README.md` describes CLAWD Token Dashboard with features, run instructions, and IPFS build steps. No SE2 template content. |
| 9 | Favicon replaced (not SE2 default scaffold logo) | **FAIL** | `favicon.svg` is a custom lobster SVG (PASS). However, `favicon.png` is still the SE2 default scaffold crane+diamond icon. The `.png` may be served as fallback by some browsers. Replace `favicon.png` with a rasterized version of the lobster. **File:** `packages/nextjs/public/favicon.png` |

---

## SHOULD-FIX

| # | Item | Verdict | Notes |
|---|------|---------|-------|
| 1 | Contract address displayed with `<Address/>` component | **N/A** | The spec requires the token address shown with copy-to-clipboard + BaseScan link. The custom implementation provides both (clickable address linking to BaseScan, Copy button with feedback). Using SE2's `<Address/>` component is not required here since this is an external token address display, not a deployed contract interaction. The current implementation is functionally equivalent. |
| 2 | OG image uses absolute URL (`NEXT_PUBLIC_PRODUCTION_URL` checked first) | **FAIL** | The OG image URL in the build is `https://clawd-dashboard.example//thumbnail.jpg` -- note the double slash and the placeholder domain `clawd-dashboard.example`. Two problems: (a) `NEXT_PUBLIC_PRODUCTION_URL` was set to a fake domain, not the real IPFS URL, and (b) trailing slash on the base URL causes a double-slash before `thumbnail.jpg`. Also, `thumbnail.jpg` is still the default SE2 "Built with Scaffold-ETH 2" image. **Files:** `packages/nextjs/utils/scaffold-eth/getMetadata.ts`, `packages/nextjs/public/thumbnail.jpg` |
| 3 | `--radius-field` changed from `9999rem` to `0.5rem` in both theme blocks | **PASS** | Both light (line 38) and dark (line 63) theme blocks set `--radius-field: 0.5rem`. |
| 4 | All token amounts have USD context | **N/A** | The dashboard shows a single price in USD. No raw token amounts displayed without USD context. |
| 5 | Errors mapped to human-readable messages | **PASS** | Error state shows "Price unavailable" -- clear and user-friendly. |
| 6 | Phantom wallet in RainbowKit wallet list | **PASS** | `wagmiConnectors.tsx:27` includes `phantomWallet`. |
| 7 | Mobile deep linking: `writeAndOpen` pattern | **N/A** | No contract writes -- read-only dashboard. |
| 8 | `appName` in `wagmiConnectors.tsx` changed from `"scaffold-eth-2"` | **PASS** | `wagmiConnectors.tsx:51` sets `appName: "CLAWD Token Dashboard"`. |

---

## JOB-SPEC ITEMS

| # | Item | Verdict | Notes |
|---|------|---------|-------|
| 1 | CLAWD branding header with animated lobster/claw element | **PASS** | `Header.tsx` shows a custom SVG lobster with `animate-lobster-glow` CSS animation (pulsing glow on 3s cycle). Title reads "CLAWD" with "Token Dashboard" subtitle. |
| 2 | Token address shown with copy-to-clipboard + BaseScan link | **PASS** | Full address `0x9f86dB9fc6f7c9408e8Fda3Ff8ce4e78ac7a6b07` displayed in monospace, clickable to `basescan.org/token/...`, with Copy button that shows "Copied" feedback for 2s. Clipboard fallback via textarea for non-HTTPS contexts. |
| 3 | BaseScan link points to correct URL | **PASS** | Points to `https://basescan.org/token/0x9f86dB9fc6f7c9408e8Fda3Ff8ce4e78ac7a6b07`. |
| 4 | Live USD price from DexScreener API | **PASS** | Fetches from `https://api.dexscreener.com/latest/dex/tokens/0x9f86...`. |
| 5 | DexScreener: highest-liquidity Base pair selected | **PASS** | `page.tsx:52-60` filters to `chainId === "base"` only, then reduces by `liquidity.usd` to pick the highest. Not a first-pair fallback. |
| 6 | "Price unavailable" shown on error | **PASS** | `page.tsx:226-230` shows "Price unavailable" when `error || !priceData`. On fetch failure, `setError(true)` and `setPriceData(null)` are called. |
| 7 | Stale price never shown after failed refresh | **PASS** | On error, `setPriceData(null)` clears old data (line 69). The UI only renders price when `priceData` is truthy (line 232). |
| 8 | Auto-refresh every 30s | **PASS** | `setInterval(fetchPrice, 30000)` on line 77. |
| 9 | Cleanup on unmount (no leaked intervals) | **PASS** | `useEffect` returns cleanup: `if (intervalRef.current) clearInterval(intervalRef.current)` (lines 78-79). |
| 10 | 24h color: green for positive | **PASS** | `isPositive` check on line 101; positive gets `color: "#4ade80"` (green) with green-tinted background. |
| 11 | 24h color: deep-red for negative | **FAIL** | Negative change gets `color: "#F5E6E0"` (the light cream text color), NOT deep red. Spec says "deep-red negative." The background is `rgba(127, 29, 29, 0.3)` which is a subtle dark red, but the text itself is cream/white -- it does not read as "red" at a glance. The negative text color should be an explicit red like `#C41E3A` or `#DC2626` to match the spec's "deep-red negative" requirement. **File:** `packages/nextjs/app/page.tsx:248` |
| 12 | +/- sign present on 24h change | **PASS** | Line 253: `{isPositive ? "+" : ""}` prepends `+` for positive. Negative numbers naturally include `-` from `toFixed()`. |
| 13 | Dark red lobster theme: bg `#0a0a0f`, accents `#8B1A1A`/`#C41E3A`, text `#F5E6E0` | **PASS** | Background is `#0a0a0f`, card uses `rgba(20, 8, 10, 0.6)` overlay, accents match the spec colors, text is `#F5E6E0`. Panel has glow effects (`box-shadow` with `rgba(196, 30, 58, ...)`). |
| 14 | Monospace for address + price, sans-serif for labels | **PASS** | Address uses `var(--font-mono), monospace`. Price uses same. Labels use default (Inter sans-serif). |
| 15 | Theme feels like "deep sea darkness with bioluminescent red accents" | **PASS** | Dark `#0a0a0f` background, subtle radial gradient glow, card has frosted glass with red-tinted border and glow shadows, animated lobster and price glow effects. Not generic dark mode -- has intentional underwater/bioluminescent feel. |
| 16 | Fonts imported via `next/font/google` (no `<link>` tags) | **PASS** | `layout.tsx` uses `Inter` and `JetBrains_Mono` from `next/font/google`. No `<link>` tags for fonts in any source file. |
| 17 | Single page only | **PASS** | Only `app/page.tsx` exists as a route. `blockexplorer` and `debug` are disabled (`_blockexplorer-disabled`, `_debug-disabled`). |
| 18 | No `localhost` references in metadata / OG image / canonical URL | **FAIL** | `getMetadata.ts:7` falls back to `http://localhost:${process.env.PORT || 3000}` when neither `NEXT_PUBLIC_PRODUCTION_URL` nor `VERCEL_PROJECT_PRODUCTION_URL` is set. During the IPFS build, the OG URL resolved to `https://clawd-dashboard.example/` (a placeholder). After IPFS deploy, `NEXT_PUBLIC_PRODUCTION_URL` must be set to the actual IPFS URL and the build re-run. The current build baked in a fake domain. **File:** `packages/nextjs/utils/scaffold-eth/getMetadata.ts:3-7` |
| 19 | No public RPC anywhere in frontend | **PASS** | No `mainnet.base.org` or other public RPCs in the `packages/nextjs/` source. Note: `packages/foundry/foundry.toml:23` has `base = "https://mainnet.base.org"` but that's the deploy tooling, not the frontend. Foundry should use Alchemy but that's outside frontend QA scope. |
| 20 | No private keys / API keys committed | **PASS** | No Alchemy API keys or private keys found in `packages/nextjs/`. The 64-char hex matches in `packages/foundry/` are all in vendored libraries (forge-std, openzeppelin) -- standard constants, not real secrets. |
| 21 | `blockexplorer` route disabled | **PASS** | Renamed to `app/_blockexplorer-disabled`. Not present in `out/` build. |
| 22 | `out/` build is fresh (source not newer than `out/`) | **FAIL** | `page.tsx` and `layout.tsx` were modified at 17:21:25 but `out/index.html` was generated at 17:20:04. Source is ~80 seconds newer than the build. The build must be re-run after Stage 8 fixes anyway, but flagging this: do NOT upload the current `out/` -- it does not reflect the latest source. |

---

## OTHER NOTES

| # | Item | Severity | Notes |
|---|------|----------|-------|
| 1 | `manifest.json` still says "Scaffold-ETH 2 DApp" | **Medium** | `packages/nextjs/public/manifest.json` has `"name": "Scaffold-ETH 2 DApp"`. Should be "CLAWD Token Dashboard". |
| 2 | `logo.svg` is still the SE2 scaffold logo | **Low** | `packages/nextjs/public/logo.svg` is the scaffold crane+diamond icon, referenced by `manifest.json`. Should be replaced with CLAWD branding or removed. |
| 3 | `thumbnail.jpg` is default SE2 OG image | **Medium** | Shows "Built with Scaffold-ETH 2" text. Must be replaced with a CLAWD-branded image before IPFS deploy. |
| 4 | `favicon.png` is SE2 default | **Medium** | As noted in ship-blockers. The `.svg` is correct but `.png` is stale. |
| 5 | Bare `http()` fallback in wagmiConfig.tsx | **Low** | Line 30: `rpcFallbacks = [http()]` -- this is the last-resort fallback when no Alchemy URL is available. For a read-only dashboard that doesn't make RPC calls from the frontend (price comes from DexScreener API), this is low risk. But it technically allows a public RPC fallback. |
| 6 | `foundry.toml` uses `mainnet.base.org` | **Low** | Line 23: `base = "https://mainnet.base.org"`. Deploy stage is past, so no immediate impact. Should be fixed for hygiene. |
| 7 | `_blockexplorer-disabled` and `_debug-disabled` still have SE2 descriptions | **Info** | These routes are disabled (prefixed with `_`) so they don't appear in builds. No action needed. |
| 8 | OG image URL has double slash | **Medium** | `https://clawd-dashboard.example//thumbnail.jpg` -- if `NEXT_PUBLIC_PRODUCTION_URL` is set with a trailing slash, the constructed URL gets `//`. Either strip trailing slash from the env var or add logic in `getMetadata.ts`. |
| 9 | `BuidlGuidlLogo.tsx` still exists in components | **Info** | The file exists but is not imported or used anywhere in the active UI. Dead code, no user impact. Could be cleaned up. |

---

## SUMMARY

**Ship-blockers:** 1 FAIL (favicon.png), 4 N/A, 4 PASS
**Should-fix:** 1 FAIL (OG image), 3 N/A, 4 PASS
**Job-spec items:** 3 FAIL (negative price color, localhost in metadata, stale build), 19 PASS

### FAIL items requiring Stage 8 fixes:

1. **FAIL -- favicon.png is SE2 default** (`public/favicon.png`): Replace with rasterized lobster icon matching `favicon.svg`.
2. **FAIL -- OG image is SE2 default** (`public/thumbnail.jpg`): Replace with CLAWD-branded image. Also fix the double-slash in the URL construction if `NEXT_PUBLIC_PRODUCTION_URL` has a trailing slash.
3. **FAIL -- Negative 24h change text color is cream, not deep red** (`app/page.tsx:248`): Change from `#F5E6E0` to a red like `#C41E3A` or `#DC2626`.
4. **FAIL -- `manifest.json` still says "Scaffold-ETH 2 DApp"** (`public/manifest.json`): Change to "CLAWD Token Dashboard".
5. **FAIL -- `logo.svg` is SE2 scaffold logo** (`public/logo.svg`): Replace with CLAWD branding or use the lobster SVG.
6. **FAIL -- Build is stale** : Source files are newer than `out/`. Must rebuild after all fixes.
7. **FAIL -- `NEXT_PUBLIC_PRODUCTION_URL` not set to real URL**: Will need to be set to the IPFS URL after deploy (Stage 9 concern, but the current placeholder `clawd-dashboard.example` must not ship).
