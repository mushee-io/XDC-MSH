# Mushee • XDC DeFi Demo (WalletConnect + Black/White)

A clean demo UI for a lending experience on XDC. This is a **frontend demo** (no smart contracts yet) with:

- WalletConnect (RainbowKit + wagmi)
- XDC Apothem + XDC Mainnet chain configs
- Black & White UI (Tailwind)
- Demo supply/borrow/repay flows stored locally per wallet address

## Folder layout

This project uses the **Next.js App Router**, so the app lives in:

- `app/` (NOT `src/app`)

## Quickstart

1) Install deps

```bash
npm install
```

2) Create a WalletConnect Project ID and add it to `.env.local`

```bash
NEXT_PUBLIC_WC_PROJECT_ID=YOUR_WALLETCONNECT_PROJECT_ID
```

3) Run

```bash
npm run dev
```

## Deploy (Vercel)

- Import the repo
- Set `NEXT_PUBLIC_WC_PROJECT_ID` in Vercel env vars
- Deploy

## Links

- Website: https://mushee.xyz
- Twitter: https://x.com/mushee_io


## ESLint note

Next.js 14.2.5 expects ESLint v8. This repo pins `eslint` to `^8.57.0` to avoid Vercel install conflicts.
