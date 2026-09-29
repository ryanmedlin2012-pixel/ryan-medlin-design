import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import styles from './ProjectHorizontalLayout.module.css';
import { PanelImageSlot } from './PanelImageSlot';
import type { ImageSlot } from './PanelImageSlot';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { readRestored, saveRestorable } from '../hooks/restore';

export interface PanelData {
  sectionLabel: string;
  heading: string;
  content: ReactNode;
  imageSlot: ImageSlot;
  /**
   * 'mediaBelow' puts the text in three columns across the top (label and
   * heading, body, extras such as a strip nav) with the media full width below.
   */
  layout?: 'default' | 'mediaBelow';
}

interface Props {
  panels: PanelData[];
}

const TRACK_TRANSITION = 'transform 0.7s cubic-bezier(0.77, 0, 0.175, 1)';

// ─── Local progress bar ───────────────────────────────────────────────────────
const ProgressBar = ({ current, total }: { current: number; total: number }) => {
  const progress = total > 1 ? (current / (total - 1)) * 100 : 100;
  return (
    <div
      className={styles.progressTrack}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Project navigation progress"
    >
      <div className={styles.progressFill} style={{ width: `${progress}%` }} />
    </div>
  );
};

// ─── Local section dots ───────────────────────────────────────────────────────
const SectionDots = ({
  current, panels, onGo,
}: {
  current: number;
  panels: PanelData[];
  onGo: (i: number) => void;
}) => (
  <div className={styles.sectionDots} role="tablist" aria-label="Project sections">
    {panels.map((panel, i) => (
      <button
        key={i}
        role="tab"
        aria-selected={i === current}
        aria-label={`Go to ${panel.sectionLabel}`}
        className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
        onClick={() => onGo(i)}
      />
    ))}
  </div>
);

// ─── Panel content template ───────────────────────────────────────────────────
// Keeps the image slot's top edge level with the section heading, however
// many lines the section label above it wraps onto. Off for a media-below
// strip, which positions itself under its nav instead.
const useAlignImageToText = (enabled = true) => {
  const textColumnRef = useRef<HTMLDivElement>(null);
  const imageColumnRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const textColumn = textColumnRef.current;
    const imageColumn = imageColumnRef.current;
    const heading = textColumn?.querySelector('[data-panel-heading]');
    if (!enabled || !textColumn || !imageColumn || !heading) return;

    const align = () => {
      // Add back the text column's scroll so the offset is its resting position.
      const offset =
        heading.getBoundingClientRect().top -
        imageColumn.getBoundingClientRect().top +
        textColumn.scrollTop;
      imageColumn.style.paddingTop = `${Math.max(0, offset)}px`;
    };

    align();
    const observer = new ResizeObserver(align);
    Array.from(textColumn.children).forEach((child) => observer.observe(child));
    observer.observe(imageColumn);
    document.fonts?.ready.then(align);
    return () => observer.disconnect();
  }, [enabled]);

  return { textColumnRef, imageColumnRef };
};

// Space between the nav's steps and the strip, in rem so it scales with the
// root font size like the rest of the layout's spacing.
const STRIP_GAP_BELOW_NAV_REM = 2.5;

// Places a media-below strip directly under the nav that drives it: starting
// at the nav's left edge, just below its steps, and running to the panel's
// right content edge. Measuring the nav directly — rather than sizing the
// strip's column from CSS — means the strip's own wide scrollable content
// never influences the layout.
// `imageColumnRef` is the same ref already attached to the strip's column
// via useAlignImageToText — reusing it means there's nothing to merge onto
// that DOM node, just one more effect reading it.
const useMatchStripWidthToNav = (
  enabled: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>,
  imageColumnRef: React.RefObject<HTMLDivElement | null>
) => {
  useLayoutEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    const stripColumn = imageColumnRef.current;
    const nav = container?.querySelector<HTMLElement>('[data-strip-nav]');
    if (!container || !stripColumn || !nav) return;

    const sync = () => {
      const navRect = nav.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const containerStyle = getComputedStyle(container);
      const paddingLeft = parseFloat(containerStyle.paddingLeft) || 0;
      // Start the strip where the nav starts, so the two read as one column,
      // and bleed it past the section's padding to the panel's (i.e. the
      // browser's) right edge, so the peeking next screen is only ever cut
      // off by the window.
      const panelRight = (container.parentElement ?? container).getBoundingClientRect().right;
      stripColumn.style.width = `${panelRight - navRect.left}px`;
      stripColumn.style.marginLeft = `${navRect.left - containerRect.left - paddingLeft}px`;
      // Lift the strip from below the whole text row to just under the nav.
      // It stretches in its grid row, so a negative top margin also makes it
      // taller by the same amount rather than leaving a gap at the bottom.
      const currentMargin = parseFloat(stripColumn.style.marginTop) || 0;
      const naturalTop = stripColumn.getBoundingClientRect().top - currentMargin;
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const gap = STRIP_GAP_BELOW_NAV_REM * rem;
      stripColumn.style.marginTop = `${navRect.bottom + gap - naturalTop}px`;
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(nav);
    observer.observe(container);
    // The panel keeps widening past the container's max width, which moves
    // the edge the strip bleeds to.
    if (container.parentElement) observer.observe(container.parentElement);
    document.fonts?.ready.then(sync);
    return () => observer.disconnect();
  }, [enabled, containerRef, imageColumnRef]);
};

