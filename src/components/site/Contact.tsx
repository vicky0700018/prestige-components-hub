import { useState } from "react";
import { useStore, KEYS, read, write, uid, logActivity, mailtoLink } from "@/lib/store";
import { Icon } from "../icons";
import { Field, isEmail } from "../ui";
import { SectionHeading } from "./Sections";

const EMPTY = { name: "", email: "", subject: "", category: "", message: "" };

export function Contact() {
  const c = useStore<any>(KEYS.content).contact;
  const cats = useStore<any[]>(KEYS.categories).filter((x) => x.status === "active");
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof EMPTY, string>>>({});
  const [result, setResult] = useState<{ ok: boolean; text: string; mail?: string } | null>(null);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`;

  const set = (k: keyof typeof EMPTY) => (e: any) => setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Partial<Record<keyof typeof EMPTY, string>> = {};
    if (!form.name.trim()) er.name = "Please enter your full name.";
    if (!form.email.trim()) er.email = "Please enter your email address.";
    else if (!isEmail(form.email)) er.email = "Please enter a valid email address.";
    if (!form.subject.trim()) er.subject = "Please enter a subject.";
    if (!form.category) er.category = "Please choose a product category.";
    if (form.message.trim().length < 10) er.message = "Please write a message of at least 10 characters.";
    setErrors(er);
    if (Object.keys(er).length) { setResult({ ok: false, text: "Please correct the highlighted fields." }); return; }
    const entry = { id: uid("enq"), ...form, name: form.name.trim(), email: form.email.trim(), date: new Date().toISOString(), status: "New" };
    const ok = write(KEYS.enquiries, [entry, ...read<any[]>(KEYS.enquiries)]);
    if (!ok) { setResult({ ok: false, text: "Your enquiry could not be saved in this browser. Please use the email button instead." }); return; }
    logActivity(`New enquiry from ${entry.name}`);
    const mail = mailtoLink(c.email, form.subject, `Name: ${entry.name}\nEmail: ${entry.email}\nProduct Category: ${form.category}\n\n${form.message}`);
    setResult({ ok: true, text: "Thank you! Your enquiry has been recorded. To send it to us by email, click “Open in email app” below.", mail });
    setForm(EMPTY);
  };

  return (
    <section id="contact" className="bg-background py-24 md:py-32">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading eyebrow="Contact Us" title="Let’s Discuss Your Component Requirements" text={c.description} />
          <div className="mt-10 space-y-4">
            <div className="reveal rounded-2xl bg-navy p-6">
              <p className="font-display text-lg font-bold text-navy-foreground">NEW PRESTIGE CORPORATION LLP</p>
              <p className="mt-1 text-sm text-navy-foreground/60">Retail Trade – Electrical & Kitchen Components</p>
            </div>
            <div className="reveal flex gap-4 rounded-2xl border bg-card p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="pin" /></span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Business Address</p>
                <p className="mt-1 text-foreground">{c.address}</p>
                <a href={mapUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-secondary hover:text-accent">View on Google Maps <Icon name="external" className="h-3.5 w-3.5" /></a>
              </div>
            </div>
            <div className="reveal flex gap-4 rounded-2xl border bg-card p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent"><Icon name="mail" /></span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Email</p>
                <a href={`mailto:${c.email}`} className="mt-1 block break-all text-foreground hover:text-accent">{c.email}</a>
                <a href={`mailto:${c.email}`} className="btn btn-navy btn-sm mt-3"><Icon name="mail" className="h-4 w-4" />Email Us</a>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} noValidate className="reveal rounded-2xl border bg-card p-6 shadow-soft md:p-10">
          <h3 className="text-xl font-semibold text-primary">Send an Enquiry</h3>
          <p className="mt-1 text-sm text-muted-foreground">Fields marked * are required.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Full Name" required error={errors.name}><input className="field" value={form.name} onChange={set("name")} /></Field>
            <Field label="Email Address" required error={errors.email}><input type="email" className="field" value={form.email} onChange={set("email")} /></Field>
            <Field label="Subject" required error={errors.subject}><input className="field" value={form.subject} onChange={set("subject")} /></Field>
            <Field label="Product Category" required error={errors.category}>
              <select className="field" value={form.category} onChange={set("category")}>
                <option value="">Select a category</option>
                {cats.map((x) => <option key={x.id}>{x.name}</option>)}
                <option>General Enquiry</option>
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Message" required error={errors.message}><textarea rows={5} className="field resize-y" value={form.message} onChange={set("message")} /></Field>
            </div>
          </div>
          {result && (
            <div className={`animate-pop-in mt-5 rounded-xl border p-4 text-sm ${result.ok ? "border-success/30 bg-success/10" : "border-destructive/30 bg-destructive/10 text-destructive"}`} role="alert">
              <p>{result.text}</p>
              {result.mail && <a href={result.mail} className="btn btn-accent btn-sm mt-3"><Icon name="mail" className="h-4 w-4" />Open in email app</a>}
            </div>
          )}
          <button type="submit" className="btn btn-accent mt-6 w-full sm:w-auto">Submit Enquiry <Icon name="arrow" className="h-4 w-4" /></button>
        </form>
      </div>
    </section>
  );
}
