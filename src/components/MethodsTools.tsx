import React, { useState } from 'react';
import styles from './MethodsTools.module.css';
import { LedgerPortrait, VennPortrait } from './MethodsPortrait';

// How I work and what I work with: the methods and tools as a portrait (a
// Venn of the three disciplines my work has spanned, each method or tool
// placed in the overlap where it's served, sized by years, darker the
// greater its mastery), and, a toggle away, the numbers behind it. A
// section of its own, after Skills. (The data: methodsData.)

type View = 'portrait' | 'numbers';

const VIEWS: Array<{ id: View; label: string }> = [
  { id: 'portrait', label: 'Portrait' },
  { id: 'numbers', label: 'Numbers behind it' },
];

export const MethodsTools: React.FC = () => {
  const [view, setView] = useState<View>('portrait');
  return (
    <section id="methods" className={styles.methods}>
      <div className={styles.container}>
        <span className={styles.eyebrow}>Methods &amp; tools</span>
        <h2 className={styles.heading} data-section-heading="true" tabIndex={-1}>
          How I work, and what with
        </h2>
        {/* The two views: a pill with a white thumb that slides to the one
            showing. */}
        <div
          className={styles.toggle}
          role="group"
          aria-label="Show methods and tools as"
          data-view={view}
        >
          <span className={styles.thumb} aria-hidden="true" />
          {VIEWS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={styles.toggleOption}
              aria-pressed={view === id}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </div>
        {/* Each view fades in as it's chosen (keyed, so it plays each time). */}
        <div key={view} className={styles.view}>
          {view === 'portrait' ? <VennPortrait /> : <LedgerPortrait />}
        </div>
      </div>
    </section>
  );
};
