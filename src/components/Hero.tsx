import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';
import { useLayout } from '../context/LayoutContext';
import { HeroOrbs } from './HeroOrbs';
import { HeroTitle, heroTitleWillPlay, LEAN, LEAN_MS } from './HeroTitle';

// The hero, as one paragraph, left aligned, every line in the heading's
// serif at the heading's size: "Hi, I'm Ryan and I'm a Multidisciplinary
// designer. I craft … strategy. View my work →" — the heading set inline
// within it, and the last words a link to the projects.
//
// Once per visit, it types itself in: "Hi, I'm Ryan and I'm a", then, in
// the word's place in the sentence, the words, each struck through in turn
// (HeroTitle, inline), until "Multidisciplinary"; then the caret types on
// past it (" designer." first) to the end. (For readers who prefer reduced
// motion, and on later visits, the paragraph is simply there.)
// The paragraph's width: as wide as its first sentence ("Hi, I'm Ryan and
// I'm a Multidisciplinary designer."), so the first line breaks after
// "designer." — measured from an unseen copy of that sentence on one line,
// and again when the window or the fonts change. Where the window is
// narrower, it simply fills it.
const useFirstSentenceWidth = () => {
  const measureRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  useLayoutEffect(() => {
    const measure = measureRef.current;
    if (!measure) return;
    const update = () => setWidth(Math.ceil(measure.getBoundingClientRect().width) + 1);
    update();
    document.fonts?.ready.then(update);
    const observer = new ResizeObserver(update);
    observer.observe(measure);
    return () => observer.disconnect();
  }, []);
  return { measureRef, width };
};

// The paragraph's text around the heading, typed in as the heading arrives.
interface Segment {
  text: string;
  em?: boolean;
  /** Not read out (the link's arrow). */
  decorative?: boolean;
}
const OPENING: Segment[] = [{ text: 'Hi, I’m Ryan and I’m a ' }];
/** (The opening) where to pause: just after "Ryan". */
const AFTER_RYAN = [...'Hi, I’m Ryan'].length;
// Whether "Multidisciplinary" ends up italic (leaning over once it has
// been typed), or stays bold and upright.
const ITALIC_WORD = false;

// Once "Multidisciplinary" is typed it's given a moment of emphasis, then a
// pause before " designer." comes in. (Locally, ?emph=a|b|c|d tries the
// treatments: a, the strikes' green pen draws a line under it — the words
// before it struck through, this one underlined; b, a soft green marker
// sweeps in behind it; c, it warms to green and settles back; d, it nods.)
type Emphasis = 'a' | 'b' | 'c' | 'd';
const EMPHASES: Emphasis[] = ['a', 'b', 'c', 'd'];
const EMPHASIS: Emphasis = (() => {
  if (!import.meta.env.DEV || typeof window === 'undefined') return 'a';
  const asked = new URLSearchParams(window.location.search).get('emph');
  return EMPHASES.find((e) => e === asked) ?? 'a';
})();
/** How long each emphasis takes (ms; matches the CSS). */
const EMPHASIS_MS: Record<Emphasis, number> = { a: 420, b: 450, c: 900, d: 520 };

/** A hand-drawn line under a word of the given size (px), as the strikes
    are drawn (HeroTitle), but low, near the baseline, and a touch longer. */
const underlineFor = (width: number, height: number, fontSize: number) => {
  const r = (spread: number) => (Math.random() * 2 - 1) * spread;
  const over = fontSize * 0.08;
  const w = width + over * 2;
  const base = height * 0.9;
  const wobble = fontSize * 0.035;
  const y0 = base + r(wobble);
  const y1 = base + r(wobble);
  const d = `M ${(fontSize * 0.04).toFixed(1)} ${y0.toFixed(1)} C ${(w * 0.3).toFixed(1)} ${(
    y0 + wobble + r(wobble)
  ).toFixed(1)}, ${(w * 0.7).toFixed(1)} ${(y1 - wobble + r(wobble)).toFixed(1)}, ${(
    w - fontSize * 0.04
  ).toFixed(1)} ${y1.toFixed(1)}`;
  return { width: w, height: height * 1.2, over, stroke: fontSize * 0.06, d };
};

