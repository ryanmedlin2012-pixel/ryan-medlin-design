import React from 'react';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>© {currentYear} Your Name. All rights reserved.</p>
        <p>Designed and built with attention to detail</p>
      </div>
    </footer>
  );
};
