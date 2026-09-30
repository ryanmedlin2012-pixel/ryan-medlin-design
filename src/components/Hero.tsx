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
            <span className={styles.fill}>UI / Interaction / Visual designer</span>
          </h1>
          <p className={styles.subtitle}>
            <span className={styles.fill}>
              Crafting digital experiences that combine beautiful design with thoughtful product
              strategy
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
