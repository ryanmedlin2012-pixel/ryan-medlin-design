import React from 'react';
import styles from './About.module.css';
import { useLayout } from '../context/LayoutContext';
import avatar from '../assets/About_avatar.jpg';

// The contact section's place on the home page (see App's HomePage).
const CONTACT_SECTION = 5;

// My face in a circle beside the headline (which ends in the way to get in
// touch), then three columns: who I am and what I did most recently, how I
// work, and how to work with me.
export const About: React.FC = () => {
  const { goToSection } = useLayout();

  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.headRow}>
          <img
            className={styles.avatar}
            src={avatar}
            alt="Ryan Medlin, smiling, in clear-framed glasses"
          />
          {/* The headline ends in the way to get in touch: its last words, in
              green, take you to the contact section. */}
          <h2 className={styles.heading} data-section-heading="true" tabIndex={-1}>
            Looking for product/interaction design for the moments that matter, down to the last
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
              An independent product designer in Portland. Most recently I designed Xbox support
              agents that identify a mystery charge, recover a damaged code from a photo, and hand
              off to a person without starting over. The handoff redesign cut abandonment from 31%
              to 18%.
            </p>
            <p>I also hold a Microsoft patent for navigating long articles with a game controller.</p>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>How I work</h3>
            <p>
              I build what I design, prototyping in working code. This site, motion graphics
              included, is my work, designed and built with AI tools.
            </p>
            <p>
              My roots are in graphic design (editorial, posters, typography), and it shows in the
              details most people never notice.
            </p>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Working together</h3>
            <p className={styles.listIntro}>
              I work with a few teams at a time, part-time or on a fixed scope, in one of three ways:
            </p>
            <ul className={styles.list}>
              <li>
                <span>Fractional design lead</span> for an early-stage product, shaping it from the
                first flows to a shipped system
              </li>
              <li>
                <span>Design engineer</span>, prototyping in working code so the team can try ideas
                before committing to them
              </li>
              <li>
                <span>Agent experience review</span>, finding where an AI agent in production hedges,
                fails or hands off, and how to fix it
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
