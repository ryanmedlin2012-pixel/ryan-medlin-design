import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navigation.module.css';
import { useLayout } from '../context/LayoutContext';

const projects = [
  { title: 'Token redemption agent', path: '/project/token-redemption-agent' },
  { title: 'Support escalation', path: '/project/support-escalation' },
  { title: 'Unrecognized charge agent', path: '/project/unrecognized-charge-agent' },
  { title: 'Voice chat reporting', path: '/project/voice-chat-reporting' },
  { title: 'Scrolling article for 10 foot experience', path: '/project/scrolling-article-10-foot-experience' },
];

const SECTION_HASHES: Record<string, number> = {
  '/#hero': 0,
  '/#projects': 1,
  '/#skills': 2,
  '/#contact': 3,
};

export const Navigation: React.FC = () => {
  const { pathname } = useLocation();
  const { goToSection } = useLayout();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const isHomePage = pathname === '/';

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  const handleSectionLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const index = SECTION_HASHES[href];
    if (isHomePage && index !== undefined) {
      e.preventDefault();
      goToSection(index);
      setMenuOpen(false);
    }
  };

  return (
    <nav ref={navRef} className={styles.nav} aria-label="Main navigation">
      <div className={styles.container}>
        <Link to="/" className={styles.logo} style={{ textDecoration: 'none' }}>
          Ryan Medlin
        </Link>

        {/* Hamburger — mobile only */}
        <button
          className={styles.hamburger}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ''}`} />
        </button>

        <ul
          id="nav-links"
          className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}
          role="list"
        >
          <li>
            <a
              href="/#hero"
              onClick={(e) => handleSectionLink(e, '/#hero')}
            >
              Home
            </a>
          </li>
          <li className={styles.dropdown}>
            <a
              href="/#projects"
              onClick={(e) => handleSectionLink(e, '/#projects')}
              className={styles.dropdownTrigger}
            >
              Projects
            </a>
            <div className={styles.dropdownMenu}>
              {projects.map((project) => (
                <Link
                  key={project.path}
                  to={project.path}
                  className={styles.dropdownItem}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {project.title}
                </Link>
              ))}
            </div>
          </li>
          <li>
            <a
              href="/#skills"
              onClick={(e) => handleSectionLink(e, '/#skills')}
            >
              Skills
            </a>
          </li>
          <li>
            <a
              href="/#contact"
              onClick={(e) => handleSectionLink(e, '/#contact')}
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
