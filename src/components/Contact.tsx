import React from 'react';
import styles from './Contact.module.css';

export const Contact: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <h2
            className={styles.heading}
            data-section-heading="true"
            tabIndex={-1}
          >
            Get In Touch
          </h2>
          <p className={styles.subtitle}>
            Let&rsquo;s collaborate on your next project or discuss design opportunities
          </p>
          <div className={styles.contactMethods}>
            <a href="mailto:your.email@example.com" className={styles.contactItem}>
              <span className={styles.icon}>✉</span>
              <span>Email</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
              <span className={styles.icon}>in</span>
              <span>LinkedIn</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
              <span className={styles.icon}>𝕏</span>
              <span>Twitter</span>
            </a>
            <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
              <span className={styles.icon}>◉</span>
              <span>Dribbble</span>
            </a>
          </div>
        </div>
      </div>
      <footer className={styles.footer}>
        <p>© {currentYear} Ryan Medlin. All rights reserved.</p>
        <p>Designed and built with attention to detail</p>
      </footer>
    </section>
  );
};
