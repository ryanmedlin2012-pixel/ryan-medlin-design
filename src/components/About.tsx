import React, { useLayoutEffect, useRef, useState } from 'react';
import styles from './About.module.css';
import { useLayout } from '../context/LayoutContext';
import avatar from '../assets/About_avatar.jpg';

// The contact section's place on the home page (see App's HomePage).
const CONTACT_SECTION = 6;

// The baseline grid's step, and the least room above the content.
const GRID = 4;
const MIN_TOP = 32;

// Centres the content in the section, rounded down to a whole step of the
// grid, so every line of type keeps to it (see About.module.css).
const useGridCentring = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(MIN_TOP);
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;
    const update = () => {
      const room = section.clientHeight - content.offsetHeight;
      const centred = Math.floor(room / 2 / GRID) * GRID;
      setTop(Math.max(MIN_TOP, centred));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(section);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);
  return { sectionRef, contentRef, top };
};

// The portrait is sized to the headline beside it: as tall as the headline,
// scaled by the proportion they had when the design was settled (188px
// beside three 44px lines), so the two keep their look at every width. The
// difference between them is kept to whole steps of 8px, so with the
// headline centred beside the circle both stay on the 4px grid. Sizing the
// circle changes the room the headline has (it can rewrap), so this settles
// over a few passes.
const PORTRAIT_RATIO = 188 / 132;
const PORTRAIT_MAX_SHARE = 1 / 3;
// At 540px and below the circle moves to the headline's top right, smaller.
const SMALL_SCREEN = 540;
const PORTRAIT_MAX_SHARE_SMALL = 0.24;
const useHeadlineSizedPortrait = () => {
  const portraitRef = useRef<HTMLImageElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    const portrait = portraitRef.current;
    const heading = headingRef.current;
    if (!portrait || !heading) return;
    // Never more than a third of the row, so on a narrow screen the headline
    // keeps room beside it (there the proportion gives way). Still a size
    // whose difference from the headline is whole 8px steps.
    const sizeFor = (h: number) => {
      const row = heading.parentElement?.clientWidth ?? Infinity;
      const small = window.matchMedia(`(max-width: ${SMALL_SCREEN}px)`).matches;
      const max = row * (small ? PORTRAIT_MAX_SHARE_SMALL : PORTRAIT_MAX_SHARE);
      let size = h + Math.round((h * PORTRAIT_RATIO - h) / 8) * 8;
      while (size > max && size - 8 > 0) size -= 8;
      return size;
    };
    const update = () => {
      const seen: number[] = [];
      for (let pass = 0; pass < 6; pass++) {
        const size = sizeFor(heading.offsetHeight);
        if (seen.includes(size)) {
          // Wrapping back and forth: settle on the smaller.
          const smaller = Math.min(...seen.slice(seen.indexOf(size)));
          portrait.style.width = portrait.style.height = `${smaller}px`;
          return;
        }
        seen.push(size);
        portrait.style.width = portrait.style.height = `${size}px`;
      }
    };
    update();
    const observer = new ResizeObserver(() => update());
    observer.observe(heading.parentElement ?? heading);
    observer.observe(heading);
    return () => observer.disconnect();
  }, []);
  return { portraitRef, headingRef };
};

// My face in a circle beside the headline (which ends in the way to get in
// touch), then three columns: who I am and what I did most recently, how I
// work, and how to work with me.
export const About: React.FC = () => {
  const { goToSection } = useLayout();
  const { sectionRef, contentRef, top } = useGridCentring();
  const { portraitRef, headingRef } = useHeadlineSizedPortrait();

  return (
    <section
      id="about"
      ref={sectionRef}
      className={styles.about}
      style={{ paddingTop: top }}
    >
      <div ref={contentRef} className={styles.container}>
        <div className={styles.headRow}>
          <img
            ref={portraitRef}
            className={styles.avatar}
            src={avatar}
            alt="Ryan Medlin, smiling, in clear-framed glasses"
          />
          {/* The headline ends in the way to get in touch: its last words, in
              green, take you to the contact section. */}
          <h2
            ref={headingRef}
            className={styles.heading}
            data-section-heading="true"
            tabIndex={-1}
          >
            Looking for a designer who can take it from first sketch to shipped, down to the last
            detail?{' '}
            <br className={styles.headingBreak} />
            <button
              type="button"
              className={styles.headingCta}
              onClick={() => goToSection(CONTACT_SECTION)}
            >
              <em>Let’s get in touch</em> <span aria-hidden="true">→</span>
            </button>
          </h2>
        </div>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Hi, I’m Ryan</h3>
            <p>
              I’m an independent designer in Portland. Most recently I designed Xbox support agents
              that identify mystery charges, recover damaged codes from a photo, and hand off to
              human support without starting over.
            </p>
            <p>I also hold a Microsoft patent for navigating long articles with a game controller.</p>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>How I work</h3>
            <p>
              I build what I design. I’ve prototyped in many ways over the years; now I work with
              Claude Code in VS Code. I designed and built this site that way, motion graphics
              included.
            </p>
            <p>
              My roots are in modern typography and grid systems. Done well, both disappear and
              let the content speak.
            </p>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Working together</h3>
            <p className={styles.listIntro}>
              I work with a few teams and studios at a time, on contract or a fixed scope:
            </p>
            <ul className={styles.list}>
              <li>
                <span>Senior product and visual design</span> for agencies and product teams
              </li>
              <li>
                <span>Fractional design lead</span>, a day or two a week
              </li>
              <li>
                <span>Design and build</span>: sites and design systems, hand‑coded
              </li>
              <li>
                <span>AI agent experience</span>: how an agent asks, answers and hands off
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