// A section's text column scrolls on its own when its copy is long; remember
// how far, per section, for a refresh.
const useRestoreTextScroll = (
  textColumnRef: React.RefObject<HTMLDivElement | null>,
  index: number
) => {
  useEffect(() => {
    const column = textColumnRef.current;
    if (!column) return;
    const key = `textScroll:${index}`;
    const saved = readRestored<number>(key);
    let frame = 0;
    if (typeof saved === 'number' && saved > 0) {
      column.scrollTop = saved;
      // Fonts can still change the text's height for a frame; apply again.
      frame = requestAnimationFrame(() => {
        column.scrollTop = saved;
      });
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    const handleScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => saveRestorable(key, Math.round(column.scrollTop)), 150);
    };
    column.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      column.removeEventListener('scroll', handleScroll);
    };
  }, [textColumnRef, index]);
};

const PanelContent = ({ panel, index }: { panel: PanelData; index: number }) => {
  const isStripBelow = panel.layout === 'mediaBelow' && panel.imageSlot.type === 'strip';
  const { textColumnRef, imageColumnRef } = useAlignImageToText(!isStripBelow);
  useRestoreTextScroll(textColumnRef, index);
  const containerRef = useRef<HTMLDivElement>(null);
  useMatchStripWidthToNav(isStripBelow, containerRef, imageColumnRef);
  const innerClass =
    panel.layout === 'mediaBelow'
      ? `${styles.panelInner} ${styles.panelInnerMediaBelow}`
      : styles.panelInner;
  return (
    <div ref={containerRef} className={innerClass} data-layout={panel.layout ?? 'default'}>
      <div ref={textColumnRef} className={styles.textColumn}>
        <span className={styles.sectionLabel}>{panel.sectionLabel}</span>
        {index === 0 ? (
          <h1
            className={`${styles.panelHeading} ${styles.panelHeadingLarge}`}
            data-panel-heading="true"
            tabIndex={-1}
          >
            {panel.heading}
          </h1>
        ) : (
          <h2
            className={styles.panelHeading}
            data-panel-heading="true"
            tabIndex={-1}
          >
            {panel.heading}
          </h2>
        )}
        <div className={styles.textContent}>{panel.content}</div>
      </div>
      <div
        ref={imageColumnRef}
        className={isStripBelow ? `${styles.imageColumn} ${styles.imageColumnStrip}` : styles.imageColumn}
      >
        <PanelImageSlot slot={panel.imageSlot} />
      </div>
    </div>
  );
};

// ─── Section ↔ URL hash ───────────────────────────────────────────────────────
// Each section is addressable as #<number>-<name> (from its label, e.g.
// "05 / Flow" → #05-flow), so a refresh or a shared link lands on it. The
// first section keeps a clean URL. Updates replace the history entry rather
// than pushing one, so Back still leaves the page instead of stepping
// through sections.
const sectionSlug = (panel: PanelData) =>
  panel.sectionLabel
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const VERTICAL_POSITION_KEY = 'verticalPosition';

const panelIndexFromHash = (panels: PanelData[]) => {
  const hash = decodeURIComponent(window.location.hash.slice(1));
  if (!hash) return 0;
  const index = panels.findIndex((panel) => sectionSlug(panel) === hash);
  return index === -1 ? 0 : index;
};

