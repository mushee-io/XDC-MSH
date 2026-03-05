"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowUpRight } from "lucide-react";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="no-underline">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl border border-white/15 grid place-items-center">
              <span className="font-mono text-sm">M</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">Mushee</div>
              <div className="text-xs text-white/60">XDC DeFi Demo</div>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <a
            href="https://mushee.xyz"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-xs text-white/70 hover:text-white no-underline px-3 py-2 rounded-xl border border-white/10 hover:border-white/20"
          >
            mushee.xyz <ArrowUpRight className="h-4 w-4" />
          </a>

          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="address" />
        </div>
      </div>
    </header>
  );
}
