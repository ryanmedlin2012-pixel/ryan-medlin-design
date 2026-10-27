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
  afterWord: 220,
  /** The beat after it's italic, before typing on past it. */
  afterLean: 120,
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
  segments,
  shown,
  caret,
  caretOn,
  silent = false,
}: {
  segments: Segment[];
  shown: number;
  caret: boolean;
  caretOn: boolean;
  /** Not read out here (the heading has its own text for screen readers). */
  silent?: boolean;
}) => {
  let index = 0;
  const caretEl = (
    <span key="caret" className={`${styles.caret} ${caretOn ? '' : styles.caretOff}`} />
  );
  const out: React.ReactNode[] = [];
  if (caret && shown === 0) out.push(caretEl);
  segments.forEach((seg, s) => {
    const chars = [...seg.text].map((ch) => {
      const i = index++;
      const el = (
        <span key={i} className={i < shown ? undefined : styles.untyped}>
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
          timer = setTimeout(() => setPhase('opening'), TYPE.startDelay);
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
    if (phase === 'opening' && !started.current.opening) {
      started.current.opening = true;
      (async () => {
        setCaret({ at: 'opening', on: true });
        for (let n = 1; n <= full.opening; n++) {
          await wait(TYPE.char + Math.random() * TYPE.jitter);
          if (cancelled) return;
          setTyped((t) => ({ ...t, opening: n }));
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
        await wait(TYPE.afterWord);
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
        const typeOut = async (key: 'designer' | 'sentence' | 'link', length: number) => {
          for (let n = 1; n <= length; n++) {
            await wait(TYPE.char + Math.random() * TYPE.jitter);
            if (cancelled) return;
            setTyped((t) => ({ ...t, [key]: n }));
          }
        };
        await typeOut('designer', full.designer);
        if (cancelled) return;
        await wait(TYPE.afterDesigner);
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
        <div className={styles.lede} style={width ? { maxWidth: width } : undefined}>
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
              segments={OPENING}
              shown={typed.opening}
              caret={caret.at === 'opening'}
              caretOn={caret.on}
            />
            <h1 className={styles.ledeHeading} data-section-heading="true" tabIndex={-1}>
              <span className={styles.srOnly}>Multidisciplinary designer.</span>
              <span aria-hidden="true">
                <em
                  className={
                    wordStyle === 'italic'
                      ? styles.finalWord
                      : `${styles.typedWord} ${wordStyle === 'leaning' ? styles.wordLeaning : ''}`
                  }
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
                </em>
                <Typed
                  segments={DESIGNER}
                  shown={typed.designer}
                  caret={caret.at === 'designer'}
                  caretOn={caret.on}
                  silent
                />
              </span>
            </h1>{' '}
            <Typed
              segments={SENTENCE}
              shown={typed.sentence}
              caret={caret.at === 'sentence'}
              caretOn={caret.on}
            />{' '}
            <button type="button" className={styles.ledeLink} onClick={() => goToSection(1)}>
              <Typed
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
