import type { Metadata } from "next";
import { Outfit, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout/LayoutWrapper";

// Creative, modern fonts
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

// Comprehensive SEO metadata
export const metadata: Metadata = {
  title: {
    default: "OpenTART - JAM Protocol Telemetry & Analytics",
    template: "%s | OpenTART",
  },
  description: "Open-source telemetry and analytics for JAM Protocol validators. Monitor your nodes in real-time with zero trust required. See your validators like never before.",
  keywords: [
    "JAM Protocol",
    "blockchain telemetry",
    "validator monitoring",
    "node analytics",
    "Polkadot",
    "Tessera",
    "web3",
    "open source",
    "real-time monitoring",
    "Chainscore",
  ],
  authors: [{ name: "Chainscore Labs", url: "https://chainscore.finance" }],
  creator: "Chainscore Labs",
  publisher: "Chainscore Labs",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://opentart.io",
    siteName: "OpenTART",
    title: "OpenTART - JAM Protocol Telemetry & Analytics",
    description: "Open-source telemetry for JAM Protocol. Your nodes. Your rules. Zero trust required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OpenTART - JAM Protocol Telemetry & Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenTART - JAM Protocol Telemetry & Analytics",
    description: "Open-source telemetry for JAM Protocol. Your nodes. Your rules.",
    images: ["/og-image.png"],
    creator: "@chainscore",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: "/apple-touch-icon.svg",
  },
  manifest: "/manifest.json",
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://opentart.io"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
