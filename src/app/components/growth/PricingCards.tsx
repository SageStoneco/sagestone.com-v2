import { Check, ShieldCheck } from "lucide-react";
import { Button } from "../ui-brand/primitives";
import { pricingModels, pricingIncludes, guarantee } from "../../content/pricing";

/** The three engagement models. Shows a "from" price only when one is configured. */
export function PricingCards({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-6 lg:grid-cols-3">
        {pricingModels.map((m, i) => (
          <article
            key={m.id}
            className={`flex flex-col rounded-3xl border bg-card p-8 ${
              i === 1 ? "border-sage shadow-[0_24px_50px_-32px_rgba(89,99,79,0.6)]" : "border-border"
            }`}
          >
            <h3 className="text-[1.45rem] leading-tight text-charcoal dark:text-chalk">{m.name}</h3>
            <p className="mt-3 text-[1rem] leading-relaxed text-slate-olive dark:text-muted-foreground">{m.summary}</p>
            <div className="mt-6 border-t border-border pt-6">
              {m.fromPrice ? (
                <p className="flex items-baseline gap-1.5 text-charcoal dark:text-chalk">
                  <span className="text-[0.85rem] text-slate-olive dark:text-muted-foreground">From</span>
                  <span className="text-[2.2rem] leading-none" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                    {m.fromPrice}
                  </span>
                  <span className="text-[0.95rem] text-slate-olive dark:text-muted-foreground">{m.unit}</span>
                </p>
              ) : (
                <p className="text-[1.05rem] font-medium text-charcoal dark:text-chalk">Quote after your discovery call</p>
              )}
            </div>
            {!compact && (
              <>
                <ul className="mt-6 flex flex-col gap-3">
                  {m.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-[0.98rem] text-charcoal dark:text-chalk">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-sage" aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[0.9rem] leading-relaxed text-slate-olive dark:text-muted-foreground">
                  <span className="font-medium text-charcoal dark:text-chalk">Best for: </span>
                  {m.bestFor}
                </p>
              </>
            )}
            <div className="mt-auto pt-8">
              <Button to="/contact" variant={i === 1 ? "primary" : "secondary"} className="w-full">
                Book a Discovery Call
              </Button>
            </div>
          </article>
        ))}
      </div>

      {!compact && (
        <div className="grid gap-8 rounded-3xl border border-border bg-cloud p-8 dark:bg-card md:grid-cols-[0.8fr_1.2fr] md:p-10">
          <h3 className="text-[1.45rem] leading-tight text-charcoal dark:text-chalk">Included in every engagement</h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {pricingIncludes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[0.98rem] text-charcoal dark:text-chalk">
                <Check className="mt-1 h-4 w-4 shrink-0 text-sage" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {guarantee && <GuaranteeNote />}
    </div>
  );
}

export function GuaranteeNote({ className = "" }: { className?: string }) {
  if (!guarantee) return null;
  return (
    <p className={`flex items-start gap-3 text-[0.98rem] leading-relaxed text-charcoal dark:text-chalk ${className}`}>
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sage" aria-hidden="true" />
      {guarantee}
    </p>
  );
}
