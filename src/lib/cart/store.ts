import type { CartEntry } from "./cart";

/**
 * Tiny browser store for the cart, read with React's useSyncExternalStore.
 * It keeps the cart in localStorage (so a refresh does not lose it) and in memory
 * (so it still works when the browser blocks storage).
 */
const KEY = "site-cart:v1";

let snapshot: string | null = null;
const listeners = new Set<() => void>();

function readStorage(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

export function getSnapshot(): string {
  if (snapshot === null) snapshot = readStorage();
  return snapshot;
}

/** On the server (and during hydration) the cart is always empty. */
export function getServerSnapshot(): string {
  return "[]";
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // another tab changed the cart
  const onStorage = (event: StorageEvent) => {
    if (event.key !== KEY) return;
    snapshot = event.newValue ?? "[]";
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function writeEntries(entries: CartEntry[]): void {
  snapshot = JSON.stringify(entries);
  try {
    window.localStorage.setItem(KEY, snapshot);
  } catch {
    // storage blocked: the in-memory snapshot is enough for this visit
  }
  listeners.forEach((listener) => listener());
}
