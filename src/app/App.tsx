import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { MotionConfig } from "motion/react";
import { Analytics } from "@vercel/analytics/react";
import { Layout, LandingLayout } from "./components/layout/Layout";
import { Home } from "./pages/Home";

// Home stays eager (the landing route → best LCP). The rest split into
// their own chunks and load on navigation.
const About = lazy(() => import("./pages/About").then((m) => ({ default: m.About })));
const Services = lazy(() => import("./pages/Services").then((m) => ({ default: m.Services })));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail").then((m) => ({ default: m.ServiceDetail })));
const WhyPhilippines = lazy(() => import("./pages/WhyPhilippines").then((m) => ({ default: m.WhyPhilippines })));
const Industries = lazy(() => import("./pages/Industries").then((m) => ({ default: m.Industries })));
const IndustryDetail = lazy(() => import("./pages/IndustryDetail").then((m) => ({ default: m.IndustryDetail })));
const Solutions = lazy(() => import("./pages/Solutions").then((m) => ({ default: m.Solutions })));
const SolutionDetail = lazy(() => import("./pages/SolutionDetail").then((m) => ({ default: m.SolutionDetail })));
const HowItWorks = lazy(() => import("./pages/HowItWorks").then((m) => ({ default: m.HowItWorks })));
const Blog = lazy(() => import("./pages/Blog").then((m) => ({ default: m.Blog })));
const BlogPost = lazy(() => import("./pages/BlogPost").then((m) => ({ default: m.BlogPost })));
const CaseStudies = lazy(() => import("./pages/CaseStudies").then((m) => ({ default: m.CaseStudies })));
const KuhaCaseStudy = lazy(() => import("./pages/KuhaCaseStudy").then((m) => ({ default: m.KuhaCaseStudy })));
const FAQ = lazy(() => import("./pages/FAQ").then((m) => ({ default: m.FAQ })));
const Contact = lazy(() => import("./pages/Contact").then((m) => ({ default: m.Contact })));
const Privacy = lazy(() => import("./pages/Privacy").then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/Terms").then((m) => ({ default: m.Terms })));
const SmsTerms = Terms;
const Pricing = lazy(() => import("./pages/Pricing").then((m) => ({ default: m.Pricing })));
const ThankYou = lazy(() => import("./pages/ThankYou").then((m) => ({ default: m.ThankYou })));
const Landing = lazy(() => import("./pages/Landing").then((m) => ({ default: m.Landing })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));

// Router-agnostic app tree: wrapped in BrowserRouter on the client (below)
// and in StaticRouter by the prerender step (src/entry-server.tsx).
export function AppRoutes() {
  return (
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/why-philippines" element={<WhyPhilippines />} />
          <Route path="/industries" element={<Industries />} />
          <Route path="/industries/:slug" element={<IndustryDetail />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/solutions/:slug" element={<SolutionDetail />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/kuha" element={<KuhaCaseStudy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact/thank-you" element={<ThankYou />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/sms-terms" element={<SmsTerms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<LandingLayout />}>
          <Route path="/lp/:slug" element={<Landing />} />
        </Route>
      </Routes>
      <Analytics />
    </MotionConfig>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
