// Remembers where the reader was so a refresh (or Back/Forward into the site)
// puts them back there. Positions are saved continuously to sessionStorage —
// per tab, cleared when the tab closes — keyed by page path. They're only
// *read back* on a reload or back/forward load, and only for the page that
// load landed on: clicking around the site afterwards still starts each
// section fresh.

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

/** Called on the first in-app route change: later pages start fresh. */
export const closeRestoreWindow = () => {
  if (window.location.pathname !== initialPath) restoreWindowOpen = false;
};

/** The saved value for `key` on this page, if this load should restore it. */
export const readRestored = <T>(key: string): T | null => {
  if (!canRestore()) return null;
  try {
    const raw = sessionStorage.getItem(storageKey(key));
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

/** Save `value` for `key` on this page, for the next reload to pick up. */
export const saveRestorable = (key: string, value: unknown) => {
  try {
    sessionStorage.setItem(storageKey(key), JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode, quota): nothing to restore next time.
  }
};
