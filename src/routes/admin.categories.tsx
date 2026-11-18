import { adminHead } from "@/lib/page-meta";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, KEYS, write, uid, logActivity } from "@/lib/store";
import { Icon } from "@/components/icons";
import { Badge, ConfirmDialog, Field, ImagePicker, Modal, SmartImg, Toggle, toast } from "@/components/ui";
import { PageHeader, RowActions, Empty } from "@/components/admin/kit";

export const Route = createFileRoute("/admin/categories")({ head: () => adminHead("Categories Management"), component: Categories });

function Categories() {
  const cats = useStore<any[]>(KEYS.categories);
  const products = useStore<any[]>(KEYS.products);
  const [form, setForm] = useState<any>(null); const [errors, setErrors] = useState<any>({});
  const [view, setView] = useState<any>(null); const [del, setDel] = useState<any>(null);
  const count = (id: string) => products.filter((p) => p.categoryId === id).length;

  const save = () => {
    const e: any = {};
    if (!form.name.trim()) e.name = "Category name is required.";
    else if (cats.some((c) => c.id !== form.id && c.name.toLowerCase() === form.name.trim().toLowerCase())) e.name = "A category with this name already exists.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.image) e.image = "Please add a category image.";
    setErrors(e); if (Object.keys(e).length) return;
    const isNew = !form.id;
    const item = { ...form, name: form.name.trim(), types: String(form.typesText || "").split(",").map((s) => s.trim()).filter(Boolean), id: form.id || uid("cat") };
    delete item.typesText;
    if (!write(KEYS.categories, isNew ? [...cats, item] : cats.map((c) => (c.id === item.id ? item : c)))) { toast("Could not save — storage is full.", "error"); return; }
    logActivity(`${isNew ? "Added" : "Updated"} category “${item.name}”`); toast(`Category ${isNew ? "added" : "updated"}`); setForm(null);
  };
  const remove = () => {
    write(KEYS.categories, cats.filter((c) => c.id !== del.id));
    logActivity(`Deleted category “${del.name}”`); toast("Category deleted"); setDel(null);
  };
  const edit = (c: any) => { setErrors({}); setForm({ ...c, typesText: (c.types || []).join(", ") }); };

  return (
    <div className="space-y-6">
      <PageHeader title="Categories" text="Categories group products on the website." action={<button className="btn btn-accent" onClick={() => { setErrors({}); setForm({ name: "", description: "", image: "", status: "active", typesText: "" }); }}><Icon name="plus" className="h-4 w-4" />Add New Category</button>} />
      {cats.length === 0 ? <Empty text="No categories yet." /> : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cats.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-2xl border bg-card shadow-soft">
              <SmartImg src={c.image} alt={c.name} className="aspect-[16/9] w-full object-cover" />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-primary">{c.name}</h3><Badge tone={c.status === "active" ? "success" : "neutral"}>{c.status === "active" ? "Active" : "Inactive"}</Badge></div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
                <p className="mt-3 text-xs font-semibold text-secondary">{count(c.id)} products · {(c.types || []).length} product types</p>
                <div className="mt-4"><RowActions onView={() => setView(c)} onEdit={() => edit(c)} onDelete={() => setDel(c)} /></div>
              </div>
            </div>))}
        </div>)}
      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edit Category" : "Add New Category"}
        footer={<><button className="btn btn-outline" onClick={() => setForm(null)}>Cancel</button><button className="btn btn-accent" onClick={save}>Save Category</button></>}>
        {form && (
          <div className="space-y-5 p-6">
            <Field label="Category Name" required error={errors.name}><input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Category Description" required error={errors.description}><textarea rows={3} className="field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <Field label="Product Types" hint="Separate with commas, e.g. Switches, Sockets"><textarea rows={2} className="field" value={form.typesText} onChange={(e) => setForm({ ...form, typesText: e.target.value })} /></Field>
            <ImagePicker label="Category Image" required value={form.image} onChange={(v) => setForm({ ...form, image: v })} error={errors.image} />
            <Toggle label={form.status === "active" ? "Active (shown on website)" : "Inactive (hidden)"} checked={form.status === "active"} onChange={(v) => setForm({ ...form, status: v ? "active" : "inactive" })} />
          </div>)}
      </Modal>
      <Modal open={!!view} onClose={() => setView(null)} title="Category Details">
        {view && (
          <div className="p-6">
            <SmartImg src={view.image} alt={view.name} className="aspect-[16/9] w-full rounded-xl object-cover" />
            <h3 className="mt-5 text-xl font-bold text-primary">{view.name}</h3>
            <p className="mt-2 text-muted-foreground">{view.description}</p>
            <p className="mt-4 text-sm font-semibold">{count(view.id)} products</p>
            <div className="mt-3 flex flex-wrap gap-2">{(view.types || []).map((t: string) => <Badge key={t}>{t}</Badge>)}</div>
          </div>)}
      </Modal>
      <ConfirmDialog open={!!del} title="Delete category?" message={count(del?.id ?? "") > 0 ? `${count(del.id)} products use this category and will be hidden from the website until moved to another category.` : `“${del?.name}” will be removed.`} onConfirm={remove} onCancel={() => setDel(null)} />
    </div>
  );
}
