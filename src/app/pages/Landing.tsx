import { useParams } from "react-router";
import { Check } from "lucide-react";
import { Logo } from "../components/brand/Logo";
import { Container, Section, Eyebrow } from "../components/ui-brand/primitives";
import { ProcessList, FAQAccordion, CaseStudyCard } from "../components/ui-brand/components";
import { ContactForm } from "../components/growth/ContactForm";
import { PricingCards, GuaranteeNote } from "../components/growth/PricingCards";
import { landingPages } from "../content/landing";
import { processSteps, faqs, caseStudies } from "../content/site";
import { pricingFaqs } from "../content/pricing";
import { NotFound } from "./NotFound";

/* Paid landing page: logo-only header, no navigation, one action (the form). */
export function Landing() {
  const { slug } = useParams();
  const page = landingPages.find((p) => p.slug === slug);
  if (!page) return <NotFound />;
  const study = caseStudies[0];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <Container className="flex h-20 items-center justify-between">
          <Logo />
          <a href="tel:+12149452234" className="text-[0.95rem] text-charcoal transition-colors hover:text-sage dark:text-chalk">
            +1 (214) 945-2234
          </a>
        </Container>
      </header>

      <main className="flex-1">
        <Section className="py-16 md:py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
              <div>
                <Eyebrow>{page.eyebrow}</Eyebrow>
                <h1 className="mt-6 text-[2.5rem] leading-[1.02] tracking-[-0.03em] text-charcoal dark:text-chalk md:text-[3.6rem]">
                  {page.headline}
                </h1>
                <p className="mt-6 max-w-xl text-[1.12rem] leading-relaxed text-slate-olive dark:text-muted-foreground">
                  {page.subhead}
                </p>
                <h2 className="mt-10 text-[1.15rem] font-medium text-charcoal dark:text-chalk">What you can hand off</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {page.tasks.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-[1rem] text-charcoal dark:text-chalk">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-sage" aria-hidden="true" />
                      {t}
                    </li>
                  ))}
                </ul>
                <GuaranteeNote className="mt-8" />
              </div>
              <div id="book">
                <ContactForm defaultService={page.serviceSlug} />
              </div>
            </div>
          </Container>
        </Section>

        <Section className="border-t border-border py-20 md:py-24">
          <Container>
            <h2 className="text-[2rem] leading-tight text-charcoal dark:text-chalk md:text-[2.6rem]">Engagement models</h2>
            <div className="mt-10">
              <PricingCards compact />
            </div>
          </Container>
        </Section>

        <Section className="bg-pine py-20 text-chalk md:py-24">
          <Container>
            <h2 className="text-[2rem] leading-tight text-chalk md:text-[2.6rem]">From first call to dependable support</h2>
            <div className="mt-12">
              <ProcessList steps={processSteps} />
            </div>
          </Container>
        </Section>

        {study && (
          <Section className="py-20 md:py-24">
            <Container>
              <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                <h2 className="text-[2rem] leading-tight text-charcoal dark:text-chalk md:text-[2.6rem]">Work we've delivered</h2>
                <div className="max-w-xl">
                  <CaseStudyCard study={study} />
                </div>
              </div>
            </Container>
          </Section>
        )}

        <Section className="border-t border-border py-20 md:py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <h2 className="text-[2rem] leading-tight text-charcoal dark:text-chalk md:text-[2.6rem]">Questions before you book</h2>
              <FAQAccordion items={[pricingFaqs[0], ...faqs.slice(0, 4)]} />
            </div>
            <div className="mt-14 text-center">
              <a href="#book" className="inline-flex items-center justify-center rounded-full bg-sage-ink px-7 py-3.5 font-medium text-cloud transition-colors hover:bg-charcoal dark:text-pine dark:hover:bg-chalk">
                Book a Discovery Call
              </a>
            </div>
          </Container>
        </Section>
      </main>

      <footer className="border-t border-border py-8 text-[0.85rem] text-slate-olive dark:text-muted-foreground">
        <Container className="flex flex-wrap items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} SageStone Inc.</span>
          <span className="flex gap-5">
            <a href="/privacy" className="hover:text-sage">Privacy Policy</a>
            <a href="/terms" className="hover:text-sage">Terms</a>
          </span>
        </Container>
      </footer>
    </div>
  );
}
