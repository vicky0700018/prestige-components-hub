import { adminHead } from "@/lib/page-meta";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useStore, KEYS, write, uid, logActivity } from "@/lib/store";
import { Icon } from "@/components/icons";
import { Badge, ConfirmDialog, Field, ImagePicker, Modal, SmartImg, Toggle, toast } from "@/components/ui";
import { PageHeader, Panel, SearchBox, RowActions, Empty, Pager } from "@/components/admin/kit";

export const Route = createFileRoute("/admin/products")({ head: () => adminHead("Products Management"), component: Products });

const BLANK = { name: "", categoryId: "", type: "", short: "", description: "", image: "", featured: false, active: true };
const PER = 8;

function Products() {
  const products = useStore<any[]>(KEYS.products);
  const cats = useStore<any[]>(KEYS.categories);
  const catName = (id: string) => cats.find((c) => c.id === id)?.name ?? "—";
  const [q, setQ] = useState(""); const [cat, setCat] = useState("all"); const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<any>(null); const [errors, setErrors] = useState<any>({});
  const [view, setView] = useState<any>(null); const [del, setDel] = useState<any>(null);

  const list = useMemo(() => products.filter((p) =>
    (cat === "all" || p.categoryId === cat) &&
    (status === "all" || (status === "active" ? p.active : !p.active)) &&
    `${p.name} ${p.type}`.toLowerCase().includes(q.toLowerCase())), [products, q, cat, status]);
  const pages = Math.max(1, Math.ceil(list.length / PER));
  const cur = Math.min(page, pages);
  const types = cats.find((c) => c.id === form?.categoryId)?.types ?? [];

  const save = () => {
    const e: any = {};
    if (!form.name.trim()) e.name = "Product name is required.";
    if (!form.categoryId) e.categoryId = "Choose a category.";
    if (!form.type.trim()) e.type = "Product type is required.";
    if (!form.short.trim()) e.short = "Short description is required.";
    if (!form.image) e.image = "Please add a product image.";
    setErrors(e);
    if (Object.keys(e).length) return;
    const isNew = !form.id;
    const item = isNew ? { ...form, id: uid("p"), createdAt: new Date().toISOString() } : form;
    const next = isNew ? [item, ...products] : products.map((p) => (p.id === item.id ? item : p));
    if (!write(KEYS.products, next)) { toast("Could not save — browser storage is full. Try a smaller image.", "error"); return; }
    logActivity(`${isNew ? "Added" : "Updated"} product “${item.name}”`);
    toast(`Product ${isNew ? "added" : "updated"}`);
    setForm(null);
  };
  const remove = () => {
    write(KEYS.products, products.filter((p) => p.id !== del.id));
    logActivity(`Deleted product “${del.name}”`); toast("Product deleted"); setDel(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Products" text={`${products.length} products in total`} action={<button className="btn btn-accent" onClick={() => { setErrors({}); setForm({ ...BLANK }); }}><Icon name="plus" className="h-4 w-4" />Add New Product</button>} />
      <Panel>
        <div className="flex flex-col gap-3 border-b p-4 md:flex-row">
          <SearchBox value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search products" />
          <select className="field md:w-56" value={cat} onChange={(e) => { setCat(e.target.value); setPage(1); }} aria-label="Category filter"><option value="all">All categories</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <select className="field md:w-44" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Status filter"><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
        </div>
        {list.length === 0 ? <Empty text="No products found." /> : (
          <div className="divide-y">
            {list.slice((cur - 1) * PER, cur * PER).map((p) => (
              <div key={p.id} className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
                <SmartImg src={p.image} alt={p.name} className="h-16 w-20 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-primary">{p.name} {p.featured && <Icon name="star" className="inline h-4 w-4 text-accent" />}</p>
                  <p className="text-sm text-muted-foreground">{catName(p.categoryId)} · {p.type}</p>
                </div>
                <Badge tone={p.active ? "success" : "neutral"}>{p.active ? "Active" : "Inactive"}</Badge>
                <RowActions onView={() => setView(p)} onEdit={() => { setErrors({}); setForm({ ...p }); }} onDelete={() => setDel(p)} />
              </div>
            ))}
          </div>)}
        <Pager page={cur} pages={pages} setPage={setPage} />
      </Panel>

      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edit Product" : "Add New Product"} size="lg"
        footer={<><button className="btn btn-outline" onClick={() => setForm(null)}>Cancel</button><button className="btn btn-accent" onClick={save}>Save Product</button></>}>
        {form && (
          <div className="grid gap-5 p-6 md:grid-cols-2">
            <Field label="Product Name" required error={errors.name}><input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Product Category" required error={errors.categoryId}>
              <select className="field" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value, type: "" })}><option value="">Select category</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            </Field>
            <Field label="Product Type" required error={errors.type} hint="Pick from the list or type a new one.">
              <input className="field" list="ptypes" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
              <datalist id="ptypes">{types.map((t: string) => <option key={t} value={t} />)}</datalist>
            </Field>
            <Field label="Short Description" required error={errors.short}><input className="field" value={form.short} onChange={(e) => setForm({ ...form, short: e.target.value })} /></Field>
            <div className="md:col-span-2"><Field label="Full Description"><textarea rows={4} className="field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field></div>
            <div className="md:col-span-2"><ImagePicker label="Product Image" required value={form.image} onChange={(v) => setForm({ ...form, image: v })} error={errors.image} /></div>
            <Toggle label="Featured product" checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} />
            <Toggle label={form.active ? "Active (shown on website)" : "Inactive (hidden)"} checked={form.active} onChange={(v) => setForm({ ...form, active: v })} />
          </div>)}
      </Modal>

      <Modal open={!!view} onClose={() => setView(null)} title="Product Details" size="lg">
        {view && (
          <div className="grid gap-6 p-6 md:grid-cols-2">
            <SmartImg src={view.image} alt={view.name} className="aspect-[4/3] w-full rounded-xl object-cover" />
            <div className="space-y-3 text-sm">
              <h3 className="text-xl font-bold text-primary">{view.name}</h3>
              <div className="flex flex-wrap gap-2"><Badge tone={view.active ? "success" : "neutral"}>{view.active ? "Active" : "Inactive"}</Badge>{view.featured && <Badge tone="accent">Featured</Badge>}</div>
              <p><b>Category:</b> {catName(view.categoryId)}</p><p><b>Type:</b> {view.type}</p>
              <p><b>Short:</b> {view.short}</p><p className="text-muted-foreground">{view.description}</p>
              <button className="btn btn-outline btn-sm" onClick={() => { setErrors({}); setForm({ ...view }); setView(null); }}><Icon name="edit" className="h-4 w-4" />Edit</button>
            </div>
          </div>)}
      </Modal>
      <ConfirmDialog open={!!del} title="Delete product?" message={<>“{del?.name}” will be removed from the website.</>} onConfirm={remove} onCancel={() => setDel(null)} />
    </div>
  );
}
