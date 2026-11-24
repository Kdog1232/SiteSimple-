import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { ArrowRight, Code2, MapPin, MessageCircle, Store, Tags, Wrench } from "lucide-react";

const portraitPath = "/images/founder.jpg";

const highlights = [
  [MapPin, "Texas-Based Business"],
  [Code2, "Hands-On Development"],
  [MessageCircle, "Direct Founder Communication"],
  [Store, "Small Business Focus"],
  [Tags, "Transparent Pricing"],
  [Wrench, "Practical Digital Solutions"],
] as const;

export function Founder() {
  const hasPortrait = existsSync(join(process.cwd(), "public", portraitPath));

  return (
    <section id="about" className="section founder" aria-labelledby="founder-heading">
      <div className="container">
        <div className="founder-heading">
          <p className="kicker">MEET THE FOUNDER</p>
          <h2 id="founder-heading">Real people. Real solutions. <em>No unnecessary complexity.</em></h2>
        </div>
        <div className="founder-grid">
          <div className="founder-portrait">
            {hasPortrait ? (
              <Image
                src={portraitPath}
                alt="Gary Adams"
                fill
                sizes="(max-width: 650px) calc(100vw - 28px), (max-width: 1000px) 36vw, 380px"
              />
            ) : (
              <span className="founder-monogram" aria-hidden="true">AD</span>
            )}
          </div>
          <div className="founder-bio">
            <h3>Gary Adams</h3>
            <p className="founder-title">Founder &amp; Developer | Adams Digital Co.</p>
            <p>I&apos;m a Texas-based digital developer, entrepreneur, and educational leader with a passion for technology, problem-solving, and helping others succeed.</p>
            <p>I founded Adams Digital Co. with a simple belief: small businesses deserve professional technology without the overwhelming costs or complications that often come with it.</p>
            <p>My background in leadership, education, and web application development has taught me the importance of communication, accountability, and creating practical solutions that make people&apos;s lives easier.</p>
            <p>From professional websites to custom business applications, I personally work on each project to ensure it meets the unique needs of the business behind it.</p>
            <p>My goal isn&apos;t just to build your website. It&apos;s to become a trusted technology partner who helps your business move forward.</p>
            <ul className="founder-highlights">
              {highlights.map(([Icon, label]) => (
                <li key={label}><span className="icon-box"><Icon size={19} aria-hidden="true" /></span>{label}</li>
              ))}
            </ul>
          </div>
          <figure className="founder-quote">
            <blockquote>“Technology should make running your business easier, not more complicated.”</blockquote>
            <figcaption>— Gary Adams, Founder</figcaption>
          </figure>
          <div className="founder-action">
            <a className="button primary" href="#contact">
              Let&apos;s Talk About Your Project <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
