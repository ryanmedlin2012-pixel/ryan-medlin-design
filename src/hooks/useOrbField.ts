import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';

// Moves the hero's blobs as a free-floating field. Each drifts slowly in its
// own direction, bouncing off the others (bigger blobs are heavier) and off
// the hero's edges, which they may slip partly past before turning back. The
// mouse pushes nearby blobs away. A gentle pull toward a cruising speed keeps
// the field alive without letting it get frantic: pushes and bounces liven
// it up for a moment, then it settles back to a steady drift. Hits make a
// blob squish: it squashes along the line of impact and wobbles back into
// shape like jelly, more for harder hits.
//
// Positions and squish are applied with the CSS `translate` and `scale`
// properties, so they combine with the blobs' morph animation (which uses
// `transform`). The loop pauses
// while the hero is off screen or the tab is hidden; for reduced motion the
// blobs are simply placed, and stay still.

const TUNING = {
  /** Speed the field settles back to (px/frame). */
  cruise: 0.35,
  /** How quickly speeds return to cruise (0–1 per frame). */
  settle: 0.012,
  /** Top speed (px/frame). */
  maxSpeed: 4.5,
  /** How much speed survives a bounce (1 = perfectly elastic). */
  restitution: 0.92,
  /** How far past the hero's edge a blob may slip, as a share of its size. */
  edgeBleed: 0.3,
  /** How far beyond a blob's edge the pointer starts to push it (px). */
  reach: 100,
  /** Push strength at the blob's edge (px/frame²), fading to 0 at `reach`. */
  push: 0.55,
  /** Share of the blobs' diameter treated as solid when they meet — a little
      under 1, so soft outlines can touch before bouncing. */
  solidity: 0.94,
  /** Grid positions snap to under a lo-fi treatment (px). */
  lofiSnap: 2,
  /** Squish per unit of impact speed. */
  squishKick: 0.09,
  /** How firmly a squished blob springs back, and how quickly the wobble dies. */
  squishSpring: 0.07,
  squishDamping: 0.1,
  /** Deepest squish (share of size). */
  maxSquish: 0.13,
};

interface Body {
  el: HTMLElement;
  r: number;
  mass: number;
  /** Centre, in hero coordinates. */
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Current squash (positive = flattened along the impact axis) and its rate. */
  squish: number;
  squishV: number;
  /** Whether the last impact came mostly from the side (else from above/below). */
  squishSideways: boolean;
}

/** Squish a blob with a hit of `speed` along direction (nx, ny). */
const jolt = (b: Body, speed: number, nx: number, ny: number) => {
  b.squishSideways = Math.abs(nx) >= Math.abs(ny);
  b.squishV += Math.min(speed, 3) * TUNING.squishKick;
};

