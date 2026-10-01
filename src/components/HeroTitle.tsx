import { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';

// The hero heading, which types itself out once per page load: "UX designer",
// then "UX" is struck through by a hand-drawn line and replaced by "UI",
// then "Product", then "Graphic" — each struck through in turn — before it
// settles on "Multidisciplinary designer".
//
// Screen readers get the final heading from the start (the animation is
// hidden from them); an invisible copy of the final text holds its space so
// nothing below shifts as the words change; and it's skipped for readers who
// prefer reduced motion.

const STRUCK = ['UX', 'UI', 'Product', 'Graphic'];
const FINAL = 'Multidisciplinary';
const SUFFIX = ' designer';
const FINAL_TEXT = `${FINAL}${SUFFIX}`;

// The caret's blink (ms): on for half of each cycle, then off for half.
// The sequence keeps this blink itself (rather than CSS), so every change to
// the caret happens exactly on its beat: it only ever appears as a blink
// comes on, and only ever goes away, or starts typing, as a blink ends — so
// every "on" it shows is a whole one, never cut short or brought in late.
const BLINK = 600;
const BLINK_ON = BLINK / 2;

// The caret is there only to type. Once a word is typed it stays on to the
// end of its blink, blinks off on the beat — and doesn't come back on. The
// strike and the deletion play without it (so the two never meet), until it
// comes back to type the next word.
const TIMING = {
  /** Wait once the hero is on screen before starting (ms). */
  startDelay: 250,
  /** Per typed character, varied a little so it reads as human (ms). */
  type: 34,
  typeJitter: 24,
  /** Per deleted character (ms). */
  erase: 20,
  /** Gap between the caret going and the strike starting to draw (ms). */
  caretClear: 80,
  /** How long the strike takes to draw (ms; matches the CSS animation). */
  strike: 260,
  /** How long the strike stays (ms). */
  strikeHold: 240,
  /** How long the strike takes to fade out (ms; matches the CSS). */
  strikeFade: 120,
  /** Gap between the strike disappearing and the word being deleted (ms). */
  strikeClear: 60,
  /** Pause with the caret back in place before it types the next word (ms). */
  beforeTyping: 100,
  // Then "Multidisciplinary" (bold, as every word there is) turns italic.
  /** Pause after the caret's gone, before it leans (ms). */
  beforeLean: 200,
  /** Pause once it's italic, before what's below the heading comes in (ms). */
  beforeDone: 300,
  /** How long it takes to lean to the italic's angle (ms; matches the CSS
      transition), when it becomes the italic proper. */
  lean: 160,
};

// Once per page load: coming back to the home page shows the finished title.
let hasPlayed = false;

interface Strike {
  /** Size of the drawing area (px): the word plus an overshoot each side. */
  width: number;
  height: number;
  /** How far it starts before the word (px). */
  overshoot: number;
  /** Pen width (px). */
  stroke: number;
  d: string;
}

/**
 * A fresh hand-drawn line through a word of the given size (px): starting
 * and ending a little past it, with a gentle wobble and slant. Drawn in real
 * pixels, so the pen width and the draw-on are the same for every word.
 */
const strikeFor = (wordWidth: number, wordHeight: number, fontSize: number): Strike => {
  const r = (spread: number) => (Math.random() * 2 - 1) * spread;
  const overshoot = fontSize * 0.14;
  const width = wordWidth + overshoot * 2;
  const mid = wordHeight * 0.54;
  const wobble = fontSize * 0.05;
  const y0 = mid + r(wobble);
  const y1 = mid + r(wobble * 1.4);
  const d = `M ${(fontSize * 0.04).toFixed(1)} ${y0.toFixed(1)} C ${(width * 0.3 + r(width * 0.06)).toFixed(
    1
  )} ${(y0 - wobble + r(wobble)).toFixed(1)}, ${(width * 0.68 + r(width * 0.06)).toFixed(1)} ${(
    y1 + wobble + r(wobble)
  ).toFixed(1)}, ${(width - fontSize * 0.04).toFixed(1)} ${y1.toFixed(1)}`;
  return { width, height: wordHeight, overshoot, stroke: fontSize * 0.075, d };
};

interface Frame {
  /** The word before " designer", as typed so far. */
  word: string;
  /** How much of " designer" is showing (it's typed once, then stays). */
  suffix: string;
  /** The strike while the word is struck through, else null. */
  strike: Strike | null;
  /** True while the strike fades out. */
  strikeLeaving: boolean;
  /** Whether the caret is showing: held on while typing (as a real caret
      is), blinking once after each word, and otherwise away. */
  caret: boolean;
  /** The word's style: upright; then, for the final word, leaning, then
      italic. */
  style: 'upright' | 'leaning' | 'italic';
  /** While it leans: its width (px), and how much its letters are narrowed
      to fit — so it arrives at the italic's width, and becoming the italic
      moves nothing. */
  lean: { width: number; squeeze: number } | null;
  /** Where the caret sits: after the word, or at the end of the line (while
      typing " designer", the first time). */
  caretAt: 'word' | 'end';
}

const finished: Frame = {
  word: FINAL,
  suffix: SUFFIX,
  strike: null,
  strikeLeaving: false,
  caret: false,
  style: 'italic',
  lean: null,
  caretAt: 'word',
};

/** Whether the heading will type itself out when it next appears (it
    doesn't once it has played, or for readers who prefer reduced motion). */
export const heroTitleWillPlay = () =>
  !hasPlayed &&
  !(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

interface HeroTitleProps {
  /** Called once the heading has finished (typed, and its final word turned
      italic) — so what follows it can come in. */
  onDone?: () => void;
}

/** The lean (deg): about the italic's own angle. */
const LEAN = -10;

const wordStyle: Record<Frame['style'], string> = {
  upright: '',
  leaning: styles.wordLeaning,
  italic: styles.finalWord,
};

export const HeroTitle = ({ onDone }: HeroTitleProps) => {
  // Decided once, when the heading first appears: finishing the animation
  // (which sets hasPlayed) mustn't restart or cancel it partway.
  const [skip] = useState(() => !heroTitleWillPlay());
  // (Kept in a ref, so a new callback each render doesn't restart it.)
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const [frame, setFrame] = useState<Frame>(
    skip
      ? finished
      : { word: '', suffix: '', strike: null, strikeLeaving: false, caret: false, style: 'upright', lean: null, caretAt: 'word' }
  );
  const headingRef = useRef<HTMLHeadingElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const italicRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (skip) return;
    const heading = headingRef.current;
    if (!heading) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => timers.push(setTimeout(resolve, ms)));
    const typeDelay = () => TIMING.type + Math.random() * TIMING.typeJitter;
    const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

    const run = async () => {
      let word = '';
      let suffix = '';
      const show = (patch: Partial<Frame>) => {
        if (!cancelled) setFrame((f) => ({ ...f, ...patch }));
      };

      // ── The blink ──
      // blink() shows the caret and blinks it from there, on the beat of
      // when it started. untilBlinkEnds(n) resolves as the nth "on" from now
      // ends — instead of the caret going off, the blink stops there, and the
      // caller decides, in the same moment, whether it goes or stays on (to
      // type).
      let blinking = false;
      let blinkStart = 0;
      let blinkEnd: { count: number; resolve: () => void } | null = null;
      const tick = (half: number) => {
        const at = blinkStart + half * BLINK_ON;
        timers.push(
          setTimeout(() => {
            if (!blinking || cancelled) return;
            const on = half % 2 === 0;
            if (!on && blinkEnd && --blinkEnd.count === 0) {
              blinking = false;
              const { resolve } = blinkEnd;
              blinkEnd = null;
              resolve();
              return;
            }
            show({ caret: on });
            tick(half + 1);
          }, Math.max(0, at - performance.now()))
        );
      };
      const blink = () => {
        blinking = true;
        blinkStart = performance.now();
        show({ caret: true });
        tick(1);
      };
      // (Only called while the caret is blinking and showing.)
      const untilBlinkEnds = (count: number) =>
        new Promise<void>((resolve) => {
          blinkEnd = { count, resolve };
        });

      // The caret appears and blinks once, then starts typing as its next
      // "on" ends.
      blink();
      await untilBlinkEnds(2);
      if (cancelled) return;
      for (const next of [...STRUCK, FINAL]) {
        // Type the word (and, the first time, " designer" after it), with
        // the caret held on.
        for (const ch of next) {
          await wait(typeDelay());
          if (cancelled) return;
          word += ch;
          show({ word });
        }
        for (const ch of SUFFIX.slice(suffix.length)) {
          await wait(typeDelay());
          if (cancelled) return;
          suffix += ch;
          show({ suffix, caretAt: 'end' });
        }
        if (next === FINAL) hasPlayed = true;
        // The caret stays on to the end of its blink (it's on from typing)
        // and, as it blinks off on the beat, goes — it doesn't come back on.
        blink();
        await untilBlinkEnds(1);
        show({ caret: false });
        if (cancelled) return;
        if (next === FINAL) {
          // With the caret gone, the final word turns italic: it leans over
          // to the italic's angle and, as it lands, becomes the italic
          // proper.
          await wait(TIMING.beforeLean);
          if (cancelled) return;
          // The italic is narrower: as it leans, it narrows to the italic's
          // width (measured from the finished heading's invisible copy),
          // starting from its own.
          const upright = wordRef.current?.getBoundingClientRect().width;
          const italic = italicRef.current?.getBoundingClientRect().width;
          if (upright && italic) {
            show({ lean: { width: upright, squeeze: 1 } });
            await nextFrame();
            await nextFrame();
            if (cancelled) return;
            show({ style: 'leaning', lean: { width: italic, squeeze: italic / upright } });
          } else {
            show({ style: 'leaning' });
          }
          await wait(TIMING.lean);
          show({ style: 'italic', lean: null });
          await wait(TIMING.beforeDone);
          if (cancelled) return;
          onDoneRef.current?.();
          return;
        }
        // Strike the word through, then delete it.
        await wait(TIMING.caretClear);
        if (cancelled) return;
        const wordEl = wordRef.current;
        if (wordEl) {
          const rect = wordEl.getBoundingClientRect();
          const fontSize = parseFloat(getComputedStyle(wordEl).fontSize);
          show({ strike: strikeFor(rect.width, rect.height, fontSize), strikeLeaving: false });
        }
        await wait(TIMING.strike + TIMING.strikeHold);
        if (cancelled) return;
        show({ strikeLeaving: true });
        await wait(TIMING.strikeFade);
        if (cancelled) return;
        show({ strike: null, strikeLeaving: false });
        await wait(TIMING.strikeClear);
        if (cancelled) return;
        while (word) {
          await wait(TIMING.erase);
          if (cancelled) return;
          word = word.slice(0, -1);
          show({ word });
        }
        // The caret comes back where the word was (a blink coming on), to
        // type the next one — " designer" stays put after it.
        show({ caret: true, caretAt: 'word' });
        await wait(TIMING.beforeTyping);
        if (cancelled) return;
      }
    };

    // Start once the hero is actually on screen (it may not be, if the page
    // opened on another section).
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timers.push(setTimeout(run, TIMING.startDelay));
      },
      { threshold: 0.5 }
    );
    observer.observe(heading);
    return () => {
      cancelled = true;
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [skip]);

  // Takes up no width (like a real text caret), so moving it never shifts
  // the letters; kept in place once gone, for the same reason.
  const caret = <span className={`${styles.caret} ${frame.caret ? '' : styles.caretOff}`} />;

  return (
    <h1
      ref={headingRef}
      className={`${styles.title} ${styles.typedTitle}`}
      data-section-heading="true"
      tabIndex={-1}
    >
      {/* What screen readers hear, from the start. */}
      <span className={styles.srOnly}>{FINAL_TEXT}</span>
      {/* Holds the finished heading's space, so nothing shifts as it types. */}
      <span className={`${styles.fill} ${styles.typedGhost}`} aria-hidden="true">
        <span ref={italicRef} className={styles.finalWord}>
          {FINAL}
        </span>
        {SUFFIX}
      </span>
      {/* The animation. */}
      <span className={styles.typedLive} aria-hidden="true">
        <span className={styles.fill}>
          <span
            ref={wordRef}
            className={`${styles.typedWord} ${wordStyle[frame.style]}`}
            style={
              frame.lean
                ? {
                    width: frame.lean.width,
                    transform:
                      frame.style === 'leaning'
                        ? `skewX(${LEAN}deg) scaleX(${frame.lean.squeeze})`
                        : undefined,
                  }
                : undefined
            }
          >
            {frame.word}
            {frame.strike && (
              <svg
                className={`${styles.strike} ${frame.strikeLeaving ? styles.strikeLeaving : ''}`}
                width={frame.strike.width}
                height={frame.strike.height}
                viewBox={`0 0 ${frame.strike.width} ${frame.strike.height}`}
                style={{ left: -frame.strike.overshoot }}
                focusable="false"
              >
                <path d={frame.strike.d} pathLength={1} strokeWidth={frame.strike.stroke} />
              </svg>
            )}
          </span>
          {frame.caretAt === 'word' && caret}
          {frame.suffix}
          {frame.caretAt === 'end' && caret}
        </span>
      </span>
    </h1>
  );
};
