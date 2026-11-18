import { useSyncExternalStore } from "react";
import { SEED } from "./seed";

export const KEYS = {
  products: "npc_products",
  categories: "npc_categories",
  gallery: "npc_gallery",
  content: "npc_content",
  enquiries: "npc_enquiries",
  admin: "npc_admin_settings",
  activity: "npc_activity",
} as const;
type Key = (typeof KEYS)[keyof typeof KEYS];

const SEED_BY_KEY: Record<Key, any> = {
  [KEYS.products]: SEED.products,
  [KEYS.categories]: SEED.categories,
  [KEYS.gallery]: SEED.gallery,
  [KEYS.content]: SEED.content,
  [KEYS.enquiries]: SEED.enquiries,
  [KEYS.admin]: SEED.admin,
  [KEYS.activity]: SEED.activity,
};

const cache: Partial<Record<Key, any>> = {};
const listeners = new Set<() => void>();

/** Reads a key; seeds it only when nothing has been saved yet. */
export function read<T = any>(key: Key): T {
  const fallback = SEED_BY_KEY[key];
  if (typeof window === "undefined") return fallback;
  if (key in cache) return cache[key];
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      window.localStorage.setItem(key, JSON.stringify(fallback));
      cache[key] = fallback;
    } else {
      cache[key] = JSON.parse(raw);
    }
  } catch {
    cache[key] = fallback;
  }
  return cache[key];
}

/** Writes a key. Returns false when the browser refuses (e.g. storage full). */
export function write(key: Key, value: any): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    cache[key] = value;
    listeners.forEach((l) => l());
    return true;
  } catch {
    return false;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key && e.key in SEED_BY_KEY) {
      delete cache[e.key as Key];
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useStore<T = any>(key: Key): T {
  return useSyncExternalStore(subscribe, () => read<T>(key), () => SEED_BY_KEY[key]);
}

export function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
}

export function logActivity(text: string) {
  const list = read<any[]>(KEYS.activity);
  write(KEYS.activity, [{ id: uid("act"), text, date: new Date().toISOString() }, ...list].slice(0, 40));
}

export function resetDemoData() {
  Object.values(KEYS).forEach((k) => {
    try { window.localStorage.removeItem(k); } catch { /* ignore */ }
    delete cache[k];
  });
  listeners.forEach((l) => l());
}

export const SESSION_KEY = "npc_admin_session";
export function isLoggedIn() {
  try { return window.sessionStorage.getItem(SESSION_KEY) === "1"; } catch { return false; }
}
export function setLoggedIn(v: boolean) {
  try {
    if (v) window.sessionStorage.setItem(SESSION_KEY, "1");
    else window.sessionStorage.removeItem(SESSION_KEY);
  } catch { /* ignore */ }
}

export const GALLERY_CATEGORIES = [
  "Electrical Components",
  "Modular Switches",
  "Electrical Accessories",
  "Kitchen Cabinet Hardware",
  "Kitchen Fittings",
  "Modern Kitchen Components",
  "Product Collections",
];
export const ENQUIRY_STATUSES = ["New", "Contacted", "In Progress", "Completed"];

export function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return iso; }
}

export function mailtoLink(email: string, subject: string, body: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
