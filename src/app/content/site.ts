import {
  Headset,
  Workflow,
  Briefcase,
  ClipboardList,
  UserCog,
  Settings2,
  type LucideIcon,
} from "lucide-react";

/* ---------- Imagery (local founder portrait + Unsplash: calm, natural light) ---------- */
export const images = {
  heroFounder: "/founder-hero.webp",
  officeGlass:
    "https://images.unsplash.com/photo-1765371514743-45bd8e6c0a28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  woodenDesk:
    "https://images.unsplash.com/photo-1772475385509-93fd87a2d4ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  deskShelves:
    "https://images.unsplash.com/photo-1772475385458-21163e41f4ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  officeArt:
    "https://images.unsplash.com/photo-1765371513276-a74f1ecbcf7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  laptopPlant:
    "https://images.unsplash.com/photo-1497215641119-bbe6d71ebaae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  deskChair:
    "https://images.unsplash.com/photo-1511362328651-90cc517fbe31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
};

/* ---------- Services ---------- */
export type Service = {
  slug: string;
  icon: LucideIcon;
  title: string;
  summary: string;
  outcome: string;
  /** Keyword-led H1 for the service page. */
  h1: string;
  /** <title>, under 60 chars. */
  seoTitle: string;
  /** Meta description, under 155 chars. */
  metaDescription: string;
  /** Related industry and solution slugs, for internal linking. */
  industries: string[];
  solutions: string[];
};

export const services: Service[] = [
  {
    slug: "virtual-assistant-services",
    icon: Briefcase,
    title: "Virtual Assistant Services",
    summary:
      "Dependable day-to-day support that keeps your calendar, inbox, and priorities in order.",
    outcome: "Reclaim focus for the work only you can do.",
    h1: "Virtual Assistant Services for Founders and Growing Teams",
    seoTitle: "Virtual Assistant Services for Growing Teams | SageStone",
    metaDescription:
      "Dedicated virtual assistants who manage your inbox, calendar, research, and admin inside your tools, with SageStone oversight for consistent quality.",
    industries: ["agencies", "professional-services", "real-estate"],
    solutions: ["inbox-calendar-management", "administrative-support", "crm-administration"],
  },
  {
    slug: "customer-support-outsourcing",
    icon: Headset,
    title: "Customer Support Outsourcing",
    summary:
      "Consistent, on-brand responses across every channel your customers rely on.",
    outcome: "Faster resolution, steadier satisfaction.",
    h1: "Customer Support Outsourcing for Growing Businesses",
    seoTitle: "Customer Support Outsourcing Services | SageStone",
    metaDescription:
      "Outsourced customer support across email, chat, and help desk: on-brand replies, clear escalation paths, and quality oversight from SageStone.",
    industries: ["ecommerce", "saas", "service-businesses"],
    solutions: ["shopify-customer-support", "customer-onboarding-support", "sop-documentation"],
  },
  {
    slug: "workflow-support",
    icon: Workflow,
    title: "Workflow Support",
    summary:
      "Structured operational help that removes bottlenecks and keeps processes moving.",
    outcome: "Cleaner handoffs, fewer dropped tasks.",
    h1: "Workflow Support That Keeps Operations Moving",
    seoTitle: "Workflow Support & Process Coordination | SageStone",
    metaDescription:
      "Structured workflow support that removes bottlenecks: task coordination, clean handoffs, documentation, and follow-through inside your tools.",
    industries: ["agencies", "service-businesses", "professional-services"],
    solutions: ["sop-documentation", "crm-administration", "administrative-support"],
  },
  {
    slug: "back-office-support",
    icon: ClipboardList,
    title: "Back Office Support",
    summary:
      "Reliable data, documentation, and administrative work handled with precision.",
    outcome: "Accurate records without the overhead.",
    h1: "Back Office Support Handled with Precision",
    seoTitle: "Back Office Support Outsourcing | SageStone",
    metaDescription:
      "Outsourced back office support for data entry, records, documentation, and admin, handled accurately and consistently with SageStone oversight.",
    industries: ["real-estate", "ecommerce", "professional-services"],
    solutions: ["administrative-support", "crm-administration", "sop-documentation"],
  },
  {
    slug: "executive-assistant-services",
    icon: UserCog,
    title: "Executive Assistance",
    summary:
      "Discreet, senior-level support for leaders who need leverage, not oversight.",
    outcome: "A trusted right hand for the details.",
    h1: "Executive Assistant Services for Busy Leaders",
    seoTitle: "Remote Executive Assistant Services | SageStone",
    metaDescription:
      "Discreet remote executive assistants who manage calendars, inboxes, travel, and meeting prep so leaders can focus on high-leverage work.",
    industries: ["saas", "agencies", "professional-services"],
    solutions: ["inbox-calendar-management", "administrative-support", "crm-administration"],
  },
  {
    slug: "remote-operations-support",
    icon: Settings2,
    title: "Remote Operations Support",
    summary:
      "Embedded operators who help your systems run smoothly as you scale.",
    outcome: "Operational excellence, built in.",
    h1: "Remote Operations Support for Scaling Teams",
    seoTitle: "Remote Operations Support Services | SageStone",
    metaDescription:
      "Embedded remote operators who run recurring processes, keep systems tidy, and document how work gets done so your business scales calmly.",
    industries: ["ecommerce", "saas", "service-businesses"],
    solutions: ["sop-documentation", "customer-onboarding-support", "crm-administration"],
  },
];

