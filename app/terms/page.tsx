import type { Metadata } from "next";
import { brand, socialPreview } from "@/lib/brand";

const title = "Terms of Service";
const description =
  "Adams Digital Co. project terms for scope, payment, and third-party services.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  openGraph: {
    type: "website",
    title: `${title} | ${brand.name}`,
    description,
    siteName: brand.name,
    images: [socialPreview],
    url: "/terms",
  },
};

import { LegalPage } from "@/components/sections";
export default function Terms() {
  return (
    <LegalPage title={title}>
      <p>
        For Adams Digital Co. projects, scope, deliverables, timelines,
        third-party costs, and payment terms will be confirmed in writing before
        work begins.
      </p>
      <h2>Payments</h2>
      <p>
        Website projects require a 50% deposit before work begins and the
        remaining balance before launch unless a written agreement states
        otherwise.
      </p>
      <h2>Third-party services</h2>
      <p>
        Domains, hosting, booking tools, and other third-party services may have
        separate fees and terms.
      </p>
    </LegalPage>
  );
}
