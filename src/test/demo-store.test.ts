import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  sessionStorage.clear();
});

describe("Browser demo persistence", () => {
  it("preserves saved products after reloading the store", async () => {
    const store = await import("@/lib/store");
    const products = [{ id: "saved-product", name: "Saved switch", active: true }];
    expect(store.write(store.KEYS.products, products)).toBe(true);
    vi.resetModules();
    const reloaded = await import("@/lib/store");
    expect(reloaded.read(reloaded.KEYS.products)).toEqual(products);
  });

  it("retains previous data when browser storage rejects a write", async () => {
    const store = await import("@/lib/store");
    const previous = store.read(store.KEYS.products);
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage full"); });
    expect(store.write(store.KEYS.products, [])).toBe(false);
    expect(store.read(store.KEYS.products)).toEqual(previous);
    spy.mockRestore();
  });

  it("recovers from malformed saved data", async () => {
    localStorage.setItem("npc_products", "broken JSON");
    const store = await import("@/lib/store");
    expect(store.read<any[]>(store.KEYS.products)).toHaveLength(20);
  });

  it("keeps demo sign-in session-based and supports logout", async () => {
    const store = await import("@/lib/store");
    expect(store.isLoggedIn()).toBe(false);
    store.setLoggedIn(true);
    expect(store.isLoggedIn()).toBe(true);
    store.setLoggedIn(false);
    expect(store.isLoggedIn()).toBe(false);
  });
});