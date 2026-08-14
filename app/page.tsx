import { About, Contact, FAQ, FinalCTA, Footer, Header, Hero, HowItWorks, Industries, Portfolio, Pricing, ProblemComparison, Services, WebsiteCare, WebsiteRescue } from "@/components/sections";

export default function Home() {
  const schema = { "@context": "https://schema.org", "@type": "ProfessionalService", name: "SiteSimple", description: "Done-for-you professional websites for small businesses.", priceRange: "$199–$799" };
  return <><Header /><main><Hero /><ProblemComparison /><Services /><Pricing /><WebsiteCare /><WebsiteRescue /><HowItWorks /><Portfolio /><Industries /><FAQ /><About /><Contact /><FinalCTA /></main><Footer /><a className="mobile-cta button primary" href="#contact">Get My Website</a><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></>;
}
