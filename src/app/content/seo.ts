import { posts } from "virtual:blog";
import { services, serviceDetails, faqs } from "./site";
import { industryPages } from "./industries";
import { solutionPages } from "./solutions";
import { FOUNDER } from "./founder";
import { pricingFaqs } from "./pricing";
import { landingPages } from "./landing";

/* ---------- Per-route <head> metadata ----------
 * Single source of truth for titles, descriptions, canonicals, social tags,
 * JSON-LD, and the sitemap. Used in three places:
 *   - <RouteHead /> updates document.head on client-side navigation
 *   - scripts/prerender.mjs bakes the same tags into each route's static HTML
 *   - scripts/prerender.mjs writes sitemap.xml from this list
 * Keep titles under 60 chars and descriptions under 155 (the build checks).
 */

export const SITE_URL = "https://www.sagestoneinc.com";
export const ORG_ID = `${SITE_URL}/#organization`;
export const DEFAULT_OG_IMAGE = "/og-default.png";

type JsonLdNode = Record<string, unknown>;

export type RouteMeta = {
  path: string;
  title: string;
  description: string;
  /** Absolute or root-relative image for og:image / twitter:image. */
  image?: string;
  ogType?: "website" | "article";
  /** Page-specific schema.org nodes, emitted together as one @graph. */
  jsonLd?: JsonLdNode[];
  /** Trail for BreadcrumbList, excluding Home (added automatically). */
  breadcrumbs?: { name: string; path: string }[];
  /** Sitemap hints. */
  lastmod?: string;
  priority?: number;
  changefreq?: "weekly" | "monthly" | "yearly";
  noindex?: boolean;
};

const url = (path: string) => `${SITE_URL}${path === "/" ? "/" : path}`;
const absolute = (src: string) => (src.startsWith("http") ? src : `${SITE_URL}${src}`);
const clip = (text: string, max = 155) =>
  text.length <= max ? text : `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;

const orgRef = { "@id": ORG_ID };
const founderRef = { "@id": FOUNDER.personId };

const faqPage = (items: { question: string; answer: string }[]): JsonLdNode => ({
  "@type": "FAQPage",
  mainEntity: items.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
});

const serviceNode = (name: string, description: string, path: string, serviceType = name): JsonLdNode => ({
  "@type": "Service",
  "@id": `${url(path)}#service`,
  name,
  serviceType,
  description,
  url: url(path),
  provider: orgRef,
  areaServed: "Worldwide",
});

/* ---------- Kuha case study ---------- */
export const KUHA_URL = "https://www.kuha.app";
export const KUHA_PATH = "/case-studies/kuha";
const KUHA_TITLE = "Case Study: Launching Kuha, a QR Event Photo Platform";
const KUHA_DESCRIPTION =
  "How SageStone built the go-to-market, content, AI publishing, and SEO systems behind Kuha, a QR event photo sharing app in the Philippines.";

const kuhaArticle: JsonLdNode = {
  "@type": "Article",
  headline: KUHA_TITLE,
  description: KUHA_DESCRIPTION,
  url: url(KUHA_PATH),
  mainEntityOfPage: url(KUHA_PATH),
  datePublished: "2026-09-24",
  inLanguage: "en",
  image: `${SITE_URL}/case-studies/kuha/kuha-og.jpg`,
  author: orgRef,
  publisher: orgRef,
  about: { "@type": "SoftwareApplication", name: "Kuha", url: KUHA_URL },
  mentions: [
    {
      "@type": "SoftwareApplication",
      name: "Kuha",
      url: KUHA_URL,
      applicationCategory: "PhotographyApplication",
      operatingSystem: "Web",
      description: "QR code event photo sharing app for weddings, debuts, and celebrations in the Philippines.",
    },
  ],
};

/* ---------- Blog ---------- */
export const BLOG_PATH = "/blog";
export const blogPostPath = (slug: string) => `${BLOG_PATH}/${slug}`;

const blogPostRoutes: RouteMeta[] = posts.map((p) => ({
  path: blogPostPath(p.slug),
  title: p.seoTitle ?? (`${p.title} | SageStone`.length <= 60 ? `${p.title} | SageStone` : clip(p.title, 60)),
  description: clip(p.description),
  ogType: "article",
  image: p.image,
  lastmod: p.updated ?? p.date,
  priority: 0.6,
  breadcrumbs: [
    { name: "Blog", path: BLOG_PATH },
    { name: p.title, path: blogPostPath(p.slug) },
  ],
  jsonLd: [
    {
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      url: url(blogPostPath(p.slug)),
      mainEntityOfPage: url(blogPostPath(p.slug)),
      datePublished: p.date,
      dateModified: p.updated ?? p.date,
      inLanguage: "en",
      articleSection: p.category,
      keywords: p.tags.join(", ") || undefined,
      image: absolute(p.image ?? DEFAULT_OG_IMAGE),
      author: p.author === FOUNDER.name ? founderRef : { "@type": "Person", name: p.author },
      publisher: orgRef,
      isPartOf: { "@id": `${url(BLOG_PATH)}#blog` },
    },
  ],
}));

