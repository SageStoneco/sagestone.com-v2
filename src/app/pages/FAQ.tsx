import { useMemo, useState } from "react";
import { Container, Section } from "../components/ui-brand/primitives";
import { FAQAccordion, PageHero, CTABand } from "../components/ui-brand/components";
import { faqs as baseFaqs } from "../content/site";
import { pricingFaqs } from "../content/pricing";

const faqs = [...pricingFaqs.map((f) => ({ ...f, category: "Pricing" })), ...baseFaqs];

export function FAQ() {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(faqs.map((f) => f.category)))],
    []
  );
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? faqs : faqs.filter((f) => f.category === active);

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Clear answers, calmly given."
        description="Everything you might want to know before working with SageStone. Can't find it here? A short call will cover the rest."
      />

      <Section className="pt-6 pb-28 md:pb-40">
        <Container>
          <div className="mb-12 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                className={`rounded-full px-5 py-2.5 text-[0.9rem] transition-colors ${
                  active === c
                    ? "bg-sage-ink text-cloud dark:text-pine"
                    : "border border-border text-charcoal hover:border-sage/40 dark:text-chalk"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="mx-auto max-w-3xl">
            <FAQAccordion key={active} items={filtered} />
          </div>
        </Container>
      </Section>

      <CTABand title="Still have questions? Let's talk." />
    </>
  );
}
