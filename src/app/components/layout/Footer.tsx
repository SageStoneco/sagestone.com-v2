import { Link } from "react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { Monogram } from "../brand/Logo";
import { Container } from "../ui-brand/primitives";
import { services } from "../../content/site";
import { industryPages } from "../../content/industries";
import { solutionPages } from "../../content/solutions";
import { FOUNDER } from "../../content/founder";

const companyLinks = [
  { label: "About", to: "/about" },
  { label: "How It Works", to: "/how-it-works" },
  { label: "Pricing", to: "/pricing" },
  { label: "Case Studies", to: "/case-studies" },
  { label: "Why the Philippines", to: "/why-philippines" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
  { label: "Client Support", to: "/contact#existing-clients" },
];

const resourceLinks = [
  { label: "Blog", to: "/blog" },
  { label: "Kuha Case Study", to: "/case-studies/kuha" },
  { label: "All Solutions", to: "/solutions" },
  { label: "All Industries", to: "/industries" },
];

export function Footer() {
  return (
    <footer className="bg-pine text-chalk">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <Monogram className="h-9 w-[1.4rem] text-sage" />
              <span
                className="text-[1.5rem] leading-none"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Sage<span className="text-sage">Stone</span>
              </span>
            </div>
            <p className="mt-5 text-[0.98rem] leading-relaxed text-chalk/60">
              Structured remote support for growth-focused businesses. Dependable
              talent, operational excellence — built for scale.
            </p>
            <p className="mt-6 text-[0.75rem] uppercase tracking-[0.24em] text-gold">
              Supporting Ambition · Delivering Excellence
            </p>
          </div>

          <FooterCol title="Services">
            {services.map((s) => (
              <FooterLink key={s.slug} to={`/services/${s.slug}`}>
                {s.title}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Company">
            {companyLinks.map((l) => (
              <FooterLink key={l.to} to={l.to}>
                {l.label}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Contact">
            <li className="flex items-start gap-3 text-[0.95rem] text-chalk/60">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
              hello@sagestoneinc.com
            </li>
            <li className="flex items-start gap-3 text-[0.95rem] text-chalk/60">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
              <a href="tel:+12149452234" className="transition-colors hover:text-sage">
                +1 (214) 945-2234
              </a>
            </li>
            <li className="flex items-start gap-3 text-[0.95rem] text-chalk/60">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
              Remote-first · Global
            </li>
          </FooterCol>
        </div>

        <div className="mt-14 grid gap-12 border-t border-chalk/10 pt-12 md:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="hidden lg:block" aria-hidden="true" />
          <FooterCol title="Industries">
            {industryPages.map((i) => (
              <FooterLink key={i.slug} to={`/industries/${i.slug}`}>
                {i.name}
              </FooterLink>
            ))}
          </FooterCol>
          <FooterCol title="Solutions">
            {solutionPages.map((sol) => (
              <FooterLink key={sol.slug} to={`/solutions/${sol.slug}`}>
                {sol.name}
              </FooterLink>
            ))}
          </FooterCol>
          <FooterCol title="Resources">
            {resourceLinks.map((l) => (
              <FooterLink key={l.to} to={l.to}>
                {l.label}
              </FooterLink>
            ))}
          </FooterCol>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-chalk/10 pt-8 text-[0.85rem] text-chalk/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} SageStone. All rights reserved. Founded by{" "}
            <a href={FOUNDER.url} className="text-chalk/70 underline decoration-chalk/25 underline-offset-4 transition-colors hover:text-sage">
              {FOUNDER.name}
            </a>
            .
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="transition-colors hover:text-chalk">Privacy Policy</Link>
            <Link to="/terms" className="transition-colors hover:text-chalk">Terms of Service</Link>
            <Link to="/sms-terms" className="transition-colors hover:text-chalk">SMS Terms</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[0.78rem] uppercase tracking-[0.2em] text-chalk/40" style={{ fontFamily: "var(--font-body)", fontWeight: 500 }}>
        {title}
      </h4>
      <ul className="mt-5 flex flex-col gap-3">{children}</ul>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={to} className="text-[0.95rem] text-chalk/60 transition-colors hover:text-sage">
        {children}
      </Link>
    </li>
  );
}
