export type Market = {
  symbol: string;
  name: string;
  supplyApy: number; // %
  borrowApy: number; // %
  ltv: number; // %
};

export const demoMarkets: Market[] = [
  { symbol: "XDC", name: "XDC", supplyApy: 3.2, borrowApy: 7.8, ltv: 75 },
  { symbol: "USDX", name: "Stable (demo)", supplyApy: 5.6, borrowApy: 10.9, ltv: 80 },
];

export type Position = {
  supplied: Record<string, number>;
  borrowed: Record<string, number>;
};

export function calcBorrowLimitUsd(pos: Position) {
  // Demo: treat 1 XDC = $0.05, 1 USDX = $1
  const prices: Record<string, number> = { XDC: 0.05, USDX: 1.0 };
  const ltvs: Record<string, number> = { XDC: 0.75, USDX: 0.8 };
  let limit = 0;
  for (const k of Object.keys(pos.supplied)) {
    limit += (pos.supplied[k] || 0) * (prices[k] || 0) * (ltvs[k] || 0);
  }
  return limit;
}

export function calcDebtUsd(pos: Position) {
  const prices: Record<string, number> = { XDC: 0.05, USDX: 1.0 };
  let debt = 0;
  for (const k of Object.keys(pos.borrowed)) {
    debt += (pos.borrowed[k] || 0) * (prices[k] || 0);
  }
  return debt;
}

export function healthFactor(pos: Position) {
  const limit = calcBorrowLimitUsd(pos);
  const debt = calcDebtUsd(pos);
  if (debt <= 0) return Infinity;
  return limit / debt;
}
