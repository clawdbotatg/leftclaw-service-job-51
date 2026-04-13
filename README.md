# CLAWD Token Dashboard

A live price dashboard for the CLAWD ERC-20 token on Base.

**Contract:** `0x9f86dB9fc6f7c9408e8Fda3Ff8ce4e78ac7a6b07`

No wallet connection needed -- this is a read-only dashboard.

## Features

- Live CLAWD price in USD via DexScreener API
- 24h price change with color-coded indicator
- Auto-refresh every 30 seconds
- Copy-to-clipboard for contract address
- Direct link to BaseScan token page
- Dark red lobster theme

## Run locally

```bash
yarn install
yarn start
```

Then open http://localhost:3000

## IPFS build

```bash
cd packages/nextjs
NEXT_PUBLIC_IPFS_BUILD=true yarn build
```

Output goes to `packages/nextjs/out/`.
