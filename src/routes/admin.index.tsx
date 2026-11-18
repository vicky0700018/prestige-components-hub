import { adminHead } from "@/lib/page-meta";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, KEYS, formatDate } from "@/lib/store";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui";
import { PageHeader, Panel, Empty } from "@/components/admin/kit";
import { statusTone } from "./admin.enquiries";

export const Route = createFileRoute("/admin/")({ head: () => adminHead("Dashboard Overview"), component: Dashboard });

function Dashboard() {
  const products = useStore<any[]>(KEYS.products);
  const cats = useStore<any[]>(KEYS.categories);
  const gallery = useStore<any[]>(KEYS.gallery);
  const enq = useStore<any[]>(KEYS.enquiries);
  const act = useStore<any[]>(KEYS.activity);
  const isCat = (p: any, word: string) => (cats.find((c) => c.id === p.categoryId)?.name ?? "").toLowerCase().includes(word);
  const stats = [
    { label: "Total Products", value: products.length, icon: "box" },
    { label: "Electrical Products", value: products.filter((p) => isCat(p, "electrical")).length, icon: "bolt" },
    { label: "Kitchen Products", value: products.filter((p) => isCat(p, "kitchen")).length, icon: "kitchen" },
    { label: "Total Categories", value: cats.length, icon: "tag" },
    { label: "Gallery Images", value: gallery.length, icon: "image" },
    { label: "Total Enquiries", value: enq.length, icon: "inbox" },
  ];
  const max = Math.max(1, ...cats.map((c) => products.filter((p) => p.categoryId === c.id).length));

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" text="An overview of your website content and enquiries." action={
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/products" className="btn btn-accent btn-sm"><Icon name="plus" className="h-4 w-4" />Add Product</Link>
          <Link to="/admin/gallery" className="btn btn-outline btn-sm"><Icon name="image" className="h-4 w-4" />Manage Gallery</Link>
          <Link to="/admin/content" className="btn btn-outline btn-sm"><Icon name="file" className="h-4 w-4" />Edit Content</Link>
        </div>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s, i) => (
          <Panel key={s.label} className="flex items-center gap-5 p-6">
            <span className={`flex h-14 w-14 items-center justify-center rounded-xl ${i % 2 ? "bg-accent/10 text-accent" : "bg-primary text-accent"}`}><Icon name={s.icon} className="h-6 w-6" /></span>
            <div><p className="text-sm text-muted-foreground">{s.label}</p><p className="font-display text-3xl font-bold text-primary">{s.value}</p></div>
          </Panel>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Panel>
          <div className="flex items-center justify-between border-b px-6 py-4"><h2 className="font-semibold text-primary">Recent Enquiries</h2><Link to="/admin/enquiries" className="text-sm font-semibold text-secondary hover:text-accent">View all</Link></div>
          {enq.length === 0 ? <Empty text="No enquiries yet." /> : (
            <ul className="divide-y">
              {enq.slice(0, 5).map((e) => (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                  <div className="min-w-0"><p className="font-medium text-foreground">{e.name}</p><p className="truncate text-sm text-muted-foreground">{e.subject} · {formatDate(e.date)}</p></div>
                  <Badge tone={statusTone(e.status)}>{e.status}</Badge>
                </li>
              ))}
            </ul>)}
        </Panel>
        <Panel>
          <div className="border-b px-6 py-4"><h2 className="font-semibold text-primary">Recent Activity</h2></div>
          <ul className="max-h-80 space-y-4 overflow-y-auto p-6">
            {act.slice(0, 10).map((a) => (
              <li key={a.id} className="flex gap-3 text-sm"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" /><div><p className="text-foreground">{a.text}</p><p className="text-xs text-muted-foreground">{formatDate(a.date)}</p></div></li>
            ))}
          </ul>
        </Panel>
      </div>
      <Panel className="p-6">
        <h2 className="font-semibold text-primary">Product Category Overview</h2>
        <div className="mt-6 space-y-5">
          {cats.map((c) => {
            const n = products.filter((p) => p.categoryId === c.id).length;
            return (
              <div key={c.id}>
                <div className="flex justify-between text-sm"><span className="font-medium">{c.name}</span><span className="text-muted-foreground">{n} products</span></div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-accent transition-all" style={{ width: `${(n / max) * 100}%` }} /></div>
              </div>);
          })}
        </div>
      </Panel>
    </div>
  );
}
