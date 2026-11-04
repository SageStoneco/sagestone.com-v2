import { useId, useRef, useState } from "react";
import { Link } from "react-router";
import { Check, Download } from "lucide-react";
import { Button } from "../ui-brand/primitives";
import { submitPlaybook, validatePlaybook, PlaybookError, PLAYBOOK_PDF, type PlaybookErrors } from "../../lib/playbook";
import { track } from "../../lib/analytics";

/**
 * Email signup for the Delegation Playbook.
 *   variant="card"  – compact box at the end of blog posts
 *   variant="panel" – the form on /delegation-playbook
 */
export function PlaybookSignup({ variant = "card" }: { variant?: "card" | "panel" }) {
  const uid = useId();
  const [form, setForm] = useState({ name: "", email: "", marketingOptIn: false, website: "" });
  const [errors, setErrors] = useState<PlaybookErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const doneRef = useRef<HTMLParagraphElement>(null);

  const set = (patch: Partial<typeof form>) => {
    const next = { ...form, ...patch };
    setForm(next);
    if (showErrors) setErrors(validatePlaybook(next));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const found = validatePlaybook(form);
    setErrors(found);
    setShowErrors(true);
    const first = (["name", "email"] as const).find((k) => found[k]);
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setSending(true);
    setError(null);
    try {
      await submitPlaybook(form);
      track("lead_magnet_signup", { lead_magnet: "delegation_playbook", marketing_opt_in: form.marketingOptIn });
      setDone(true);
      requestAnimationFrame(() => doneRef.current?.focus());
    } catch (err) {
      if (err instanceof PlaybookError && Object.keys(err.fields).length) {
        setErrors(err.fields);
      } else {
        setError(
          err instanceof PlaybookError && err.code === "not_configured"
            ? "Email delivery isn't connected yet. You can download the playbook directly below."
            : "Something went wrong sending the email. You can download the playbook directly below."
        );
        setDone(true);
      }
    } finally {
      setSending(false);
    }
  };

  const input =
    "w-full rounded-xl border bg-input-background px-4 py-3 text-[0.98rem] text-charcoal placeholder:text-slate-olive/60 transition-colors focus:outline-none focus:ring-2 dark:text-chalk dark:placeholder:text-muted-foreground";
  const inputState = (k: "name" | "email") =>
    errors[k] ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-border focus:border-sage focus:ring-sage/20";

  const shell =
    variant === "card"
      ? "rounded-3xl border border-border bg-card p-7 md:p-9"
      : "rounded-3xl border border-border bg-card p-8 shadow-[0_18px_40px_-28px_rgba(34,38,34,0.4)] md:p-10";

  if (done) {
    return (
      <div className={shell} role="status" aria-live="polite">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-sage">
          <Check className="h-6 w-6" aria-hidden="true" />
        </span>
        <p ref={doneRef} tabIndex={-1} className="mt-5 text-[1.4rem] leading-tight text-charcoal outline-none dark:text-chalk" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
          {error ? "Here's your playbook." : "Check your inbox."}
        </p>
        <p className="mt-3 text-[1rem] leading-relaxed text-slate-olive dark:text-muted-foreground">
          {error ?? "We've emailed you the Delegation Playbook. You can also download it right now."}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button href={PLAYBOOK_PDF} onClick={() => track("lead_magnet_download", { lead_magnet: "delegation_playbook" })}>
            <Download className="h-4 w-4" aria-hidden="true" /> Download the PDF
          </Button>
          <Link to="/contact" className="font-medium text-sage-ink hover:text-sage">
            Book a discovery call
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={shell} aria-labelledby={`${uid}-title`}>
      {variant === "card" && (
        <>
          <p className="text-[0.72rem] uppercase tracking-[0.2em] text-gold-ink">Free guide</p>
          <p id={`${uid}-title`} className="mt-3 text-[1.5rem] leading-tight text-charcoal dark:text-chalk" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
            The Delegation Playbook
          </p>
          <p className="mt-3 text-[1rem] leading-relaxed text-slate-olive dark:text-muted-foreground">
            50 tasks founders can hand off, an hours worksheet to size the help you need, and a four-week onboarding plan.
          </p>
        </>
      )}
      {variant === "panel" && (
        <p id={`${uid}-title`} className="text-[1.35rem] leading-tight text-charcoal dark:text-chalk" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
          Get the free playbook
        </p>
      )}

      <div className={`mt-6 grid gap-4 ${variant === "card" ? "sm:grid-cols-2" : ""}`}>
        <label className="flex flex-col gap-2">
          <span className="text-[0.9rem] font-medium text-charcoal dark:text-chalk">First name</span>
          <input id={`${uid}-name`} name="name" autoComplete="given-name" maxLength={100} value={form.name} onChange={(e) => set({ name: e.target.value })} aria-invalid={errors.name ? true : undefined} aria-describedby={errors.name ? `${uid}-name-error` : undefined} className={`${input} ${inputState("name")}`} placeholder="Jane" />
          {errors.name && <span id={`${uid}-name-error`} className="text-[0.85rem] text-destructive">{errors.name}</span>}
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-[0.9rem] font-medium text-charcoal dark:text-chalk">Work email</span>
          <input id={`${uid}-email`} name="email" type="email" inputMode="email" autoComplete="email" maxLength={254} value={form.email} onChange={(e) => set({ email: e.target.value })} aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? `${uid}-email-error` : undefined} className={`${input} ${inputState("email")}`} placeholder="jane@company.com" />
          {errors.email && <span id={`${uid}-email-error`} className="text-[0.85rem] text-destructive">{errors.email}</span>}
        </label>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 text-[0.88rem] leading-relaxed text-slate-olive dark:text-muted-foreground">
        <input type="checkbox" name="marketingOptIn" checked={form.marketingOptIn} onChange={(e) => set({ marketingOptIn: e.target.checked })} className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-sage" />
        <span>Also send me SageStone's five short emails on delegating well. Optional, and you can unsubscribe anytime.</span>
      </label>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={form.website} onChange={(e) => set({ website: e.target.value })} className="absolute left-[-9999px] h-0 w-0 opacity-0" />

      <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto" disabled={sending}>
        {sending ? "Sending…" : "Email me the playbook"}
      </Button>
      <p className="mt-4 text-[0.8rem] text-slate-olive dark:text-muted-foreground">
        We'll email you the PDF. See our <Link to="/privacy" className="underline underline-offset-4">Privacy Policy</Link>.
      </p>
    </form>
  );
}
