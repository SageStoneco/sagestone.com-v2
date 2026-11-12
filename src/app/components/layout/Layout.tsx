import { Suspense, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { RouteHead } from "./RouteHead";
import { loadTagManager, track } from "../../lib/analytics";
import { captureAttribution } from "../../lib/attribution";
import { loadChat } from "../../lib/chat";

export function Layout() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);


  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteEffects />
      <Header dark={dark} onToggleDark={() => setDark((v) => !v)} />
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

/** Head tags, tag manager, lead-source capture, chat, scroll reset and page views.
 * Shared by the main layout and the paid landing pages. */
export function SiteEffects() {
  const location = useLocation();

  useEffect(() => {
    captureAttribution();
    loadTagManager();
    loadChat();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    track("page_view", { page_path: location.pathname, page_title: document.title });
  }, [location.pathname]);

  return <RouteHead />;
}

/** Bare shell for /lp/* pages: no header navigation or footer columns. */
export function LandingLayout() {
  return (
    <>
      <SiteEffects />
      <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
        <Outlet />
      </Suspense>
    </>
  );
}
