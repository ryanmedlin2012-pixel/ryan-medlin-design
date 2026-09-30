// Remembers where the reader was so a refresh (or Back/Forward into the site)
// puts them back there. Positions are saved continuously to sessionStorage —
// per tab, cleared when the tab closes — keyed by page path. They're only
// *read back* on a reload or back/forward load, and only for the page that
// load landed on: clicking around the site afterwards still starts each
// section fresh.
//
// Separately, values saved during the current page view are kept in memory,
// so a component rebuilt mid-visit — the layout swapping between desktop and
// stacked as the window is resized — picks up where it was. That memory is
// dropped as soon as the reader moves to another page.

const VERSION = 1;

const navigationType = (() => {
  if (typeof performance === 'undefined') return 'navigate';
  const entry = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined;
  const type = entry?.type ?? 'navigate';
  // On GitHub Pages a project URL has no file of its own: a refresh there is
  // served 404.html, which redirects here — so this load always reads as a
  // fresh 'navigate'. 404.html notes its own (real) load type first; use it
  // if it was left moments ago, and only once.
  try {
    const raw = sessionStorage.getItem('spa-redirect-nav');
    if (raw) {
      sessionStorage.removeItem('spa-redirect-nav');
      const redirect = JSON.parse(raw) as { type?: string; at?: number };
      if (type === 'navigate' && redirect.type && Date.now() - (redirect.at ?? 0) < 10000) {
        return redirect.type;
      }
    }
  } catch {
    // Storage unavailable: treat as whatever the browser reported.
  }
  return type;
})();

const initialPath = typeof window === 'undefined' ? '' : window.location.pathname;
let restoreWindowOpen = navigationType === 'reload' || navigationType === 'back_forward';

const storageKey = (key: string, path = window.location.pathname) =>
  `restore:v${VERSION}:${path}:${key}`;

/** True while the page first loaded is still showing and was a reload/back-forward. */
export const canRestore = () => restoreWindowOpen && window.location.pathname === initialPath;

// This page view's saved values. Checked against the current path on every
// use, so it empties the moment the route changes — even during the first
// render of the next page, before any effect has run.
const memory = new Map<string, string>();
let memoryPath = initialPath;
const syncMemoryToPath = () => {
  if (window.location.pathname !== memoryPath) {
    memory.clear();
    memoryPath = window.location.pathname;
  }
};

/** Called on in-app route changes: later pages start fresh. */
export const closeRestoreWindow = () => {
  syncMemoryToPath();
  if (window.location.pathname !== initialPath) restoreWindowOpen = false;
};

/**
 * The saved value for `key` on this page: from earlier in this page view if
 * there is one (a component rebuilt by a layout swap), otherwise from storage
 * if this load was a refresh or back/forward.
 */
export const readRestored = <T>(key: string): T | null => {
  syncMemoryToPath();
  try {
    const raw =
      memory.get(key) ?? (canRestore() ? sessionStorage.getItem(storageKey(key)) : null);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

/** Save `value` for `key` on this page: for the rest of this visit, and the next reload. */
export const saveRestorable = (key: string, value: unknown) => {
  syncMemoryToPath();
  const raw = JSON.stringify(value);
  memory.set(key, raw);
  try {
    sessionStorage.setItem(storageKey(key), raw);
  } catch {
    // Storage unavailable (private mode, quota): nothing to restore next time.
  }
};