/* ---------- Per-service detail content ---------- */
export type ServiceDetail = {
  intro: string;
  image: string;
  capabilities: { title: string; body: string }[];
  useCases: string[];
  outcomes: { value: string; label: string }[];
  faqs: { question: string; answer: string }[];
};

export const serviceDetails: Record<string, ServiceDetail> = {
  "virtual-assistant-services": {
    intro:
      "A SageStone virtual assistant is a dependable, embedded partner — handling the day-to-day so you can stay focused on the work that moves your business forward.",
    image: images.laptopPlant,
    capabilities: [
      { title: "Calendar & inbox", body: "Scheduling, triage, and follow-up handled with care and discretion." },
      { title: "Coordination", body: "Meeting prep, travel, and cross-team logistics kept moving." },
      { title: "Research & docs", body: "Structured research, reporting, and documentation you can rely on." },
      { title: "Personal operations", body: "The recurring tasks that quietly consume your week." },
    ],
    useCases: [
      "Founders reclaiming time for high-leverage work",
      "Small teams without dedicated administrative support",
      "Leaders who need a trusted right hand",
    ],
    outcomes: [
      { value: "1:1", label: "Dedicated matching" },
      { value: "24–72h", label: "Onboarding window" },
      { value: "Your tools", label: "No new software to adopt" },
    ],
    faqs: faqPlaceholders("virtual assistant"),
  },
  "customer-support-outsourcing": {
    intro:
      "SageStone customer support brings steady, thoughtful responses to every channel your customers rely on — protecting satisfaction as your volume grows.",
    image: images.officeArt,
    capabilities: [
      { title: "Email & chat", body: "Timely, documented responses that reflect your tone." },
      { title: "Help desk", body: "Ticket triage, tagging, and resolution within your systems." },
      { title: "Escalation flow", body: "Clear paths so complex issues reach the right person." },
      { title: "Knowledge base", body: "Maintained documentation that keeps answers consistent." },
    ],
    useCases: [
      "E-commerce brands managing seasonal spikes",
      "SaaS teams protecting response times",
      "Growing companies scaling support without losing quality",
    ],
    outcomes: [
      { value: "Dedicated", label: "Support person or pod" },
      { value: "Documented", label: "Macros and escalation paths" },
      { value: "24–72h", label: "Onboarding window" },
    ],
    faqs: faqPlaceholders("customer support"),
  },
  "workflow-support": {
    intro:
      "We map how work actually moves through your business, then place structured support where handoffs break down — so processes stay smooth and predictable.",
    image: images.deskChair,
    capabilities: [
      { title: "Process mapping", body: "Clear visibility into where work slows or stalls." },
      { title: "Task ownership", body: "Defined responsibility so nothing falls through the cracks." },
      { title: "Data & CRM hygiene", body: "Accurate records that keep teams aligned." },
      { title: "Reporting cadence", body: "Reliable status and reporting on a steady rhythm." },
    ],
    useCases: [
      "Teams outgrowing manual coordination",
      "Operations leaders reducing handoff friction",
      "Businesses standardizing repeatable processes",
    ],
    outcomes: [
      { value: "Mapped", label: "Process before placement" },
      { value: "Named", label: "Owner for every handoff" },
      { value: "Documented", label: "SOPs from day one" },
    ],
    faqs: faqPlaceholders("workflow support"),
  },
  "back-office-support": {
    intro:
      "Reliable administrative, data, and documentation work — quietly kept accurate so your team can operate without the overhead.",
    image: images.deskShelves,
    capabilities: [
      { title: "Data entry", body: "Accurate, consistent records across your systems." },
      { title: "Documentation", body: "Organized, up-to-date documentation and filing." },
      { title: "Invoicing support", body: "Structured billing and reconciliation assistance." },
      { title: "Reporting", body: "Clean, dependable reports on schedule." },
    ],
    useCases: [
      "Firms reducing administrative overhead",
      "Teams needing accurate, ongoing records",
      "Businesses standardizing back-office work",
    ],
    outcomes: [
      { value: "Checked", label: "Review steps on data work" },
      { value: "24–72h", label: "Onboarding window" },
      { value: "1:1", label: "Dedicated support" },
    ],
    faqs: faqPlaceholders("back office support"),
  },
  "executive-assistant-services": {
    intro:
      "Discreet, senior-level support that anticipates needs and handles detail — giving leaders room to focus on what matters most.",
    image: images.woodenDesk,
    capabilities: [
      { title: "Executive scheduling", body: "Complex calendars managed with judgment." },
      { title: "Communications", body: "Drafting, triage, and follow-up on your behalf." },
      { title: "Project support", body: "Keeping initiatives organized and on track." },
      { title: "Confidential work", body: "Sensitive tasks handled with discretion." },
    ],
    useCases: [
      "CEOs and COOs needing a trusted right hand",
      "Leaders managing multiple priorities",
      "Executives protecting focus and time",
    ],
    outcomes: [
      { value: "Senior", label: "Talent tier" },
      { value: "Discreet", label: "Confidentiality as standard" },
      { value: "1:1", label: "Dedicated matching" },
    ],
    faqs: faqPlaceholders("executive assistance"),
  },
  "remote-operations-support": {
    intro:
      "Embedded operators who help your systems run smoothly — bringing structure and steadiness to operations as your business grows.",
    image: images.officeGlass,
    capabilities: [
      { title: "Systems support", body: "Keeping your tools and workflows running cleanly." },
      { title: "Coordination", body: "Cross-functional coordination that reduces friction." },
      { title: "Process building", body: "Documenting and refining how work gets done." },
      { title: "Scaling support", body: "Adjusting capacity as your needs evolve." },
    ],
    useCases: [
      "Scaling businesses building operational maturity",
      "Founder-led teams formalizing process",
      "Operations leaders extending capacity",
    ],
    outcomes: [
      { value: "6", label: "Support disciplines" },
      { value: "Flexible", label: "Capacity model" },
      { value: "Embedded", label: "Engagement style" },
    ],
    faqs: faqPlaceholders("remote operations support"),
  },
};

