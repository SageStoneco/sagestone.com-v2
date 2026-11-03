import { Linkedin } from "lucide-react";
import { Container, Section, SectionHeader, Eyebrow } from "../components/ui-brand/primitives";
import { PageHero, CTABand, ProcessList, NoiseOverlay } from "../components/ui-brand/components";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { FOUNDER } from "../content/founder";
import { team, type TeamMember } from "../content/team";
import { processSteps } from "../content/site";

const serif = { fontFamily: "var(--font-display)", fontWeight: 600 } as const;

const standards = [
  {
    title: "Matched, not assigned",
    body: "Talent is matched to your workflows, tools and working style, and you approve the fit before work begins.",
  },
  {
    title: "Documented from day one",
    body: "Onboarding captures how your work gets done, so quality never depends on one person's memory.",
  },
  {
    title: "Overseen by SageStone",
    body: "We stay involved after onboarding, checking consistency and adjusting as your needs change.",
  },
];

export function Team() {
  const leadership = team.filter((m) => m.group === "leadership");
  const talent = team.filter((m) => m.group === "talent");

  return (
    <>
      <PageHero
        eyebrow="Our Team"
        title="The people behind dependable support."
        description="SageStone pairs U.S. businesses with dedicated talent in the Philippines, with a small team that matches, onboards and oversees every engagement."
        breadcrumbs={[{ name: "About", to: "/about" }, { name: "Team" }]}
      />

      {/* ---------- Founder ---------- */}
      <Section className="pb-24 md:pb-32">
        <Container>
          <div className="grid gap-12 rounded-[2rem] border border-border bg-card p-6 sm:p-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-16">
            <div className="mx-auto w-full max-w-xs overflow-hidden rounded-[1.5rem] border border-border lg:mx-0">
              <ImageWithFallback
                src={FOUNDER.photo}
                alt={`${FOUNDER.name}, founder of SageStone`}
                width={1023}
                height={1537}
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
            <div>
              <Eyebrow className="mb-5">Founder</Eyebrow>
              <h2 className="text-[2.2rem] leading-[1.05] tracking-[-0.02em] text-charcoal dark:text-chalk md:text-[2.9rem]">
                {FOUNDER.name}
              </h2>
              <p className="mt-6 max-w-xl text-[1.08rem] leading-relaxed text-slate-olive dark:text-muted-foreground">{FOUNDER.bio}</p>
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Areas of focus">
                {FOUNDER.knowsAbout.map((k) => (
                  <li key={k} className="rounded-full border border-border px-3 py-1 text-[0.82rem] text-charcoal dark:text-chalk">
                    {k}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-[0.98rem] font-medium">
                <a href={FOUNDER.linkedin} className="inline-flex items-center gap-2 text-sage-ink underline decoration-gold/60 underline-offset-4 hover:text-sage">
                  <Linkedin className="h-4 w-4" aria-hidden="true" /> LinkedIn
                </a>
                <a href={FOUNDER.url} className="text-sage-ink underline decoration-gold/60 underline-offset-4 hover:text-sage">
                  jeselcura.me
                </a>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {leadership.length > 0 && (
        <Section className="border-t border-border py-24 md:py-32">
          <Container>
            <SectionHeader eyebrow="Leadership" title="Who runs your engagement" />
            <MemberGrid members={leadership} />
          </Container>
        </Section>
      )}

      {talent.length > 0 && (
        <Section className="bg-cloud py-24 dark:bg-card md:py-32">
          <Container>
            <SectionHeader
              eyebrow="Our Talent"
              title="Dedicated professionals in the Philippines"
              description="A few of the people who support SageStone clients day to day."
            />
            <MemberGrid members={talent} />
          </Container>
        </Section>
      )}

      {/* ---------- How talent works with you ---------- */}
      <Section className="border-t border-border py-24 md:py-32">
        <Container>
          <SectionHeader eyebrow="How We Work" title="What every SageStone teammate brings" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {standards.map((s) => (
              <div key={s.title} className="rounded-3xl border border-border bg-card p-8">
                <h3 className="text-[1.3rem] leading-tight text-charcoal dark:text-chalk">{s.title}</h3>
                <p className="mt-3 text-[1rem] leading-relaxed text-slate-olive dark:text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="relative overflow-hidden bg-pine py-24 text-chalk md:py-32">
        <NoiseOverlay />
        <Container className="relative z-10">
          <Eyebrow className="mb-6 text-chalk/60">Meeting your teammate</Eyebrow>
          <h2 className="max-w-2xl text-[2.15rem] leading-[1.08] tracking-[-0.02em] text-chalk md:text-[3rem]">
            From first call to a dedicated teammate.
          </h2>
          <div className="mt-14 md:mt-20">
            <ProcessList steps={processSteps} />
          </div>
        </Container>
      </Section>

      <CTABand title="Meet the right teammate for your work." />
    </>
  );
}

function MemberGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((m) => (
        <article key={m.name} className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card">
          {m.photo ? (
            <ImageWithFallback src={m.photo} alt={`${m.name}, ${m.role}`} width={800} height={1000} loading="lazy" className="aspect-[4/5] w-full object-cover object-top" />
          ) : (
            <div className="flex aspect-[4/5] w-full items-center justify-center bg-sage/10 text-[3rem] text-sage-ink" style={serif} aria-hidden="true">
              {m.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join("")}
            </div>
          )}
          <div className="flex flex-1 flex-col p-7">
            <h3 className="text-[1.35rem] leading-tight text-charcoal dark:text-chalk">{m.name}</h3>
            <p className="mt-1 text-[0.82rem] uppercase tracking-[0.16em] text-gold-ink">
              {m.role}
              {m.years ? ` · ${m.years} yrs experience` : ""}
            </p>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-slate-olive dark:text-muted-foreground">{m.bio}</p>
            {m.skills && m.skills.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${m.name}'s tools and skills`}>
                {m.skills.map((s) => (
                  <li key={s} className="rounded-full border border-border px-3 py-1 text-[0.8rem] text-charcoal dark:text-chalk">{s}</li>
                ))}
              </ul>
            )}
            {m.linkedin && (
              <a href={m.linkedin} className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.95rem] font-medium text-sage-ink hover:text-sage">
                <Linkedin className="h-4 w-4" aria-hidden="true" /> LinkedIn
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
