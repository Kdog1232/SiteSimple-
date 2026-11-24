import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { metadataBase } from "@/lib/site-url";
import "./globals.css";

const description = "Done-for-you professional websites for small businesses. Simple pricing, modern design, and no tech headaches. Websites starting at $199.";

export const metadata: Metadata = {
  metadataBase,
  title: "Adams Digital Co. | Affordable Small Business Websites",
  description,
  alternates: { canonical: "/" },
  openGraph: { title: "Adams Digital Co. | Affordable Small Business Websites", description, type: "website", siteName: "Adams Digital Co.", url: "/" },
  twitter: { card: "summary_large_image", title: "Adams Digital Co. | Affordable Small Business Websites", description },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}<Analytics /></body>
    </html>
  );
}
