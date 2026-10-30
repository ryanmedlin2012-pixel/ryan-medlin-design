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
/** The line above the heading, typed first. */
/** …typed in phrases, with a beat (the caret blinking) between them. */
// (A no-break space keeps the ellipsis with "a" when the line wraps.)
const INTRO_PHRASES = ['Hi,', ' I’m Ryan', ' and I’m a\u00a0...'];
const INTRO = INTRO_PHRASES.join('');

// The order things come in. 'wordsFirst': just the words type first, alone
// (each struck through, then the final one); then " designer" opens out
// beside it, and the intro line above fades in, with the subtitle and
// button. 'introFirst': the intro is typed
// first, then the heading row opens below it (as it used to).
type Order = 'wordsFirst' | 'introFirst';
const ORDER = 'wordsFirst' as Order;

// The caret's blink (ms): on for half of each cycle, then off for half. Quick,
// so the whole sequence runs in a few seconds.
// The sequence keeps this blink itself (rather than CSS), so every change to
// the caret happens exactly on its beat: it only ever appears as a blink
// comes on, and only ever goes away, or starts typing, as a blink ends — so
// every "on" it shows is a whole one, never cut short or brought in late.
const BLINK = 360;
const BLINK_ON = BLINK / 2;

// The caret is there only to type. Once a word is typed it stays on to the
// end of its blink, blinks off on the beat — and doesn't come back on. The
// strike and the deletion play without it (so the two never meet), until it
// comes back to type the next word.
/** How long the final word takes to lean to the italic's angle (ms; matches
    the CSS transition). */
export const LEAN_MS = 140;

const TIMING = {
  /** Wait once the hero is on screen before starting (ms). */
  startDelay: 80,
  /** Per typed character, varied a little so it reads as human (ms). */
  type: 20,
  typeJitter: 12,
  /** Per deleted character (ms). */
  erase: 12,
  /** Gap between the caret going and the strike starting to draw (ms). */
  caretClear: 30,
  /** How long the strike takes to draw (ms; matches the CSS animation). */
  strike: 150,
  /** How long the strike stays (ms). */
  strikeHold: 90,
  /** How long the strike takes to fade out (ms; matches the CSS). */
  strikeFade: 70,
  /** Gap between the strike disappearing and the word being deleted (ms). */
  strikeClear: 20,
  /** Pause with the caret back in place before it types the next word (ms). */
  beforeTyping: 40,
  // Then "Multidisciplinary" (bold, as every word there is) turns italic.
  /** Pause after the caret's gone, before it leans (ms). */
  beforeLean: 80,
  /** Whole blinks the caret gives at each beat in the intro (after "Hi,"
      and after "I’m Ryan") before typing on. */
  introBeatBlinks: 0,
  /** How long the heading's row takes to open below the intro, once the
      intro is typed (ms; matches the CSS transition). */
  titleOpen: 320,
  /** Pause once it's italic, before what's below the heading comes in (ms). */
  beforeDone: 300,
  /** (Words first) pause once it's italic and " designer" is opening, before
      the intro fades in (ms). */
  beforeIntro: 450,
  /** How long it takes to lean to the italic's angle (ms; matches the CSS
      transition), when it becomes the italic proper. */
  lean: LEAN_MS,
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
  const d = `M ${(fontSize * 0.04).toFixed(1)} ${y0.toFixed(1)} C ${(
    width * 0.3 +
    r(width * 0.06)
  ).toFixed(
    1,
  )} ${(y0 - wobble + r(wobble)).toFixed(1)}, ${(width * 0.68 + r(width * 0.06)).toFixed(1)} ${(
    y1 +
    wobble +
    r(wobble)
  ).toFixed(1)}, ${(width - fontSize * 0.04).toFixed(1)} ${y1.toFixed(1)}`;
  return { width, height: wordHeight, overshoot, stroke: fontSize * 0.075, d };
};

interface Frame {
  /** The intro line above the heading, as typed so far. */
  intro: string;
  /** Whether the intro is showing (it's held back until the heading is
      done, when the words come first). */
  introShown: boolean;
  /** Whether the heading's row has opened (below the intro, once typed). */
  titleOpen: boolean;
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
  /** Where the caret sits: after the intro (while typing it), after the
      word, or at the end of the line (while typing " designer", the first
      time). */
  caretAt: 'intro' | 'word' | 'end';
}

