"use client";

import Image from "next/image";
import Link from "next/link";
import { createContext, FormEvent, ReactNode, useContext, useState } from "react";
import { ArrowRight, BriefcaseBusiness, Camera, Car, Check, ChevronDown, CircleCheck, Flower2, Hammer, HeartHandshake, House, Menu, Paintbrush, Scissors, Sparkles, Store, Utensils, Wrench, X } from "lucide-react";
import { applicationExamples, applicationServices, carePlans, careTerms, hostingOptions, packages, projects } from "@/lib/data";
import { applicationMaintenance, applications, careOnly, careOptions, launch, projectOptions, rescue, type CareOption, type ProjectOption, type InquirySelection } from "@/lib/inquiry-options";

type InquiryFormSelection = { project: ProjectOption | ""; care: CareOption | "" };
const emptySelection: InquiryFormSelection = { project: "", care: "" };
const InquiryContext = createContext<{
  selection: InquiryFormSelection;
  setSelection: React.Dispatch<React.SetStateAction<InquiryFormSelection>>;
}>({ selection: emptySelection, setSelection: () => {} });

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState(emptySelection);
  return <InquiryContext.Provider value={{ selection, setSelection }}>{children}</InquiryContext.Provider>;
}

function InquiryLink({ selection, children, secondary = false }: {
  selection: InquirySelection;
  children: ReactNode;
  secondary?: boolean;
}) {
  const { setSelection } = useContext(InquiryContext);
  return (
    <a href="#contact" className={`button ${secondary ? "secondary" : "primary"}`} onClick={() => setSelection(current => ({ project: selection.project, care: selection.care ?? current.care }))}>
      {children}<ArrowRight size={17} aria-hidden />
    </a>
  );
}

