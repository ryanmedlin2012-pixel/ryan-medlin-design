import React from 'react';
import styles from './Contact.module.css';

// Where to reach me. The email address isn't written out on the page, and
// isn't whole anywhere in the code: it's put together only when the link is
// used, which keeps it from address-harvesting bots.
const EMAIL_PARTS = ['ryanmedlin2012', 'gmail.com'];
const openEmail = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  window.location.href = `mailto:${EMAIL_PARTS.join('@')}`;
};

const CONTACT_LINKS = [
  { label: 'Email', text: 'Send me an email', href: '#contact', onClick: openEmail },
  {
    label: 'LinkedIn',
    text: 'linkedin.com/in/medlinryan',
    href: 'https://www.linkedin.com/in/medlinryan/',
  },
];

// The last section, set as About is (but centred): a serif headline on the
// light ground, a line of grey text, then the ways to reach me as green
// links, one above the other, and a quiet note under them.
export const Contact: React.FC = () => {
  const currentYear = new Date().getFullYear();

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
          <footer className={styles.footer}>
            <p>© {currentYear} Ryan Medlin</p>
            <p>Designed and built with AI tools</p>
          </footer>
        </div>
      </div>
    </section>
  );
};