const DESIGNER: Segment[] = [{ text: ' designer.' }];
const SENTENCE: Segment[] = [
  { text: 'I craft communications that combine beautiful design & thoughtful strategy.' },
];
const LINK: Segment[] = [{ text: 'View my work', em: true }, { text: ' ' }, { text: '→', decorative: true }];
const lengthOf = (segments: Segment[]) => segments.reduce((n, seg) => n + [...seg.text].length, 0);
const textOf = (segments: Segment[]) =>
  segments.filter((seg) => !seg.decorative).map((seg) => seg.text).join('').trim();

// Typing (ms), at a typist's pace.
const TYPE = {
  /** Wait once the hero is on screen before starting. */
  startDelay: 80,
  /** Per character, and its variation. */
  char: 24,
  jitter: 14,
  /** The brief pause after "Ryan", as someone typing gathers their
      thoughts. */
  afterRyan: 225,
  /** The pause after "designer.", the first sentence's end. */
  afterDesigner: 900,
  /** The pause after "strategy.", before "View my work". */
  beforeLink: 900,
  /** The beat after the opening words are typed, before the words (none:
      it types straight on). */
  beforeWords: 0,
  /** The beat after "Multidisciplinary" is typed, before it leans into
      italic (if it does) or the typing goes on: brief. */
  afterWord: 160,
  /** The pause after the word's emphasis, before " designer." */
  afterEmphasis: 380,
  /** The beat after it's italic, before typing on past it. */
  afterLean: 120,
  /** The first line slides from centred to its place, once it's typed. */
  lineSettle: 480,
  /** The caret's blink, once it's done (on and off), and how many. */
  blink: 300,
  blinks: 2,
};

/**
 * Text that types itself in: every character is laid out from the start
 * (so nothing reflows as it types), and shown as it's reached. A caret
 * follows the last one shown, while this piece is being typed. Screen
 * readers have the whole text throughout.
 */
const Typed = ({
  name,
  segments,
  shown,
  caret,
  caretOn,
  silent = false,
}: {
  /** Marks its characters (data-ch="name:n", n counting from 1), for the
      first line to be found among them. */
  name: string;
  segments: Segment[];
  shown: number;
  caret: boolean;
  caretOn: boolean;
  /** Not read out here (the heading has its own text for screen readers). */
  silent?: boolean;
}) => {
  let index = 0;
  const caretEl = (
    <span key="caret" data-caret className={`${styles.caret} ${caretOn ? '' : styles.caretOff}`} />
  );
  const out: React.ReactNode[] = [];
  if (caret && shown === 0) out.push(caretEl);
  segments.forEach((seg, s) => {
    const chars = [...seg.text].map((ch) => {
      const i = index++;
      const el = (
        <span key={i} data-ch={`${name}:${i + 1}`} className={i < shown ? undefined : styles.untyped}>
          {ch}
        </span>
      );
      return caret && i === shown - 1 ? [el, caretEl] : [el];
    });
    const flat = chars.flat();
    out.push(seg.em ? <em key={`s${s}`}>{flat}</em> : <React.Fragment key={`s${s}`}>{flat}</React.Fragment>);
  });
  return (
    <>
      {!silent && <span className={styles.srOnly}>{textOf(segments)}</span>}
      <span aria-hidden="true">{out}</span>
    </>
  );
};

