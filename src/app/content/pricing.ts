/* ---------- Pricing ----------
 * Engagement models shown on /pricing, the homepage preview and the ad
 * landing pages.
 *
 * TO PUBLISH PRICES: set `fromPrice` (e.g. "$1,400") and `unit` (e.g. "/month")
 * on each model. While `fromPrice` is null the card says "Quote after your
 * discovery call" instead, so nothing invented ever shows.
 *
 * TO PUBLISH A GUARANTEE: set `guarantee` to the exact policy wording, e.g.
 * "If the fit isn't right in the first 30 days, we rematch at no cost."
 * Leave it null until the policy is agreed; nothing renders while it's null.
 */

export type PricingModel = {
  id: string;
  name: string;
  summary: string;
  bestFor: string;
  fromPrice: string | null;
  unit: string;
  highlights: string[];
};

export const pricingModels: PricingModel[] = [
  {
    id: "part-time",
    name: "Part-time dedicated",
    summary: "One dedicated assistant for a set block of hours each week.",
    bestFor: "Founders and small teams handing off inbox, calendar, admin or a first support queue.",
    fromPrice: null,
    unit: "/month",
    highlights: ["One dedicated person, not a rotating pool", "Works inside your existing tools", "Hours adjust as priorities shift"],
  },
  {
    id: "full-time",
    name: "Full-time dedicated",
    summary: "A full-time teammate embedded in your workflows and rhythms.",
    bestFor: "Teams with daily support volume, an executive who needs leverage, or ongoing operations work.",
    fromPrice: null,
    unit: "/month",
    highlights: ["Full working week, dedicated to your team", "Owns recurring workflows end to end", "Documented processes from day one"],
  },
  {
    id: "team",
    name: "Support team",
    summary: "Two or more people across disciplines, coordinated by SageStone.",
    bestFor: "Growing companies covering support, operations and back-office work at once.",
    fromPrice: null,
    unit: "/month",
    highlights: ["Mix of roles across six disciplines", "Shared documentation and escalation paths", "Add coverage or roles as you grow"],
  },
];

/** Included in every engagement. Each line restates something the site already commits to. */
export const pricingIncludes = [
  "Matching to your workflows, tools and working style",
  "You review and approve the fit before work begins",
  "Onboarding that documents how your work is done",
  "Ongoing SageStone oversight for consistent quality",
  "Scale hours or add roles as priorities change",
];

export const guarantee: string | null = null;

export const pricingFaqs = [
  {
    question: "How much does SageStone cost?",
    answer:
      "It depends on the role, the hours you need and the scope of work. After a short discovery call we send a written quote, and nothing starts until you approve it.",
  },
  {
    question: "What affects the price?",
    answer:
      "Mainly the number of hours, the type of work (for example executive assistance versus data entry), and whether you need one person or a small team.",
  },
  {
    question: "Can I start small and add more later?",
    answer:
      "Yes. Many teams start with the work that's slowing them down most, then add hours or roles once the first engagement is running smoothly.",
  },
];
