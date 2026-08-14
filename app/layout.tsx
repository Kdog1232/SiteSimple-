import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const description = "Done-for-you professional websites for small businesses. Simple pricing, modern design, and no tech headaches. Websites starting at $199.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "SiteSimple | Affordable Small Business Websites",
  description,
  openGraph: { title: "SiteSimple | Affordable Small Business Websites", description, type: "website", siteName: "SiteSimple" },
  twitter: { card: "summary_large_image", title: "SiteSimple | Affordable Small Business Websites", description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}<Analytics /></body>
    </html>
  );
}