function faqPlaceholders(name: string) {
  return [
    {
      question: `How quickly can ${name} be set up?`,
      answer:
        "Most engagements begin onboarding within 24 to 72 hours of our discovery conversation, depending on scope and fit.",
    },
    {
      question: "Do we get a dedicated person or a rotating pool?",
      answer:
        "You're matched with dedicated talent whose skills and working style fit your team, with SageStone oversight to maintain consistency.",
    },
    {
      question: "Can we scale support up or down?",
      answer:
        "Yes. Our model is built for growth, so you can adjust hours or expand across disciplines as your priorities shift.",
    },
  ];
}

/* ---------- Process ---------- */
export const processSteps = [
  {
    number: "01",
    title: "Discovery",
    description:
      "We start with a focused conversation about your goals, workflows, and the support that would move things forward.",
  },
  {
    number: "02",
    title: "Matching",
    description:
      "We match you with vetted talent whose skills and temperament fit the way your team actually works.",
  },
  {
    number: "03",
    title: "Onboarding",
    description:
      "We embed your support into your tools and rhythms with clear documentation and expectations.",
  },
  {
    number: "04",
    title: "Ongoing Support",
    description:
      "You get dependable, structured help — with oversight from SageStone so quality stays consistent.",
  },
];

/* ---------- Stats ---------- */
export const stats = [
  { value: "24–72h", label: "Onboarding window after discovery" },
  { value: "1:1", label: "Dedicated matching, not a rotating pool" },
  { value: "6", label: "Core support disciplines" },
  { value: "PH", label: "Dedicated talent based in the Philippines" },
];