const finished: Frame = {
  intro: INTRO,
  introShown: true,
  titleOpen: true,
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
  /** Just the words, inline in the paragraph's sentence (in the word's
      place, after "Hi, I'm Ryan and I'm a"): each struck through in turn,
      then the final one — no intro, no " designer", no heading (the
      paragraph has its own: see Hero). Starts as soon as it appears. */
  inline?: boolean;
  /** Called once the heading has finished (typed, and its final word turned
      italic; inline, once the final word is typed) — so what follows it can
      come in. */
  onDone?: () => void;
}

/** The lean (deg): about the italic's own angle. */
export const LEAN = -10;

const wordStyle: Record<Frame['style'], string> = {
  upright: '',
  leaning: styles.wordLeaning,
  italic: styles.finalWord,
};

export const HeroTitle = ({ onDone, inline = false }: HeroTitleProps) => {
  // Decided once, when the heading first appears: finishing the animation
  // (which sets hasPlayed) mustn't restart or cancel it partway.
  const [skip] = useState(() => !heroTitleWillPlay());
  // (Kept in a ref, so a new callback each render doesn't restart it.)
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const [frame, setFrame] = useState<Frame>(
    skip
      ? finished
      : ORDER === 'wordsFirst'
      ? {
          // The heading's row is open from the start; the intro's text is
          // set but hidden, holding its place above.
          intro: INTRO,
          introShown: false,
          titleOpen: true,
          word: '',
          suffix: '',
          strike: null,
          strikeLeaving: false,
          caret: false,
          style: 'upright',
          lean: null,
          caretAt: 'word',
                }
      : {
          intro: '',
          introShown: true,
          titleOpen: false,
          word: '',
          suffix: '',
          strike: null,
          strikeLeaving: false,
          caret: false,
          style: 'upright',
          lean: null,
          caretAt: 'intro',
                },
  );
  // What's watched to start it (the intro; inline, it starts at once).
  const introRef = useRef<HTMLElement | null>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const italicRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (skip) return;
    const intro = introRef.current;
    if (!intro && !inline) return;
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
          setTimeout(
            () => {
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
            },
            Math.max(0, at - performance.now()),
          ),
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

      if (ORDER === 'introFirst') {
      // The caret appears and blinks once, then starts typing the intro as
      // its next "on" ends.
      blink();
      await untilBlinkEnds(1);
      if (cancelled) return;
      let introTyped = '';
      for (const [i, phrase] of INTRO_PHRASES.entries()) {
        for (const ch of phrase) {
          await wait(typeDelay());
          if (cancelled) return;
          introTyped += ch;
          show({ intro: introTyped });
        }
        // A beat between phrases, as someone typing pauses: the caret
        // blinks (on, off) and typing resumes as the next "on" ends.
        if (i < INTRO_PHRASES.length - 1) {
          blink();
          await untilBlinkEnds(TIMING.introBeatBlinks + 1);
          if (cancelled) return;
        }
      }
      // As after each word: on to the end of its blink, then gone.
      blink();
      await untilBlinkEnds(1);
      show({ caret: false });
      if (cancelled) return;
      // The heading's row opens below it — the intro easing up, so the two
      // stay centred together — and the caret appears there (a blink coming
      // on) and starts typing as that "on" ends.
      show({ titleOpen: true });
      await wait(TIMING.titleOpen);
      if (cancelled) return;
      show({ caretAt: 'word' });
      }
      // The caret blinks once before typing the first word (inline, it
      // types straight on from the paragraph's opening, without a beat).
      if (inline) {
        show({ caret: true });
      } else {
        blink();
        await untilBlinkEnds(1);
        if (cancelled) return;
      }
      for (const next of [...STRUCK, FINAL]) {
        // Type the word (and, the first time, " designer" after it), with
        // the caret held on.
        for (const ch of next) {
          await wait(typeDelay());
          if (cancelled) return;
          word += ch;
          show({ word });
        }
        // (Words first: just the words; " designer" comes in at the end.)
        if (ORDER === 'introFirst') {
          for (const ch of SUFFIX.slice(suffix.length)) {
            await wait(typeDelay());
            if (cancelled) return;
            suffix += ch;
            show({ suffix, caretAt: 'end' });
          }
        }
        if (next === FINAL) hasPlayed = true;
        // (Inline, the paragraph types straight on from the final word.)
        if (next === FINAL && inline) {
          onDoneRef.current?.();
          return;
        }
        // The caret stays on to the end of its blink (it's on from typing)
        // and, as it blinks off on the beat, goes — it doesn't come back on.
        blink();
        await untilBlinkEnds(1);
        show({ caret: false });
        if (cancelled) return;
        if (next === FINAL) {
          // With the caret gone, the final word turns italic: it leans over
          // to the italic's angle and, as it lands, becomes the italic
          // proper. (Inline, it stays upright: the paragraph turns it italic,
          // if it does — see Hero.)
          if (!inline) {
            await wait(TIMING.beforeLean);
            if (cancelled) return;
            // The italic is narrower: as it leans, it narrows to the italic's
            // width (measured from the finished heading's invisible copy),
            // starting from its own.
            const upright = wordRef.current?.offsetWidth;
            const italic = italicRef.current?.offsetWidth;
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
          }
          // Then the rest comes in: " designer" opening out beside the word
          // (which eases over to make room), the intro above, and what's
          // below (by onDone, just after).
          if (ORDER === 'wordsFirst') {
            show({ suffix: SUFFIX });
            await wait(TIMING.beforeIntro);
            if (cancelled) return;
            show({ introShown: true });
          }
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
          // (Its own size, not as drawn: it may be scaled up.)
          const fontSize = parseFloat(getComputedStyle(wordEl).fontSize);
          show({
            strike: strikeFor(wordEl.offsetWidth, wordEl.offsetHeight, fontSize),
            strikeLeaving: false,
          });
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

    // Inline, it starts at once (the paragraph shows it when it's time).
    if (inline) {
      timers.push(setTimeout(run, 0));
      return () => {
        cancelled = true;
        timers.forEach(clearTimeout);
      };
    }
    // Start once the hero is actually on screen (it may not be, if the page
    // opened on another section).
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timers.push(setTimeout(run, TIMING.startDelay));
      },
      { threshold: 0.5 },
    );
    if (intro) observer.observe(intro);
    return () => {
      cancelled = true;
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [skip, inline]);

  // Takes up no width (like a real text caret), so moving it never shifts
  // the letters; kept in place once gone, for the same reason.
  // (data-caret: the hero's first line follows it, typing in from the
  // centre — see Hero.)
  const caret = (
    <span data-caret className={`${styles.caret} ${frame.caret ? '' : styles.caretOff}`} />
  );

  if (inline) {
    return (
      <span aria-hidden="true">
        <span ref={wordRef} className={styles.typedWord}>
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
        {caret}
      </span>
    );
  }


  return (
    <>
      {/* The intro line, typed first, from its centre like the heading. */}
      <p
        ref={(el) => (introRef.current = el)}
        className={`${styles.intro} ${styles.typedTitle} ${
          frame.introShown ? '' : styles.introHeld
        } ${ORDER === 'wordsFirst' && frame.introShown && !skip ? styles.introIn : ''}`}
      >
        <span className={styles.srOnly}>{INTRO}</span>
        <span className={`${styles.fill} ${styles.typedGhost}`} aria-hidden="true">
          {INTRO}
        </span>
        <span className={styles.typedLive} aria-hidden="true">
          <span className={styles.fill}>
            {frame.intro}
            {frame.caretAt === 'intro' && caret}
          </span>
        </span>
      </p>
      {/* The heading's row: closed (no height) while the intro types, so the
          intro alone is centred; then it opens. */}
      <div className={`${styles.titleRow} ${frame.titleOpen ? styles.titleRowOpen : ''}`}>
        <div className={styles.titleRowInner}>
          <h1
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
                {/* (Words first) the word, with its caret, is set large while
                    it stands alone; it eases down to size as " designer"
                    joins it. */}
                <span
                  className={`${styles.wordScale} ${
                    ORDER === 'wordsFirst' && !skip && !frame.suffix ? styles.wordScaleBig : ''
                  }`}
                >
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
                </span>
                {ORDER === 'wordsFirst' && !skip ? (
                  <span className={`${styles.suffix} ${frame.suffix ? styles.suffixShown : ''}`}>
                    {SUFFIX}
                  </span>
                ) : (
                  frame.suffix
                )}
                {frame.caretAt === 'end' && caret}
              </span>
            </span>
          </h1>
        </div>
      </div>
    </>
  );
};
