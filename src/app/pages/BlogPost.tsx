import { lazy, Suspense, useCallback, type ComponentType, type LazyExoticComponent, type MouseEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowRight } from "lucide-react";
import { loadPostBody } from "virtual:blog";
import { Container, Section, Eyebrow, Button } from "../components/ui-brand/primitives";
import { CTABand, Breadcrumbs, RelatedLinks } from "../components/ui-brand/components";
import { postBySlug, relatedPosts, formatPostDate } from "../content/blog";
import { serviceLinks } from "../content/links";
import { FOUNDER } from "../content/founder";
import { NotFound } from "./NotFound";
import { PlaybookSignup } from "../components/growth/PlaybookSignup";

/* Post bodies are separate chunks (see scripts/blog/plugin.ts). One lazy
 * component per slug, cached so re-renders don't re-suspend. The prerender
 * waits for it, and hydration keeps the server HTML until the chunk loads. */
const bodies = new Map<string, LazyExoticComponent<ComponentType>>();
function PostBody({ slug }: { slug: string }) {
  let Body = bodies.get(slug);
  if (!Body) {
    Body = lazy(async () => {
      const mod = await loadPostBody(slug);
      const html = mod?.default.html ?? "";
      return { default: () => <div className="blog-prose" dangerouslySetInnerHTML={{ __html: html }} /> };
    });
    bodies.set(slug, Body);
  }
  return <Body />;
}

export function BlogPost() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const post = postBySlug(slug);

  // Route internal links inside the Markdown body without a full page load.
  const onBodyClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      const a = (e.target as HTMLElement).closest("a");
      const href = a?.getAttribute("href");
      if (!a || !href?.startsWith("/") || a.target || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      navigate(href);
    },
    [navigate],
  );

  if (!post) return <NotFound />;
  const isFounder = post.author === FOUNDER.name;

  return (
    <>
      <article>
        <Section className="pt-40 pb-10 md:pt-48 md:pb-14">
          <Container>
            <Breadcrumbs items={[{ name: "Blog", to: "/blog" }, { name: post.title }]} />
            <div className="mx-auto max-w-3xl">
              <Eyebrow className="mb-7">{post.category}</Eyebrow>
              <h1 className="text-[2.3rem] leading-[1.06] tracking-[-0.025em] text-charcoal dark:text-chalk md:text-[3.2rem]">
                {post.title}
              </h1>
              <p className="mt-6 text-[1.2rem] leading-relaxed text-slate-olive dark:text-muted-foreground">{post.description}</p>
              <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-6 text-[0.92rem] text-slate-olive dark:text-muted-foreground">
                <span>
                  By{" "}
                  {isFounder ? (
                    <a href={FOUNDER.url} className="text-sage-ink underline decoration-gold/60 underline-offset-4 hover:text-sage">
                      {post.author}
                    </a>
                  ) : (
                    post.author
                  )}
                </span>
                <span aria-hidden="true">·</span>
                <time dateTime={post.date}>{formatPostDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingMinutes} min read</span>
              </p>
            </div>
          </Container>
        </Section>

        {post.image && (
          <Container>
            <img
              src={post.image}
              alt={post.imageAlt ?? ""}
              width={1200}
              height={630}
              {...({ fetchpriority: "high" } as Record<string, string>)}
              className="mx-auto aspect-[1200/630] w-full max-w-4xl rounded-2xl border border-border object-cover"
            />
          </Container>
        )}

        <Section className="pt-6 pb-20 md:pb-24">
          <Container>
            <div className="mx-auto max-w-3xl" onClick={onBodyClick}>
              <Suspense fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>
                <PostBody slug={post.slug} />
              </Suspense>
            </div>

            <div className="mx-auto mt-16 max-w-3xl">
              <PlaybookSignup variant="card" />
            </div>

            {isFounder && (
              <aside className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-card p-7 md:p-9">
                <p className="text-[0.72rem] uppercase tracking-[0.2em] text-gold-ink">About the author</p>
                <p className="mt-3 text-[1.3rem] text-charcoal dark:text-chalk" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                  {FOUNDER.name}
                </p>
                <p className="mt-3 text-[1rem] leading-relaxed text-slate-olive dark:text-muted-foreground">{FOUNDER.bio}</p>
                <a
                  href={FOUNDER.url}
                  className="mt-5 inline-flex items-center gap-1.5 font-medium text-sage-ink hover:text-sage"
                >
                  More from Jesel at jeselcura.me <ArrowRight className="h-4 w-4" />
                </a>
              </aside>
            )}
          </Container>
        </Section>
      </article>

      <Section className="border-t border-border py-24 md:py-32">
        <Container className="flex flex-col gap-20">
          <RelatedLinks eyebrow="Services" title="How SageStone can help" items={serviceLinks(post.services)} columns={post.services.length > 2 ? 3 : 2} />
          <RelatedLinks
            eyebrow="Keep Reading"
            title="More from the blog"
            items={relatedPosts(post).map((p) => ({ to: `/blog/${p.slug}`, title: p.title, body: p.description }))}
          />
          <div>
            <Button to="/blog" variant="secondary">
              All articles
            </Button>
          </div>
        </Container>
      </Section>

      <CTABand />
    </>
  );
}
