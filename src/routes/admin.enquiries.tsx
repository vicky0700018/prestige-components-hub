import { adminHead } from "@/lib/page-meta";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useStore, KEYS, write, logActivity, formatDate, ENQUIRY_STATUSES } from "@/lib/store";
import { Badge, ConfirmDialog, Modal, toast } from "@/components/ui";
import { PageHeader, Panel, SearchBox, RowActions, Empty } from "@/components/admin/kit";

export const statusTone = (s: string) => (s === "New" ? "accent" : s === "Contacted" ? "info" : s === "In Progress" ? "warning" : "success") as "accent";

export const Route = createFileRoute("/admin/enquiries")({ head: () => adminHead("Enquiry Management"), component: Enquiries });

function Enquiries() {
  const list = useStore<any[]>(KEYS.enquiries);
  const [q, setQ] = useState(""); const [cat, setCat] = useState("all"); const [st, setSt] = useState("all");
  const [view, setView] = useState<any>(null); const [del, setDel] = useState<any>(null);
  const cats = Array.from(new Set(list.map((e) => e.category)));
  const rows = list.filter((e) => (cat === "all" || e.category === cat) && (st === "all" || e.status === st) && `${e.name} ${e.email} ${e.subject}`.toLowerCase().includes(q.toLowerCase()));
  const setStatus = (e: any, status: string) => { write(KEYS.enquiries, list.map((x) => (x.id === e.id ? { ...x, status } : x))); logActivity(`Enquiry from ${e.name} marked ${status}`); toast("Status updated"); if (view?.id === e.id) setView({ ...e, status }); };
  const remove = () => { write(KEYS.enquiries, list.filter((x) => x.id !== del.id)); logActivity(`Deleted enquiry from ${del.name}`); toast("Enquiry deleted"); setDel(null); };
  return (
    <div className="space-y-6">
      <PageHeader title="Enquiries" text={`${list.length} enquiries`} />
      <Panel>
        <div className="flex flex-col gap-3 border-b p-4 md:flex-row">
          <SearchBox value={q} onChange={setQ} placeholder="Search enquiries" />
          <select className="field md:w-56" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category"><option value="all">All categories</option>{cats.map((c) => <option key={c}>{c}</option>)}</select>
          <select className="field md:w-44" value={st} onChange={(e) => setSt(e.target.value)} aria-label="Status"><option value="all">All statuses</option>{ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        </div>
        {rows.length === 0 ? <Empty text="No enquiries found." /> : (
          <div className="divide-y">{rows.map((e) => (
            <div key={e.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
              <div className="min-w-0 flex-1"><p className="font-semibold text-primary">{e.name} <span className="font-normal text-muted-foreground">· {e.email}</span></p><p className="truncate text-sm text-muted-foreground">{e.subject} · {e.category} · {formatDate(e.date)}</p></div>
              <select className="field md:w-40" value={e.status} onChange={(ev) => setStatus(e, ev.target.value)} aria-label="Update status">{ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
              <RowActions onView={() => setView(e)} onDelete={() => setDel(e)} />
            </div>))}</div>)}
      </Panel>
      <Modal open={!!view} onClose={() => setView(null)} title="Enquiry Details">
        {view && <div className="space-y-2 p-6 text-sm">
          <Badge tone={statusTone(view.status)}>{view.status}</Badge>
          <p><b>Name:</b> {view.name}</p><p><b>Email:</b> <a className="text-secondary" href={`mailto:${view.email}`}>{view.email}</a></p>
          <p><b>Subject:</b> {view.subject}</p><p><b>Category:</b> {view.category}</p><p><b>Date:</b> {formatDate(view.date)}</p>
          <p className="whitespace-pre-wrap rounded-lg bg-muted p-4">{view.message}</p>
        </div>}
      </Modal>
      <ConfirmDialog open={!!del} title="Delete enquiry?" message={`The enquiry from ${del?.name} will be removed.`} onConfirm={remove} onCancel={() => setDel(null)} />
    </div>
  );
}
