import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { isLoggedIn, setLoggedIn, useStore, KEYS } from "@/lib/store";
import { Icon } from "@/components/icons";
import { Brand } from "@/components/site/Navbar";
import { toast } from "@/components/ui";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — New Prestige Corporation LLP" },
      { name: "description", content: "Manage the New Prestige Corporation LLP website." },
      { property: "og:title", content: "Admin Dashboard — New Prestige Corporation LLP" },
      { property: "og:description", content: "Admin area for New Prestige Corporation LLP." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: "dashboard" },
  { to: "/admin/products", label: "Products", icon: "box" },
  { to: "/admin/categories", label: "Categories", icon: "tag" },
  { to: "/admin/gallery", label: "Gallery", icon: "image" },
  { to: "/admin/content", label: "Website Content", icon: "file" },
  { to: "/admin/enquiries", label: "Enquiries", icon: "inbox" },
  { to: "/admin/settings", label: "Settings", icon: "settings" },
] as const;

function AdminLayout() {
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const admin = useStore<any>(KEYS.admin);
  const newCount = useStore<any[]>(KEYS.enquiries).filter((e) => e.status === "New").length;

  useEffect(() => {
    if (!isLoggedIn()) nav({ to: "/admin/login" });
    else setReady(true);
  }, [nav]);
  useEffect(() => setOpen(false), [path]);

  const logout = () => { setLoggedIn(false); toast("You have been logged out", "info"); nav({ to: "/admin/login" }); };
  if (!ready) return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">Checking sign-in…</div>;

  return (
    <div className="min-h-screen bg-surface">
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-navy transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[72px] items-center justify-between px-5">
          <Link to="/admin"><Brand /></Link>
          <button className="text-navy-foreground lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu"><Icon name="close" /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {LINKS.map((l) => {
            const active = l.to === "/admin" ? path === "/admin" || path === "/admin/" : path.startsWith(l.to);
            return (
              <Link key={l.to} to={l.to} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${active ? "bg-accent text-accent-foreground" : "text-navy-foreground/70 hover:bg-navy-foreground/10 hover:text-navy-foreground"}`}>
                <Icon name={l.icon} className="h-5 w-5" />{l.label}
                {l.label === "Enquiries" && newCount > 0 && <span className="ml-auto rounded-full bg-navy-foreground px-2 text-xs font-bold text-primary">{newCount}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-navy-foreground/10 p-3">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-navy-foreground/70 hover:bg-navy-foreground/10"><Icon name="external" className="h-5 w-5" />View website</Link>
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-navy-foreground/70 hover:bg-navy-foreground/10"><Icon name="logout" className="h-5 w-5" />Logout</button>
        </div>
      </aside>
      {open && <div className="fixed inset-0 z-40 bg-navy-deep/60 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between gap-4 border-b bg-card/95 px-4 backdrop-blur md:px-8">
          <button className="rounded-lg p-2 text-primary lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Icon name="menu" /></button>
          <p className="hidden text-sm text-muted-foreground sm:block">Demo admin panel · data saved in this browser</p>
          <div className="flex items-center gap-3">
            <div className="text-right"><p className="text-sm font-semibold text-primary">{admin.name}</p><p className="text-xs text-muted-foreground">{admin.email}</p></div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display font-bold text-accent">{admin.name?.[0] ?? "A"}</span>
          </div>
        </header>
        <main className="animate-fade-in p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
