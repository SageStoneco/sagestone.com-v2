import { Check } from "lucide-react";
import { Container, Section, Eyebrow } from "../components/ui-brand/primitives";
import { Breadcrumbs, FAQAccordion } from "../components/ui-brand/components";
import { PlaybookSignup } from "../components/growth/PlaybookSignup";

const inside = [
  { title: "50 tasks you can hand off", body: "Grouped into inbox and calendar, customer support, CRM and sales admin, back office, and operations." },
  { title: "An hours worksheet", body: "Tick what you'd delegate, estimate the time, and see whether you need a few hours of help, a part-time assistant, or a full-time teammate." },
  { title: "A four-week onboarding plan", body: "What to prepare before day one, then context, supervised ownership and independence, week by week." },
  { title: "What to keep for yourself", body: "The decisions and relationships that should stay with you, and how to tell when a task is ready to hand over." },
];

const faqs = [
  { question: "Is it really free?", answer: "Yes. Enter your first name and email and we'll send you the PDF straight away. There's no call required." },
  { question: "Will I be added to a mailing list?", answer: "Only if you tick the box for our five short emails on delegating well. Otherwise we just send you the playbook." },
  { question: "Who is it for?", answer: "Founders and operators of small and growing teams who know they're doing too much themselves and want a clear place to start." },
];

export function DelegationPlaybook() {
  return (
    <>
      <Section className="pt-40 pb-20 md:pt-48 md:pb-28">
        <Container>
          <Breadcrumbs items={[{ name: "Delegation Playbook" }]} />
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div>
              <Eyebrow className="mb-7">Free guide for founders</Eyebrow>
              <h1 className="text-[2.7rem] leading-[1.0] tracking-[-0.03em] text-charcoal dark:text-chalk md:text-[4rem]">
                The Delegation Playbook
              </h1>
              <p className="mt-6 max-w-xl text-[1.15rem] leading-relaxed text-slate-olive dark:text-muted-foreground">
                Find the work you should stop doing, see how many hours it adds up to, and hand it over properly in the first
                week. Eight pages, about thirty minutes.
              </p>
              <ul className="mt-10 flex flex-col gap-5">
                {inside.map((i) => (
                  <li key={i.title} className="grid grid-cols-[auto_1fr] gap-4">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sage/15 text-sage">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[1.05rem] font-medium text-charcoal dark:text-chalk">{i.title}</span>
                      <span className="mt-1 block text-[0.98rem] leading-relaxed text-slate-olive dark:text-muted-foreground">{i.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-8">
              <img
                src="/downloads/delegation-playbook-cover.webp"
                alt="Cover of The Delegation Playbook by SageStone"
                width={612}
                height={792}
                className="mx-auto w-full max-w-[17rem] -rotate-2 rounded-xl border border-border shadow-[0_30px_60px_-30px_rgba(23,27,24,0.55)] lg:max-w-[19rem]"
              />
              <PlaybookSignup variant="panel" />
            </div>
          </div>
        </Container>
      </Section>
      <Section className="border-t border-border py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-3xl">
            <FAQAccordion items={faqs} />
          </div>
        </Container>
      </Section>
    </>
  );
}
