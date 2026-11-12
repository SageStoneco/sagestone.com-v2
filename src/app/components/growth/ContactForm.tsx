import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  submitContact,
  validateContact,
  ContactConfigError,
  ContactSendError,
  FIELD_ORDER,
  MESSAGE_MAX,
  HOURS_OPTIONS,
  TIMELINE_OPTIONS,
  type ContactErrors,
} from "../../lib/contact";
import { Button } from "../ui-brand/primitives";
import { services } from "../../content/site";
import { track } from "../../lib/analytics";

/** The discovery-call form: used on /contact and the paid landing pages. */
export function ContactForm({ defaultService = "" }: { defaultService?: string } = {}) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    // Landing pages pass a service slug; the select stores the service title.
    service: services.find((x) => x.slug === defaultService)?.title ?? "",
    hours: "",
    timeline: "",
    message: "",
    // Optional. Never required to submit — SMS consent cannot be a condition
    // of contacting us (A2P 10DLC / TCPA).
    smsConsent: false,
    // Honeypot — hidden from real users.
    website: "",
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ContactErrors>({});
  // Errors appear after the first submit attempt, then update as the visitor types.
  const [showErrors, setShowErrors] = useState(false);

  const setAndRevalidate = (next: typeof form) => {
    setForm(next);
    if (showErrors) setErrors(validateContact(next));
  };
  const update = (key: string, value: string) => setAndRevalidate({ ...form, [key]: value });
  const updateSmsConsent = (value: boolean) => setAndRevalidate({ ...form, smsConsent: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;

    const found = validateContact(form);
    setErrors(found);
    setShowErrors(true);
    const first = FIELD_ORDER.find((k) => found[k]);
    if (first) {
      setError(null);
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    setSending(true);
    setError(null);

    try {
      const { eventId } = await submitContact(form);
      // The conversion event GTM forwards to GA4 / Google Ads / Meta / LinkedIn.
      // event_id matches the server-side Meta Conversions API event for deduplication.
      track("generate_lead", { event_id: eventId, form: "contact", service: form.service, hours: form.hours || undefined, timeline: form.timeline || undefined });
      navigate("/contact/thank-you", { state: { firstName: form.name.trim().split(/\s+/)[0] } });
    } catch (err) {
      const serverFields = err instanceof ContactSendError ? err.fields : {};
      const firstInvalid = FIELD_ORDER.find((k) => serverFields[k]);
      if (firstInvalid) {
        // The server's checks disagreed with the browser's; show its reasons.
        setErrors(serverFields);
        setError(null);
        document.getElementById(`contact-${firstInvalid}`)?.focus();
        return;
      }
      setError(
        err instanceof ContactConfigError
          ? "This form isn't connected yet. Please email hello@sagestoneinc.com and we'll pick it up right away."
          : "Something went wrong sending your message. Please try again, or email hello@sagestoneinc.com."
      );
    } finally {
      setSending(false);
    }
  };

  // Accessible wiring for a validated field: id for focus, error text linked
  // for screen readers, and a red border while it's invalid.
  const fieldProps = (key: keyof ContactErrors) => ({
    id: `contact-${key}`,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `contact-${key}-error` : undefined,
    className: errors[key]
      ? inputBase
          .replace("border-border", "border-destructive")
          .replace("focus:border-sage", "focus:border-destructive")
          .replace("focus:ring-sage/20", "focus:ring-destructive/20")
      : inputBase,
  });

  const inputBase =
    "w-full rounded-xl border border-border bg-input-background px-4 py-3 text-[0.98rem] text-charcoal placeholder:text-slate-olive/60 transition-colors focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20 dark:text-chalk dark:placeholder:text-muted-foreground";

  return (
          <div className="rounded-3xl border border-border bg-card p-8 shadow-[0_18px_40px_-28px_rgba(34,38,34,0.4)] md:p-10">
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <p className="text-[0.82rem] text-slate-olive dark:text-muted-foreground">
                  All fields are required unless marked optional.
                </p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" error={errors.name} errorId="contact-name-error">
                    <input {...fieldProps("name")} required aria-required="true" name="name" autoComplete="name" maxLength={100} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Jane Doe" />
                  </Field>
                  <Field label="Work email" error={errors.email} errorId="contact-email-error">
                    <input {...fieldProps("email")} required aria-required="true" type="email" name="email" autoComplete="email" inputMode="email" maxLength={254} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="jane@company.com" />
                  </Field>
                </div>
                <Field label="Company" optional>
                  <input name="organization" autoComplete="organization" maxLength={120} value={form.company} onChange={(e) => update("company", e.target.value)} className={inputBase} placeholder="Company name" />
                </Field>
                <Field label="Mobile phone" optional={!form.smsConsent} error={errors.phone} errorId="contact-phone-error">
                  <input {...fieldProps("phone")} required={form.smsConsent} type="tel" name="phone" autoComplete="tel" inputMode="tel" maxLength={25} value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 (555) 000-0000" />
                </Field>
                <Field label="What do you need support with?" error={errors.service} errorId="contact-service-error">
                  <select {...fieldProps("service")} required aria-required="true" name="service" value={form.service} onChange={(e) => update("service", e.target.value)} className={`${fieldProps("service").className} ${form.service === "" ? "text-slate-olive/70 dark:text-muted-foreground" : ""}`}>
                    <option value="">Select a service</option>
                    {services.map((s) => (
                      <option key={s.slug} value={s.title}>{s.title}</option>
                    ))}
                    <option value="Not sure yet">Not sure yet</option>
                  </select>
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Hours needed" optional>
                    <select id="contact-hours" name="hours" value={form.hours} onChange={(e) => update("hours", e.target.value)} className={`${inputBase} ${form.hours === "" ? "text-slate-olive/70 dark:text-muted-foreground" : ""}`}>
                      <option value="">Select</option>
                      {HOURS_OPTIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Start date" optional>
                    <select id="contact-timeline" name="timeline" value={form.timeline} onChange={(e) => update("timeline", e.target.value)} className={`${inputBase} ${form.timeline === "" ? "text-slate-olive/70 dark:text-muted-foreground" : ""}`}>
                      <option value="">Select</option>
                      {TIMELINE_OPTIONS.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Tell us a little more" error={errors.message} errorId="contact-message-error">
                  <textarea {...fieldProps("message")} required aria-required="true" rows={4} name="message" maxLength={MESSAGE_MAX} value={form.message} onChange={(e) => update("message", e.target.value)} className={`${fieldProps("message").className} resize-none`} placeholder="A sentence or two about your business and what you're hoping to solve." />
                </Field>
                <div className="mt-1 flex items-start gap-3 rounded-xl border border-border bg-input-background/60 p-4">
                  <input
                    id="sms-consent"
                    name="smsConsent"
                    type="checkbox"
                    checked={form.smsConsent}
                    onChange={(e) => updateSmsConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-sage focus:outline-none focus-visible:ring-2 focus-visible:ring-sage/40"
                  />
                  <label
                    htmlFor="sms-consent"
                    className="cursor-pointer text-[0.85rem] font-normal leading-relaxed text-slate-olive dark:text-muted-foreground"
                  >
                    I agree to receive SMS/text messages from Sage Stone (SageStone Inc.) at the mobile number I provided about my inquiry, scheduling, service updates, and customer support. Message frequency varies. Message and data rates may apply. Reply STOP to opt out and HELP for help. Consent is not a condition of purchase. See our {" "}
                    <Link
                      to="/privacy"
                      className="text-sage-ink underline decoration-sage/40 underline-offset-4 transition-colors hover:text-sage dark:text-sage dark:hover:text-sage-deep"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and {" "}
                    <Link
                      to="/sms-terms"
                      className="text-sage-ink underline decoration-sage/40 underline-offset-4 transition-colors hover:text-sage dark:text-sage dark:hover:text-sage-deep"
                    >
                      SMS Terms & Conditions
                    </Link>
                    .
                  </label>
                </div>
                {/* Honeypot: hidden from real users to reduce spam submissions. */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />
                {error && (
                  <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-[0.9rem] leading-relaxed text-destructive">
                    {error}
                  </p>
                )}
                <Button type="submit" size="lg" className="mt-2 w-full" disabled={sending}>
                  {sending ? "Sending…" : "Book a Discovery Call"}
                </Button>
                <p className="text-center text-[0.82rem] text-slate-olive dark:text-muted-foreground">
                  By submitting, you agree to be contacted about your inquiry. Consent to text messages is optional and is not a condition of any purchase.
                </p>
              </form>
          </div>
  );
}

function Field({
  label,
  optional = false,
  error,
  errorId,
  children,
}: {
  label: string;
  optional?: boolean;
  error?: string;
  errorId?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[0.9rem] font-medium text-charcoal dark:text-chalk">
        {label}
        {optional && (
          <span className="ml-1.5 font-normal text-slate-olive dark:text-muted-foreground">
            (optional)
          </span>
        )}
      </span>
      {children}
      {error && (
        <span id={errorId} className="text-[0.85rem] leading-snug text-destructive">
          {error}
        </span>
      )}
    </label>
  );
}
