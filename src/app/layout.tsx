import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — On-Chain Parametric Cover by ${siteConfig.founder.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "parametric insurance",
    "on-chain cover",
    "DeFi insurance",
    "VeriCover",
    "Base",
    "USDC",
    "policy NFT",
    "liquidity provider yield",
    "Javad",
  ],
  authors: [{ name: siteConfig.founder.name, url: siteConfig.founder.xUrl }],
  creator: siteConfig.founder.name,
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    creator: siteConfig.founder.handle,
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.name,
  description: siteConfig.description,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  author: {
    "@type": "Person",
    name: siteConfig.founder.name,
    sameAs: siteConfig.founder.xUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${dmSans.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}