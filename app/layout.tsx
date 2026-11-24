import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { brand, socialPreview } from "@/lib/brand";
import { metadataBase } from "@/lib/site-url";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: `${brand.name} | ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  openGraph: { type: "website", siteName: brand.name },
  twitter: { card: "summary_large_image", images: [socialPreview] },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
