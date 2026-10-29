import { useEffect, useId, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Colophon.module.css';
import { CONTACT_LINKS } from './contactLinks';

// The site's footer, as a colophon: a round button anchored at the bottom
// right of every page (my monogram, set as my name is in the nav), and from it a
// flyout card with the small print — the ways to reach me, the year, and how
// the site was made.
//
// A disclosure, not a dialog: the card comes right after the button, so Tab
// goes on into it; Escape, a click outside it, or moving to another page
// closes it (Escape returns focus to the button).
export const Colophon = () => {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const year = new Date().getFullYear();

  useEffect(() => setOpen(false), [pathname]);

  // While closed, the card is out of the tab order and hidden from screen
  // readers. (Set directly: React 18 doesn't pass `inert` through.)
  useEffect(() => {
    if (panelRef.current) panelRef.current.inert = !open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={styles.colophon} data-open={open || undefined}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.button}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close the colophon' : 'Colophon: contact and site details'}
        onClick={() => setOpen((o) => !o)}
      >
        {/* The monogram, giving way to a close mark when open. */}
        <span className={styles.monogram} aria-hidden="true">
          RM
        </span>
        <svg className={styles.close} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
      <section ref={panelRef} id={panelId} className={styles.panel} aria-label="Colophon">
        <p className={styles.name}>Ryan Medlin</p>
        <p className={styles.role}>Multidisciplinary designer · Portland, Oregon</p>
        <ul className={styles.links}>
          {CONTACT_LINKS.map(({ label, text, href, onClick }) => {
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
        <div className={styles.smallPrint}>
          <p>© {year} Ryan Medlin</p>
          <p>Designed and built with AI tools</p>
        </div>
      </section>
    </div>
  );
};
