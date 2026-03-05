"use client";

import * as React from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { Card, CardContent, CardHeader, Button, Input, Pill } from "@/components/ui";
import { demoMarkets, Position, calcBorrowLimitUsd, calcDebtUsd, healthFactor } from "@/lib/demo-market";
import { fmt } from "@/lib/format";
import { ShieldCheck, Sparkles, Wallet, ArrowRight } from "lucide-react";

function useLocalPosition(key: string) {
  const [pos, setPos] = React.useState<Position>({
    supplied: { XDC: 0, USDX: 0 },
    borrowed: { XDC: 0, USDX: 0 },
  });

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setPos(JSON.parse(raw));
    } catch {}
  }, [key]);

  React.useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(pos));
    } catch {}
  }, [key, pos]);

  return { pos, setPos };
}

export default function Page() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { switchChain, chains, isPending } = useSwitchChain();
  const storageKey = React.useMemo(() => `mushee_xdc_demo_pos_${address ?? "anon"}`, [address]);
  const { pos, setPos } = useLocalPosition(storageKey);

  const [asset, setAsset] = React.useState(demoMarkets[0]?.symbol ?? "XDC");
  const [amount, setAmount] = React.useState("");
  const amt = Number(amount || "0");

  const limit = calcBorrowLimitUsd(pos);
  const debt = calcDebtUsd(pos);
  const hf = healthFactor(pos);

  const onSupply = () => {
    if (!isConnected || !Number.isFinite(amt) || amt <= 0) return;
    setPos((p) => ({
      ...p,
      supplied: { ...p.supplied, [asset]: (p.supplied[asset] || 0) + amt },
    }));
    setAmount("");
  };

  const onWithdraw = () => {
    if (!isConnected || !Number.isFinite(amt) || amt <= 0) return;
    setPos((p) => ({
      ...p,
      supplied: { ...p.supplied, [asset]: Math.max(0, (p.supplied[asset] || 0) - amt) },
    }));
    setAmount("");
  };

  const onBorrow = () => {
    if (!isConnected || !Number.isFinite(amt) || amt <= 0) return;

    // Demo borrow guard: don't exceed limit by USD value
    const prices: Record<string, number> = { XDC: 0.05, USDX: 1.0 };
    const nextDebt = debt + amt * (prices[asset] || 0);
    if (nextDebt > limit) return;

    setPos((p) => ({
      ...p,
      borrowed: { ...p.borrowed, [asset]: (p.borrowed[asset] || 0) + amt },
    }));
    setAmount("");
  };

  const onRepay = () => {
    if (!isConnected || !Number.isFinite(amt) || amt <= 0) return;
    setPos((p) => ({
      ...p,
      borrowed: { ...p.borrowed, [asset]: Math.max(0, (p.borrowed[asset] || 0) - amt) },
    }));
    setAmount("");
  };

  const wrongNetwork = isConnected && !(chainId === 51 || chainId === 50);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <section className="space-y-4">
        <div className="flex flex-wrap gap-2 items-center">
          <Pill>
            <Sparkles className="h-4 w-4 mr-2" />
            Mushee XDC DeFi Demo
          </Pill>
          <Pill>
            <ShieldCheck className="h-4 w-4 mr-2" />
            Black & White UI
          </Pill>
          <Pill>
            <Wallet className="h-4 w-4 mr-2" />
            WalletConnect Enabled
          </Pill>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          A clean lending demo for XDC — supply, borrow, repay.
        </h1>
        <p className="text-white/70 max-w-2xl">
          This is a UI demo (no contracts yet). It shows the full flow and UX we’ll use when we plug real XDC smart
          contracts in.
        </p>

        {wrongNetwork && (
          <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-4 text-sm flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="text-white/75">
              You’re connected to an unsupported network. Switch to XDC Apothem (testnet) or XDC Mainnet.
            </div>
            <div className="flex gap-2">
              {chains.map((c) => (
                <Button
                  key={c.id}
                  onClick={() => switchChain({ chainId: c.id })}
                  disabled={isPending}
                  variant="ghost"
                >
                  Switch: {c.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Markets</div>
                <div className="text-xs text-white/60">Select an asset and simulate actions.</div>
              </div>
              <a
                href="https://x.com/mushee_io"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-white/70 hover:text-white no-underline inline-flex items-center gap-1"
              >
                Follow updates <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {demoMarkets.map((m) => (
                <button
                  key={m.symbol}
                  onClick={() => setAsset(m.symbol)}
                  className={[
                    "text-left rounded-2xl border p-4 transition",
                    asset === m.symbol
                      ? "border-white bg-white text-black"
                      : "border-white/15 bg-white/[0.03] hover:border-white/25",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <div className={asset === m.symbol ? "text-black" : "text-white"}>
                      <div className="text-sm font-semibold">{m.symbol}</div>
                      <div className={asset === m.symbol ? "text-black/70 text-xs" : "text-white/60 text-xs"}>
                        {m.name}
                      </div>
                    </div>
                    <div className={asset === m.symbol ? "text-black/80 text-xs" : "text-white/70 text-xs"}>
                      LTV {m.ltv}%
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className={asset === m.symbol ? "text-black/70" : "text-white/60"}>
                      Supply APY: <span className={asset === m.symbol ? "text-black" : "text-white"}>{m.supplyApy}%</span>
                    </div>
                    <div className={asset === m.symbol ? "text-black/70" : "text-white/60"}>
                      Borrow APR: <span className={asset === m.symbol ? "text-black" : "text-white"}>{m.borrowApy}%</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 p-4 bg-black">
              <div className="text-xs text-white/60 mb-2">Amount</div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  inputMode="decimal"
                />
                <div className="flex gap-2">
                  <Button onClick={onSupply} disabled={!isConnected || amt <= 0}>
                    Supply
                  </Button>
                  <Button onClick={onWithdraw} disabled={!isConnected || amt <= 0} variant="ghost">
                    Withdraw
                  </Button>
                  <Button onClick={onBorrow} disabled={!isConnected || amt <= 0 || debt + (asset === "USDX" ? amt : amt * 0.05) > limit} variant="ghost">
                    Borrow
                  </Button>
                  <Button onClick={onRepay} disabled={!isConnected || amt <= 0} variant="ghost">
                    Repay
                  </Button>
                </div>
              </div>
              {!isConnected && <div className="mt-2 text-xs text-white/50">Connect your wallet to enable actions.</div>}
              {isConnected && (
                <div className="mt-2 text-xs text-white/50">
                  Demo guard: borrow can’t exceed your borrow limit (based on supplied collateral).
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 p-4">
                <div className="text-xs text-white/60">Supplied</div>
                <div className="mt-2 space-y-1">
                  {Object.entries(pos.supplied).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-white/70">{k}</span>
                      <span className="font-mono">{fmt(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <div className="text-xs text-white/60">Borrowed</div>
                <div className="mt-2 space-y-1">
                  {Object.entries(pos.borrowed).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-white/70">{k}</span>
                      <span className="font-mono">{fmt(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold">Account</div>
            <div className="text-xs text-white/60">Your demo risk metrics (simulated).</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-white/10 p-4">
              <div className="text-xs text-white/60">Wallet</div>
              <div className="mt-2 font-mono text-xs break-all">
                {isConnected ? address : "Not connected"}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Borrow limit (USD)</span>
                <span className="font-mono text-sm">${fmt(limit, 2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Debt (USD)</span>
                <span className="font-mono text-sm">${fmt(debt, 2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">Health factor</span>
                <span className="font-mono text-sm">
                  {hf === Infinity ? "∞" : fmt(hf, 2)}
                </span>
              </div>

              <div className="mt-3 text-xs text-white/55">
                Plugging real contracts in next: supply/borrow will call XDC smart contracts, and metrics will be fetched
                from chain.
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 p-4 text-xs text-white/60 space-y-2">
              <div className="font-semibold text-white">Next steps (when ready)</div>
              <ul className="list-disc pl-4 space-y-1">
                <li>Deploy lending contracts to XDC Apothem</li>
                <li>Replace demo markets with on-chain reserves</li>
                <li>Add price oracle + liquidation (v2)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="rounded-2xl border border-white/10 p-5 bg-white/[0.03]">
        <div className="text-sm font-semibold">Brand links</div>
        <div className="mt-2 text-sm text-white/70">
          Website:{" "}
          <a href="https://mushee.xyz" target="_blank" rel="noreferrer" className="text-white">
            mushee.xyz
          </a>{" "}
          • Twitter:{" "}
          <a href="https://x.com/mushee_io" target="_blank" rel="noreferrer" className="text-white">
            @mushee_io
          </a>
        </div>
      </section>
    </div>
  );
}
