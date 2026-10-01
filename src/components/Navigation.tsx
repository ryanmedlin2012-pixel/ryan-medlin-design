import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Navigation.module.css';
import { useLayout } from '../context/LayoutContext';

const projects = [
  { title: 'SVA Improved Escalation to Assisted Support', path: '/project/support-escalation' },
  { title: 'Persistent Chat & OCC Floating Surface', path: '/project/persistent-chat-occ' },
  { title: 'Unrecognized Charge Agent', path: '/project/unrecognized-charge-agent' },
  { title: 'Voice Chat Reporting & Voice Safety', path: '/project/voice-chat-reporting' },
  { title: 'Token Redemption Agent', path: '/project/token-redemption-agent' },
  { title: 'SVA Settings, Feedback & Agent Appearance', path: '/project/sva-settings-feedback' },
  { title: 'Skylight to OCC Migration', path: '/project/skylight-occ-migration' },
  { title: 'Asurion Hardware Card', path: '/project/asurion-hardware-card' },
  { title: 'Floating SVA & the Front Door', path: '/project/floating-sva-front-door' },
  { title: 'XDS Design System Contributions', path: '/project/xds-design-system' },
  { title: 'Scrolling Article — 10-Foot Experience', path: '/project/scrolling-article-10-foot-experience' },
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
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  // The Projects panel (desktop). This one state opens it and turns its
  // chevron, so the two always agree. A mouse opens it by hovering ('hover':
  // it closes again as the pointer leaves); clicking the chevron, or using
  // it from the keyboard or by touch, opens it until it's dismissed
  // ('pinned').
  const [projectsPanel, setProjectsPanel] = useState<'hover' | 'pinned' | null>(null);
  const projectsOpen = projectsPanel !== null;
  const setProjectsOpen = (open: boolean) => setProjectsPanel(open ? 'pinned' : null);
  const navRef = useRef<HTMLElement>(null);
  const projectsToggleRef = useRef<HTMLButtonElement>(null);
  const isHomePage = pathname === '/';

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setProjectsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setProjectsOpen(false);
  }, [pathname]);

  const handleSectionLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const index = SECTION_HASHES[href] ?? 0;
    setMenuOpen(false);
    if (isHomePage) {
      goToSection(index);
    } else {
      navigate('/', { state: { section: index } });
    }
  };

  return (
    <nav ref={navRef} className={styles.nav} aria-label="Main navigation">
      <div className={styles.container}>
        <a
          href="/"
          className={styles.logo}
          style={{ textDecoration: 'none' }}
          onClick={(e) => handleSectionLink(e, '/#hero')}
        >
          Ryan Medlin
        </a>

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
          <li
            className={`${styles.dropdown} ${projectsOpen ? styles.dropdownOpen : ''}`}
            // Escape closes it, back to the toggle; so does focus moving on
            // past it.
            onPointerEnter={(e) => {
              if (e.pointerType === 'mouse') setProjectsPanel((p) => p ?? 'hover');
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === 'mouse') setProjectsPanel((p) => (p === 'hover' ? null : p));
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && projectsOpen) {
                setProjectsOpen(false);
                projectsToggleRef.current?.focus();
              }
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                setProjectsOpen(false);
              }
            }}
          >
            <a
              href="/#projects"
              onClick={(e) => handleSectionLink(e, '/#projects')}
              className={styles.dropdownTrigger}
            >
              Projects
            </a>
            {/* Opens the list without leaving the page (the link above goes
                to the Projects section). */}
            <button
              ref={projectsToggleRef}
              type="button"
              className={styles.dropdownToggle}
              aria-label="Project list"
              aria-expanded={projectsOpen}
              aria-controls="nav-projects"
              // Opened by hovering, a click keeps it open (the pointer is
              // already there, so it wants the list); otherwise it toggles.
              onClick={() => setProjectsPanel((p) => (p === 'hover' ? 'pinned' : p ? null : 'pinned'))}
            >
              <svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true" focusable="false">
                <path d="M1 1l4 4 4-4" />
              </svg>
            </button>
            <div id="nav-projects" className={styles.dropdownMenu}>
              {projects.map((project) => (
                <Link
                  key={project.path}
                  to={project.path}
                  className={styles.dropdownItem}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  onClick={() => {
                    setMenuOpen(false);
                    setProjectsOpen(false);
                  }}
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