/* ---------- Testimonials ----------
 * Real client quotes only: name, role and company as the client approved them.
 * Sections that show testimonials are hidden while this list is empty.
 * (The earlier placeholder quotes were removed: they were not from real clients.) */
export type Testimonial = { quote: string; name: string; role: string; url?: string };
export const testimonials: Testimonial[] = [];

/* ---------- Case studies ---------- */
export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  headline: string;
  challenge: string;
  solution: string;
  outcome: string;
  /** Omit to render a branded placeholder tile. */
  image?: string;
  /** Route of the full write-up, when one exists. */
  to?: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "kuha",
    client: "Kuha",
    industry: "Event Tech · Product Launch",
    headline: "Launching Kuha, a QR event photo platform",
    challenge:
      "A new consumer app launching in a price-sensitive market, with no marketing team and global competitors.",
    solution:
      "We built the go-to-market strategy, content operations, AI publishing workflow, SEO foundation, and sales materials.",
    outcome: "500+ events powered and 50,000+ guest photos collected.",
    image: "/case-studies/kuha/kuha-live-slideshow.webp",
    to: "/case-studies/kuha",
  },
];

/* ---------- FAQ ---------- */
export const faqs = [
  {
    category: "Getting Started",
    question: "How quickly can we get support in place?",
    answer:
      "Most engagements begin onboarding within 24 to 72 hours of our discovery conversation, depending on the scope and the fit we're matching for.",
  },
  {
    category: "Getting Started",
    question: "What does the matching process look like?",
    answer:
      "We match you with vetted talent based on your workflows, tools, and working style — not just a skills checklist. You review and approve the fit before we begin.",
  },
  {
    category: "Working Together",
    question: "How is quality maintained over time?",
    answer:
      "Every engagement includes oversight from SageStone. We monitor consistency, provide structure, and adjust as your needs evolve so the support stays dependable.",
  },
  {
    category: "Working Together",
    question: "Can support scale up or down as we grow?",
    answer:
      "Yes. Our model is built for growth-focused businesses, so you can expand support across disciplines or adjust hours as your priorities shift.",
  },
  {
    category: "Working Together",
    question: "Which tools and systems do you work within?",
    answer:
      "We embed into the tools you already use — from project management and CRMs to help desks and communication platforms — rather than asking you to change your stack.",
  },
  {
    category: "Getting Started",
    question: "Where is my assistant based?",
    answer:
      "In the Philippines. SageStone connects U.S. companies with dedicated Filipino talent, chosen for strong English, professionalism and experience supporting remote teams.",
  },
  {
    category: "Getting Started",
    question: "What should I prepare for the discovery call?",
    answer:
      "Nothing formal. A rough list of the tasks that eat your week, the tools you use, and how many hours of help you think you need is plenty. We'll shape the rest together.",
  },
  {
    category: "Working Together",
    question: "Who manages my assistant day to day?",
    answer:
      "You direct the work, inside your own tools. SageStone handles matching, documents your processes during onboarding, and stays involved afterwards to keep quality consistent.",
  },
  {
    category: "Working Together",
    question: "Can we start with a few tasks and add more later?",
    answer:
      "Yes. Most teams start with the work that's slowing them down most, then add hours, tasks or roles once the first engagement is running smoothly.",
  },
  {
    category: "Working Together",
    question: "I'm already a client. How do I get help?",
    answer:
      "Email hello@sagestoneinc.com with \"Client support\" in the subject line, or call +1 (214) 945-2234. We reply within one business day.",
  },
  {
    category: "Trust & Security",
    question: "How do you handle confidentiality and data?",
    answer:
      "Confidentiality is standard. We work within your access controls and follow clear documentation and security practices to protect sensitive information.",
  },
];
