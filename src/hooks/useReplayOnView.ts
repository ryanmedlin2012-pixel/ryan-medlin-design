import { useEffect, useState } from 'react';

// Unique to this page load, so a replay never reuses an image the browser
// kept in memory from before a refresh (whose animation clock carries on).
const PAGE_LOAD = Date.now().toString(36);

// Replays an animated image (an SVG that plays once) each time it comes back
// into view: its address gains a fresh query (?play=…), so the browser loads
// it as a new image, from the start. On the home page, say, a reader might
// reach it long after the page loaded, or leave and come back.
//
// (A query rather than a #fragment: a fragment restarts CSS animations, but
// Chrome keeps the same SVG document — and so its SMIL clock — across a
// fragment change, so an SVG animated with SMIL would carry on from where it
// was rather than start again.)
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

  const replaySrc =
    // (An image inlined as a data: URI can't take a query; a fragment it is.)
    src.startsWith('data:')
      ? `${src}#play-${play}`
      : `${src}${src.includes('?') ? '&' : '?'}play=${PAGE_LOAD}-${play}`;
  return { ref: setImg, src: enabled && play ? replaySrc : src };
};
