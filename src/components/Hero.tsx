import React from 'react';
import styles from './Hero.module.css';
import { useLayout } from '../context/LayoutContext';

export const Hero: React.FC = () => {
  const { goToSection } = useLayout();

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1
            className={styles.title}
            data-section-heading="true"
            tabIndex={-1}
          >
            UI / Interaction / Visual designer
          </h1>
          <p className={styles.subtitle}>
            Crafting digital experiences that combine beautiful design with thoughtful product strategy
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
