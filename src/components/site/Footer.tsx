import { Link } from "@tanstack/react-router";
import { useStore, KEYS } from "@/lib/store";
import { Icon } from "../icons";
import { Brand, NAV } from "./Navbar";

export function Footer() {
  const content = useStore<any>(KEYS.content);
  const cats = useStore<any[]>(KEYS.categories).filter((c) => c.status === "active");
  const f = content.footer, c = content.contact;
  return (
    <footer className="bg-navy-deep text-navy-foreground">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <Brand />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-foreground/65">{f.description}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">Quick Links</h4>
          <ul className="mt-5 space-y-2.5 text-sm">
            {NAV.map((n) => <li key={n.id}><Link to={n.to} className="text-navy-foreground/70 transition hover:text-accent">{n.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">Product Categories</h4>
          <ul className="mt-5 space-y-2.5 text-sm">
            {cats.map((x) => <li key={x.id}><Link to="/products" search={{ category: x.id }} className="text-navy-foreground/70 transition hover:text-accent">{x.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">Contact</h4>
          <ul className="mt-5 space-y-4 text-sm text-navy-foreground/70">
            <li className="flex gap-3"><Icon name="pin" className="h-5 w-5 shrink-0 text-accent" />{c.address}</li>
            <li className="flex gap-3"><Icon name="mail" className="h-5 w-5 shrink-0 text-accent" /><a href={`mailto:${c.email}`} className="break-all hover:text-accent">{c.email}</a></li>
          </ul>
          <Link to="/admin/login" className="btn btn-glass btn-sm mt-6"><Icon name="settings" className="h-4 w-4" />Admin Login</Link>
        </div>
      </div>
      <div className="border-t border-navy-foreground/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-center text-xs text-navy-foreground/60 md:flex-row md:text-left">
          <p>{f.copyright}</p>
          <p className="font-medium text-navy-foreground/85">{f.credit}</p>
        </div>
      </div>
    </footer>
  );
}
