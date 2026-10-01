import React, { useState } from 'react';
import styles from './Hero.module.css';
import { useLayout } from '../context/LayoutContext';
import { HeroOrbs } from './HeroOrbs';
import { HeroTitle, heroTitleWillPlay } from './HeroTitle';

export const Hero: React.FC = () => {
  const { goToSection } = useLayout();
  // The subtitle and button come in once the heading has finished — or are
  // simply there, if it won't animate.
  const [titleWillPlay] = useState(heroTitleWillPlay);
  const [revealed, setRevealed] = useState(false);
  const reveal = titleWillPlay ? `${styles.reveal} ${revealed ? styles.revealed : ''}` : '';

  return (
    <section id="hero" className={styles.hero}>
      <HeroOrbs />
      <div className={styles.container}>
        <div className={styles.content}>
          <HeroTitle onDone={() => setRevealed(true)} />
          <div className={`${styles.after} ${!titleWillPlay || revealed ? styles.afterShown : ''}`}>
            <div className={styles.afterInner}>
              <p className={`${styles.subtitle} ${reveal}`}>
                <span className={styles.fill}>
                  Crafting communications that combine beautiful design &amp; thoughtful strategy
                </span>
              </p>
              <button className={`${styles.cta} ${reveal}`} onClick={() => goToSection(1)}>
                View My Work
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
