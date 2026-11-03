/* Paid-traffic landing pages (/lp/:slug). noindex, logo-only header, one CTA.
 * Keep each headline matched to the ad group that points at it. */

export type LandingPage = {
  slug: string;
  serviceSlug: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  title: string;
  description: string;
  tasks: string[];
};

export const landingPages: LandingPage[] = [
  {
    slug: "hire-a-virtual-assistant",
    serviceSlug: "virtual-assistant-services",
    eyebrow: "Dedicated virtual assistants",
    headline: "Hire a dedicated virtual assistant from the Philippines.",
    subhead:
      "One vetted assistant, matched to your tools and working style, onboarded within 24–72 hours of your discovery call, with SageStone oversight so quality holds.",
    title: "Hire a Dedicated Virtual Assistant | SageStone",
    description:
      "A dedicated Filipino virtual assistant for your inbox, calendar and admin. Matched to how you work, onboarded in 24–72 hours. Book a discovery call.",
    tasks: [
      "Inbox triage and follow-ups",
      "Calendar and meeting coordination",
      "Research, reports and documents",
      "CRM updates and data hygiene",
      "Travel and logistics",
      "Recurring admin that fills your week",
    ],
  },
  {
    slug: "customer-support-outsourcing",
    serviceSlug: "customer-support-outsourcing",
    eyebrow: "Customer support outsourcing",
    headline: "Dedicated customer support that sounds like your brand.",
    subhead:
      "Email, chat and help-desk support from dedicated Filipino talent, trained on your tone and tools, with documented escalation paths and SageStone oversight.",
    title: "Outsourced Customer Support Team | SageStone",
    description:
      "Dedicated Filipino support talent for email, chat and help desk. On-brand replies, clear escalation, onboarded in 24–72 hours. Book a discovery call.",
    tasks: [
      "Email and chat replies in your tone",
      "Help-desk triage and tagging",
      "Order, refund and return questions",
      "Escalations routed to the right person",
      "Macros and knowledge-base upkeep",
      "Peak-season coverage",
    ],
  },
];
