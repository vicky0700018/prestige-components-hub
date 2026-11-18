import { useEffect, useState } from "react";
import { useStore, KEYS, GALLERY_CATEGORIES } from "@/lib/store";
import { Icon } from "../icons";
import { SmartImg } from "../ui";
import { SectionHeading } from "./Sections";

export function Gallery() {
  const items = useStore<any[]>(KEYS.gallery).filter((g) => g.active);
  const [filter, setFilter] = useState("All");
  const [idx, setIdx] = useState<number | null>(null);
  const cats = ["All", ...GALLERY_CATEGORIES.filter((c) => items.some((i) => i.category === c))];
  const list = filter === "All" ? items : items.filter((i) => i.category === filter);

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") setIdx((i) => i === null || list.length === 0 ? null : (i + 1) % list.length);
      if (e.key === "ArrowLeft") setIdx((i) => i === null || list.length === 0 ? null : (i - 1 + list.length) % list.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [idx, list.length]);

  const cur = idx !== null ? list[idx] : null;
  return (
    <section id="gallery" className="bg-surface py-24 md:py-32">
      <div className="container-x">
        <SectionHeading center eyebrow="Business Gallery" title="A Closer Look at Our Product Range" text="Explore photographs of the electrical and kitchen components we trade in." />
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${filter === c ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:border-accent hover:text-primary"}`}>{c}</button>
          ))}
        </div>
        <div className="mt-12 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((g, i) => (
            <button key={g.id} onClick={() => setIdx(i)}
              className={`group relative overflow-hidden rounded-2xl bg-navy text-left ${i % 6 === 0 ? "sm:col-span-2 sm:row-span-2" : i % 6 === 3 ? "lg:col-span-2" : ""}`}>
              <SmartImg src={g.image} alt={g.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/10 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">{g.category}</p>
                <p className="mt-1 font-display font-semibold text-navy-foreground">{g.title}</p>
              </div>
              <span className="absolute right-4 top-4 flex h-9 w-9 scale-75 items-center justify-center rounded-full bg-card/90 text-primary opacity-0 transition group-hover:scale-100 group-hover:opacity-100"><Icon name="eye" className="h-4 w-4" /></span>
            </button>
          ))}
        </div>
        {list.length === 0 && <p className="mt-10 text-center text-muted-foreground">No images in this category yet.</p>}
      </div>

      {cur && (
        <div className="animate-fade-in fixed inset-0 z-[95] flex flex-col bg-navy-deep/95 p-4 backdrop-blur" role="dialog" aria-modal="true" aria-label="Image viewer">
          <div className="flex items-center justify-between text-navy-foreground">
            <span className="text-sm text-navy-foreground/70">{(idx ?? 0) + 1} / {list.length}</span>
            <button onClick={() => setIdx(null)} className="rounded-full p-2 hover:bg-navy-foreground/10" aria-label="Close"><Icon name="close" className="h-6 w-6" /></button>
          </div>
          <div className="relative flex flex-1 items-center justify-center gap-4 py-4">
            <button onClick={() => setIdx(((idx ?? 0) - 1 + list.length) % list.length)} className="absolute left-0 z-10 rounded-full bg-navy-foreground/10 p-3 text-navy-foreground hover:bg-accent md:static" aria-label="Previous image"><Icon name="left" className="h-6 w-6" /></button>
            <SmartImg key={cur.id} src={cur.image} alt={cur.title} className="animate-pop-in max-h-[72vh] max-w-full rounded-xl object-contain" />
            <button onClick={() => setIdx(((idx ?? 0) + 1) % list.length)} className="absolute right-0 z-10 rounded-full bg-navy-foreground/10 p-3 text-navy-foreground hover:bg-accent md:static" aria-label="Next image"><Icon name="right" className="h-6 w-6" /></button>
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">{cur.category}</p>
            <p className="mt-1 font-display text-lg font-semibold text-navy-foreground">{cur.title}</p>
            <p className="text-sm text-navy-foreground/70">{cur.description}</p>
          </div>
        </div>
      )}
    </section>
  );
}
