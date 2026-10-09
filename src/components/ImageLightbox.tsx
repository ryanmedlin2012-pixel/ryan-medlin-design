import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './ImageLightbox.module.css';

interface Props {
  src: string;
  alt: string;
  onClose: () => void;
  /** Text shown under the image (a gallery piece's description). */
  caption?: string;
  /** What the image is, for its labels: "diagram" (default), "poster"… */
  noun?: string;
  /** Fit the image with room round it and a fine grey edge — for printed
      pieces, which don't run edge to edge like a diagram. */
  framed?: boolean;
}

// The room left round a framed image when it's fitted to the window.
const FRAMED_GUTTER = 32;

/**
 * Where the viewer left an image: its scale (rendered px / natural px) and the
 * point of the image at the centre of the viewport, as 0–1 fractions. Stored
 * per image so reopening the lightbox restores the same zoom and position,
 * even if the window has been resized in between.
 */
interface ViewState {
  scale: number;
  cx: number;
  cy: number;
}

const MAX_SCALE = 1;
const ZOOM_STEP = 1.5;
const storageKey = (src: string) => `lightbox-view:${src}`;
const memoryViews = new Map<string, ViewState>();

const loadView = (src: string): ViewState | null => {
  const inMemory = memoryViews.get(src);
  if (inMemory) return inMemory;
  try {
    const raw = sessionStorage.getItem(storageKey(src));
    return raw ? (JSON.parse(raw) as ViewState) : null;
  } catch {
    return null;
  }
};