const nav = [["Home", "#home"], ["Services", "#services"], ["Pricing", "#pricing"], ["Portfolio", "#portfolio"], ["How It Works", "#process"], ["FAQ", "#faq"], ["Contact", "#contact"]];
const Button = ({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) => <a href={href} className={`button ${secondary ? "secondary" : "primary"}`}>{children}<ArrowRight size={17} aria-hidden /></a>;
const Kicker = ({ children }: { children: ReactNode }) => <p className="kicker">{children}</p>;

function BrandLogo() {
  return (
    <Link className="logo" href="/#home">
      <Image
        src="/adams-digital-co.webp"
        alt="Adams Digital Co. home"
        width={1200}
        height={400}
        sizes="(max-width: 600px) 132px, 156px"
        className="brand-image"
      />
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="header"><div className="container nav-wrap"><BrandLogo /><nav className="desktop-nav" aria-label="Main navigation">{nav.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav><a className="button primary header-cta" href="#contact">Get My Website</a><button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label="Toggle menu">{open ? <X /> : <Menu />}</button></div>{open && <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">{nav.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}<a className="button primary" href="#contact" onClick={() => setOpen(false)}>Get My Website</a></nav>}</header>;
}

export function Hero() {
  return <section className="hero" id="home"><div className="container hero-grid"><div><div className="eyebrow"><span />Done-for-you websites for local businesses</div><h1>A website that helps<br/><em>customers contact you.</em></h1><p className="hero-copy">Show what you do, make it easy to request a quote, and give customers a place to find you online. We handle the design and launch, with one-time website packages starting at $199.</p><div className="button-row"><Button href="#contact">Get My Website</Button><Button href="#pricing" secondary>See Pricing</Button></div><p className="trust"><Check /> Mobile-friendly <b>•</b> Quote form <b>•</b> Domain connection</p></div><HeroVisual /></div></section>;
}

function HeroVisual() { return <div className="hero-visual" aria-label="Original example of a landscaping business website on desktop and mobile"><div className="browser"><div className="browser-bar"><i/><i/><i/><span>greenwaylandscapes.com</span></div><div className="mock-nav"><b><Flower2 size={17}/>Greenway</b><small>Services&nbsp;&nbsp; About&nbsp;&nbsp; Contact</small></div><div className="mock-hero"><small>LOCAL LAWN & LANDSCAPE</small><strong>Outdoor spaces,<br/>beautifully kept.</strong><p>Reliable care for lawns you love coming home to.</p><button>Get a free quote</button></div><div className="mock-stats"><b>Weekly care</b><b>Local team</b><b>Easy quotes</b></div></div><div className="phone"><div className="phone-notch"/><div className="mini-brand"><Flower2 size={14}/> Greenway</div><div className="mini-photo"><small>YOUR LOCAL LAWN TEAM</small><b>Love your<br/>outdoors.</b><i>Get a free quote</i></div></div><div className="floating-note"><CircleCheck/><span><b>Example website</b><small>Desktop and mobile preview</small></span></div></div> }

export function ProblemComparison() { const diy = ["You build everything", "You choose the layout", "You configure the website", "You troubleshoot problems", "You spend your time"], us = ["We build it", "We design it", "We configure it", "We launch it", "You run your business"]; return <section className="section warm"><div className="container problem-grid"><div><Kicker>DESIGN AND LAUNCH</Kicker><h2>We handle the website.<br/><em>You run your business.</em></h2><p>Tell us what you offer and where you work. We’ll organize your business details into a site that makes it easy for customers to see your services and get in touch.</p><div className="highlight"><Sparkles/><p><b>You review the site before it goes live.</b><br/><span>We make the revisions included in your package and connect your domain when you’re ready to launch.</span></p></div></div><div className="comparison"><div><small>DIY WEBSITE BUILDER</small>{diy.map(x=><p key={x}><X/> {x}</p>)}</div><div className="compare-us"><small>WITH ADAMS DIGITAL CO.</small>{us.map(x=><p key={x}><Check/> {x}</p>)}</div></div></div></section> }

const serviceItems = [
  [House, "Landing Pages", "Simple, professional online presence for businesses that need to get online quickly.", "#pricing"],
  [BriefcaseBusiness, "Small Business Websites", "Complete professional websites for established local businesses.", "#pricing"],
  [Paintbrush, "Website Redesigns", "Modernize an outdated or DIY website with a clearer, more polished experience.", "#website-rescue"],
  [Wrench, "Website Care", "Ongoing support, content updates, monitoring, and maintenance.", "#website-care"],
  [Store, "Custom Web Applications", "Booking systems, customer portals, and tools that simplify everyday work.", "#custom-applications"],
] as const;
export function Services() { return <section id="services" className="section"><div className="container"><div className="section-head"><div><Kicker>WHAT WE DO</Kicker><h2>Websites, business tools,<br/><em>and ongoing support.</em></h2></div><p>Get a professional site, improve the one you have, or build a tool that makes your business easier to run.</p></div><div className="service-grid">{serviceItems.map(([Icon,title,copy,href])=><article className="service-card" key={title}><div className="icon-box"><Icon/></div><h3>{title}</h3><p>{copy}</p><a href={href}>Learn more <ArrowRight/></a></article>)}</div></div></section> }

type PricePackage = {
  name: string;
  price: string;
  blurb: string;
  cta: string;
  features: string[];
  popular?: boolean;
  note?: string;
};

function FeatureList({ features }: { features: readonly string[] }) {
  return <div className="features">{features.map(feature => <span key={feature}><Check aria-hidden />{feature}</span>)}</div>;
}

function PriceCard({ item, billing, selection }: {
  item: PricePackage;
  billing: "One-time project price" | "Per month";
  selection: InquirySelection;
}) {
  return (
    <article className={`price-card ${item.popular ? "popular" : ""}`}>
      {item.popular && <div className="popular-label">MOST POPULAR</div>}
      <h3>{item.name}</h3>
      <p>{item.blurb}</p>
      <strong className="price">{item.price}</strong>
      <small>{billing}</small>
      <InquiryLink selection={selection} secondary={!item.popular}>{item.cta}</InquiryLink>
      <FeatureList features={item.features} />
      {item.note && <p className="plan-note">{item.note}</p>}
    </article>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="section navy">
      <div className="container">
        <div className="center-head">
          <Kicker>SIMPLE, UPFRONT PRICING</Kicker>
          <h2>Choose the website that<br/><em>fits your business.</em></h2>
          <p>Compare one-time website packages.</p>
        </div>
        <div className="pricing-grid">
          {packages.map(item => <PriceCard key={item.name} item={item} billing="One-time project price" selection={{ project: item.option }} />)}
        </div>
        <div className="pricing-terms">
          <p className="pricing-note"><CircleCheck aria-hidden /> <strong>A 50% deposit starts your project. The remaining balance is due before your website launches.</strong></p>
          <p>Website development is a one-time investment. Ongoing hosting and maintenance are available through our optional Website Care plans.</p>
          <p>Domain registration and premium third-party subscriptions are separate. We disclose third-party expenses before purchase.</p>
        </div>
      </div>
    </section>
  );
}

export function WebsiteCare() {
  return (
    <section id="website-care" className="section navy website-care">
      <div className="container">
        <div className="center-head">
          <Kicker>OPTIONAL MONTHLY PLANS</Kicker>
          <h2>Keep Your Website <em>Taken Care Of.</em></h2>
          <p>Focus on running your business while we handle the technical side. Our flexible Website Care plans keep your website online, secure, updated, and performing at its best.</p>
        </div>
        <div className="pricing-grid">
          {carePlans.map(item => <PriceCard key={item.name} item={item} billing="Per month" selection={{ project: careOnly, care: item.option }} />)}
        </div>
        <div className="care-terms">
          <h3>Website Care terms</h3>
          <div className="accordion">
            {careTerms.map(([title, copy]) => (
              <details key={title}><summary>{title}<ChevronDown aria-hidden /></summary><p>{copy}</p></details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function HostingOptions() {
  return (
    <section className="section warm">
      <div className="container">
        <div className="center-head">
          <h2>Your Website. <em>Your Choice.</em></h2>
          <p>Choose how your site will be hosted after development. If you decline Website Care, you’ll need to arrange your own hosting.</p>
        </div>
        <div className="hosting-grid">
          {hostingOptions.map(([title, features]) => (
            <article className="service-card" key={title}><h3>{title}</h3><FeatureList features={features} /></article>
          ))}
        </div>
        <p className="domain-note">Your domain belongs to you. Whether you manage your website yourself or choose one of our Website Care plans, you remain in control of your business&apos;s online identity.</p>
      </div>
    </section>
  );
}

export function CustomApplications() {
  return (
    <section id="custom-applications" className="section warm">
      <div className="container">
        <div className="section-head">
          <div><Kicker>CUSTOM DIGITAL SOLUTIONS</Kicker><h2>More Than Just <em>Websites.</em></h2></div>
          <p>Have a business process that takes too much time? Need a tool that doesn&apos;t exist yet? Adams Digital Co. builds custom web applications that simplify your operations, automate repetitive tasks, and help your business grow.</p>
        </div>
        <div className="application-grid">
          {applicationServices.map(item => (
            <article className="service-card" key={item.name}>
              <h3>{item.name}</h3>
              <InquiryLink selection={{ project: item.option }} secondary>Starting at {item.price}</InquiryLink>
            </article>
          ))}
          <article className="service-card">
            <h3>Application Hosting and Maintenance</h3>
            <InquiryLink selection={{ project: careOnly, care: applicationMaintenance }} secondary>Starting at $99/month</InquiryLink>
          </article>
        </div>
        <div className="application-details">
          <div>
            <h3>Examples of what we can build</h3>
            <FeatureList features={applicationExamples} />
          </div>
          <div>
            <h3>Project consultation and quote</h3>
            <p>Every custom application requires an individual consultation and an approved project quote before development begins.</p>
            <p>Advanced database hosting, authentication, payment processing, email services, integrations, and other third-party expenses may be billed separately. We disclose those costs before purchase.</p>
            <InquiryLink selection={{ project: applications }}>Discuss My App Idea</InquiryLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WebsiteRescue() { const improvements=["Professional redesign", "Better mobile experience", "Cleaner layout", "Stronger calls to action", "Contact improvements", "Visual cleanup", "Basic SEO improvements"]; return <section id="website-rescue" className="section rescue"><div className="container rescue-grid"><div><Kicker>DIY WEBSITE RESCUE</Kicker><h2>Already built a website<br/>but hate it? <em>We’ll fix it.</em></h2><p>You may not need to start over. We can improve the website you already have, keeping what works and cleaning up what doesn’t.</p><div className="rescue-price"><b>Starting at $249</b><span>Final pricing depends on your existing platform, site complexity, and project requirements.</span></div><InquiryLink selection={{ project: rescue }}>Fix My Website</InquiryLink></div><div className="rescue-list">{improvements.map((x,i)=><div key={x}><span>0{i+1}</span><b>{x}</b><Check/></div>)}</div></div></section> }

export function HowItWorks() {
  const steps = [
    ["Tell Us About Your Business", "Complete a simple project questionnaire so we understand your business, goals, and requirements."],
    ["Approve Your Project", "We confirm the project scope, pricing, and timeline. A 50% deposit secures your project and allows development to begin."],
    ["We Build It", "Adams Digital Co. handles the design, development, content layout, and technical setup."],
    ["Review and Approve", "Review your website or application and request the revision rounds included in your package."],
    ["Launch and Grow", "After your final payment, we connect your domain, complete final checks, and launch your project. Choose an optional Website Care plan or manage your website independently."],
  ];

  return (
    <section id="process" className="section process">
      <div className="container">
        <div className="center-head"><Kicker>HOW IT WORKS</Kicker><h2>From idea to online in<br/><em>five simple steps.</em></h2></div>
        <div className="steps">
          {steps.map(([title, copy], index) => (
            <article key={title}>
              <span>{index + 1}</span><h3>{title}</h3><p>{copy}</p>
              {index < steps.length - 1 && <ArrowRight className="step-arrow" aria-hidden />}
            </article>
          ))}
        </div>
        <p className="process-line">No coding. No templates to figure out. No tech headaches.</p>
      </div>
    </section>
  );
}

export function Portfolio() { return <section id="portfolio" className="section portfolio"><div className="container"><div className="section-head"><div><Kicker>OUR WORK</Kicker><h2>Made for the businesses<br/><em>that keep things moving.</em></h2></div><div><p>Explore sample sites for a lawn care company, a cleaning service, and a mobile detailer.</p></div></div><div className="portfolio-grid">{projects.map((p)=><article className="project" key={p.name}><div className={`project-preview ${p.theme}`}><div className="project-browser"><div className="dots">•••</div><nav><b>{p.name}</b><small>Services&nbsp;&nbsp; About&nbsp;&nbsp; Contact</small></nav><div><small>{p.category.toUpperCase()}</small><h3>{p.eyebrow}</h3><button>{p.action}</button></div></div><div className="project-phone"><span/><b>{p.name.split(" ")[0]}</b><p>{p.eyebrow}</p><i>{p.action}</i></div></div><div className="project-info"><span className="pill">DEMO CONCEPT</span><small>{p.category}</small><h3>{p.name}</h3><p>{p.description}</p><div>{p.services.map(s=><span key={s}>{s}</span>)}</div></div></article>)}</div><div className="portfolio-cta"><p><b>Like what you see?</b> Let’s build something that feels like your business.</p><Button href="#contact" secondary>Start Your Project</Button></div></div></section> }

const industries = [[Hammer,"Contractors"],[Sparkles,"Cleaning"],[Flower2,"Landscaping"],[Car,"Automotive"],[Scissors,"Beauty"],[Camera,"Photography"],[House,"Real Estate"],[HeartHandshake,"Childcare"],[BriefcaseBusiness,"Coaching"],[Utensils,"Restaurants"],[Store,"Local Services"],[HeartHandshake,"Nonprofits"]] as const;
export function Industries() { return <section className="section"><div className="container industries-wrap"><div><Kicker>WHO WE HELP</Kicker><h2>Built for<br/><em>Small Business.</em></h2><p>Whether you’re starting something new or finally ready to upgrade your online presence, we’ll make getting a professional website simple.</p><Button href="#contact">Let’s Talk About Your Site</Button></div><div className="industry-grid">{industries.map(([Icon,name])=><div key={name}><Icon/><span>{name}</span></div>)}</div></div></section> }

const faqs = [
  ["How long does a website take?", "Turnaround depends on your package, project scope, and how quickly you provide the content and feedback we need. We’ll confirm a realistic timeline before work begins."],
  ["Do I need to know anything about websites?", "No. Tell us about your business and goals; we’ll guide you through the decisions and handle the technical details."],
  ["Do I own my domain?", "Yes. You retain ownership of your domain name. We can assist with domain registration and connection."],
  ["Is hosting included in my website purchase?", "Ongoing hosting is separate from the one-time development price. Standard hosting is included with eligible Website Care plans. If you decline Website Care, arrange your own hosting."],
  ["Can you redesign my existing website?", "Yes. We can refresh an existing website or recommend a rebuild when that is the more practical choice."],
  ["Can I update my website later?", "Yes. You can request future updates as needed, or choose an optional Website Care plan for ongoing support and small updates."],
  ["Do you build online stores?", "Ecommerce projects require a custom quote because product counts, payments, shipping, and other requirements vary."],
  ["Do you build custom apps?", "Yes. We build custom web applications and business tools. Each project starts with a consultation and an individual quote."],
  ["How does payment work?", "After you approve the scope and price, we issue a Stripe invoice for a 50% deposit before development begins. The remaining 50% is due before launch."],
  ["Do I have to pay monthly?", "No. Website development is a one-time payment. You can manage your own hosting or select an optional monthly Website Care plan."],
  ["Can I cancel Website Care?", "Yes. You can cancel before the next billing cycle. If you use managed hosting, arrange alternative hosting before your service ends."],
  ["What happens if I need additional website updates?", "Updates beyond your monthly allowance are available at $75 per hour with your approval."],
];
export function FAQ() { return <section id="faq" className="section faq"><div className="container faq-grid"><div><Kicker>QUESTIONS, ANSWERED</Kicker><h2>Good questions.<br/><em>Simple answers.</em></h2><p>Still wondering about something?</p><a href="#contact">Send us your question <ArrowRight/></a></div><div className="accordion">{faqs.map(([q,a],i)=><details key={q} open={i===0}><summary>{q}<ChevronDown/></summary><p>{a}</p></details>)}</div></div></section> }

export function About() { return <section className="section about"><div className="container about-card"><div><Kicker>WHY ADAMS DIGITAL CO.</Kicker><h2>There should be a better option.</h2></div><div><p className="lead">Small businesses shouldn’t have to choose between an expensive agency and figuring everything out themselves.</p><p>Adams Digital Co. is the middle option: professional, done-for-you websites at straightforward prices. We keep the process clear, the design focused, and the technical headaches off your plate.</p><p className="signature"><b>Professional websites.<br/><em>Made simple.</em></b></p></div></div></section> }

export function Contact() { return <section id="contact" className="section contact"><div className="container contact-grid"><div><Kicker>LET’S GET STARTED</Kicker><h2>Tell us about<br/><em>your business.</em></h2><p>Tell us a little about your business and what help you need with a website, a custom application, or ongoing Website Care. You can inquire even if you’re still deciding on a package.</p><div className="contact-points">{["Clear, straightforward pricing", "A process built around your schedule", "Professional design without the agency overhead"].map(x=><span key={x}><Check/>{x}</span>)}</div><div className="expect"><b>What happens next?</b><p>We’ll review your inquiry and follow up to discuss fit, scope, and next steps. Your project only begins after you approve the details.</p></div></div><ContactForm/></div></section> }

function ContactForm() {
  const { selection, setSelection } = useContext(InquiryContext);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID());

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = event.currentTarget;
    const payload = { ...Object.fromEntries(new FormData(form)), submissionId };
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || data.success !== true) throw new Error(data.error ?? "We couldn’t confirm your inquiry. Please try again.");
      form.reset();
      setSelection(emptySelection);
      setSubmissionId(crypto.randomUUID());
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success" && !selection.project) {
    return (
      <div className="form-card form-success" role="status">
        <CircleCheck />
        <h3>Thanks! We&apos;ve received your inquiry.</h3>
        <p>We’ll review your details and follow up about next steps.</p>
        <button className="button secondary" onClick={() => setStatus("idle")}>Send another inquiry</button>
      </div>
    );
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-10000px" }} />
      <div className="form-heading"><div><h3>Project inquiry</h3><p>Fields marked * are required</p></div></div>
      <div className="form-grid">
        <Field label="Your name *" name="name" placeholder="Jordan Smith" />
        <Field label="Business name *" name="businessName" placeholder="Your business" />
        <Field label="Email address *" name="email" type="email" placeholder="you@business.com" />
        <Field label="Phone (optional)" name="phone" type="tel" placeholder="(555) 000-0000" />
        <Field label="Business type *" name="businessType" placeholder="e.g. Landscaping" />
        <Field label="Current website (optional)" name="currentWebsite" type="url" placeholder="https://" />
        <label>
          Project or package *
          <select name="package" required value={selection.project} onChange={event => setSelection({ ...selection, project: event.target.value as ProjectOption })}>
            <option value="" disabled>Select a package</option>
            {projectOptions.map(option => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label>
          Website Care interest (optional)
          <select name="websiteCareInterest" value={selection.care} onChange={event => setSelection({ ...selection, care: event.target.value as CareOption | "" })}>
            <option value="">Select a plan</option>
            {careOptions.map(option => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label>
          Do you already own a domain? *
          <select name="domain" required defaultValue="">
            <option value="" disabled>Select an answer</option>
            <option>Yes</option><option>No</option><option>Not sure</option>
          </select>
        </label>
      </div>
      <label>What does your business do? *<textarea name="description" required rows={3} placeholder="Tell us about your services and customers." /></label>
      <label>What would you like help with? *<textarea name="goal" required rows={3} placeholder="Tell us what you want your website or application to accomplish, or what support you need." /></label>
      <label>Anything else we should know?<textarea name="notes" rows={2} placeholder="Timelines, inspiration, questions, or other details." /></label>
      {status === "error" && <p className="form-error" role="alert">{message}</p>}
      <button className="button primary submit" disabled={status === "loading"}>{status === "loading" ? "Sending…" : "Send Inquiry"}<ArrowRight aria-hidden /></button>
      <p className="form-note">By submitting, you agree that Adams Digital Co. may contact you about your inquiry.</p>
    </form>
  );
}
function Field({label,name,type="text",placeholder}:{label:string;name:string;type?:string;placeholder:string}){return <label>{label}<input name={name} type={type} placeholder={placeholder} required={label.includes("*")}/></label>}

export function FinalCTA() { return <section className="final-cta"><div className="container"><h2>Give customers a place to find<br/>your services and request a quote.</h2><p>Get started with a one-page website for $199.</p><InquiryLink selection={{ project: launch }}>Let’s Build Your Website</InquiryLink></div></section> }
export function Footer() { return <footer><div className="container footer-grid"><div><BrandLogo /><p>Professional Websites.<br/><em>Made Simple.</em></p><small>Done-for-you websites for small businesses.</small></div><div><b>Navigate</b>{nav.slice(1).map(([x,h])=><a href={h} key={x}>{x}</a>)}</div><div><b>Services</b><a href="#services">Landing Pages</a><a href="#services">Business Websites</a><a href="#services">Website Redesigns</a><a href="#website-care">Website Care</a><a href="#custom-applications">Custom Web Applications</a></div><div><b>Legal</b><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><span className="social-label">Social profiles coming soon</span></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Adams Digital Co.. All rights reserved.</span><span>Built for small business.</span></div></footer> }

export function LegalPage({title,children}:{title:string;children:ReactNode}) { return <><Header/><main className="legal container"><Kicker>ADAMS DIGITAL CO.</Kicker><h1>{title}</h1><p className="updated">Last updated August 14, 2026</p><div>{children}</div></main><Footer/></> }
