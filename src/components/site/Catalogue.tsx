import { useEffect, useMemo, useState } from "react";
import { useStore, KEYS, mailtoLink } from "@/lib/store";
import { Icon } from "../icons";
import { Modal, SmartImg } from "../ui";
import { SectionHeading } from "./Sections";

export function enquiryMail(email: string, productName: string, category: string) {
  return mailtoLink(
    email,
    `Product Enquiry: ${productName}`,
    `Hello NEW PRESTIGE CORPORATION LLP,\n\nI would like to enquire about the following product:\n\nProduct: ${productName}\nCategory: ${category}\n\nPlease share more details.\n\nName:\nRequirement:\n\nThank you.`,
  );
}

export function Catalogue({ initialCategory }: { initialCategory?: string }) {
  const products = useStore<any[]>(KEYS.products);
  const categories = useStore<any[]>(KEYS.categories);
  const email = useStore<any>(KEYS.content).contact.email;
  const activeCats = categories.filter((c) => c.status === "active");
  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "Uncategorised";

  const [q, setQ] = useState("");
  const [cat, setCat] = useState(initialCategory ?? "all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [detail, setDetail] = useState<any>(null);
  const [limit, setLimit] = useState(9);

  useEffect(() => {
    setCat(initialCategory ?? "all"); setType("all"); setLimit(9);
  }, [initialCategory]);

  const visible = products.filter((p) => p.active && activeCats.some((c) => c.id === p.categoryId));
  const types = useMemo(() => {
    const src = cat === "all" ? visible : visible.filter((p) => p.categoryId === cat);
    return Array.from(new Set(src.map((p) => p.type))).sort();
  }, [visible, cat]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    let r = visible.filter((p) =>
      (cat === "all" || p.categoryId === cat) &&
      (type === "all" || p.type === type) &&
      (!term || `${p.name} ${p.type} ${p.short}`.toLowerCase().includes(term)));
    r = [...r].sort((a, b) =>
      sort === "az" ? a.name.localeCompare(b.name) :
      sort === "za" ? b.name.localeCompare(a.name) :
      sort === "newest" ? (b.createdAt || "").localeCompare(a.createdAt || "") :
      Number(b.featured) - Number(a.featured));
    return r;
  }, [visible, q, cat, type, sort]);

  const related = detail ? visible.filter((p) => p.categoryId === detail.categoryId && p.id !== detail.id).slice(0, 3) : [];

  return (
    <section id="products" className="bg-background py-24 md:py-32">
      <div className="container-x">
        <SectionHeading eyebrow="Product Catalogue" title="Explore Our Range of Components" text="Search, filter and browse our electrical and kitchen components. Send an enquiry for any product directly by email." />

        <div className="mt-12 rounded-2xl border bg-card p-4 shadow-soft md:p-5">
          <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
            <div className="relative">
              <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => { setQ(e.target.value); setLimit(9); }} placeholder="Search products…" className="field pl-9" aria-label="Search products" />
            </div>
            <select value={cat} onChange={(e) => { setCat(e.target.value); setType("all"); setLimit(9); }} className="field" aria-label="Category">
              <option value="all">All categories</option>
              {activeCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={type} onChange={(e) => { setType(e.target.value); setLimit(9); }} className="field" aria-label="Product type">
              <option value="all">All product types</option>
              {types.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="field" aria-label="Sort">
              <option value="featured">Featured first</option>
              <option value="az">Name A–Z</option>
              <option value="za">Name Z–A</option>
              <option value="newest">Newest</option>
            </select>
            <div className="flex overflow-hidden rounded-lg border">
              {(["grid", "list"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} aria-label={`${v} view`} aria-pressed={view === v}
                  className={`flex flex-1 items-center justify-center px-3 py-2 transition ${view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                  <Icon name={v} className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">Showing <b className="text-foreground">{Math.min(limit, list.length)}</b> of {list.length} products</p>

        {list.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed p-16 text-center">
            <Icon name="search" className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 font-semibold text-primary">No products match your filters</p>
            <button className="btn btn-outline btn-sm mt-4" onClick={() => { setQ(""); setCat("all"); setType("all"); }}>Clear filters</button>
          </div>
        ) : (
          <div className={`mt-6 grid gap-6 ${view === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : ""}`}>
            {list.slice(0, limit).map((p) => (
              <article key={p.id} className={`group overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${view === "list" ? "flex flex-col sm:flex-row" : ""}`}>
                <div className={`relative overflow-hidden bg-muted ${view === "list" ? "aspect-[4/3] sm:aspect-auto sm:w-64 sm:shrink-0" : "aspect-[4/3]"}`}>
                  <SmartImg src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {p.featured && <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold text-accent-foreground"><Icon name="star" className="h-3 w-3" />Featured</span>}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary">{catName(p.categoryId)} · {p.type}</p>
                  <h3 className="mt-2 text-lg font-semibold text-primary">{p.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.short}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button onClick={() => setDetail(p)} className="btn btn-outline btn-sm"><Icon name="eye" className="h-4 w-4" />View Details</button>
                    <a href={enquiryMail(email, p.name, catName(p.categoryId))} className="btn btn-accent btn-sm"><Icon name="mail" className="h-4 w-4" />Enquire Now</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        {list.length > limit && (
          <div className="mt-10 text-center"><button className="btn btn-navy" onClick={() => setLimit(limit + 9)}>Load more products</button></div>
        )}
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title="Product Details" size="lg">
        {detail && (
          <div className="p-6">
            <div className="grid gap-8 md:grid-cols-2">
              <SmartImg src={detail.image} alt={detail.name} className="aspect-[4/3] w-full rounded-xl object-cover" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">{catName(detail.categoryId)}</p>
                <h3 className="mt-2 text-2xl font-bold text-primary">{detail.name}</h3>
                <span className="mt-3 inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium">{detail.type}</span>
                <p className="mt-4 leading-relaxed text-muted-foreground">{detail.description}</p>
                <a href={enquiryMail(email, detail.name, catName(detail.categoryId))} className="btn btn-accent mt-6"><Icon name="mail" className="h-4 w-4" />Enquire about this product</a>
                <p className="mt-3 text-xs text-muted-foreground">Opens your email app with a prefilled enquiry to {email}.</p>
              </div>
            </div>
            {related.length > 0 && (
              <div className="mt-10 border-t pt-6">
                <h4 className="font-semibold text-primary">Related products</h4>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  {related.map((r) => (
                    <button key={r.id} onClick={() => setDetail(r)} className="group overflow-hidden rounded-xl border text-left transition hover:shadow-soft">
                      <SmartImg src={r.image} alt={r.name} className="aspect-[4/3] w-full object-cover" />
                      <p className="p-3 text-sm font-medium text-primary group-hover:text-accent">{r.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