/* ---------- Routes ---------- */
export const routeMeta: RouteMeta[] = [
  {
    path: "/",
    title: "Virtual Assistants & Remote Operations Support | SageStone",
    description:
      "SageStone provides dedicated virtual assistants, customer support, executive assistance, and remote operations support for growing businesses.",
    priority: 1,
    changefreq: "weekly",
  },
  {
    path: "/about",
    title: "About SageStone | Remote Operations Partner",
    description:
      "SageStone gives growth-focused businesses a dependable operational layer: remote support that is thoughtful, structured, and genuinely embedded.",
    priority: 0.7,
    breadcrumbs: [{ name: "About", path: "/about" }],
    jsonLd: [{ "@type": "AboutPage", url: url("/about"), about: orgRef, mainEntity: founderRef }],
  },
  {
    path: "/services",
    title: "Remote Support & Outsourcing Services | SageStone",
    description:
      "Virtual assistants, customer support, back office, workflow, and executive support, matched to your workflows and overseen for consistency.",
    priority: 0.9,
    breadcrumbs: [{ name: "Services", path: "/services" }],
  },
  ...services.map((s): RouteMeta => {
    const path = `/services/${s.slug}`;
    return {
      path,
      title: s.seoTitle,
      description: s.metaDescription,
      priority: 0.9,
      breadcrumbs: [
        { name: "Services", path: "/services" },
        { name: s.title, path },
      ],
      jsonLd: [serviceNode(s.title, s.metaDescription, path), faqPage(serviceDetails[s.slug]?.faqs ?? [])],
    };
  }),
  {
    path: "/industries",
    title: "Industries We Support | SageStone",
    description:
      "Remote support shaped to your industry: e-commerce, real estate, agencies, professional services, SaaS, and service businesses.",
    priority: 0.8,
    breadcrumbs: [{ name: "Industries", path: "/industries" }],
  },
  ...industryPages.map((i): RouteMeta => {
    const path = `/industries/${i.slug}`;
    return {
      path,
      title: i.seoTitle,
      description: i.metaDescription,
      priority: 0.8,
      breadcrumbs: [
        { name: "Industries", path: "/industries" },
        { name: i.name, path },
      ],
      jsonLd: [
        {
          ...serviceNode(i.h1, i.metaDescription, path, "Virtual assistant and operations support"),
          audience: { "@type": "BusinessAudience", name: i.name },
        },
        faqPage(i.faqs),
      ],
    };
  }),
  {
    path: "/solutions",
    title: "Solutions: What We Take Off Your Plate | SageStone",
    description:
      "Specific jobs SageStone handles for growing teams: Shopify support, CRM admin, inbox and calendar management, onboarding, SOPs, and admin support.",
    priority: 0.8,
    breadcrumbs: [{ name: "Solutions", path: "/solutions" }],
  },
  ...solutionPages.map((s): RouteMeta => {
    const path = `/solutions/${s.slug}`;
    return {
      path,
      title: s.seoTitle,
      description: s.metaDescription,
      priority: 0.8,
      breadcrumbs: [
        { name: "Solutions", path: "/solutions" },
        { name: s.name, path },
      ],
      jsonLd: [serviceNode(s.name, s.metaDescription, path), faqPage(s.faqs)],
    };
  }),
  {
    path: "/how-it-works",
    title: "How It Works: Onboarding in 24–72 Hours | SageStone",
    description:
      "How SageStone engagements work: discovery, matching, onboarding, and ongoing oversight, so dedicated remote support fits into your workflows.",
    priority: 0.7,
    breadcrumbs: [{ name: "How It Works", path: "/how-it-works" }],
  },
  {
    path: "/why-philippines",
    title: "Why Hire Remote Talent in the Philippines | SageStone",
    description:
      "Professionalism, communication, and adaptability: why the Philippines is a strong market for dependable remote support, and how SageStone fits it.",
    priority: 0.6,
    breadcrumbs: [{ name: "Why the Philippines", path: "/why-philippines" }],
  },
  {
    path: "/case-studies",
    title: "Client Results & Case Studies | SageStone",
    description:
      "How SageStone brings structure, systems, and dependable support to growth-focused teams and product launches, and the outcomes that follow.",
    priority: 0.7,
    breadcrumbs: [{ name: "Case Studies", path: "/case-studies" }],
  },
  {
    path: KUHA_PATH,
    title: "Kuha Case Study: Event Photo App Launch | SageStone",
    description: KUHA_DESCRIPTION,
    ogType: "article",
    image: "/case-studies/kuha/kuha-og.jpg",
    lastmod: "2026-09-24",
    priority: 0.7,
    breadcrumbs: [
      { name: "Case Studies", path: "/case-studies" },
      { name: "Kuha", path: KUHA_PATH },
    ],
    jsonLd: [kuhaArticle],
  },
  {
    path: BLOG_PATH,
    title: "Blog: Operations, Support & Delegation | SageStone",
    description:
      "Practical guides on virtual assistants, customer support outsourcing, and remote operations for founders and growing teams.",
    priority: 0.7,
    changefreq: "weekly",
    breadcrumbs: [{ name: "Blog", path: BLOG_PATH }],
    jsonLd: [
      {
        "@type": "Blog",
        "@id": `${url(BLOG_PATH)}#blog`,
        name: "The SageStone Blog",
        url: url(BLOG_PATH),
        publisher: orgRef,
      },
    ],
  },
  ...blogPostRoutes,
  {
    path: "/faq",
    title: "Virtual Assistant & Outsourcing FAQ | SageStone",
    description:
      "Answers about pricing, onboarding, matching, security, and working day to day with SageStone's dedicated remote support talent in the Philippines.",
    priority: 0.6,
    breadcrumbs: [{ name: "FAQ", path: "/faq" }],
    jsonLd: [faqPage([...pricingFaqs, ...faqs])],
  },
  {
    path: "/pricing",
    title: "Pricing & Engagement Models | SageStone",
    description:
      "Part-time, full-time and team engagements with dedicated Filipino support talent. Matching, onboarding and SageStone oversight included in every plan.",
    priority: 0.8,
    breadcrumbs: [{ name: "Pricing", path: "/pricing" }],
    jsonLd: [faqPage(pricingFaqs)],
  },
  {
    path: "/contact/thank-you",
    title: "Thank You | SageStone",
    description: "Your inquiry has been received. Pick a time for your SageStone discovery call.",
    noindex: true,
  },
  ...landingPages.map(
    (l): RouteMeta => ({
      path: `/lp/${l.slug}`,
      title: l.title,
      description: l.description,
      noindex: true,
    })
  ),
  {
    path: "/contact",
    title: "Contact SageStone | Book a Discovery Call",
    description:
      "Tell us about your operations and book a discovery call. Most SageStone engagements begin onboarding within 24–72 hours.",
    priority: 0.8,
    breadcrumbs: [{ name: "Contact", path: "/contact" }],
  },
  {
    path: "/terms",
    title: "Terms of Service | SageStone",
    description:
      "The terms that govern your use of the SageStone website and the support services we provide.",
    priority: 0.3,
    changefreq: "yearly",
  },
];

