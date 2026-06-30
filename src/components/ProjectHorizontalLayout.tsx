import { useState, useRef, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './ProjectHorizontalLayout.module.css';
import { PanelImageSlot } from './PanelImageSlot';
import type { ImageSlot } from './PanelImageSlot';
import { useMediaQuery } from '../hooks/useMediaQuery';

export interface PanelData {
  sectionLabel: string;
  heading: string;
  content: ReactNode;
  imageSlot: ImageSlot;
}

interface Props {
  panels: PanelData[];
}

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
  current,
  panels,
  onGo,
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
const PanelContent = ({ panel, index }: { panel: PanelData; index: number }) => (
  <div className={styles.panelInner}>
    <div className={styles.textColumn}>
      {index === 0 && (
        <Link to="/" className={styles.backLink}>
          ← Portfolio
        </Link>
      )}
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
    <div className={styles.imageColumn}>
      <PanelImageSlot slot={panel.imageSlot} />
    </div>
  </div>
);

// ─── Main layout component ────────────────────────────────────────────────────
export const ProjectHorizontalLayout = ({ panels }: Props) => {
  const [currentPanel, setCurrentPanel] = useState(0);
  const isAnimatingRef = useRef(false);
  const currentPanelRef = useRef(0);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const snapContainerRef = useRef<HTMLDivElement>(null);
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    container.scrollTo({
      left: targetLeft,
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
    });
    const timer = setTimeout(() => {
      isAnimatingRef.current = false;
    }, 650);
    return () => clearTimeout(timer);
  }, [currentPanel, useSnapMode, prefersReducedMotion]);

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
      const delta =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(delta) < 3) return;
      const direction = delta > 0 ? 1 : -1;

      // Walk up the DOM: if any scrollable ancestor hasn't hit its boundary
      // in this direction, let the element scroll natively.
      let el = e.target as HTMLElement | null;
      while (el && el !== document.body) {
        const oy = window.getComputedStyle(el).overflowY;
        if (oy === 'auto' || oy === 'scroll') {
          const atTop = el.scrollTop <= 0;
          const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
          if ((direction > 0 && !atBottom) || (direction < 0 && !atTop)) {
            return; // element can still scroll — don't advance panel
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

  // ─── Short landscape or mobile width: vertical fallback ──────────────────
  if (isShortLandscape || isMobileWidth) {
    return (
      <div className={styles.verticalFallback}>
        {panels.map((panel, i) => (
          <div
            key={i}
            className={`${styles.verticalPanel} ${i === 0 ? styles.heroPanel : ''}`}
          >
            {i === 0 && (
              <Link to="/" className={styles.backLink}>
                ← Portfolio
              </Link>
            )}
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
          className={styles.track}
          style={{
            transform: `translateX(calc(-${currentPanel} * 100vw))`,
            transition: 'transform 0.7s cubic-bezier(0.77, 0, 0.175, 1)',
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
