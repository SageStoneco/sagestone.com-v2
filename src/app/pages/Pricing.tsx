import { Container, Section, SectionHeader } from "../components/ui-brand/primitives";
import { PageHero, CTABand, FAQAccordion } from "../components/ui-brand/components";
import { PricingCards } from "../components/growth/PricingCards";
import { pricingFaqs } from "../content/pricing";

export function Pricing() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Simple engagement models, quoted plainly."
        description="Choose how much support you need. Every engagement includes matching, documented onboarding and ongoing SageStone oversight, and you approve a written quote before anything starts."
        breadcrumbs={[{ name: "Pricing" }]}
      />
      <Section className="pb-24 md:pb-32">
        <Container>
          <PricingCards />
        </Container>
      </Section>
      <Section className="border-t border-border py-24 md:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeader eyebrow="Pricing questions" title="What shapes your quote" />
            <FAQAccordion items={pricingFaqs} />
          </div>
        </Container>
      </Section>
      <CTABand title="Get a quote in one conversation." description="Tell us what's slowing you down. We'll recommend an engagement model and send a written quote after the call." />
    </>
  );
}
