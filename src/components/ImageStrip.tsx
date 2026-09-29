import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import styles from './ImageStrip.module.css';
import { readRestored, saveRestorable } from '../hooks/restore';

export interface StripImage {
  /** Leave out to show a 16:9 placeholder until the real image is ready. */
  src?: string;
  alt: string;
  /** Short name shown in the nav, e.g. "Choose players". */
  label: string;
  /** Short paragraph shown under the screen. */
  caption?: string;
}

// ─── Shared state ─────────────────────────────────────────────────────────────
// The strip lives in a panel's image column and its nav lives in the text
// column, so they meet through a small store keyed by the strip's id.

interface StripState {
  active: number;
  scroller: HTMLDivElement | null;
}

const strips = new Map<string, StripState>();
const listeners = new Map<string, Set<() => void>>();

const getStrip = (id: string): StripState => {
  let strip = strips.get(id);
  if (!strip) {
    strip = { active: 0, scroller: null };
    strips.set(id, strip);
  }
  return strip;
};

const notify = (id: string) => listeners.get(id)?.forEach((listener) => listener());

const setActive = (id: string, active: number) => {
  const strip = getStrip(id);
  if (strip.active === active) return;
  strips.set(id, { ...strip, active });
  notify(id);
};

const useStripActive = (id: string) =>
  useSyncExternalStore(
    (listener) => {
      if (!listeners.has(id)) listeners.set(id, new Set());
      listeners.get(id)!.add(listener);
      return () => listeners.get(id)!.delete(listener);
    },
    () => getStrip(id).active
  );

const scrollToIndex = (id: string, index: number) => {
  const scroller = getStrip(id).scroller;
  const item = scroller?.children[index] as HTMLElement | undefined;
  if (!scroller || !item) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  scroller.scrollTo({
    left: item.offsetLeft,
    behavior: reduceMotion ? 'auto' : 'smooth',
  });
  setActive(id, index);
};

// ─── Right column: the scrolling strip ────────────────────────────────────────

