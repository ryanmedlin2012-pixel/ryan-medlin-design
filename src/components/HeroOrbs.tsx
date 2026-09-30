import { useRef } from 'react';
import styles from './HeroOrbs.module.css';
import { useOrbField } from '../hooks/useOrbField';

// A field of outlined greyscale blobs filling the hero, drifting and
// bouncing off one another behind the text (whose fills keep the copy
// legible over them). Each outline squishes as it morphs, and again when it
// hits something, so it reads as soft and organic rather than geometric. The
// look is CSS; the movement is useOrbField. Still for readers who prefer
// reduced motion.
//
// Smooth by default; add ?lofi=<name> to the URL to try an old-school
// digital treatment (see LOFI_STYLES).

type Tone = 'dark' | 'mid' | 'light' | 'pale';

interface Orb {
  tone: Tone;
  /** Width as a multiple of the base size (--s). */
  size: number;
  /** Which of the three outline morphs it follows. */
  shape: 0 | 1 | 2;
  /** Morph cycle length (s) and offset (s), so no two move in step. */
  duration: number;
  delay: number;
}

// The field: a spread of sizes, biggest first. Phones show the first ten.
// Together they cover roughly a quarter of the hero — full, but with room
// to move.
const SIZES = [
  1.3, 1.15, 1.0, 0.95, 0.85, 0.8, 0.7, 0.62, 0.55, 0.48, 0.44, 0.4, 0.36, 0.33, 0.3, 0.27, 0.24,
  0.2,
];

const between = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(options: T[]) => options[Math.floor(Math.random() * options.length)];

// Every load gives each blob a fresh tone, outline and rhythm (the
// field hook scatters them and sets them moving). Chosen once per page load.
const loadOrbs: Orb[] = SIZES.map((size, i) => ({
  // A few pale ones, for air; the rest a random mix of greys.
  tone: i % 5 === 3 ? 'pale' : pick<Tone>(['dark', 'mid', 'light']),
  size,
  shape: pick<Orb['shape']>([0, 1, 2]),
  duration: Math.round(between(5, 9)),
  delay: -Math.round(between(0, 14) * 10) / 10,
}));

// ─── Lo-fi treatments ─────────────────────────────────────────────────────

/**
 * - stepped: slightly stepped morphing, positions snapped to a 2px grid
 * - pixel: the outlines rendered in chunky pixel blocks, stepped morphing
 * - smooth: no lo-fi treatment
 */
const LOFI_STYLES = ['stepped', 'pixel', 'smooth'] as const;
type LofiStyle = (typeof LOFI_STYLES)[number];
const DEFAULT_LOFI: LofiStyle = 'smooth';

const lofiStyle = ((): LofiStyle => {
  const requested = new URLSearchParams(window.location.search).get('lofi');
  return (LOFI_STYLES as readonly string[]).includes(requested ?? '')
    ? (requested as LofiStyle)
    : DEFAULT_LOFI;
})();

const toneClass: Record<Tone, string> = {
  dark: styles.dark,
  mid: styles.mid,
  light: styles.light,
  pale: styles.pale,
};

const shapeClass = [styles.shape0, styles.shape1, styles.shape2];

export const HeroOrbs = () => {
  const ref = useRef<HTMLDivElement>(null);
  useOrbField(ref);

  return (
    <div ref={ref} className={styles.orbs} data-lofi={lofiStyle} aria-hidden="true">
      {/* Pixel treatment: samples the layer in 6px blocks. */}
      <svg className={styles.filters} aria-hidden="true" focusable="false">
        <filter id="hero-orbs-pixelate" x="0" y="0" width="100%" height="100%">
          <feFlood x="2" y="2" width="2" height="2" />
          <feComposite width="6" height="6" />
          <feTile result="grid" />
          <feComposite in="SourceGraphic" in2="grid" operator="in" />
          <feMorphology operator="dilate" radius="3" />
        </filter>
      </svg>
      {loadOrbs.map((orb, i) => (
        <span
          key={i}
          className={`${styles.orb} ${toneClass[orb.tone]} ${shapeClass[orb.shape]}`}
          style={
            {
              '--size': orb.size,
              '--duration': `${orb.duration}s`,
              '--delay': `${orb.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};