/** Head for unknown URLs (served as dist/404.html with a real 404 status). */
export const notFoundMeta: RouteMeta = {
  path: "/404",
  title: "Page Not Found | SageStone",
  description: "The page you're looking for may have moved or no longer exists.",
  noindex: true,
};

/** Static pages outside the React app, listed in the sitemap only. */
export const staticSitemapPaths = ["/privacy", "/sms-terms"];

export function getRouteMeta(pathname: string): RouteMeta | undefined {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return routeMeta.find((m) => m.path === normalized);
}

/** The page's JSON-LD graph: its own nodes plus an auto-built BreadcrumbList. */
export function buildJsonLd(meta: RouteMeta): Record<string, unknown> | null {
  const nodes: JsonLdNode[] = [...(meta.jsonLd ?? [])];
  if (meta.breadcrumbs?.length) {
    const trail = [{ name: "Home", path: "/" }, ...meta.breadcrumbs];
    nodes.push({
      "@type": "BreadcrumbList",
      itemListElement: trail.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: url(b.path),
      })),
    });
  }
  return nodes.length ? { "@context": "https://schema.org", "@graph": nodes } : null;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Head tags for a route, as an HTML string (used by the prerender step). */
export function renderHeadTags(meta: RouteMeta): string {
  const canonical = url(meta.path);
  const t = escapeHtml(meta.title);
  const d = escapeHtml(meta.description);
  const image = absolute(meta.image ?? DEFAULT_OG_IMAGE);
  const jsonLd = buildJsonLd(meta);
  const tags = [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    `<meta name="robots" content="${meta.noindex ? "noindex, follow" : "index, follow"}" />`,
    !meta.noindex && `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="${meta.ogType ?? "website"}" />`,
    `<meta property="og:site_name" content="SageStone" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    !meta.noindex && `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    jsonLd &&
      `<script type="application/ld+json" id="route-jsonld">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
  ];
  return tags.filter(Boolean).join("\n      ");
}

/** sitemap.xml for every indexable route plus the static legal pages. */
export function renderSitemap(): string {
  const entries = [
    ...routeMeta.filter((m) => !m.noindex),
    ...staticSitemapPaths.map((path): RouteMeta => ({ path, title: "", description: "", priority: 0.3, changefreq: "yearly" })),
  ];
  const body = entries
    .map((m) =>
      [
        "  <url>",
        `    <loc>${url(m.path)}</loc>`,
        m.lastmod && `    <lastmod>${m.lastmod}</lastmod>`,
        `    <changefreq>${m.changefreq ?? "monthly"}</changefreq>`,
        `    <priority>${(m.priority ?? 0.5).toFixed(1)}</priority>`,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}