// ─── Main layout component ────────────────────────────────────────────────────
export const ProjectHorizontalLayout = ({ panels }: Props) => {
  const [currentPanel, setCurrentPanel] = useState(() => panelIndexFromHash(panels));
  const isAnimatingRef = useRef(false);
  const currentPanelRef = useRef(currentPanel);
  const verticalPanelRefs = useRef<(HTMLDivElement | null)[]>([]);
  // The first positioning after load jumps straight to the section from the
  // hash; only later moves animate.
  const initialPositionDoneRef = useRef(false);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const snapContainerRef = useRef<HTMLDivElement>(null);
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPointerFine = useMediaQuery('(pointer: fine)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isShortLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');
  const isMobileWidth = useMediaQuery('(max-width: 767px)');

  const useJSMode = isPointerFine && !prefersReducedMotion && !isShortLandscape && !isMobileWidth;
  const useSnapMode = !useJSMode && !isShortLandscape && !isMobileWidth;

  useEffect(() => {
    currentPanelRef.current = currentPanel;
  }, [currentPanel]);

  const goToPanel = useCallback(
    (index: number) => {
      if (index < 0 || index >= panels.length) return;
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      setCurrentPanel(index);
      currentPanelRef.current = index;
    },
    [panels.length]
  );

  // Keep the URL hash on the current section.
  useEffect(() => {
    const slug = currentPanel === 0 ? '' : `#${sectionSlug(panels[currentPanel])}`;
    if (window.location.hash === slug) return;
    const url = `${window.location.pathname}${window.location.search}${slug}`;
    // Keep React Router's own history state intact.
    window.history.replaceState(window.history.state, '', url);
  }, [currentPanel, panels]);

  // Vertical fallback: sections stack down the page, so "going" to one means
  // scrolling the window to it (clear of the fixed nav bar).
  const navHeight = () =>
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64;
  // `offset` is how far into the section to land, in px below its top.
  const scrollToVerticalSection = useCallback(
    (index: number, behavior: ScrollBehavior, offset = 0) => {
      const target = verticalPanelRefs.current[index];
      if (!target) return;
      const sectionTop =
        index === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY - navHeight();
      window.scrollTo({ top: sectionTop + offset, behavior });
    },
    []
  );

  // A hash typed into the address bar (or a same-page link) moves there.
  useEffect(() => {
    const handleHashChange = () => {
      const index = panelIndexFromHash(panels);
      if (index === currentPanelRef.current) return;
      if (isVerticalRef.current) {
        // The scroll observer updates currentPanel as the section arrives.
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        scrollToVerticalSection(index, reduceMotion ? 'instant' : 'smooth');
        return;
      }
      isAnimatingRef.current = false;
      goToPanel(index);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [panels, goToPanel, scrollToVerticalSection]);

  // Body scroll lock
  useEffect(() => {
    if (useJSMode || useSnapMode) {
      document.body.classList.add('horizontal-layout-active');
    } else {
      document.body.classList.remove('horizontal-layout-active');
    }
    return () => document.body.classList.remove('horizontal-layout-active');
  }, [useJSMode, useSnapMode]);

  // Make off-screen panels inert
  useEffect(() => {
    panelRefs.current.forEach((panel, i) => {
      if (!panel) return;
      i !== currentPanel
        ? panel.setAttribute('inert', '')
        : panel.removeAttribute('inert');
    });
  }, [currentPanel]);

  // JS mode: transitionend → release isAnimating lock
  const handleTrackTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== 'transform') return;
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
      cooldownRef.current = setTimeout(() => {
        isAnimatingRef.current = false;
      }, 50);
    },
    []
  );

  // Snap mode: programmatic scroll when panel changes
  useEffect(() => {
    if (!useSnapMode || !snapContainerRef.current) return;
    const container = snapContainerRef.current;
    const targetLeft = currentPanel * window.innerWidth;
    if (Math.abs(container.scrollLeft - targetLeft) < 5) {
      isAnimatingRef.current = false;
      return;
    }
    const instant = prefersReducedMotion || !initialPositionDoneRef.current;
    initialPositionDoneRef.current = true;
    container.scrollTo({
      left: targetLeft,
      behavior: instant ? 'instant' : 'smooth',
    });
    const timer = setTimeout(() => {
      isAnimatingRef.current = false;
    }, instant ? 0 : 650);
    return () => clearTimeout(timer);
  }, [currentPanel, useSnapMode, prefersReducedMotion]);

  // Vertical fallback: start at the section from the hash, then track which
  // section is being read so the hash follows the page as it scrolls.
  const isVertical = isShortLandscape || isMobileWidth;
  const isVerticalRef = useRef(isVertical);
  isVerticalRef.current = isVertical;
  useEffect(() => {
    if (!isVertical) return;
    const sections = verticalPanelRefs.current.filter(Boolean) as HTMLDivElement[];
    const cleanups: (() => void)[] = [];
    // While the page above the target section is still loading (images
    // arriving push it down), hold the target in place rather than letting
    // it drift — and don't let the drift rewrite the hash. Any real scroll by
    // the reader, or 2.5s, ends the hold.
    let settling = false;
    if (!initialPositionDoneRef.current) {
      initialPositionDoneRef.current = true;
      // On a refresh, return to the exact spot saved as the reader scrolled
      // (it also tracks moves made by typing a hash, so it's never staler
      // than the hash); otherwise — a link to a section — land at its top.
      const saved = readRestored<{ index: number; offset: number }>(VERTICAL_POSITION_KEY);
      const fromHash = currentPanelRef.current;
      const savedIndex =
        saved && saved.index >= 0 && saved.index < sections.length ? saved.index : null;
      const target = savedIndex ?? fromHash;
      const offset = savedIndex !== null ? Math.max(0, saved!.offset) : 0;
      if (target > 0 || offset > 0) {
        settling = true;
        currentPanelRef.current = target;
        if (target !== fromHash) setCurrentPanel(target);
        const hold = () => {
          if (settling) scrollToVerticalSection(target, 'instant', offset);
        };
        hold();
        const resizeObserver = new ResizeObserver(hold);
        const container = sections[0]?.parentElement;
        if (container) resizeObserver.observe(container);
        const userEvents = ['wheel', 'touchstart', 'keydown', 'mousedown'] as const;
        const stop = () => {
          settling = false;
          resizeObserver.disconnect();
          userEvents.forEach((type) => window.removeEventListener(type, stop));
        };
        userEvents.forEach((type) => window.addEventListener(type, stop, { passive: true }));
        const timer = setTimeout(stop, 2500);
        cleanups.push(() => {
          // Torn down mid-hold (React dev mode runs effects twice, or a
          // layout mode switch): let the next run start the hold again.
          if (settling) initialPositionDoneRef.current = false;
          clearTimeout(timer);
          stop();
        });
      }
    }
    // A section counts as current once it crosses a line 30% down the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        if (settling) return;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = sections.indexOf(entry.target as HTMLDivElement);
          if (index !== -1 && index !== currentPanelRef.current) {
            currentPanelRef.current = index;
            setCurrentPanel(index);
          }
        });
      },
      { rootMargin: '-30% 0px -69% 0px' }
    );
    sections.forEach((section) => observer.observe(section));

    // Save where the reader is: the section whose top has passed under the
    // nav bar, and how far into it they've scrolled.
    let saveTimer: ReturnType<typeof setTimeout> | undefined;
    const handleScroll = () => {
      if (settling) return;
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        const line = navHeight() + 1;
        let index = 0;
        sections.forEach((section, i) => {
          if (section.getBoundingClientRect().top <= line) index = i;
        });
        const sectionTop =
          index === 0 ? 0 : sections[index].getBoundingClientRect().top + window.scrollY - navHeight();
        saveRestorable(VERTICAL_POSITION_KEY, {
          index,
          offset: Math.round(window.scrollY - sectionTop),
        });
      }, 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(saveTimer);
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [isVertical, scrollToVerticalSection]);

  // Snap mode: sync currentPanel on manual swipe
  useEffect(() => {
    if (!useSnapMode || !snapContainerRef.current) return;
    const container = snapContainerRef.current;
    let timer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const index = Math.round(container.scrollLeft / window.innerWidth);
        const clamped = Math.max(0, Math.min(index, panels.length - 1));
        if (clamped !== currentPanelRef.current) {
          setCurrentPanel(clamped);
          currentPanelRef.current = clamped;
        }
      }, 120);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [useSnapMode, panels.length]);

  // JS mode: wheel handler
  // Respects scrollable ancestors — if the hovered element can still scroll
  // in the gesture direction, lets it scroll rather than advancing the panel.
  useEffect(() => {
    if (!useJSMode) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch-zoom — let browser handle
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = horizontal ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 3) return;
      const direction = delta > 0 ? 1 : -1;

      // Walk up the DOM: if any scrollable ancestor hasn't hit its boundary
      // in this direction, let the element scroll natively. Sideways gestures
      // check sideways scrollers (e.g. an image strip), vertical ones vertical.
      let el = e.target as HTMLElement | null;
      while (el && el !== document.body) {
        const style = window.getComputedStyle(el);
        const overflow = horizontal ? style.overflowX : style.overflowY;
        if (overflow === 'auto' || overflow === 'scroll') {
          const pos = horizontal ? el.scrollLeft : el.scrollTop;
          const size = horizontal ? el.clientWidth : el.clientHeight;
          const total = horizontal ? el.scrollWidth : el.scrollHeight;
          const atStart = pos <= 0;
          const atEnd = pos + size >= total - 2;
          if (total > size && ((direction > 0 && !atEnd) || (direction < 0 && !atStart))) {
            return; // element can still scroll — don't advance panel
          }
          // A sideways scroller at its end keeps the gesture rather than
          // flipping the page, so over-swiping the strip doesn't jump sections.
          if (horizontal && total > size) {
            e.preventDefault();
            return;
          }
        }
        el = el.parentElement;
      }

      e.preventDefault();
      if (isAnimatingRef.current) return;
      goToPanel(currentPanelRef.current + direction);
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [useJSMode, goToPanel]);

  // Keyboard navigation
  useEffect(() => {
    if (isShortLandscape) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (target.isContentEditable) return;
      // Elements that scroll sideways themselves (e.g. an image strip) keep
      // the left/right arrows while focused.
      if (
        (e.key === 'ArrowLeft' || e.key === 'ArrowRight') &&
        target.closest('[data-own-arrow-keys]')
      ) {
        return;
      }
      let direction: number | null = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') direction = 1;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') direction = -1;
      if (direction === null) return;
      e.preventDefault();
      if (isAnimatingRef.current) return;
      goToPanel(currentPanelRef.current + direction);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShortLandscape, goToPanel]);

  // Focus management: move focus to panel heading after transition
  useEffect(() => {
    if (!useJSMode) return;
    const headings = document.querySelectorAll<HTMLElement>('[data-panel-heading]');
    const heading = headings[currentPanel];
    if (heading) setTimeout(() => heading.focus({ preventScroll: true }), 720);
  }, [currentPanel, useJSMode]);

  // Suppress the translateX transition while the window is being resized —
  // 100vw recomputes continuously during a drag-resize, and an always-on
  // transition makes the panel visibly lag/chase the window edge instead of
  // tracking it live.
  useEffect(() => {
    const handleResize = () => {
      if (trackRef.current) trackRef.current.style.transition = 'none';
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        if (trackRef.current) trackRef.current.style.transition = TRACK_TRANSITION;
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, []);

  // ─── Short landscape or mobile width: vertical fallback ──────────────────
  if (isVertical) {
    return (
      <div className={styles.verticalFallback}>
        {panels.map((panel, i) => (
          <div
            key={i}
            ref={(el) => {
              verticalPanelRefs.current[i] = el;
            }}
            className={`${styles.verticalPanel} ${i === 0 ? styles.heroPanel : ''}`}
          >
            <span className={styles.sectionLabel}>{panel.sectionLabel}</span>
            {i === 0 ? (
              <h1 className={styles.panelHeading}>{panel.heading}</h1>
            ) : (
              <h2 className={styles.panelHeading}>{panel.heading}</h2>
            )}
            <div className={styles.textContent}>{panel.content}</div>
            <PanelImageSlot slot={panel.imageSlot} />
          </div>
        ))}
      </div>
    );
  }

  // ─── CSS snap mode ────────────────────────────────────────────────────────
  if (useSnapMode) {
    return (
      <>
        <div ref={snapContainerRef} className={styles.snapContainer}>
          {panels.map((panel, i) => (
            <div
              key={i}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              className={`${styles.snapPanel} ${i === 0 ? styles.heroPanel : ''}`}
              role="region"
              aria-label={panel.sectionLabel}
            >
              <PanelContent panel={panel} index={i} />
            </div>
          ))}
        </div>
        <SectionDots current={currentPanel} panels={panels} onGo={goToPanel} />
      </>
    );
  }

  // ─── JS mode ──────────────────────────────────────────────────────────────
  return (
    <>
      <ProgressBar current={currentPanel} total={panels.length} />
      <div className={styles.viewport}>
        <div
          ref={trackRef}
          className={styles.track}
          style={{
            transform: `translateX(calc(-${currentPanel} * 100vw))`,
            transition: TRACK_TRANSITION,
          }}
          onTransitionEnd={handleTrackTransitionEnd}
        >
          {panels.map((panel, i) => (
            <div
              key={i}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              className={`${styles.panel} ${i === 0 ? styles.heroPanel : ''}`}
              role="region"
              aria-label={panel.sectionLabel}
            >
              <PanelContent panel={panel} index={i} />
            </div>
          ))}
        </div>
      </div>
      <SectionDots current={currentPanel} panels={panels} onGo={goToPanel} />
    </>
  );
};
