import { useState, useCallback, useEffect, useRef } from 'react';
import styles from './PanelImageSlot.module.css';
import lightboxStyles from './ImageLightbox.module.css';
import { ImageLightbox } from './ImageLightbox';
import { ImageStrip } from './ImageStrip';
import { readRestored, saveRestorable } from '../hooks/restore';
import { limitSideCrop } from './limitSideCrop';
import type { StripImage } from './ImageStrip';

export type ImageSlot =
  | { type: 'placeholder' }
  /**
   * `fit: 'contain'` scales the whole image down to fit rather than cropping it.
   * `background` replaces the slot's default gradient — set it to the image's own
   * backdrop colour so a contained image blends into the frame around it.
   * `position` sets where the image sits in the slot (CSS object-position),
   * e.g. 'top' to pin a contained image to the slot's top edge.
   * `fullImage` adds a "See full diagram" button that opens it in a zoomable lightbox.
   * `link` adds the same corner button as a link that opens in a new tab.
   * `maxSideCrop` (in the image's own pixels) caps how much a cover-fit image
   * may lose off its left and right, however tall the slot (see limitSideCrop).
   */
  | {
      type: 'image';
      src: string;
      alt: string;
      fit?: 'cover' | 'contain';
      background?: string;
      position?: string;
      fullImage?: { src: string; alt: string };
      link?: { href: string; label: string };
      maxSideCrop?: number;
    }
  | { type: 'carousel'; images: Array<{ src: string; alt: string }> }
  /**
   * A row of 16:9 screens that scrolls sideways. Put an `ImageStripNav` with the
   * same `id` in the panel's text to drive it.
   */
  | { type: 'strip'; id: string; images: StripImage[] };

interface Props {
  slot: ImageSlot;
}

// Refresh-restore keys, named by the slot's (first) image so each slot on a
// page has its own.
const slotKey = (slot: ImageSlot) =>
  slot.type === 'carousel'
    ? `carousel:${slot.images[0]?.src ?? ''}`
    : slot.type === 'image'
    ? `lightbox:${slot.fullImage?.src ?? slot.src}`
    : '';

export const PanelImageSlot = ({ slot }: Props) => {
  const key = slotKey(slot);
  // A refresh returns to the same slide, and reopens the full-diagram
  // lightbox if it was open (the lightbox restores its own zoom and pan).
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (slot.type !== 'carousel') return 0;
    const saved = readRestored<number>(key);
    return typeof saved === 'number' && saved >= 0 && saved < slot.images.length ? saved : 0;
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(
    () => slot.type === 'image' && !!slot.fullImage && readRestored<boolean>(key) === true
  );

  useEffect(() => {
    if (slot.type === 'carousel') saveRestorable(key, currentIndex);
  }, [slot.type, key, currentIndex]);

  useEffect(() => {
    if (slot.type === 'image' && slot.fullImage) saveRestorable(key, lightboxOpen);
  }, [slot, key, lightboxOpen]);

  const images =
    slot.type === 'carousel'
      ? slot.images
      : slot.type === 'image'
      ? [{ src: slot.src, alt: slot.alt }]
      : [];

  const isCarousel = slot.type === 'carousel' && images.length > 1;
  const background = slot.type === 'image' ? slot.background : undefined;
  const fullImage = slot.type === 'image' ? slot.fullImage : undefined;
  const position = slot.type === 'image' ? slot.position : undefined;
  const link = slot.type === 'image' ? slot.link : undefined;
  const imageStyle = position ? { objectPosition: position } : undefined;
  const maxSideCrop = slot.type === 'image' ? slot.maxSideCrop : undefined;
  const imageRef = maxSideCrop ? limitSideCrop(maxSideCrop) : undefined;
  const slideClass = maxSideCrop ? `${styles.slide} ${styles.slideLimitCrop}` : styles.slide;
  const backgroundStyle = background ? { background } : undefined;
  const imageClass =
    slot.type === 'image' && slot.fit === 'contain'
      ? `${styles.image} ${styles.imageContain}`
      : styles.image;

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      if (index < 0 || index >= images.length) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
    },
    [isTransitioning, images.length]
  );

  const handleTransitionEnd = useCallback(() => {
    setTimeout(() => setIsTransitioning(false), 50);
  }, []);

  const trackRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Suppress the translateX transition while the window is being resized —
  // the track's transform is percentage-based against its own box, which
  // recomputes continuously during a drag-resize, and an always-on
  // transition makes the slide visibly lag/chase instead of resizing live.
  useEffect(() => {
    const handleResize = () => {
      if (trackRef.current) trackRef.current.style.transition = 'none';
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        if (trackRef.current) trackRef.current.style.transition = '';
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, []);

  if (slot.type === 'strip') {
    return (
      <div className={styles.stripSlot} data-strip-slot>
        <ImageStrip id={slot.id} images={slot.images} />
      </div>
    );
  }

  if (slot.type === 'placeholder') {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder} aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={styles.container} style={backgroundStyle}>
      <div className={styles.viewport}>
        <div
          ref={trackRef}
          className={styles.track}
          style={{ transform: `translateX(calc(-${currentIndex} * 100%))` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {images.map((img, i) => (
            <div key={i} className={slideClass} style={backgroundStyle}>
              <img
                ref={imageRef}
                src={img.src}
                alt={img.alt}
                className={imageClass}
                style={imageStyle}
              />
            </div>
          ))}
        </div>

        {isCarousel && (
          <>
            <button
              className={`${styles.arrow} ${styles.arrowLeft}`}
              onClick={() => goTo(currentIndex - 1)}
              disabled={currentIndex === 0}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className={`${styles.arrow} ${styles.arrowRight}`}
              onClick={() => goTo(currentIndex + 1)}
              disabled={currentIndex === images.length - 1}
              aria-label="Next image"
            >
              ›
            </button>
            <div className={styles.dotBar} role="tablist" aria-label="Image carousel">
              {images.map((img, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === currentIndex}
                  aria-label={`${img.alt}, image ${i + 1} of ${images.length}`}
                  className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
          </>
        )}

        {fullImage && (
          <button
            type="button"
            className={lightboxStyles.trigger}
            onClick={() => setLightboxOpen(true)}
            aria-haspopup="dialog"
          >
            See full diagram
          </button>
        )}

        {link && !fullImage && (
          <a
            className={lightboxStyles.trigger}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
            <span className={lightboxStyles.srOnly}> (opens in a new tab)</span>
          </a>
        )}
      </div>

      {fullImage && lightboxOpen && (
        <ImageLightbox
          src={fullImage.src}
          alt={fullImage.alt}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};
