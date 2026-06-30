import { useEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import styles from './HorizontalLayout.module.css';
import { useLayout, SECTION_LABELS } from '../context/LayoutContext';
import { SectionDots } from './SectionDots';
import { ProgressBar } from './ProgressBar';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface HorizontalLayoutProps {
  sections: ReactNode[];
}

export const HorizontalLayout = ({ sections }: HorizontalLayoutProps) => {
  const {
    currentSection,
    goToSection,
    wheelHandlersRef,
    isAnimating,
    setIsAnimating,
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

    if (Math.abs(container.scrollLeft - targetLeft) < 5) {
      // Already at position — clear animating immediately
      setIsAnimating(false);
      return;
    }

    container.scrollTo({
      left: targetLeft,
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
    });

    // Reset animating once scroll completes
    const timer = setTimeout(() => setIsAnimating(false), 650);
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
    if (isShortLandscape) return;

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
  }, [isShortLandscape, goToSection, wheelHandlersRef]);

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

  // Focus management: move focus to section heading on JS mode navigation
  useEffect(() => {
    if (!useJSMode) return;
    const headings = document.querySelectorAll<HTMLElement>('[data-section-heading]');
    const heading = headings[currentSection];
    if (heading) {
      setTimeout(() => heading.focus({ preventScroll: true }), 720);
    }
  }, [currentSection, useJSMode]);

  // ─── Short landscape or mobile width → vertical fallback ──────────────────
  if (isShortLandscape || isMobileWidth) {
    return (
      <div className={styles.verticalContainer}>
        {sections.map((section, i) => (
          <div key={i}>{section}</div>
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
    transition: 'transform 0.7s cubic-bezier(0.77, 0, 0.175, 1)',
  };

  return (
    <>
      <ProgressBar />
      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={trackStyle}
          onTransitionEnd={handleTransitionEnd}
        >
          {sections.map((section, i) => (
            <div
              key={i}
              ref={(el) => { panelRefs.current[i] = el; }}
              className={styles.panel}
              role="region"
              aria-label={SECTION_LABELS[i]}
            >
              <div className={styles.panelFrame}>
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