export const ImageStrip = ({ id, images }: { id: string; images: StripImage[] }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const strip = getStrip(id);
    strips.set(id, { ...strip, scroller });
    const items = () => Array.from(scroller.children) as HTMLElement[];

    // Where the strip is, saved as the screen nearest its left edge plus how
    // far into that screen it's scrolled (as a fraction of the screen's
    // width), so a refresh at a different window size still lands on the
    // same spot. A fresh visit starts at the first screen — and resets the
    // shared active step, which otherwise outlives the strip between pages.
    const storageKey = `strip:${id}`;
    const saved = readRestored<{ index: number; fraction: number }>(storageKey);
    const restore = () => {
      const list = items();
      if (!saved || !list.length) return;
      const index = Math.max(0, Math.min(saved.index, list.length - 1));
      const item = list[index];
      scroller.scrollLeft = item.offsetLeft + saved.fraction * item.offsetWidth;
    };
    if (saved) {
      restore();
      setActive(id, Math.max(0, Math.min(saved.index, items().length - 1)));
    } else {
      setActive(id, 0);
    }
    // The layout can still settle for a frame (strip width, fonts), so apply
    // the restored position once more after it has.
    const restoreFrame = saved ? requestAnimationFrame(restore) : 0;

    // Keep the nav in step when the strip is scrolled directly (trackpad,
    // touch, scrollbar): once scrolling settles, the active image is the one
    // nearest the left edge. Waiting for it to settle stops the nav flickering
    // through every step during a smooth scroll.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const handleScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const list = items();
        const atEnd = scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 2;
        let nearest = list.length - 1;
        if (!atEnd) {
          let nearestDistance = Infinity;
          list.forEach((item, i) => {
            const distance = Math.abs(item.offsetLeft - scroller.scrollLeft);
            if (distance < nearestDistance) {
              nearest = i;
              nearestDistance = distance;
            }
          });
        }
        setActive(id, nearest);
        const item = list[nearest];
        if (item) {
          saveRestorable(storageKey, {
            index: nearest,
            fraction: (scroller.scrollLeft - item.offsetLeft) / item.offsetWidth,
          });
        }
      }, 100);
    };
    scroller.addEventListener('scroll', handleScroll, { passive: true });

    // Mark screens the strip's right edge cuts off (the strip runs to the
    // window edge, so this is the browser cropping them) so CSS can dim them.
    const cropObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const rootRight = entry.rootBounds?.right ?? Infinity;
          const cropped =
            entry.intersectionRatio < 0.98 && entry.boundingClientRect.right > rootRight + 1;
          (entry.target as HTMLElement).toggleAttribute('data-cropped', cropped);
        });
      },
      { root: scroller, threshold: [0, 0.25, 0.5, 0.75, 0.98, 1] }
    );
    items().forEach((item) => cropObserver.observe(item));

    return () => {
      cancelAnimationFrame(restoreFrame);
      scroller.removeEventListener('scroll', handleScroll);
      cropObserver.disconnect();
      clearTimeout(timer);
      strips.set(id, { ...getStrip(id), scroller: null });
    };
  }, [id]);

  return (
    <div
      ref={scrollerRef}
      id={`strip-${id}`}
      className={styles.strip}
      tabIndex={0}
      data-own-arrow-keys
      role="region"
      aria-label="Screens, scroll sideways to see more"
    >
      {images.map((image, i) => (
        <figure key={i} className={styles.item}>
          <div className={styles.frame}>
            {image.src ? (
              <img src={image.src} alt={image.alt} className={styles.image} draggable={false} />
            ) : (
              <div className={styles.placeholder} role="img" aria-label={image.alt}>
                <span>{image.label}</span>
              </div>
            )}
          </div>
          {image.caption && <figcaption className={styles.caption}>{image.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
};

// ─── Left column: the nav that drives the strip ───────────────────────────────

export const ImageStripNav = ({ id, images }: { id: string; images: StripImage[] }) => {
  const active = useStripActive(id);
  const goTo = useCallback((index: number) => scrollToIndex(id, index), [id]);
  const stepsRef = useRef<HTMLDivElement>(null);
  const navStorageKey = `stripNav:${id}`;
  // While a refresh is putting the steps row back where it was, don't let
  // the follow-the-active-step behaviour below move it somewhere else.
  const holdFollowUntilRef = useRef(0);

  // Save and restore how far the steps row is scrolled (it only scrolls
  // when it overflows, on narrow screens).
  useEffect(() => {
    const steps = stepsRef.current;
    if (!steps) return;
    const saved = readRestored<number>(navStorageKey);
    if (typeof saved === 'number') {
      holdFollowUntilRef.current = performance.now() + 1000;
      steps.scrollLeft = saved;
      requestAnimationFrame(() => {
        steps.scrollLeft = saved;
      });
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    const handleScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => saveRestorable(navStorageKey, Math.round(steps.scrollLeft)), 150);
    };
    steps.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      steps.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [navStorageKey]);

  // When the steps overflow (phones), keep the active one in view as the
  // strip moves. Scrolls only the steps row, never the page.
  useEffect(() => {
    if (performance.now() < holdFollowUntilRef.current) return;
    const steps = stepsRef.current;
    const step = steps?.children[active] as HTMLElement | undefined;
    if (!steps || !step || steps.scrollWidth <= steps.clientWidth) return;
    const left = step.offsetLeft;
    const right = left + step.offsetWidth;
    const visibleRight = steps.scrollLeft + steps.clientWidth - steps.clientWidth * 0.15;
    if (left >= steps.scrollLeft && right <= visibleRight) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    steps.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' });
  }, [active]);

  // Mouse drag-to-scroll for when the steps overflow in a narrow desktop
  // window (touch already swipes natively). A drag only starts past a few
  // pixels, so ordinary clicks still pick a step; the click that ends a drag
  // is swallowed so letting go doesn't also jump the strip.
  const [overflowing, setOverflowing] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const steps = stepsRef.current;
    if (!steps) return;
    const measure = () => setOverflowing(steps.scrollWidth > steps.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(steps);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const steps = stepsRef.current;
    if (!steps) return;
    const DRAG_THRESHOLD = 5;
    let start: { x: number; scrollLeft: number; pointerId: number } | null = null;
    let didDrag = false;

    const handleDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      if (steps.scrollWidth <= steps.clientWidth + 1) return;
      start = { x: e.clientX, scrollLeft: steps.scrollLeft, pointerId: e.pointerId };
      didDrag = false;
    };
    const handleMove = (e: PointerEvent) => {
      if (!start || e.pointerId !== start.pointerId) return;
      const dx = e.clientX - start.x;
      if (!didDrag) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        didDrag = true;
        steps.setPointerCapture(e.pointerId);
        setDragging(true);
      }
      steps.scrollLeft = start.scrollLeft - dx;
    };
    const handleUp = (e: PointerEvent) => {
      if (!start || e.pointerId !== start.pointerId) return;
      if (steps.hasPointerCapture(e.pointerId)) steps.releasePointerCapture(e.pointerId);
      start = null;
      setDragging(false);
    };
    const handleClick = (e: MouseEvent) => {
      if (!didDrag) return;
      didDrag = false;
      e.preventDefault();
      e.stopPropagation();
    };

    steps.addEventListener('pointerdown', handleDown);
    steps.addEventListener('pointermove', handleMove);
    steps.addEventListener('pointerup', handleUp);
    steps.addEventListener('pointercancel', handleUp);
    steps.addEventListener('click', handleClick, true);
    return () => {
      steps.removeEventListener('pointerdown', handleDown);
      steps.removeEventListener('pointermove', handleMove);
      steps.removeEventListener('pointerup', handleUp);
      steps.removeEventListener('pointercancel', handleUp);
      steps.removeEventListener('click', handleClick, true);
    };
  }, []);

  const stepsClass = [
    styles.navSteps,
    overflowing ? styles.navStepsDraggable : '',
    dragging ? styles.navStepsDragging : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.nav} data-strip-nav>
      <div
        ref={stepsRef}
        className={stepsClass}
        role="group"
        aria-label="Choose a screen"
      >
        {images.map((image, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.navStep} ${i === active ? styles.navStepActive : ''}`}
            onClick={() => goTo(i)}
            aria-current={i === active ? 'step' : undefined}
            aria-controls={`strip-${id}`}
          >
            <span className={styles.navNumber}>{i + 1}</span>
            <span className={styles.navLabel} data-text={image.label}>
              {image.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
