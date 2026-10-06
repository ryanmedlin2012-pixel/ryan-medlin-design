import { useEffect, useState } from 'react';

// Replays an animated image (an SVG that plays once) each time it comes back
// into view: its address gains a fresh fragment, which the browser treats as
// a new image, from the start. On the home page, say, a reader might reach
// it long after the page loaded, or leave and come back.
//
// Returns a ref for the <img> and the src to give it.
export const useReplayOnView = (src: string, enabled = true) => {
  const [play, setPlay] = useState(0);
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!enabled || !img) return;
    // Watch the frame the image sits in — what the reader actually sees —
    // rather than the image, which may be larger than its frame (it's
    // cropped to fill it) and so never look more than partly in view.
    // (Skipping any wrapper that has no box of its own, like a <picture>
    // set to display: contents.)
    let frame: HTMLElement = img;
    for (let el = img.parentElement; el; el = el.parentElement) {
      if (getComputedStyle(el).display !== 'contents') {
        frame = el;
        break;
      }
    }
    // Only a return counts: an image already in view on load is playing.
    let away = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio === 0) away = true;
        else if (away && entry.intersectionRatio >= 0.5) {
          away = false;
          setPlay((p) => p + 1);
        }
      },
      { threshold: [0, 0.5] }
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [enabled, img]);

  return { ref: setImg, src: enabled && play ? `${src}#play-${play}` : src };
};
