import { useState, useCallback } from 'react';
import styles from './PanelImageSlot.module.css';

export type ImageSlot =
  | { type: 'placeholder' }
  | { type: 'image'; src: string; alt: string }
  | { type: 'carousel'; images: Array<{ src: string; alt: string }> };

interface Props {
  slot: ImageSlot;
}

export const PanelImageSlot = ({ slot }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const images =
    slot.type === 'carousel'
      ? slot.images
      : slot.type === 'image'
      ? [{ src: slot.src, alt: slot.alt }]
      : [];

  const isCarousel = slot.type === 'carousel' && images.length > 1;

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

  if (slot.type === 'placeholder') {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder} aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={{ transform: `translateX(calc(-${currentIndex} * 100%))` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {images.map((img, i) => (
            <div key={i} className={styles.slide}>
              <img src={img.src} alt={img.alt} className={styles.image} />
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
      </div>
    </div>
  );
};
