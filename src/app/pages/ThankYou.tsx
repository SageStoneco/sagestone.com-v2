import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { CalendarCheck, Check } from "lucide-react";
import { Container, Section, Eyebrow, Button } from "../components/ui-brand/primitives";
import { BOOKING_URL } from "../lib/env";
import { track } from "../lib/analytics";

/* /contact/thank-you — where the contact form lands after a successful send.
 * A real URL (noindex) so ad platforms can use it as a conversion goal, and the
 * place the visitor books their call straight away when VITE_BOOKING_URL is set. */
export function ThankYou() {
  const { state } = useLocation() as { state?: { firstName?: string } };
  const firstName = state?.firstName && /^[\p{L}'’-]{1,40}$/u.test(state.firstName) ? state.firstName : "";
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <Section className="pt-40 pb-28 md:pt-48">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sage/15 text-sage">
            <Check className="h-8 w-8" aria-hidden="true" />
          </span>
          <Eyebrow className="mt-8 justify-center">Inquiry received</Eyebrow>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="mt-5 text-[2.6rem] leading-[1.02] tracking-[-0.03em] text-charcoal outline-none dark:text-chalk md:text-[3.5rem]"
          >
            {firstName ? `Thank you, ${firstName}.` : "Thank you."}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[1.1rem] leading-relaxed text-slate-olive dark:text-muted-foreground">
            {BOOKING_URL
              ? "We've emailed you a confirmation. Pick a time below and your discovery call is booked. It takes less than a minute."
              : "We've emailed you a confirmation. We'll be in touch within one business day to arrange your discovery call."}
          </p>
          {BOOKING_URL && (
            <Button
              href={BOOKING_URL}
              size="lg"
              className="mt-9"
              onClick={() => track("book_call_click", { location: "thank_you" })}
            >
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              Choose a time
            </Button>
          )}
        </div>

        {BOOKING_URL && (
          <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-3xl border border-border bg-card">
            <iframe
              src={BOOKING_URL}
              title="Book your SageStone discovery call"
              loading="lazy"
              className="h-[720px] w-full"
            />
          </div>
        )}

        <div className="mx-auto mt-14 flex max-w-xl flex-col items-center gap-3 text-center text-[0.95rem] text-slate-olive dark:text-muted-foreground">
          <p>While you wait, see how an engagement runs from the first call to ongoing support.</p>
          <Button to="/how-it-works" variant="secondary">See how it works</Button>
        </div>
      </Container>
    </Section>
  );
}
