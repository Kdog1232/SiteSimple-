import Image from "next/image";
import { ArrowRight, BriefcaseBusiness, Code2, MapPin, MessageCircle, Store, Tags } from "lucide-react";
import portrait from "@/public/images/founder.jpg";

const highlights = [
  [MapPin, "North Texas Based"],
  [BriefcaseBusiness, "Independently Owned & Operated"],
  [MessageCircle, "Direct Founder Communication"],
  [Code2, "Hands-On Development"],
  [Tags, "Transparent & Affordable Pricing"],
  [Store, "Small Business Focused"],
] as const;

export function Founder() {
  return (
    <section id="about" className="section founder" aria-labelledby="founder-heading">
      <div className="container founder-grid">
        <figure className="founder-portrait">
          <Image
            src={portrait}
            alt="Gary Adams, Founder of Adams Digital Co."
            sizes="(max-width: 428px) calc(100vw - 28px), (max-width: 650px) 400px, (max-width: 1220px) 35vw, 420px"
          />
          <figcaption>
            <strong>Gary Adams</strong>
            <span>Founder &amp; Developer | Adams Digital Co.</span>
          </figcaption>
        </figure>

        <div className="founder-bio">
          <p className="kicker">MEET THE FOUNDER</p>
          <h2 id="founder-heading">A Real Person Behind Your Digital Solutions.</h2>

          <p>I&apos;m a North Texas-based developer, entrepreneur, and educational leader with a passion for technology, problem-solving, and helping others succeed.</p>
          <p>I founded Adams Digital Co. because I believe small businesses deserve access to professional websites and custom technology without the overwhelming costs and complications of traditional digital agencies.</p>
          <p>My background in leadership, education, and web application development has taught me the importance of communication, accountability, and creating practical solutions that make people&apos;s lives easier.</p>
          <p>When you work with Adams Digital Co., you&apos;re working directly with me. From your initial consultation to the launch of your website or application, I personally oversee your project.</p>
          <p>Whether you&apos;re a local contractor, a family-owned business, or an entrepreneur bringing a new idea to life, my goal is to provide affordable, dependable digital solutions that help your business grow.</p>

          <ul className="founder-highlights">
            {highlights.map(([Icon, label]) => (
              <li key={label}>
                <span className="icon-box"><Icon size={19} aria-hidden="true" /></span>
                {label}
              </li>
            ))}
          </ul>

          <figure className="founder-quote">
            <blockquote>“Technology should make running your business easier, not more complicated.”</blockquote>
            <figcaption>— Gary Adams, Founder</figcaption>
          </figure>

          <a className="button primary" href="#inquiry-form">
            Let&apos;s Talk About Your Project <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
