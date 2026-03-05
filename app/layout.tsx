import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Mushee • XDC DeFi Demo",
  description: "A clean DeFi demo on XDC with WalletConnect. Built by Mushee.",
  metadataBase: new URL("https://mushee.xyz"),
  openGraph: {
    title: "Mushee • XDC DeFi Demo",
    description: "A clean DeFi demo on XDC with WalletConnect. Built by Mushee.",
    url: "https://mushee.xyz",
    siteName: "Mushee",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mushee • XDC DeFi Demo",
    description: "A clean DeFi demo on XDC with WalletConnect. Built by Mushee.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <SiteNav />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
