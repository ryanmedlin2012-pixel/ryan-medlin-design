import React, { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Skills.module.css';

// Skills & expertise, as the strengths the work shows rather than a list of
// self-rated skills: each a plain claim (an accordion's heading), and in its
// panel a line or two of proof from real work, and where to see it. Beside them, an aside of methods and tools,
// for scanning.
//
// Every fact here is in a case study, the résumé or this site itself; keep
// it that way.

interface Strength {
  title: string;
  proof: string;
  /** Where to see it (a case study or gallery; no path: not a page). */
  seenIn: Array<{ label: string; path?: string }>;
}

const STRENGTHS: Strength[] = [
  {
    title: 'Conversational and AI agent UX',
    proof:
      'How an agent asks, answers and hands off to a person. For Xbox support, a conversation‑first route to live help cut abandonment from 31% to 18%.',
    seenIn: [
      { label: 'Escalation', path: '/project/support-escalation' },
      { label: 'Purchase Lookup', path: '/project/unrecognized-charge-lookup' },
      { label: 'Token Redemption', path: '/project/token-redemption-agent' },
    ],
  },
  {
    title: 'Controller, TV and voice UX',
    proof:
      'Reading long articles with a controller from across the room, now a Microsoft patent; evidence-first voice reporting on console; and conversations designed for voice input.',
    seenIn: [
      { label: 'Scrolling Article', path: '/project/scrolling-article-10-foot-experience' },
      { label: 'Voice Chat Reporting', path: '/project/voice-chat-reporting' },
    ],
  },
  {
    title: 'Typography and editorial craft',
    proof:
      'Roots in graphic design: covers, posters and identities, and a year teaching typography at Miami Ad School. Interfaces set on a baseline grid (4px / 8px grid).',
    seenIn: [
      { label: 'Editorial', path: '/graphic-design/editorial' },
      { label: 'Posters', path: '/graphic-design/posters' },
    ],
  },
  {
    title: 'Design engineering',
    proof:
      'Designer and front-end developer at the San Francisco Chronicle, the Oakland Tribune and IDG, 2002–2014. I hand‑code HTML, CSS and JavaScript, which makes me a better vibe coder: I can read and fix what AI writes.',
    seenIn: [{ label: 'this site' }],
  },
  {
    title: 'Accessibility as a design material',
    proof:
      'Screen-reader labels written to be heard in context, focus that lands where it should, checked contrast, and motion that respects reduced-motion settings.',
    seenIn: [{ label: 'Scrolling Article', path: '/project/scrolling-article-10-foot-experience' }],
  },
  {
    title: 'Evidence and systems',
    proof:
      'Flows validated with players (91% task success in study), handed off as specs teams build from: design-system components and interaction guidelines.',
    seenIn: [{ label: 'Escalation', path: '/project/support-escalation' }],
  },
];

export const Skills: React.FC = () => {
  // The strengths as an accordion: all closed to start, then one open at a
  // time, so the section keeps nearly the same height; each heading a button
  // that opens or closes its panel.
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();
  // Closed panels are out of the tab order and hidden from screen readers.
  // (Set directly: React 18 doesn't pass `inert` through.)
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    panels.current.forEach((panel, i) => {
      if (panel) panel.inert = i !== open;
    });
  }, [open]);

  return (
    <section id="skills" className={styles.skills}>
      <div className={styles.container}>
        <span className={styles.eyebrow}>Skills &amp; expertise</span>
        <h2 className={styles.heading} data-section-heading="true" tabIndex={-1}>
          Where I do my best work
        </h2>
        <div className={styles.accordion} data-any-open={open !== null || undefined}>
          {STRENGTHS.map((strength, i) => {
            const isOpen = open === i;
            const triggerId = `${baseId}-trigger-${i}`;
            const panelId = `${baseId}-panel-${i}`;
            return (
              <div key={strength.title} className={styles.item} data-open={isOpen || undefined}>
                <h3 className={styles.itemHeading}>
                  <button
                    type="button"
                    id={triggerId}
                    className={styles.trigger}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className={styles.title}>{strength.title}</span>
                  </button>
                </h3>
                <div
                  ref={(el) => {
                    panels.current[i] = el;
                  }}
                  id={panelId}
                  role="region"
                  aria-labelledby={triggerId}
                  className={styles.panel}
                >
                  <div className={styles.panelInner}>
                    <p className={styles.proof}>{strength.proof}</p>
                    <p className={styles.seenIn}>
                      <span className={styles.seenInLabel}>Seen in</span>{' '}
                      {strength.seenIn.map((place, j) => (
                        <React.Fragment key={place.label}>
                          {j > 0 && <span aria-hidden="true"> · </span>}
                          {place.path ? (
                            <Link className={styles.seenInLink} to={place.path}>
                              {place.label}
                            </Link>
                          ) : (
                            <span className={styles.seenInPlain}>{place.label}</span>
                          )}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
