import { cloneElement, isValidElement, useEffect, useId, useState, useSyncExternalStore, type ReactNode } from "react";
import { Icon } from "./icons";
import { resolveImage, FALLBACK_IMAGE } from "@/lib/assets";

/* ---------- Toasts ---------- */
type Toast = { id: number; message: string; type: "success" | "error" | "info" };
let toasts: Toast[] = [];
const toastListeners = new Set<() => void>();
const EMPTY: Toast[] = [];
export function toast(message: string, type: Toast["type"] = "success") {
  const t = { id: Date.now() + Math.random(), message, type };
  toasts = [...toasts, t];
  toastListeners.forEach((l) => l());
  setTimeout(() => {
    toasts = toasts.filter((x) => x.id !== t.id);
    toastListeners.forEach((l) => l());
  }, 3800);
}
export function Toaster() {
  const list = useSyncExternalStore(
    (cb) => { toastListeners.add(cb); return () => { toastListeners.delete(cb); }; },
    () => toasts,
    () => EMPTY,
  );
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(92vw,22rem)] flex-col gap-2" role="status" aria-live="polite">
      {list.map((t) => (
        <div key={t.id} className="animate-pop-in pointer-events-auto flex items-start gap-3 rounded-xl border bg-card p-4 text-sm shadow-lift">
          <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${t.type === "error" ? "bg-destructive/10 text-destructive" : t.type === "info" ? "bg-secondary/10 text-secondary" : "bg-success/10 text-success"}`}>
            <Icon name={t.type === "error" ? "alert" : "check"} className="h-3.5 w-3.5" strokeWidth={2.4} />
          </span>
          <p className="text-foreground">{t.message}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- Modal ---------- */
export function Modal({ open, onClose, title, children, footer, size = "md" }: { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode; footer?: ReactNode; size?: "sm" | "md" | "lg" | "xl" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  const w = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl", xl: "max-w-6xl" }[size];
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true">
      <div className="animate-fade-in absolute inset-0 bg-navy-deep/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`animate-pop-in relative flex max-h-[92vh] w-full ${w} flex-col overflow-hidden rounded-t-2xl bg-card shadow-lift sm:rounded-2xl`}>
        {title !== undefined && (
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h3 className="text-lg font-semibold text-primary">{title}</h3>
            <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-primary" aria-label="Close">
              <Icon name="close" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t bg-muted px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, title = "Are you sure?", message, confirmLabel = "Delete", onConfirm, onCancel }: { open: boolean; title?: string; message: ReactNode; confirmLabel?: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <Modal open={open} onClose={onCancel} size="sm">
      <div className="p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Icon name="trash" className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-primary">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button className="btn bg-destructive text-destructive-foreground hover:brightness-110" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </Modal>
  );
}

/* ---------- Form helpers ---------- */
export function Field({ label, error, hint, children, required }: { label: string; error?: string | undefined; hint?: string | undefined; children: ReactNode; required?: boolean }) {
  const id = useId();
  const control = isValidElement<{ id?: string }>(children) && typeof children.type === "string" && ["input", "select", "textarea"].includes(children.type)
    ? cloneElement(children, { id: children.props.id ?? id })
    : children;
  return (
    <label className="block" htmlFor={control !== children ? id : undefined}>
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      {control}
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : hint ? <span className="mt-1 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-3 text-sm font-medium" aria-pressed={checked}>
      <span className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-accent" : "bg-border"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </span>
      {label}
    </button>
  );
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "success" | "warning" | "info" | "accent" | "danger"; children: ReactNode }) {
  const cls = {
    neutral: "bg-muted text-muted-foreground border-border",
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/15 text-foreground border-warning/30",
    info: "bg-secondary/10 text-secondary border-secondary/20",
    accent: "bg-accent/10 text-accent border-accent/25",
    danger: "bg-destructive/10 text-destructive border-destructive/20",
  }[tone];
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{children}</span>;
}

export function SmartImg({ src, alt, className = "", ...rest }: { src?: string; alt: string; className?: string; [k: string]: any }) {
  const [failed, setFailed] = useState(false);
  const url = failed ? FALLBACK_IMAGE : resolveImage(src);
  return <img src={url} alt={alt} className={className} onError={() => !failed && setFailed(true)} {...rest} />;
}

/* ---------- Image picker (compresses to keep within storage limits) ---------- */
const MAX_FILE_MB = 5;
function compressImage(file: File, maxSide = 1100, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Invalid image"));
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas unavailable"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function ImagePicker({ value, onChange, label = "Image", error, required }: { value: string; onChange: (v: string) => void; label?: string; error?: string; required?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState("");
  const handle = async (file?: File) => {
    if (!file) return;
    setLocalError("");
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      setLocalError("Please choose a JPG, PNG, WEBP or GIF image.");
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setLocalError(`Image must be smaller than ${MAX_FILE_MB} MB.`);
      return;
    }
    setBusy(true);
    try {
      const data = await compressImage(file);
      if (data.length > 900_000) setLocalError("Image is too detailed to store in this demo. Try a smaller image.");
      else onChange(data);
    } catch {
      setLocalError("This image could not be processed.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium">{label} {required && <span className="text-accent">*</span>}</span>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative h-32 w-full overflow-hidden rounded-xl border bg-muted sm:w-44">
          {value ? <SmartImg src={value} alt="Preview" className="h-full w-full object-cover" /> : (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-xs text-muted-foreground"><Icon name="image" className="h-7 w-7" />No image</div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="btn btn-outline btn-sm cursor-pointer">
            <Icon name="upload" className="h-4 w-4" />{busy ? "Processing…" : value ? "Replace image" : "Choose image"}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={(e) => { handle(e.target.files?.[0]); e.target.value = ""; }} />
          </label>
          {value && <button type="button" className="btn btn-outline btn-sm text-destructive" onClick={() => onChange("")}><Icon name="trash" className="h-4 w-4" />Remove</button>}
        </div>
      </div>
      <span className="mt-1 block text-xs text-muted-foreground">JPG, PNG, WEBP or GIF up to {MAX_FILE_MB} MB. Large images are resized automatically.</span>
      {(localError || error) && <span className="mt-1 block text-xs text-destructive">{localError || error}</span>}
    </div>
  );
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
