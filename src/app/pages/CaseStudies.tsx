import { Container, Section } from "../components/ui-brand/primitives";
import { PageHero, CaseStudyCard, TestimonialCard, CTABand } from "../components/ui-brand/components";
import { caseStudies, testimonials } from "../content/site";

export function CaseStudies() {
  return (
    <>
      <PageHero
        eyebrow="Case Studies"
        title="Proof, presented plainly."
        description="A look at how SageStone brings structure and dependable support to growth-focused teams — and the outcomes that follow."
      />

      <Section className="pt-6 pb-20 md:pb-28">
        <Container>
          <div className={`grid gap-8 ${caseStudies.length > 1 ? "md:grid-cols-2 lg:grid-cols-3" : "max-w-xl"}`}>
            {caseStudies.map((s) => (
              <CaseStudyCard key={s.slug} study={s} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Detailed challenge / solution / outcome */}
      <Section className="bg-cloud py-28 dark:bg-card md:py-40">
        <Container>
          <div className="flex flex-col gap-8">
            {caseStudies.map((s) => (
              <div key={s.slug} className="grid gap-8 rounded-3xl border border-border bg-card p-8 md:grid-cols-3 md:gap-12 md:p-12">
                <div>
                  <span className="text-[0.75rem] uppercase tracking-[0.18em] text-gold-ink">Challenge</span>
                  <p className="mt-3 text-[0.98rem] leading-relaxed text-slate-olive dark:text-muted-foreground">{s.challenge}</p>
                </div>
                <div>
                  <span className="text-[0.75rem] uppercase tracking-[0.18em] text-gold-ink">Solution</span>
                  <p className="mt-3 text-[0.98rem] leading-relaxed text-slate-olive dark:text-muted-foreground">{s.solution}</p>
                </div>
                <div>
                  <span className="text-[0.75rem] uppercase tracking-[0.18em] text-gold-ink">Outcome</span>
                  <p className="mt-3 text-[1.05rem] leading-relaxed text-charcoal dark:text-chalk" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                    {s.outcome}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {testimonials.length > 0 && (
        <Section className="py-28 md:py-40">
          <Container>
            <div className="grid gap-8 lg:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard key={t.name} {...t} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <CTABand />
    </>
  );
}