export const Hero: React.FC = () => {
  const { goToSection } = useLayout();
  const { measureRef, width } = useFirstSentenceWidth();
  const [wordsWillPlay] = useState(heroTitleWillPlay);
  // 'waiting': for the hero to be on screen; 'opening': the opening words
  // typing in; 'words': the words typing (and struck through) in the word's
  // place; 'paragraph': "Multidisciplinary" in place, and the rest.
  const [phase, setPhase] = useState<'waiting' | 'opening' | 'words' | 'paragraph'>(
    wordsWillPlay ? 'waiting' : 'paragraph',
  );
  const sectionRef = useRef<HTMLElement>(null);
  // "Multidisciplinary" as it finishes, and upright, unseen, to measure.
  const finalRef = useRef<HTMLElement>(null);
  const uprightRef = useRef<HTMLSpanElement>(null);
  // It's typed upright, then (if it turns italic) leans over, narrowing as
  // it leans so it arrives at the italic's width (as HeroTitle's lean).
  // The word's emphasis, once it's typed (and, for the underline, its line).
  const [emphasis, setEmphasis] = useState(false);
  const [underline, setUnderline] = useState<ReturnType<typeof underlineFor> | null>(null);
  const wordRef = useRef<HTMLElement>(null);
  const [wordStyle, setWordStyle] = useState<'upright' | 'leaning' | 'italic'>(
    wordsWillPlay || !ITALIC_WORD ? 'upright' : 'italic',
  );
  // Its widths, upright and as it finishes (measured before the paragraph
  // types). Its place in the sentence is held at its finished width
  // throughout — the words typed there (shorter) leave space after them,
  // and the upright word, if it's to turn italic, overhangs the (still
  // untyped) space after it — so the paragraph is laid out as it will
  // finish from the start, and nothing in it reflows (or, as it's centred,
  // shifts) as the words change.
  const [widths, setWidths] = useState<{ upright: number; final: number } | null>(null);
  // The paragraph's fill comes in only once all its text is typed.
  const [filled, setFilled] = useState(!wordsWillPlay);

  // How much of each piece is typed, and where the caret is.
  const full = {
    opening: lengthOf(OPENING),
    designer: lengthOf(DESIGNER),
    sentence: lengthOf(SENTENCE), link: lengthOf(LINK) };
  const [typed, setTyped] = useState(
    wordsWillPlay ? { opening: 0, designer: 0, sentence: 0, link: 0 } : full,
  );
  const [caret, setCaret] = useState<{
    at: 'opening' | 'designer' | 'sentence' | 'link' | null; on: boolean }>({
    at: null,
    on: true,
  });
  // The first line types in from the centre: while it types, the paragraph
  // is nudged so the typed part stays centred (the rest is unseen, so only
  // the first line seems to move), following the caret; once the line's last
  // character is in, the paragraph slides to its place and the rest types
  // in, left aligned. Which characters are on the first line is read from
  // the layout (data-ch), so it holds at any width.
  const ledeRef = useRef<HTMLDivElement>(null);
  const lineOneEnd = useRef<string | null>(null);
  const centring = useRef<number | null>(null);
  const findLineOneEnd = () => {
    const chars = ledeRef.current?.querySelectorAll<HTMLElement>('[data-ch]');
    if (!chars?.length) return null;
    const top = chars[0].getBoundingClientRect().top;
    let last = chars[0].dataset.ch ?? null;
    for (const ch of chars) {
      if (ch.getBoundingClientRect().top > top + 2) break;
      last = ch.dataset.ch ?? last;
    }
    return last;
  };
  const startCentring = () => {
    const lede = ledeRef.current;
    if (!lede) return;
    lede.style.transition = 'transform 90ms linear';
    const follow = () => {
      const caretEl = lede.querySelector<HTMLElement>('[data-caret]');
      const first = lede.querySelector<HTMLElement>('[data-ch]');
      if (caretEl && first) {
        const box = lede.getBoundingClientRect();
        const start = first.getBoundingClientRect().left;
        const end = caretEl.getBoundingClientRect().left;
        // (Measured as it's drawn, but the nudge moves all three alike, so
        // the difference is the nudge needed, whatever it is now.)
        const nudge = box.left + box.width / 2 - (start + end) / 2;
        lede.style.transform = `translateX(${Math.max(0, nudge).toFixed(1)}px)`;
      }
      centring.current = requestAnimationFrame(follow);
    };
    centring.current = requestAnimationFrame(follow);
  };
  const settleLineOne = () => {
    if (centring.current !== null) cancelAnimationFrame(centring.current);
    centring.current = null;
    const lede = ledeRef.current;
    if (!lede) return;
    lede.style.transition = `transform ${TYPE.lineSettle}ms cubic-bezier(0.3, 0, 0.2, 1)`;
    lede.style.transform = 'translateX(0)';
  };
  useEffect(
    () => () => {
      if (centring.current !== null) cancelAnimationFrame(centring.current);
    },
    [],
  );

  // Once the hero is on screen (it may not be, if the page opened on another
  // section) and the fonts are in, the word's place is measured and the
  // opening types in.
  useEffect(() => {
    const section = sectionRef.current;
    if (!wordsWillPlay || !section) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        (document.fonts?.ready ?? Promise.resolve()).then(() => {
          if (cancelled) return;
          const upright = uprightRef.current?.offsetWidth;
          const final = finalRef.current?.offsetWidth;
          if (upright && final) setWidths({ upright, final });
          timer = setTimeout(() => {
            if (cancelled) return;
            // (The word's place now held at its width: the lines as they'll
            // finish.)
            lineOneEnd.current = findLineOneEnd();
            startCentring();
            setPhase('opening');
          }, TYPE.startDelay);
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(section);
    return () => {
      cancelled = true;
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [wordsWillPlay]);
  // The opening types in; then the words, in the word's place (HeroTitle,
  // with its own caret); then the caret types " designer." after the word,
  // then the sentence, then the link, then blinks and goes.
  const started = useRef<{ opening?: boolean; rest?: boolean }>({});
  useEffect(() => {
    if (!wordsWillPlay) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) => new Promise<void>((r) => timers.push(setTimeout(r, ms)));
    let cancelled = false;
    // Typed the first line's last character: it slides into place (typing
    // waits for it, or a pause that follows runs alongside it).
    const lineOneDone = (at: string) => {
      if (at !== lineOneEnd.current) return null;
      settleLineOne();
      return wait(TYPE.lineSettle);
    };
    if (phase === 'opening' && !started.current.opening) {
      started.current.opening = true;
      (async () => {
        setCaret({ at: 'opening', on: true });
        for (let n = 1; n <= full.opening; n++) {
          await wait(TYPE.char + Math.random() * TYPE.jitter);
          if (cancelled) return;
          setTyped((t) => ({ ...t, opening: n }));
          const settling = lineOneDone(`opening:${n}`);
          if (settling) {
            await settling;
            if (cancelled) return;
          }
          if (n === AFTER_RYAN) {
            await wait(TYPE.afterRyan);
            if (cancelled) return;
          }
        }
        await wait(TYPE.beforeWords);
        if (cancelled) return;
        setCaret({ at: null, on: false });
        setPhase('words');
      })();
    }
    if (phase === 'paragraph' && !started.current.rest) {
      started.current.rest = true;
      (async () => {
        await Promise.all([wait(TYPE.afterWord), lineOneDone('word')]);
        if (cancelled) return;
        // The word's emphasis, then a pause before " designer."
        const word = wordRef.current;
        if (EMPHASIS === 'a' && word) {
          const fontSize = parseFloat(getComputedStyle(word).fontSize);
          setUnderline(underlineFor(word.offsetWidth, word.offsetHeight, fontSize));
        }
        setEmphasis(true);
        await wait(EMPHASIS_MS[EMPHASIS] + TYPE.afterEmphasis);
        if (cancelled) return;
        if (ITALIC_WORD) {
          setWordStyle('leaning');
          await wait(LEAN_MS);
          if (cancelled) return;
          setWordStyle('italic');
          await wait(TYPE.afterLean);
          if (cancelled) return;
        }
        setCaret({ at: 'designer', on: true });
        // (Its line's end, if it's on the first line and the first line
        // ends within it: a slide that typing waits for; at its very end,
        // one the pause after it runs alongside.)
        let lineOneSettling: Promise<void> | null = null;
        const typeOut = async (key: 'designer' | 'sentence' | 'link', length: number) => {
          for (let n = 1; n <= length; n++) {
            await wait(TYPE.char + Math.random() * TYPE.jitter);
            if (cancelled) return;
            setTyped((t) => ({ ...t, [key]: n }));
            const settling = lineOneDone(`${key}:${n}`);
            if (settling && n < length) await settling;
            else if (settling) lineOneSettling = settling;
          }
        };
        await typeOut('designer', full.designer);
        if (cancelled) return;
        await Promise.all([wait(TYPE.afterDesigner), lineOneSettling]);
        if (cancelled) return;
        setCaret({ at: 'sentence', on: true });
        await typeOut('sentence', full.sentence);
        if (cancelled) return;
        await wait(TYPE.beforeLink);
        if (cancelled) return;
        setCaret({ at: 'link', on: true });
        await typeOut('link', full.link);
        if (cancelled) return;
        setFilled(true);
        for (let b = 0; b < TYPE.blinks * 2; b++) {
          await wait(TYPE.blink);
          if (cancelled) return;
          setCaret((c) => ({ ...c, on: !c.on }));
        }
        setCaret({ at: null, on: false });
      })();
    }
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, wordsWillPlay]);

  return (
    <section ref={sectionRef} id="hero" className={styles.hero}>
      <HeroOrbs />
      <div className={styles.container}>
        {/* One fill behind the whole paragraph, wrapping with it, so the
            phrases sit as one run of text (the fill's padding only at its
            ends, not between phrases). */}
        <div ref={ledeRef} className={styles.lede} style={width ? { maxWidth: width } : undefined}>
          {/* The first sentence on one line, unseen, to size the paragraph. */}
          <span ref={measureRef} className={`${styles.fill} ${styles.ledeMeasure}`} aria-hidden="true">
            Hi, I’m Ryan and I’m a <em ref={finalRef} className={ITALIC_WORD ? styles.finalWord : styles.typedWord}>Multidisciplinary</em> designer.
          </span>
          <span ref={uprightRef} className={`${styles.typedWord} ${styles.ledeMeasure}`} aria-hidden="true">
            Multidisciplinary
          </span>
          <span className={`${styles.fill} ${wordsWillPlay ? styles.ledeFill : ''} ${
            filled ? styles.ledeFillIn : ''
          }`}>
            <Typed
              name="opening"
              segments={OPENING}
              shown={typed.opening}
              caret={caret.at === 'opening'}
              caretOn={caret.on}
            />
            <h1 className={styles.ledeHeading} data-section-heading="true" tabIndex={-1}>
              <span className={styles.srOnly}>Multidisciplinary designer.</span>
              <span aria-hidden="true">
                <em
                  ref={wordRef}
                  data-ch="word"
                  data-emphasis={emphasis ? EMPHASIS : undefined}
                  className={`${
                    wordStyle === 'italic'
                      ? styles.finalWord
                      : `${styles.typedWord} ${wordStyle === 'leaning' ? styles.wordLeaning : ''}`
                  } ${styles.emphasisWord}`}
                  style={
                    widths && wordStyle !== 'italic'
                      ? {
                          width: widths.final,
                          whiteSpace: 'nowrap',
                          transform:
                            wordStyle === 'leaning'
                              ? `skewX(${LEAN}deg) scaleX(${widths.final / widths.upright})`
                              : undefined,
                        }
                      : undefined
                  }
                >
                  {phase === 'paragraph' ? (
                    'Multidisciplinary'
                  ) : phase === 'words' ? (
                    <HeroTitle inline onDone={() => setPhase('paragraph')} />
                  ) : (
                    // (Nothing yet, but a line's height: a zero-width space.)
                    '\u200b'
                  )}
                  {underline && (
                    <svg
                      className={styles.underline}
                      width={underline.width}
                      height={underline.height}
                      viewBox={`0 0 ${underline.width} ${underline.height}`}
                      style={{ left: -underline.over }}
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d={underline.d} pathLength={1} strokeWidth={underline.stroke} />
                    </svg>
                  )}
                </em>
                <Typed
                  name="designer"
                  segments={DESIGNER}
                  shown={typed.designer}
                  caret={caret.at === 'designer'}
                  caretOn={caret.on}
                  silent
                />
              </span>
            </h1>{' '}
            <Typed
              name="sentence"
              segments={SENTENCE}
              shown={typed.sentence}
              caret={caret.at === 'sentence'}
              caretOn={caret.on}
            />{' '}
            <button type="button" className={styles.ledeLink} onClick={() => goToSection(1)}>
              <Typed
                name="link"
                segments={LINK}
                shown={typed.link}
                caret={caret.at === 'link'}
                caretOn={caret.on}
              />
            </button>
          </span>
        </div>
      </div>
    </section>
  );
};
