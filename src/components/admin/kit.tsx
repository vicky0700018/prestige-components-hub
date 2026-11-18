import type { ReactNode } from "react";
import { Icon } from "../icons";

export function PageHeader({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-bold text-primary md:text-3xl">{title}</h1>
        {text && <p className="mt-1 text-sm text-muted-foreground">{text}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border bg-card shadow-soft ${className}`}>{children}</div>;
}

export function SearchBox({ value, onChange, placeholder = "Search…" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative min-w-0 flex-1">
      <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input className="field pl-9" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
    </div>
  );
}

/** Always-visible View / Edit / Delete buttons for a row. */
export function RowActions({ onView, onEdit, onDelete }: { onView: () => void; onEdit?: () => void; onDelete: () => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button onClick={onView} className="btn btn-outline btn-sm" aria-label="View"><Icon name="eye" className="h-4 w-4" /><span>View</span></button>
      {onEdit && <button onClick={onEdit} className="btn btn-outline btn-sm text-secondary" aria-label="Edit"><Icon name="edit" className="h-4 w-4" /><span>Edit</span></button>}
      <button onClick={onDelete} className="btn btn-outline btn-sm text-destructive" aria-label="Delete"><Icon name="trash" className="h-4 w-4" /><span>Delete</span></button>
    </div>
  );
}

export function Empty({ text }: { text: string }) {
  return <div className="p-12 text-center text-sm text-muted-foreground"><Icon name="inbox" className="mx-auto mb-2 h-8 w-8" />{text}</div>;
}

export function Pager({ page, pages, setPage }: { page: number; pages: number; setPage: (n: number) => void }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t px-5 py-3 text-sm">
      <span className="text-muted-foreground">Page {page} of {pages}</span>
      <div className="flex gap-2">
        <button className="btn btn-outline btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}><Icon name="left" className="h-4 w-4" />Prev</button>
        <button className="btn btn-outline btn-sm" disabled={page === pages} onClick={() => setPage(page + 1)}>Next<Icon name="right" className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
