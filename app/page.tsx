import type { Metadata } from "next";
import { brand, socialPreview } from "@/lib/brand";
import {
  About,
  Contact,
  FAQ,
  FinalCTA,
  Footer,
  Header,
  Hero,
  HowItWorks,
  Industries,
  Portfolio,
  Pricing,
  ProblemComparison,
  Services,
  WebsiteCare,
  WebsiteRescue,
} from "@/components/sections";
import { siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: `${brand.name} | ${brand.tagline}`,
    description: brand.description,
    siteName: brand.name,
    images: [socialPreview],
    url: "/",
  },
};

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#business`,
    url: siteUrl,
    name: brand.name,
    description: brand.description,
    slogan: brand.tagline,
    logo: `${siteUrl}/icon.svg`,
    areaServed: { "@type": "State", name: "Texas" },
  };
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <ProblemComparison />
        <Services />
        <Pricing />
        <WebsiteCare />
        <WebsiteRescue />
        <HowItWorks />
        <Portfolio />
        <Industries />
        <FAQ />
        <About />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
      <a className="mobile-cta button primary" href="#contact">
        Start a Project
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
