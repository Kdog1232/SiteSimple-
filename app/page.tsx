import { About, Contact, CustomApplications, FAQ, FinalCTA, Footer, Header, Hero, HostingOptions, HowItWorks, Industries, InquiryProvider, Portfolio, Pricing, ProblemComparison, Services, WebsiteCare, WebsiteRescue } from "@/components/sections";
import { siteUrl } from "@/lib/site-url";

export default function Home() {
  const schema = { "@context": "https://schema.org", "@type": "ProfessionalService", "@id": `${siteUrl}/#business`, url: siteUrl, name: "Adams Digital Co.", description: "Professional websites, custom web applications, and ongoing website care for small businesses." };
  return <><Header /><InquiryProvider><main><Hero /><ProblemComparison /><Services /><Pricing /><WebsiteCare /><HostingOptions /><WebsiteRescue /><CustomApplications /><HowItWorks /><Portfolio /><Industries /><FAQ /><About /><Contact /><FinalCTA /></main></InquiryProvider><Footer /><a className="mobile-cta button primary" href="#contact">Get My Website</a><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></>;
}
