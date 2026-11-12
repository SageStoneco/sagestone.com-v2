import { LifeBuoy, Mail, Phone } from "lucide-react";
import { Container, Section, Eyebrow } from "../components/ui-brand/primitives";
import { ContactForm } from "../components/growth/ContactForm";
import { GuaranteeNote } from "../components/growth/PricingCards";

export function Contact() {
  return (
    <Section className="pt-40 pb-28 md:pt-48">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Left: intro + details */}
          <div>
            <Eyebrow className="mb-7">Book a Call</Eyebrow>
            <h1 className="text-[2.9rem] leading-[1.0] tracking-[-0.03em] text-charcoal dark:text-chalk md:text-[4rem]">
              Let's talk about the support you need.
            </h1>
            <p className="mt-6 max-w-md text-[1.1rem] leading-relaxed text-slate-olive dark:text-muted-foreground">
              Share a little about your business, then pick a time for a focused
              discovery call. No pressure, no scripts — just a clear conversation
              about how SageStone can help.
            </p>

            <div className="mt-10 flex flex-col divide-y divide-border border-t border-border">
              {[
                { label: "Response time", text: "Within one business day." },
                { label: "Discovery call", text: "A focused 30-minute conversation." },
                { label: "Confidentiality", text: "Your details are kept private." },
              ].map((item) => (
                <div key={item.label} className="grid grid-cols-[10rem_1fr] items-baseline gap-4 py-5">
                  <span className="text-[0.72rem] uppercase tracking-[0.18em] text-slate-olive dark:text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="text-[1rem] text-charcoal dark:text-chalk">{item.text}</span>
                </div>
              ))}
            </div>

            <GuaranteeNote className="mt-8" />

            <div className="mt-10 flex flex-col gap-3 border-t border-border pt-8 text-[0.98rem] text-slate-olive dark:text-muted-foreground">
              <a href="mailto:hello@sagestoneinc.com" className="flex items-center gap-3 transition-colors hover:text-sage">
                <Mail className="h-4 w-4 text-sage" /> hello@sagestoneinc.com
              </a>
              <a href="tel:+12149452234" className="flex items-center gap-3 transition-colors hover:text-sage">
                <Phone className="h-4 w-4 text-sage" /> +1 (214) 945-2234
              </a>
            </div>

            <div id="existing-clients" className="mt-10 rounded-2xl border border-border bg-card p-6">
              <p className="flex items-center gap-2 text-[0.98rem] font-medium text-charcoal dark:text-chalk">
                <LifeBuoy className="h-4 w-4 text-sage" aria-hidden="true" /> Already a SageStone client?
              </p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-slate-olive dark:text-muted-foreground">
                For help with an existing engagement, a change in scope, or anything about your
                assistant, email{" "}
                <a href="mailto:hello@sagestoneinc.com?subject=Client%20support" className="text-sage-ink underline decoration-sage/40 underline-offset-4">
                  hello@sagestoneinc.com
                </a>{" "}
                with "Client support" in the subject. We reply within one business day.
              </p>
            </div>
          </div>

          {/* Right: form */}
          <ContactForm />
        </div>
      </Container>
    </Section>
  );
}
