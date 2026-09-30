// Puts the window at a scroll position and keeps it there while the page
// settles — images loading or a freshly built layout growing can push the
// content under the reader around for a moment. Re-applies whenever
// `watch` changes size; ends as soon as the reader scrolls anywhere else
// (whatever they used: wheel, keys, touch, dragging the scrollbar), on any
// input that's about to scroll, or after `maxMs`. `onEnd` runs once when the hold ends, however it
// ends — e.g. to re-check which section is now on screen.

export interface ScrollHold {
  /** True until the hold ends. */
  active: () => boolean;
  /** End the hold now. */
  cancel: () => void;
}

const USER_INPUT = ['wheel', 'touchstart', 'keydown', 'mousedown'] as const;

export const holdScroll = (
  getTop: () => number,
  watch: Element | null,
  { maxMs = 2500, onEnd }: { maxMs?: number; onEnd?: () => void } = {}
): ScrollHold => {
  let active = true;
  // Where the hold last put the page (after the browser clamped it).
  let heldAt = 0;
  const apply = () => {
    if (!active) return;
    window.scrollTo({ top: getTop(), behavior: 'instant' });
    heldAt = window.scrollY;
  };
  apply();
  // Any scroll that leaves the page somewhere other than where the hold put
  // it is the reader taking over — including ways that fire no input event
  // first, like dragging the scrollbar.
  const handleScroll = () => {
    if (Math.abs(window.scrollY - heldAt) > 2) cancel();
  };
  const resizeObserver = new ResizeObserver(apply);
  if (watch) resizeObserver.observe(watch);
  const cancel = () => {
    if (!active) return;
    active = false;
    resizeObserver.disconnect();
    clearTimeout(timer);
    USER_INPUT.forEach((type) => window.removeEventListener(type, cancel));
    window.removeEventListener('scroll', handleScroll);
    onEnd?.();
  };
  USER_INPUT.forEach((type) => window.addEventListener(type, cancel, { passive: true }));
  window.addEventListener('scroll', handleScroll, { passive: true });
  const timer = setTimeout(cancel, maxMs);
  return { active: () => active, cancel };
};
