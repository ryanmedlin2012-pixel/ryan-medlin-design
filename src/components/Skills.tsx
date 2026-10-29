import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Skills.module.css';

// Skills & expertise, as the strengths the work shows rather than a list of
// self-rated skills: each a plain claim, a line or two of proof from real
// work, and where to see it. Then the methods and tools, for scanning.
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
      'How a support agent asks, answers and hands off to a person. For Xbox’s Support Virtual Agent, a conversation-first route to live help cut abandonment from 31% to 18%.',
    seenIn: [
      { label: 'Escalation', path: '/project/support-escalation' },
      { label: 'Purchase Lookup', path: '/project/unrecognized-charge-lookup' },
      { label: 'Token Redemption', path: '/project/token-redemption-agent' },
    ],
  },
  {
    title: 'Controller, TV and voice UX',
    proof:
      'A way to read long articles with a game controller from across the room, now a Microsoft patent; an evidence-first voice reporting flow for console; and conversational UX designed for voice input, not just typing.',
    seenIn: [
      { label: 'Scrolling Article', path: '/project/scrolling-article-10-foot-experience' },
      { label: 'Voice Chat Reporting', path: '/project/voice-chat-reporting' },
    ],
  },
  {
    title: 'Typography and editorial craft',
    proof:
      'Roots in graphic design: book covers, posters and identities, and a year teaching typography to postgraduate students at Miami Ad School. Interfaces set on a baseline grid, down to the last detail.',
    seenIn: [
      { label: 'Editorial', path: '/graphic-design/editorial' },
      { label: 'Posters', path: '/graphic-design/posters' },
    ],
  },
  {
    title: 'Design engineering',
    proof:
      'Designer and front-end developer at the San Francisco Chronicle, the Oakland Tribune and IDG from 2002 to 2014. I hand-code HTML, CSS and JavaScript, and that makes me a better vibe coder: I can read, check and fix what AI tools write. This site is the proof.',
    seenIn: [{ label: 'this site' }],
  },
  {
    title: 'Accessibility as a design material',
    proof:
      'Labels written to be heard in context by a screen reader, focus that lands where it should, contrast checked, and motion that gives way for people who prefer less of it.',
    seenIn: [{ label: 'Scrolling Article', path: '/project/scrolling-article-10-foot-experience' }],
  },
  {
    title: 'Evidence and systems',
    proof:
      'Flows validated with players (91% task success in study) and handed off as specs teams can build from: design-system components, interaction guidelines and patterns used across teams.',
    seenIn: [{ label: 'Escalation', path: '/project/support-escalation' }],
  },
];

const METHODS = [
  'Problem framing',
  'Research and usability testing',
  'Wireframes to high fidelity',
  'Prototyping',
  'Content design',
  'Design systems',
  'Spec and hand-off',
];

const TOOLS = [
  'Figma',
  'ProtoPie',
  'VS Code',
  'Claude',
  'GitHub',
  'HTML, CSS and JavaScript',
  'InDesign',
  'Photoshop',
  'Illustrator',
];

export const Skills: React.FC = () => {
  return (
    <section id="skills" className={styles.skills}>
      <div className={styles.container}>
        <span className={styles.eyebrow}>Skills &amp; expertise</span>
        <h2 className={styles.heading} data-section-heading="true" tabIndex={-1}>
          Where I do my best work
        </h2>
        <ol className={styles.strengths}>
          {STRENGTHS.map((strength, i) => (
            <li key={strength.title} className={styles.strength}>
              <span className={styles.number} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.title}>{strength.title}</h3>
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
            </li>
          ))}
        </ol>
        <div className={styles.kit}>
          <div className={styles.kitRow}>
            <h3 className={styles.kitLabel}>Methods</h3>
            <ul className={styles.tags}>
              {METHODS.map((method) => (
                <li key={method} className={styles.tag}>
                  {method}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.kitRow}>
            <h3 className={styles.kitLabel}>Tools</h3>
            <ul className={styles.tags}>
              {TOOLS.map((tool) => (
                <li key={tool} className={styles.tag}>
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
