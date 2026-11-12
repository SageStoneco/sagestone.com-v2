import { useState, useEffect } from "react";
import { Link, useLocation, NavLink } from "react-router";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { Logo } from "../brand/Logo";
import { Button, Container } from "../ui-brand/primitives";
import { services } from "../../content/site";

const nav = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services", hasMenu: true },
  { label: "Why Philippines", to: "/why-philippines" },
  { label: "Industries", to: "/industries" },
  { label: "Case Studies", to: "/case-studies" },
  { label: "Blog", to: "/blog" },
  { label: "Pricing", to: "/pricing" },
  { label: "FAQ", to: "/faq" },
];

export function Header({
  dark,
  onToggleDark,
}: {
  dark: boolean;
  onToggleDark: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <Container className="flex h-20 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-0.5 lg:flex xl:gap-1">
          {/* The logo links home, so the desktop nav skips "Home" to save space. */}
          {nav.filter((item) => item.to !== "/").map((item) =>
            item.hasMenu ? (
              <div
                key={item.to}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[0.9rem] transition-colors xl:px-4 xl:text-[0.95rem] ${
                      isActive
                        ? "text-sage-ink"
                        : "text-charcoal hover:text-sage dark:text-chalk"
                    }`
                  }
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </NavLink>
                {servicesOpen && (
                  <div className="absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3">
                    <div className="overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-[0_18px_40px_-24px_rgba(34,38,34,0.45)]">
                      {services.map((s) => (
                        <Link
                          key={s.slug}
                          to={`/services/${s.slug}`}
                          className="block rounded-xl px-4 py-3 text-[0.92rem] text-charcoal transition-colors hover:bg-sage/10 hover:text-sage dark:text-chalk"
                        >
                          {s.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-2.5 py-2 text-[0.9rem] transition-colors xl:px-4 xl:text-[0.95rem] ${
                    isActive
                      ? "text-sage-ink"
                      : "text-charcoal hover:text-sage dark:text-chalk"
                  }`
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme toggle lives in the mobile menu below 640px so the header row
              never overflows a 375–390px phone screen. Wrapped in spans because the
              Button's own inline-flex would override a `hidden` class on it. */}
          <span className="hidden sm:block">
            <ThemeToggle dark={dark} onToggleDark={onToggleDark} />
          </span>
          <span className="hidden sm:block">
            <Button to="/contact" className="whitespace-nowrap">
              Book a Call
            </Button>
          </span>
          <span className="sm:hidden">
            <Button to="/contact" className="whitespace-nowrap px-4">
              Book
            </Button>
          </span>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-charcoal dark:text-chalk lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <Container className="flex flex-col gap-1 py-6">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-[1.05rem] ${
                    isActive ? "bg-sage/10 text-sage-ink" : "text-charcoal dark:text-chalk"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 flex items-center justify-between rounded-xl px-4 py-2 sm:hidden">
              <span className="text-[1.05rem] text-charcoal dark:text-chalk">Theme</span>
              <ThemeToggle dark={dark} onToggleDark={onToggleDark} />
            </div>
            <Button to="/contact" size="lg" className="mt-4">
              Book a Discovery Call
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}

function ThemeToggle({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggleDark}
      aria-label="Toggle dark mode"
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-charcoal transition-colors hover:text-sage dark:text-chalk"
    >
      {dark ? <Sun className="h-[1.15rem] w-[1.15rem]" /> : <Moon className="h-[1.15rem] w-[1.15rem]" />}
    </button>
  );
}
