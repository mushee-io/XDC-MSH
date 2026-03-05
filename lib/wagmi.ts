import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { walletConnectWallet, injectedWallet } from "@rainbow-me/rainbowkit/wallets";
import { http } from "viem";

// XDC chain IDs:
// - Mainnet: 50 (0x32)
// - Apothem testnet: 51 (0x33)

export const xdcMainnet = {
  id: 50,
  name: "XDC Mainnet",
  nativeCurrency: { name: "XDC", symbol: "XDC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.xinfin.network"] },
    public: { http: ["https://rpc.xinfin.network"] },
  },
  blockExplorers: {
    default: { name: "XDCScan", url: "https://xdcscan.com" },
  },
} as const;

export const xdcApothem = {
  id: 51,
  name: "XDC Apothem",
  nativeCurrency: { name: "XDC", symbol: "XDC", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.apothem.network"] },
    public: { http: ["https://rpc.apothem.network"] },
  },
  blockExplorers: {
    default: { name: "XDCScan", url: "https://apothem.xdcscan.com" },
  },
  testnet: true,
} as const;

const projectId =
  process.env.NEXT_PUBLIC_WC_PROJECT_ID || "YOUR_WALLETCONNECT_PROJECT_ID";

// Keep connectors simple to avoid pulling MetaMask SDK (which can break Next builds).
const connectors = connectorsForWallets(
  [
    {
      groupName: "Wallets",
      wallets: [
        injectedWallet, // MetaMask / browser injected
        walletConnectWallet, // WalletConnect
      ],
    },
  ],
  { appName: "Mushee • XDC DeFi Demo", projectId }
);

export const wagmiConfig = getDefaultConfig({
  appName: "Mushee • XDC DeFi Demo",
  projectId,
  chains: [xdcApothem, xdcMainnet],
  connectors,
  transports: {
    [xdcApothem.id]: http(xdcApothem.rpcUrls.default.http[0]),
    [xdcMainnet.id]: http(xdcMainnet.rpcUrls.default.http[0]),
  },
  ssr: true,
});
