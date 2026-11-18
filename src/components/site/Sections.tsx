import { useStore, KEYS } from "@/lib/store";
import { Icon } from "../icons";
import { SmartImg } from "../ui";
import { Link } from "@tanstack/react-router";

export function SectionHeading({ eyebrow, title, text, center = false, light = false }: { eyebrow: string; title: string; text?: string; center?: boolean; light?: boolean }) {
  return (
    <div className={`reveal ${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      <span className={`eyebrow ${center ? "justify-center" : ""}`}>{eyebrow}</span>
      <h2 className={`mt-4 text-3xl font-bold leading-tight md:text-[2.6rem] ${light ? "text-navy-foreground" : "text-primary"}`}>{title}</h2>
      {text && <p className={`mt-4 text-base leading-relaxed md:text-lg ${light ? "text-navy-foreground/70" : "text-muted-foreground"}`}>{text}</p>}
    </div>
  );
}

export function Hero() {
  const c = useStore<any>(KEYS.content).hero;
  return (
    <section id="home" className="relative isolate overflow-hidden bg-navy-deep">
      <SmartImg src={c.image} alt="Electrical switches, sockets and kitchen hardware components" className="absolute inset-0 -z-10 h-full w-full object-cover object-right" width={1920} height={1088} />
      <div className="absolute inset-0 -z-10 bg-hero-overlay" />
      <div className="container-x flex items-center py-16 md:min-h-[720px] md:py-24">
        <div className="max-w-2xl">
          <span className="eyebrow animate-fade-up">{c.label}</span>
          <h1 className="animate-fade-up delay-1 mt-6 text-4xl font-bold leading-[1.08] text-navy-foreground sm:text-5xl lg:text-[4rem]">{c.heading}</h1>
          <p className="animate-fade-up delay-2 mt-6 max-w-xl text-lg leading-relaxed text-navy-foreground/75">{c.description}</p>
          <div className="animate-fade-up delay-3 mt-10 flex flex-wrap gap-4">
            <Link to="/products" className="btn btn-accent px-7 py-4">{c.cta1} <Icon name="arrow" className="h-4 w-4" /></Link>
            <Link to="/contact" className="btn btn-glass px-7 py-4">{c.cta2}</Link>
          </div>
          <div className="animate-fade-up delay-3 mt-14 grid max-w-lg grid-cols-2 gap-px overflow-hidden rounded-xl border border-navy-foreground/15 bg-navy-foreground/15">
            {[["bolt", "Electrical Components"], ["kitchen", "Kitchen Components"]].map(([i, t]) => (
              <div key={t} className="flex items-center gap-3 bg-navy-deep/60 px-4 py-4 backdrop-blur">
                <Icon name={i as string} className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium text-navy-foreground">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const ABOUT_ICONS = ["layers", "handshake", "award", "users"];

export function About() {
  const a = useStore<any>(KEYS.content).about;
  return (
    <section id="about" className="bg-background py-24 md:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="reveal relative">
          <div className="absolute -left-4 -top-4 h-40 w-40 rounded-2xl border-2 border-accent/40" />
          <div className="relative overflow-hidden rounded-2xl shadow-lift">
            <SmartImg src={a.image} alt="Display of electrical switches and kitchen hardware" loading="lazy" className="aspect-[4/5] w-full object-cover" width={1024} height={1280} />
          </div>
          <div className="absolute -bottom-8 right-4 max-w-[17rem] rounded-xl bg-navy p-5 shadow-lift sm:-right-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Partners</p>
            {a.partners.map((p: string) => (
              <p key={p} className="mt-2 font-display text-sm font-semibold text-navy-foreground">{p}</p>
            ))}
          </div>
        </div>
        <div>
          <SectionHeading eyebrow="About Our Company" title={a.heading} text={a.description} />
          <p className="reveal mt-5 inline-flex rounded-full border bg-muted px-4 py-1.5 text-xs font-semibold text-secondary">{a.companyInfo}</p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2">
            {a.blocks.map((b: any, i: number) => (
              <div key={i} className="reveal group bg-card p-6 transition-colors hover:bg-muted">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-accent transition-transform group-hover:-translate-y-1">
                  <Icon name={ABOUT_ICONS[i % 4] ?? "box"} />
                </span>
                <h3 className="mt-4 text-base font-semibold text-primary">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Categories() {
  const cats = useStore<any[]>(KEYS.categories).filter((c) => c.status === "active");
  return (
    <section id="categories" className="bg-surface py-24 md:py-32">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Product Categories" title="Two Specialised Categories, One Trusted Source" />
          <p className="reveal max-w-sm text-muted-foreground">Browse our electrical and kitchen component ranges — each curated to meet a variety of customer requirements.</p>
        </div>
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {cats.map((c, idx) => (
            <article key={c.id} className="reveal group relative overflow-hidden rounded-2xl bg-navy shadow-soft transition-shadow duration-500 hover:shadow-lift">
              <div className="relative h-72 overflow-hidden sm:h-80">
                <SmartImg src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
                <span className="absolute left-6 top-6 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">0{idx + 1}</span>
              </div>
              <div className="relative -mt-16 p-7 pt-0 sm:p-9 sm:pt-0">
                <h3 className="text-2xl font-bold text-navy-foreground sm:text-3xl">{c.name}</h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-navy-foreground/70">{c.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(c.types || []).slice(0, 6).map((t: string) => (
                    <span key={t} className="rounded-full border border-navy-foreground/15 px-3 py-1 text-xs text-navy-foreground/80">{t}</span>
                  ))}
                  {(c.types || []).length > 6 && <span className="rounded-full px-3 py-1 text-xs text-accent">+{c.types.length - 6} more</span>}
                </div>
                <Link to="/products" search={{ category: c.id }} className="btn btn-accent mt-7">Explore Products <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const WHY_ICONS = ["layers", "bolt", "award", "users", "shield", "handshake"];

export function WhyUs() {
  const w = useStore<any>(KEYS.content).why;
  const features = w.features.map((f: any, i: number) => ({ ...f, icon: WHY_ICONS[i % 6] ?? "box" })).filter((f: any) => f.visible);
  return (
    <section id="why" className="relative overflow-hidden bg-navy py-24 md:py-32">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full border border-navy-foreground/10" />
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-accent/20" />
      <div className="container-x relative grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow="Why Choose Us" title={w.heading} text={w.intro} light />
          <Link to="/contact" className="btn btn-accent reveal mt-8">Start an Enquiry <Icon name="arrow" className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-navy-foreground/10 bg-navy-foreground/10 sm:grid-cols-2">
          {features.map((f: any, i: number) => (
            <div key={i} className="reveal group bg-navy p-8 transition-colors duration-300 hover:bg-navy-deep">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 text-accent transition-all group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon name={f.icon} className="h-6 w-6" />
                </span>
                <span className="font-display text-sm font-semibold text-navy-foreground/25">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-navy-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-foreground/65">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
