import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Container, Section, SectionHeader, Eyebrow } from "../components/ui-brand/primitives";
import { CTABand, PageHero, NoiseOverlay } from "../components/ui-brand/components";
import { stats, images } from "../content/site";
import { FOUNDER } from "../content/founder";

const serif = { fontFamily: "var(--font-display)", fontWeight: 600 } as const;

const values = [
  { title: "Clarity", body: "We communicate plainly and set expectations you can plan around." },
  { title: "Dependability", body: "Consistent quality is the promise every engagement is built on." },
  { title: "Structure", body: "Documented process turns support into something reliable, not reactive." },
  { title: "Precision", body: "Details are handled with care, because details are where trust is built." },
];

export function About() {
  return (
    <>
      <PageHero
        eyebrow="About SageStone"
        title="A steady operational partner for ambitious teams."
        description="SageStone exists to give growth-focused businesses a dependable operational layer — remote support that is thoughtful, structured, and genuinely embedded."
      />

      <Section className="pt-4 pb-8">
        <Container>
          <div className="overflow-hidden rounded-[1.75rem] border border-border">
            <ImageWithFallback src={images.officeGlass} alt="Modern office with natural light" className="aspect-[21/9] w-full object-cover" />
          </div>
        </Container>
      </Section>

      <Section className="py-28 md:py-40">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <Eyebrow className="mb-6">Our Story</Eyebrow>
              <h2 className="text-[2.15rem] leading-[1.08] tracking-[-0.02em] text-charcoal dark:text-chalk md:text-[3rem]">
                Built for growth, grounded in excellence.
              </h2>
            </div>
            <div className="flex flex-col gap-6 text-[1.15rem] leading-relaxed text-slate-olive dark:text-muted-foreground">
              <p>
                Growing businesses rarely fail for lack of ambition — they strain under
                the weight of operations that were never built to scale. SageStone was
                founded to solve that quietly and well.
              </p>
              <p>
                We pair vetted remote professionals with the businesses that need them,
                then embed that support into real workflows with clear structure and
                steady oversight. The result feels less like outsourcing and more like a
                dependable extension of your team.
              </p>
              <p>
                Our approach is deliberately calm and precise. We believe operational
                excellence should feel like relief, not another thing to manage.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-cloud py-28 dark:bg-card md:py-40">
        <Container>
          <SectionHeader eyebrow="What We Stand For" title="Values expressed in how we work" />
          <div className="mt-16 grid gap-x-14 gap-y-12 sm:grid-cols-2">
            {values.map((v, i) => (
              <div key={v.title} className="grid grid-cols-[auto_1fr] items-baseline gap-6 border-t border-border pt-7">
                <span aria-hidden="true" className="text-[1.05rem] text-gold-ink tabular-nums" style={serif}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[1.5rem] text-charcoal dark:text-chalk">{v.title}</h3>
                  <p className="mt-3 text-[1rem] leading-relaxed text-slate-olive dark:text-muted-foreground">{v.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- Founder ---------- */}
      <Section className="py-28 md:py-40" id="founder">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20">
            <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-border lg:mx-0">
              <ImageWithFallback
                src={FOUNDER.photo}
                alt={`${FOUNDER.name}, founder of SageStone`}
                width={1023}
                height={1537}
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
            <div>
              <Eyebrow className="mb-6">Meet the Founder</Eyebrow>
              <h2 className="text-[2.15rem] leading-[1.08] tracking-[-0.02em] text-charcoal dark:text-chalk md:text-[3rem]">
                {FOUNDER.name}
              </h2>
              <p className="mt-3 text-[0.85rem] uppercase tracking-[0.18em] text-gold-ink">{FOUNDER.role}</p>
              <p className="mt-7 max-w-xl text-[1.1rem] leading-relaxed text-slate-olive dark:text-muted-foreground">{FOUNDER.bio}</p>
              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[0.98rem] font-medium">
                <a href={FOUNDER.url} className="text-sage-ink underline decoration-gold/60 underline-offset-4 hover:text-sage">
                  Jesel Cura's website: jeselcura.me
                </a>
                <a href={FOUNDER.linkedin} className="text-sage-ink underline decoration-gold/60 underline-offset-4 hover:text-sage">
                  LinkedIn
                </a>
                <Link to="/team" className="text-sage-ink underline decoration-gold/60 underline-offset-4 hover:text-sage">
                  Meet the team
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="relative overflow-hidden bg-pine py-24 text-chalk md:py-32">
        <NoiseOverlay />
        <Container className="relative z-10">
          <Eyebrow className="mb-12 text-chalk/60">By the Numbers</Eyebrow>
          <div className="grid grid-cols-2 gap-x-12 gap-y-12 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col gap-3 border-t border-chalk/15 pt-6">
                <span className="text-[2.75rem] leading-none text-chalk md:text-[3.25rem]" style={serif}>
                  {s.value}
                </span>
                <span className="text-[0.82rem] uppercase tracking-[0.16em] text-chalk/60">{s.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <CTABand title="Let's build your operational advantage." />
    </>
  );
}
