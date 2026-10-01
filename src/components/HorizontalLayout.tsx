import { useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import styles from './HorizontalLayout.module.css';
import { useLayout, SECTION_LABELS, HOME_SECTION_KEY } from '../context/LayoutContext';
import { saveRestorable } from '../hooks/restore';
import { holdScroll } from '../hooks/holdScroll';
import type { ScrollHold } from '../hooks/holdScroll';
import { readingSectionIndex, onWindowScrollFrame } from '../hooks/readingSection';
import { SectionDots } from './SectionDots';
import { ProgressBar } from './ProgressBar';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface HorizontalLayoutProps {
  sections: ReactNode[];
}

const TRACK_TRANSITION = 'transform 0.7s cubic-bezier(0.77, 0, 0.175, 1)';

// Matches the id already set on each section's own root element
// (Hero, FeaturedProjects, Skills, Contact), in currentSection order.
const SECTION_IDS = ['hero', 'projects', 'skills', 'contact'];

// Sections that fill the whole viewport below the nav, edge to edge, rather
// than sitting in the inset, outlined frame the others use (the hero: its
// background and forms run to the window's edges).
const FULL_BLEED_SECTIONS = new Set([0]);

export const HorizontalLayout = ({ sections }: HorizontalLayoutProps) => {
  const {
    currentSection, goToSection, syncSection, wheelHandlersRef, isAnimating, setIsAnimating,
    sectionCount,
  } = useLayout();

  // Responsive mode detection — reactive to viewport changes
  const isPointerFine = useMediaQuery('(pointer: fine)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isShortLandscape = useMediaQuery('(orientation: landscape) and (max-height: 500px)');
  const isMobileWidth = useMediaQuery('(max-width: 767px)');

  const useJSMode = isPointerFine && !prefersReducedMotion && !isShortLandscape && !isMobileWidth;
  const useSnapMode = !useJSMode && !isShortLandscape && !isMobileWidth;

  const snapContainerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The first positioning after load (e.g. a refresh restoring a section)
  // jumps straight there; only later moves animate or scroll smoothly.
  const initialPositionDoneRef = useRef(false);
  // The snap container last positioned — a new one (the layout just swapped
  // into snap mode) is put in place instantly rather than animated.
  const positionedSnapContainerRef = useRef<HTMLDivElement | null>(null);
  const isVerticalRef = useRef(isShortLandscape || isMobileWidth);
  isVerticalRef.current = isShortLandscape || isMobileWidth;

  // Remember the section for a refresh. In the vertical fallback the page is
  // a plain scroll and currentSection doesn't follow it, so nothing's saved.
  useEffect(() => {
    if (isShortLandscape || isMobileWidth) return;
    saveRestorable(HOME_SECTION_KEY, currentSection);
  }, [currentSection, isShortLandscape, isMobileWidth]);

  // Stable refs to avoid stale closures in persistent event listeners
  const currentSectionRef = useRef(currentSection);
  const isAnimatingRef = useRef(isAnimating);
  useEffect(() => { currentSectionRef.current = currentSection; }, [currentSection]);
  useEffect(() => { isAnimatingRef.current = isAnimating; }, [isAnimating]);

  // Prevent body scroll in horizontal mode
  useEffect(() => {
    if (useJSMode || useSnapMode) {
      document.body.classList.add('horizontal-layout-active');
    } else {
      document.body.classList.remove('horizontal-layout-active');
    }
    return () => document.body.classList.remove('horizontal-layout-active');
  }, [useJSMode, useSnapMode]);

  // Make off-screen panels inert so tab focus can't escape into them
  useEffect(() => {
    panelRefs.current.forEach((panel, i) => {
      if (!panel) return;
      if (i !== currentSection) {
        panel.setAttribute('inert', '');
      } else {
        panel.removeAttribute('inert');
      }
    });
  }, [currentSection]);

  // JS mode: reset isAnimating after the translateX transition completes
  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== 'transform') return;
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
      cooldownRef.current = setTimeout(() => setIsAnimating(false), 50);
    },
    [setIsAnimating]
  );

  // Snap mode: scroll to section when currentSection changes (programmatic navigation)
  useEffect(() => {
    if (!useSnapMode || !snapContainerRef.current) return;
    const container = snapContainerRef.current;
    const targetLeft = currentSection * window.innerWidth;
    const freshContainer = positionedSnapContainerRef.current !== container;
    positionedSnapContainerRef.current = container;

    if (Math.abs(container.scrollLeft - targetLeft) < 5) {
      // Already at position — clear animating immediately
      setIsAnimating(false);
      return;
    }

    const instant = prefersReducedMotion || !initialPositionDoneRef.current || freshContainer;
    initialPositionDoneRef.current = true;
    container.scrollTo({
      left: targetLeft,
      behavior: instant ? 'instant' : 'smooth',
    });

    // Reset animating once scroll completes
    const timer = setTimeout(() => setIsAnimating(false), instant ? 0 : 650);
    return () => clearTimeout(timer);
  }, [currentSection, useSnapMode, prefersReducedMotion, setIsAnimating]);

  // Snap mode: sync context when user manually swipes
  useEffect(() => {
    if (!useSnapMode || !snapContainerRef.current) return;
    const container = snapContainerRef.current;
    let timer: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const index = Math.round(container.scrollLeft / window.innerWidth);
        const clamped = Math.max(0, Math.min(index, sectionCount - 1));
        if (clamped !== currentSectionRef.current) {
          currentSectionRef.current = clamped;
          goToSection(clamped);
        }
      }, 120);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [useSnapMode, goToSection, sectionCount]);

  // JS mode: wheel event handler
  useEffect(() => {
    if (!useJSMode) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch-to-zoom — let browser handle
      e.preventDefault();
      if (isAnimatingRef.current) return;

      const delta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 3) return; // dead zone for tiny trackpad movements

      const direction = delta > 0 ? 1 : -1;

      // Give the current section's inner handler first refusal
      const sectionHandler = wheelHandlersRef.current.get(currentSectionRef.current);
      if (sectionHandler) {
        const consumed = sectionHandler(direction);
        if (consumed) return;
      }

      goToSection(currentSectionRef.current + direction);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [useJSMode, goToSection, wheelHandlersRef]);

  // Keyboard navigation (all modes except short landscape)
  useEffect(() => {
    // The stacked layout is an ordinary scrolling page: leave the arrow keys
    // to scroll it (and section tracking to follow), rather than turning
    // them into panel moves that don't scroll anything.
    if (isShortLandscape || isMobileWidth) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      if (target.isContentEditable) return;

      let direction: number | null = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') direction = 1;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') direction = -1;
      if (direction === null) return;

      e.preventDefault();
      if (isAnimatingRef.current) return;

      const sectionHandler = wheelHandlersRef.current.get(currentSectionRef.current);
      if (sectionHandler) {
        const consumed = sectionHandler(direction);
        if (consumed) return;
      }

      goToSection(currentSectionRef.current + direction);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShortLandscape, isMobileWidth, goToSection, wheelHandlersRef]);

  // Hash navigation (supports nav links when coming from other pages)
  useEffect(() => {
    const hashMap: Record<string, number> = {
      '#hero': 0,
      '#projects': 1,
      '#skills': 2,
      '#contact': 3,
    };

    const handleHashChange = () => {
      const index = hashMap[window.location.hash];
      if (index !== undefined) goToSection(index);
    };

    // Check initial hash on mount
    const initialIndex = hashMap[window.location.hash];
    if (initialIndex !== undefined) {
      setTimeout(() => goToSection(initialIndex), 0);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [goToSection]);

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

  // Focus management: move focus to section heading on JS mode navigation
  useEffect(() => {
    if (!useJSMode) return;
    const headings = document.querySelectorAll<HTMLElement>('[data-section-heading]');
    const heading = headings[currentSection];
    if (heading) {
      setTimeout(() => heading.focus({ preventScroll: true }), 720);
    }
  }, [currentSection, useJSMode]);

  // Vertical fallback (mobile / short landscape): a plain scrolling page with
  // no transform-based positioning. Three things move the reader here:
  //  - arriving from a side-by-side layout mid-visit (the window was resized
  //    down): hold on the section being read rather than start at the top;
  //  - a nav click (currentSection changes): scroll there smoothly;
  //  - the first load: nothing, so the browser's own scroll restoration (or
  //    a hash link, which moves currentSection) decides.
  // And the reader's own scrolling updates currentSection, so resizing back
  // up lands on the section they'd reached.
  const isVertical = isShortLandscape || isMobileWidth;
  const hasShownHorizontalRef = useRef(!isVertical);
  const verticalHoldRef = useRef<ScrollHold | null>(null);
  const sectionFromScrollRef = useRef<number | null>(null);
  useEffect(() => {
    if (!isVertical) hasShownHorizontalRef.current = true;
  }, [isVertical]);

  const verticalSectionTop = useCallback((index: number) => {
    const id = SECTION_IDS[index];
    const target = id ? document.getElementById(id) : null;
    if (!target || index === 0) return 0;
    // Offset by the fixed nav bar plus a little breathing room so the
    // section heading doesn't land hidden underneath it.
    const navHeight =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) ||
      64;
    return target.getBoundingClientRect().top + window.scrollY - (navHeight + 24);
  }, []);

  // Swapped in from a side-by-side layout.
  useEffect(() => {
    if (!isVertical || !hasShownHorizontalRef.current) return;
    const target = currentSectionRef.current;
    const container = document.getElementById(SECTION_IDS[0])?.parentElement?.parentElement ?? null;
    let tornDown = false;
    // Section tracking is paused during the hold, so once it ends check
    // which section the reader is actually on.
    const syncToScrollPosition = () => {
      if (tornDown) return;
      const index = readingSectionIndex(SECTION_IDS.map((id) => document.getElementById(id)));
      sectionFromScrollRef.current = index;
      syncSection(index);
    };
    // Everything's already loaded mid-visit, so this settles fast.
    const hold = holdScroll(() => verticalSectionTop(target), container, {
      maxMs: 1000,
      onEnd: syncToScrollPosition,
    });
    verticalHoldRef.current = hold;
    return () => {
      tornDown = true;
      hold.cancel();
      verticalHoldRef.current = null;
    };
  }, [isVertical, verticalSectionTop, syncSection]);

  // Nav clicks.
  const lastSectionRef = useRef(currentSection);
  useEffect(() => {
    if (currentSection === lastSectionRef.current) return;
    lastSectionRef.current = currentSection;
    if (!isVerticalRef.current) return;
    // Changes that came from the reader's own scrolling need no scroll.
    if (sectionFromScrollRef.current === currentSection) return;
    verticalHoldRef.current?.cancel();
    window.scrollTo({
      top: verticalSectionTop(currentSection),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [currentSection, prefersReducedMotion, verticalSectionTop]);

  // The reader's scrolling moves the current section (see readingSectionIndex).
  useEffect(() => {
    if (!isVertical) return;
    return onWindowScrollFrame(() => {
      if (verticalHoldRef.current?.active()) return;
      const index = readingSectionIndex(SECTION_IDS.map((id) => document.getElementById(id)));
      sectionFromScrollRef.current = index;
      syncSection(index);
    });
  }, [isVertical, syncSection]);

  // ─── Short landscape or mobile width → vertical fallback ──────────────────
  if (isVertical) {
    return (
      <div className={styles.verticalContainer}>
        {sections.map((section, i) => (
          <div key={i} className={FULL_BLEED_SECTIONS.has(i) ? styles.verticalFullBleed : undefined}>
            {section}
          </div>
        ))}
      </div>
    );
  }

  // ─── Touch / reduced-motion → CSS snap ────────────────────────────────────
  if (useSnapMode) {
    return (
      <>
        <div ref={snapContainerRef} className={styles.snapContainer}>
          {sections.map((section, i) => (
            <div
              key={i}
              ref={(el) => { panelRefs.current[i] = el; }}
              className={styles.snapPanel}
              role="region"
              aria-label={SECTION_LABELS[i]}
            >
              {section}
            </div>
          ))}
        </div>
        <SectionDots />
      </>
    );
  }

  // ─── Desktop → JS-driven horizontal ───────────────────────────────────────
  const trackStyle: React.CSSProperties = {
    transform: `translateX(calc(-${currentSection} * 100vw))`,
    transition: TRACK_TRANSITION,
  };

  return (
    <>
      <ProgressBar />
      <div className={styles.viewport}>
        <div
          ref={trackRef}
          className={styles.track}
          style={trackStyle}
          onTransitionEnd={handleTransitionEnd}
        >
          {sections.map((section, i) => (
            <div
              key={i}
              ref={(el) => { panelRefs.current[i] = el; }}
              className={
                FULL_BLEED_SECTIONS.has(i) ? `${styles.panel} ${styles.panelFullBleed}` : styles.panel
              }
              role="region"
              aria-label={SECTION_LABELS[i]}
            >
              <div
                className={
                  FULL_BLEED_SECTIONS.has(i)
                    ? `${styles.panelFrame} ${styles.panelFrameFullBleed}`
                    : styles.panelFrame
                }
              >
                {section}
              </div>
            </div>
          ))}
        </div>
      </div>
      <SectionDots />
    </>
  );
};
