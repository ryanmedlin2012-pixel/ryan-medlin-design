import React from 'react';
import styles from './Contact.module.css';
import { CONTACT_LINKS } from './contactLinks';

// The last section, set as About is (but centred): a serif headline on the
// light ground, a line of grey text, then the ways to reach me as green
// links, one above the other. (The small print — the year, how the site was
// made — is in the colophon, from the button at the bottom right.)
export const Contact: React.FC = () => {
  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <h2 className={styles.heading} data-section-heading="true" tabIndex={-1}>
            Let’s work together
          </h2>
          <p className={styles.intro}>
            Tell me about the product, the team and the moments you’re designing for. I’m taking
            on a few part-time and fixed-scope projects.
          </p>
          <ul className={styles.links}>
            {CONTACT_LINKS.map(({ label, text, href, onClick }) => {
              // (The label names the link for screen readers only.)
              const external = href.startsWith('http');
              return (
                <li key={label}>
                  <a
                    className={styles.link}
                    href={href}
                    onClick={onClick}
                    aria-label={`${label}: ${text}`}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <em>{text}</em> <span aria-hidden="true">→</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
