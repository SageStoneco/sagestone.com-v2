import { Link } from "react-router";
import type { ReactNode } from "react";

/* ---------- Container ---------- */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1200px] px-6 md:px-10 ${className}`}>
      {children}
    </div>
  );
}

/* ---------- Section ---------- */
export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      {children}
    </section>
  );
}

/* ---------- Eyebrow label ---------- */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[0.24em] text-slate-olive dark:text-muted-foreground ${className}`}
    >
      <span className="h-px w-6 bg-gold" aria-hidden="true" />
      {children}
    </span>
  );
}

/* ---------- Section header ---------- */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col ${
        align === "center" ? "items-center text-center mx-auto max-w-2xl" : "max-w-2xl"
      } ${className}`}
    >
      {eyebrow && <Eyebrow className="mb-6">{eyebrow}</Eyebrow>}
      <h2 className="text-[2.15rem] leading-[1.08] tracking-[-0.02em] md:text-[3rem] text-charcoal dark:text-chalk">
        {title}
      </h2>
      {description && (
        <p className="mt-6 text-[1.1rem] leading-relaxed text-slate-olive dark:text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

/* ---------- Button ---------- */
type ButtonProps = {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50";

const buttonVariants: Record<string, string> = {
  primary:
    "bg-sage-ink text-cloud hover:bg-charcoal shadow-sm hover:shadow-md dark:text-pine dark:hover:bg-chalk",
  secondary:
    "border border-charcoal/20 text-charcoal hover:bg-charcoal hover:text-cloud dark:border-chalk/25 dark:text-chalk dark:hover:bg-chalk dark:hover:text-pine",
  ghost:
    "text-charcoal hover:text-sage dark:text-chalk dark:hover:text-sage",
};

const buttonSizes: Record<string, string> = {
  md: "px-5 py-2.5 text-[0.95rem]",
  lg: "px-7 py-3.5 text-[1rem]",
};

export function Button({
  children,
  to,
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled = false,
}: ButtonProps) {
  const classes = `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`;
  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

/* ---------- Card ---------- */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-card p-7 shadow-[0_1px_2px_rgba(34,38,34,0.04),0_8px_24px_-16px_rgba(34,38,34,0.15)] ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- Divider ---------- */
export function Divider({ className = "" }: { className?: string }) {
  return <div className={`h-px w-full bg-border ${className}`} />;
}
