import { adminHead } from "@/lib/page-meta";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, KEYS, write, uid, logActivity, GALLERY_CATEGORIES } from "@/lib/store";
import { Icon } from "@/components/icons";
import { Badge, ConfirmDialog, Field, ImagePicker, Modal, SmartImg, Toggle, toast } from "@/components/ui";
import { PageHeader, SearchBox, RowActions, Empty } from "@/components/admin/kit";

export const Route = createFileRoute("/admin/gallery")({ head: () => adminHead("Gallery Management"), component: GalleryAdmin });

function GalleryAdmin() {
  const items = useStore<any[]>(KEYS.gallery);
  const [q, setQ] = useState(""); const [cat, setCat] = useState("all");
  const [form, setForm] = useState<any>(null); const [errors, setErrors] = useState<any>({});
  const [view, setView] = useState<any>(null); const [del, setDel] = useState<any>(null);
  const list = items.filter((g) => (cat === "all" || g.category === cat) && g.title.toLowerCase().includes(q.toLowerCase()));

  const save = () => {
    const e: any = {};
    if (!form.title.trim()) e.title = "Image title is required.";
    if (!form.category) e.category = "Choose a gallery category.";
    if (!form.image) e.image = "Please upload an image.";
    setErrors(e); if (Object.keys(e).length) return;
    const isNew = !form.id; const item = { ...form, id: form.id || uid("g") };
    if (!write(KEYS.gallery, isNew ? [item, ...items] : items.map((g) => (g.id === item.id ? item : g)))) { toast("Could not save — storage is full. Try a smaller image.", "error"); return; }
    logActivity(`${isNew ? "Added" : "Updated"} gallery image “${item.title}”`); toast(`Image ${isNew ? "added" : "updated"}`); setForm(null);
  };
  const remove = () => { write(KEYS.gallery, items.filter((g) => g.id !== del.id)); logActivity(`Deleted gallery image “${del.title}”`); toast("Image deleted"); setDel(null); };

  return (
    <div className="space-y-6">
      <PageHeader title="Gallery" text={`${items.length} images`} action={<button className="btn btn-accent" onClick={() => { setErrors({}); setForm({ title: "", description: "", category: "", image: "", active: true }); }}><Icon name="plus" className="h-4 w-4" />Add New Image</button>} />
      <div className="flex flex-col gap-3 md:flex-row">
        <SearchBox value={q} onChange={setQ} placeholder="Search images" />
        <select className="field md:w-64" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category filter"><option value="all">All categories</option>{GALLERY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
      </div>
      {list.length === 0 ? <Empty text="No images found." /> : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {list.map((g) => (
            <div key={g.id} className="overflow-hidden rounded-2xl border bg-card shadow-soft">
              <div className="relative"><SmartImg src={g.image} alt={g.title} className="aspect-[4/3] w-full object-cover" /><span className="absolute left-3 top-3"><Badge tone={g.active ? "success" : "neutral"}>{g.active ? "Visible" : "Hidden"}</Badge></span></div>
              <div className="p-4">
                <p className="font-semibold text-primary">{g.title}</p>
                <p className="text-xs text-muted-foreground">{g.category}</p>
                <div className="mt-3"><RowActions onView={() => setView(g)} onEdit={() => { setErrors({}); setForm({ ...g }); }} onDelete={() => setDel(g)} /></div>
              </div>
            </div>))}
        </div>)}
      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edit Image Details" : "Add Gallery Image"}
        footer={<><button className="btn btn-outline" onClick={() => setForm(null)}>Cancel</button><button className="btn btn-accent" onClick={save}>Save Image</button></>}>
        {form && (
          <div className="space-y-5 p-6">
            <Field label="Image Title" required error={errors.title}><input className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
            <Field label="Image Description"><textarea rows={2} className="field" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <Field label="Gallery Category" required error={errors.category}><select className="field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option value="">Select category</option>{GALLERY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <ImagePicker label="Image Upload" required value={form.image} onChange={(v) => setForm({ ...form, image: v })} error={errors.image} />
            <Toggle label={form.active ? "Visible on website" : "Hidden"} checked={form.active} onChange={(v) => setForm({ ...form, active: v })} />
          </div>)}
      </Modal>
      <Modal open={!!view} onClose={() => setView(null)} title={view?.title} size="lg">
        {view && <div className="p-6"><SmartImg src={view.image} alt={view.title} className="max-h-[60vh] w-full rounded-xl object-contain" /><p className="mt-4 text-sm font-semibold text-secondary">{view.category}</p><p className="mt-1 text-muted-foreground">{view.description}</p></div>}
      </Modal>
      <ConfirmDialog open={!!del} title="Delete image?" message={`“${del?.title}” will be removed from the gallery.`} onConfirm={remove} onCancel={() => setDel(null)} />
    </div>
  );
}