const saveView = (src: string, view: ViewState) => {
  memoryViews.set(src, view);
  try {
    sessionStorage.setItem(storageKey(src), JSON.stringify(view));
  } catch {
    // Storage unavailable — the in-memory copy still covers this visit.
  }
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const ImageLightbox = ({
  src,
  alt,
  onClose,
  caption,
  noun = 'diagram',
  framed = false,
}: Props) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  // Scale lives in a ref so pinch gestures can resize the image every frame
  // without re-rendering; `scaleLabel` only drives the button states.
  const scaleRef = useRef(0);
  const naturalRef = useRef({ w: 0, h: 0 });
  const [scaleLabel, setScaleLabel] = useState({ scale: 0, min: 0 });
  const [ready, setReady] = useState(false);

  // The caption sits just under the image, and the two are centred together,
  // so the image's fit and position allow for the caption's height (and the
  // gap above it).
  const captionBlock = useCallback(() => {
    const el = captionRef.current;
    if (!el) return 0;
    return el.offsetHeight + parseFloat(getComputedStyle(el).marginTop || '0');
  }, []);

  const minScale = useCallback(() => {
    const scroller = scrollerRef.current;
    const { w, h } = naturalRef.current;
    if (!scroller || !w || !h) return 1;
    const gutter = framed ? FRAMED_GUTTER * 2 : 0;
    return Math.min(
      (scroller.clientWidth - gutter) / w,
      (scroller.clientHeight - gutter - captionBlock()) / h,
      MAX_SCALE,
    );
  }, [framed, captionBlock]);

  // The image is centred inside the scroller while it is smaller than it, so
  // its left/top edge sits this far into the scrollable content.
  const imageOffset = useCallback((scale: number) => {
    const scroller = scrollerRef.current!;
    const { w, h } = naturalRef.current;
    return {
      x: Math.max(0, (scroller.clientWidth - w * scale) / 2),
      y: Math.max(0, (scroller.clientHeight - h * scale - captionBlock()) / 2),
    };
  }, [captionBlock]);

  const applyScale = useCallback(
    (scale: number) => {
      const img = imgRef.current;
      const { w, h } = naturalRef.current;
      if (!img) return;
      scaleRef.current = scale;
      img.style.width = `${w * scale}px`;
      img.style.height = `${h * scale}px`;
      setScaleLabel({ scale, min: minScale() });
    },
    [minScale],
  );

  /** Zoom to `nextScale`, keeping the image point under (fx, fy) fixed. */
  const zoomAt = useCallback(
    (nextScale: number, fx?: number, fy?: number) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const prev = scaleRef.current;
      const next = clamp(nextScale, minScale(), MAX_SCALE);
      if (next === prev) return;
      const focusX = fx ?? scroller.clientWidth / 2;
      const focusY = fy ?? scroller.clientHeight / 2;
      const prevOffset = imageOffset(prev);
      const px = (scroller.scrollLeft + focusX - prevOffset.x) / prev;
      const py = (scroller.scrollTop + focusY - prevOffset.y) / prev;
      applyScale(next);
      const nextOffset = imageOffset(next);
      scroller.scrollLeft = px * next + nextOffset.x - focusX;
      scroller.scrollTop = py * next + nextOffset.y - focusY;
    },
    [applyScale, imageOffset, minScale],
  );

  const currentView = useCallback((): ViewState | null => {
    const scroller = scrollerRef.current;
    const { w, h } = naturalRef.current;
    const scale = scaleRef.current;
    if (!scroller || !w || !scale) return null;
    const offset = imageOffset(scale);
    return {
      scale,
      cx: (scroller.scrollLeft + scroller.clientWidth / 2 - offset.x) / (w * scale),
      cy: (scroller.scrollTop + scroller.clientHeight / 2 - offset.y) / (h * scale),
    };
  }, [imageOffset]);

  const restoreView = useCallback(
    (view: ViewState) => {
      const scroller = scrollerRef.current!;
      const { w, h } = naturalRef.current;
      const scale = clamp(view.scale, minScale(), MAX_SCALE);
      applyScale(scale);
      const offset = imageOffset(scale);
      scroller.scrollLeft = view.cx * w * scale + offset.x - scroller.clientWidth / 2;
      scroller.scrollTop = view.cy * h * scale + offset.y - scroller.clientHeight / 2;
    },
    [applyScale, imageOffset, minScale],
  );

  const handleLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    naturalRef.current = { w: img.naturalWidth, h: img.naturalHeight };
    restoreView(loadView(src) ?? { scale: 0, cx: 0.5, cy: 0.5 });
    setReady(true);
  };

  // A cached image can finish loading before React attaches onLoad.
  useLayoutEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth) handleLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = useCallback(() => {
    const view = currentView();
    if (view) saveView(src, view);
    onClose();
  }, [currentView, onClose, src]);

  // Remember the position continuously too, in case the page is left
  // without closing the lightbox.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !ready) return;
    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const view = currentView();
        if (view) saveView(src, view);
      });
    };
    scroller.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(frame);
    };
  }, [currentView, ready, src]);

  // Keep the view steady when the window resizes.
  useEffect(() => {
    if (!ready) return;
    let view = currentView();
    const handleResize = () => {
      if (view) restoreView(view);
      view = currentView();
    };
    const syncView = () => {
      view = currentView();
    };
    const scroller = scrollerRef.current!;
    scroller.addEventListener('scroll', syncView, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      scroller.removeEventListener('scroll', syncView);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentView, ready, restoreView]);

  // Lock page scroll, move focus into the dialog, and hand it back on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  // Native listeners on the overlay so wheel and key events stop here and
  // never reach the page's own panel-navigation handlers on window.
  useEffect(() => {
    const overlay = overlayRef.current;
    const scroller = scrollerRef.current;
    if (!overlay || !scroller) return;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
      // Trackpad pinch (and ctrl + wheel) arrives as a wheel event with ctrlKey.
      if (!e.ctrlKey) return;
      e.preventDefault();
      const rect = scroller.getBoundingClientRect();
      zoomAt(
        scaleRef.current * Math.exp(-e.deltaY * 0.01),
        e.clientX - rect.left,
        e.clientY - rect.top,
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        zoomAt(scaleRef.current * ZOOM_STEP);
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        zoomAt(scaleRef.current / ZOOM_STEP);
      } else if (e.key === 'Tab') {
        // Keep focus inside the dialog.
        const focusable = overlay.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [tabindex="0"]',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    // Safari's trackpad pinch fires gesture events rather than ctrl + wheel.
    let gestureStartScale = 0;
    const handleGestureStart = (e: Event) => {
      e.preventDefault();
      gestureStartScale = scaleRef.current;
    };
    const handleGestureChange = (e: Event) => {
      e.preventDefault();
      const ge = e as Event & {
        scale: number;
        clientX: number;
        clientY: number;
      };
      const rect = scroller.getBoundingClientRect();
      zoomAt(gestureStartScale * ge.scale, ge.clientX - rect.left, ge.clientY - rect.top);
    };

    // Two-finger pinch on touch screens. One finger scrolls natively.
    let pinchStart: { distance: number; scale: number } | null = null;
    const touchInfo = (touches: TouchList) => {
      const [a, b] = [touches[0], touches[1]];
      const rect = scroller.getBoundingClientRect();
      return {
        distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
        fx: (a.clientX + b.clientX) / 2 - rect.left,
        fy: (a.clientY + b.clientY) / 2 - rect.top,
      };
    };
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinchStart = {
          distance: touchInfo(e.touches).distance,
          scale: scaleRef.current,
        };
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || !pinchStart) return;
      e.preventDefault();
      const { distance, fx, fy } = touchInfo(e.touches);
      zoomAt(pinchStart.scale * (distance / pinchStart.distance), fx, fy);
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinchStart = null;
    };

    overlay.addEventListener('wheel', handleWheel, { passive: false });
    overlay.addEventListener('keydown', handleKeyDown);
    overlay.addEventListener('gesturestart', handleGestureStart);
    overlay.addEventListener('gesturechange', handleGestureChange);
    scroller.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    scroller.addEventListener('touchmove', handleTouchMove, { passive: false });
    scroller.addEventListener('touchend', handleTouchEnd);
    scroller.addEventListener('touchcancel', handleTouchEnd);
    return () => {
      overlay.removeEventListener('wheel', handleWheel);
      overlay.removeEventListener('keydown', handleKeyDown);
      overlay.removeEventListener('gesturestart', handleGestureStart);
      overlay.removeEventListener('gesturechange', handleGestureChange);
      scroller.removeEventListener('touchstart', handleTouchStart);
      scroller.removeEventListener('touchmove', handleTouchMove);
      scroller.removeEventListener('touchend', handleTouchEnd);
      scroller.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [close, zoomAt]);

  // Click-and-drag panning with a mouse (touch already pans natively).
  const dragRef = useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
  } | null>(null);
  const [dragging, setDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const scroller = scrollerRef.current!;
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      left: scroller.scrollLeft,
      top: scroller.scrollTop,
    };
    scroller.setPointerCapture(e.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    const scroller = scrollerRef.current!;
    scroller.scrollLeft = drag.left - (e.clientX - drag.x);
    scroller.scrollTop = drag.top - (e.clientY - drag.y);
  };

  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const zoomPercent = Math.round(scaleLabel.scale * 100);
  const atMin = scaleLabel.scale <= scaleLabel.min + 0.0001;
  const atMax = scaleLabel.scale >= MAX_SCALE - 0.0001;

  return createPortal(
    <div
      ref={overlayRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      aria-describedby={caption ? 'lightbox-caption' : undefined}
    >
      <div className={styles.toolbar}>
        <div className={styles.zoomControls}>
          <button
            type="button"
            className={styles.toolButton}
            onClick={() => zoomAt(scaleRef.current / ZOOM_STEP)}
            disabled={atMin}
            aria-label="Zoom out"
          >
            −
          </button>
          <span className={styles.zoomLevel} aria-live="polite">
            {zoomPercent}%
          </span>
          <button
            type="button"
            className={styles.toolButton}
            onClick={() => zoomAt(scaleRef.current * ZOOM_STEP)}
            disabled={atMax}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            className={`${styles.toolButton} ${styles.fitButton}`}
            onClick={() => zoomAt(minScale())}
            disabled={atMin}
          >
            Fit
          </button>
        </div>
        <button
          ref={closeRef}
          type="button"
          className={styles.toolButton}
          onClick={close}
          aria-label={`Close full ${noun}`}
        >
          ×
        </button>
      </div>

      <div
        ref={scrollerRef}
        className={`${styles.scroller} ${dragging ? styles.dragging : ''}`}
        tabIndex={0}
        aria-label={`${noun[0].toUpperCase()}${noun.slice(1)}. Scroll to pan, pinch or use the zoom buttons to zoom.`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div className={styles.stage}>
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={`${styles.image} ${framed ? styles.imageFramed : ''} ${ready ? styles.imageReady : ''}`}
            onLoad={handleLoad}
            draggable={false}
          />
          {caption && (
            <p ref={captionRef} id="lightbox-caption" className={styles.caption}>
              {caption}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};
