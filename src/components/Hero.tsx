import React from 'react';
import styles from './Hero.module.css';
import { useLayout } from '../context/LayoutContext';
import { HeroOrbs } from './HeroOrbs';

export const Hero: React.FC = () => {
  const { goToSection } = useLayout();

  return (
    <section id="hero" className={styles.hero}>
      <HeroOrbs />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1
            className={styles.title}
            data-section-heading="true"
            tabIndex={-1}
          >
            <span className={styles.fill}>Multidisciplinary designer</span>
          </h1>
          <p className={styles.subtitle}>
            <span className={styles.fill}>
              Crafting digital experiences and communication that combine beautiful design and
              thoughtful strategy
            </span>
          </p>
          <button
            className={styles.cta}
            onClick={() => goToSection(1)}
          >
            View My Work
          </button>
        </div>
      </div>
    </section>
  );
};