export const useOrbField = (layerRef: RefObject<HTMLElement | null>) => {
  useLayoutEffect(() => {
    const layer = layerRef.current;
    const hero = layer?.parentElement;
    if (!layer || !hero) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lofi = layer.dataset.lofi;
    const snap = lofi && lofi !== 'smooth' ? TUNING.lofiSnap : 0;

    let width = hero.clientWidth;
    let height = hero.clientHeight;
    let pointer: { x: number; y: number } | null = null;
    let frame = 0;
    let onScreen = true;

    // Scatter the blobs across the hero without overlaps (as far as a few
    // tries allow), each heading off in its own direction.
    const bodies: Body[] = Array.from(layer.querySelectorAll<HTMLElement>('span'))
      .filter((el) => getComputedStyle(el).display !== 'none')
      .map((el) => {
        const r = (el.offsetWidth / 2) * TUNING.solidity;
        const angle = Math.random() * Math.PI * 2;
        const speed = TUNING.cruise * (0.6 + Math.random() * 0.8);
        return {
          el,
          r,
          mass: r * r,
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          squish: 0,
          squishV: 0,
          squishSideways: true,
        };
      })
      // Place the biggest first, while there's the most room.
      .sort((a, b) => b.r - a.r);
    const placed: Body[] = [];
    for (const b of bodies) {
      let best = { x: Math.random() * width, y: Math.random() * height, overlap: Infinity };
      for (let attempt = 0; attempt < 40 && best.overlap > 0; attempt++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const overlap = placed.reduce(
          (sum, o) => sum + Math.max(0, b.r + o.r - Math.hypot(x - o.x, y - o.y)),
          0
        );
        if (overlap < best.overlap) best = { x, y, overlap };
      }
      b.x = best.x;
      b.y = best.y;
      placed.push(b);
    }

    const render = () => {
      for (const b of bodies) {
        const half = b.el.offsetWidth / 2;
        let x = b.x - half;
        let y = b.y - half;
        if (snap) {
          x = Math.round(x / snap) * snap;
          y = Math.round(y / snap) * snap;
        }
        b.el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
        // Flatten along the impact axis, bulging a little the other way.
        const squash = b.squish;
        const along = (1 - squash).toFixed(3);
        const across = (1 + squash * 0.85).toFixed(3);
        b.el.style.scale =
          Math.abs(squash) < 0.002 ? '' : b.squishSideways ? `${along} ${across}` : `${across} ${along}`;
      }
    };

    const step = () => {
      for (const b of bodies) {
        // The pointer pushes away, harder the closer it is.
        if (pointer) {
          const dx = b.x - pointer.x;
          const dy = b.y - pointer.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const reach = b.r + TUNING.reach;
          if (dist < reach) {
            const strength = TUNING.push * (1 - dist / reach);
            b.vx += (dx / dist) * strength;
            b.vy += (dy / dist) * strength;
            jolt(b, strength * 0.6, dx / dist, dy / dist);
          }
        }
        // Ease back toward cruising speed, keeping direction.
        const speed = Math.hypot(b.vx, b.vy) || 0.001;
        const target = speed + (TUNING.cruise - speed) * TUNING.settle;
        const capped = Math.min(target, TUNING.maxSpeed);
        b.vx = (b.vx / speed) * capped;
        b.vy = (b.vy / speed) * capped;
        b.x += b.vx;
        b.y += b.vy;
        // Bounce off the hero's edges, allowing a partial slip past them.
        const bleed = b.r * 2 * TUNING.edgeBleed;
        const minX = b.r - bleed;
        const maxX = width - b.r + bleed;
        const minY = b.r - bleed;
        const maxY = height - b.r + bleed;
        if (b.x < minX || b.x > maxX) {
          jolt(b, Math.abs(b.vx), 1, 0);
          b.x = b.x < minX ? minX : maxX;
          b.vx = b.x === minX ? Math.abs(b.vx) : -Math.abs(b.vx);
        }
        if (b.y < minY || b.y > maxY) {
          jolt(b, Math.abs(b.vy), 0, 1);
          b.y = b.y < minY ? minY : maxY;
          b.vy = b.y === minY ? Math.abs(b.vy) : -Math.abs(b.vy);
        }
      }

      // Blobs that meet bounce apart, as if they had weight.
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i];
          const b = bodies[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const overlap = a.r + b.r - dist;
          if (overlap <= 0) continue;
          const nx = dx / dist;
          const ny = dy / dist;
          const total = a.mass + b.mass;
          // Separate them, the lighter one moving further.
          a.x -= nx * overlap * (b.mass / total);
          a.y -= ny * overlap * (b.mass / total);
          b.x += nx * overlap * (a.mass / total);
          b.y += ny * overlap * (a.mass / total);
          // Exchange momentum along the line between them, if closing.
          const closing = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
          if (closing > 0) {
            jolt(a, closing, nx, ny);
            jolt(b, closing, nx, ny);
            const impulse = ((1 + TUNING.restitution) * closing) / total;
            a.vx -= impulse * b.mass * nx;
            a.vy -= impulse * b.mass * ny;
            b.vx += impulse * a.mass * nx;
            b.vy += impulse * a.mass * ny;
          }
        }
      }

      // Squished blobs spring back, overshooting a little — a jelly wobble.
      for (const b of bodies) {
        b.squishV += -b.squish * TUNING.squishSpring - b.squishV * TUNING.squishDamping;
        b.squish = Math.max(-TUNING.maxSquish, Math.min(TUNING.maxSquish, b.squish + b.squishV));
      }

      render();
      frame = requestAnimationFrame(step);
    };

    const start = () => {
      if (!frame && !reducedMotion && onScreen && !document.hidden) {
        frame = requestAnimationFrame(step);
      }
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    render();
    start();

    // Pause while the hero is off screen (another section showing) or the
    // tab is hidden.
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    visibility.observe(hero);
    const handleVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', handleVisibility);

    // The mouse (not touch — there's no hover) pushes blobs away.
    const handleMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const rect = hero.getBoundingClientRect();
      pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleLeave = () => {
      pointer = null;
    };
    hero.addEventListener('pointermove', handleMove);
    hero.addEventListener('pointerleave', handleLeave);

    // Keep everything inside a resized hero, scaled to where it was.
    const resize = new ResizeObserver(() => {
      const newWidth = hero.clientWidth;
      const newHeight = hero.clientHeight;
      if (!newWidth || !newHeight || (newWidth === width && newHeight === height)) return;
      for (const b of bodies) {
        b.x *= newWidth / width;
        b.y *= newHeight / height;
        b.r = (b.el.offsetWidth / 2) * TUNING.solidity;
        b.mass = b.r * b.r;
      }
      width = newWidth;
      height = newHeight;
      render();
    });
    resize.observe(hero);

    return () => {
      stop();
      visibility.disconnect();
      resize.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      hero.removeEventListener('pointermove', handleMove);
      hero.removeEventListener('pointerleave', handleLeave);
      bodies.forEach((b) => {
        b.el.style.translate = '';
        b.el.style.scale = '';
      });
    };
  }, [layerRef]);
};
