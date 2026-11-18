import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Icon, LogoMark } from "../icons";

export const NAV = [
  { id: "home", to: "/", label: "Home" },
  { id: "about", to: "/about", label: "About Us" },
  { id: "products", to: "/products", label: "Products" },
  { id: "categories", to: "/categories", label: "Categories" },
  { id: "why", to: "/why-choose-us", label: "Why Choose Us" },
  { id: "gallery", to: "/gallery", label: "Gallery" },
  { id: "contact", to: "/contact", label: "Contact Us" },
] as const;

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", id === "home" ? "/" : `#${id}`);
}

export function Brand({ light = true }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark />
      <span className="leading-tight">
        <span className={`block font-display text-[15px] font-bold tracking-tight ${light ? "text-navy-foreground" : "text-primary"}`}>NEW PRESTIGE</span>
        <span className={`block text-[10px] font-semibold tracking-[0.28em] ${light ? "text-navy-foreground/60" : "text-muted-foreground"}`}>CORPORATION LLP</span>
      </span>
    </span>
  );
}

export function Navbar() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const active = NAV.find((item) => item.to === path)?.id;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); };
  }, []);

  useEffect(() => setOpen(false), [path]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-navy/95 shadow-lift backdrop-blur" : "bg-navy"}`}>
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <Link to="/" aria-label="Home"><Brand /></Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.id} to={n.to} aria-current={active === n.id ? "page" : undefined}
              className={`relative px-3 py-2 text-[13.5px] font-medium transition-colors ${active === n.id ? "text-navy-foreground" : "text-navy-foreground/65 hover:text-navy-foreground"}`}>
              {n.label}
              <span className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300 ${active === n.id ? "scale-x-100" : "scale-x-0"}`} />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/contact" className="btn btn-accent btn-sm hidden sm:inline-flex">Enquire Now <Icon name="arrow" className="h-4 w-4" /></Link>
          <button className="rounded-lg p-2 text-navy-foreground lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            <Icon name={open ? "close" : "menu"} className="h-6 w-6" />
          </button>
        </div>
      </div>
      {open && (
        <nav className="animate-fade-in border-t border-navy-foreground/10 bg-navy lg:hidden" aria-label="Mobile">
          <div className="container-x flex flex-col py-3">
            {NAV.map((n) => (
              <Link key={n.id} to={n.to} onClick={() => setOpen(false)} aria-current={active === n.id ? "page" : undefined}
                className={`flex items-center justify-between rounded-lg px-3 py-3 text-left text-sm font-medium ${active === n.id ? "bg-navy-foreground/10 text-navy-foreground" : "text-navy-foreground/75"}`}>
                {n.label}{active === n.id && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
              </Link>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="btn btn-accent mt-3">Enquire Now</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
