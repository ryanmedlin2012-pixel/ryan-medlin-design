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
  {
    title: 'Scrolling Article — 10-Foot Experience',
    path: '/project/scrolling-article-10-foot-experience',
  },
];

// The flyout lists the first few; "More projects" shows the rest.
const PROJECTS_SHOWN = 5;

// Graphic design work, by kind. No pages yet, so listed but not linked.
const graphicDesign = ['Editorial', 'Posters', 'Ephemera'];

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
  // The rest of the list, above "More projects"; collapsed again each time
  // the panel (desktop) or the menu (phone) opens.
  const [moreProjects, setMoreProjects] = useState(false);
  useEffect(() => {
    if (projectsOpen) setMoreProjects(false);
  }, [projectsOpen]);
  useEffect(() => {
    if (menuOpen) setMoreProjects(false);
  }, [menuOpen]);
  const navRef = useRef<HTMLElement>(null);
  const projectsToggleRef = useRef<HTMLButtonElement>(null);
  const moreProjectsRef = useRef<HTMLDivElement>(null);
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

  const projectLink = (project: (typeof projects)[number]) => (
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
  );

  const handleSectionLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
            <a href="/#hero" onClick={(e) => handleSectionLink(e, '/#hero')}>
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
              onClick={() =>
                setProjectsPanel((p) => (p === 'hover' ? 'pinned' : p ? null : 'pinned'))
              }
            >
              <svg viewBox="0 0 10 6" width="10" height="6" aria-hidden="true" focusable="false">
                <path d="M1 1l4 4 4-4" />
              </svg>
            </button>
            <div id="nav-projects" className={styles.dropdownMenu}>
              {/* The list is grouped by discipline. */}
              <div role="group" aria-labelledby="nav-projects-interaction">
                <div id="nav-projects-interaction" className={styles.groupHeading}>
                  Interaction
                </div>
                {projects.slice(0, PROJECTS_SHOWN).map(projectLink)}
                {/* The rest open above the control, so it always sits at the
                    foot of the list it shows and hides. */}
                <div
                  id="nav-projects-more"
                  className={`${styles.moreProjects} ${moreProjects ? styles.moreProjectsOpen : ''}`}
                >
                  <div ref={moreProjectsRef} className={styles.moreProjectsInner}>
                    {projects.slice(PROJECTS_SHOWN).map(projectLink)}
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.moreToggle}
                  aria-expanded={moreProjects}
                  aria-controls="nav-projects-more"
                  onClick={(e) => {
                    const opening = !moreProjects;
                    setMoreProjects(opening);
                    // Using the panel keeps it open, even if a hover opened
                    // it. (In the phone menu there's no panel to keep.)
                    setProjectsPanel((p) => (p === 'hover' ? 'pinned' : p));
                    // From the keyboard (a click with no pointer), opening
                    // moves to the first project it reveals — they're above
                    // the control, so Tab alone would skip past them.
                    if (opening && e.detail === 0) {
                      requestAnimationFrame(() =>
                        moreProjectsRef.current?.querySelector('a')?.focus()
                      );
                    }
                  }}
                >
                  <span className={styles.moreLabel}>
                    {/* An arrow before the words: down to show more, up to
                        show fewer. */}
                    <svg
                      className={styles.moreArrow}
                      viewBox="0 0 10 10"
                      width="10"
                      height="10"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M5 1v8M1.5 5.5L5 9l3.5-3.5" />
                    </svg>
                    <span className={styles.moreText}>
                      {moreProjects ? 'fewer interaction projects' : 'more interaction projects'}
                    </span>
                  </span>
                </button>
              </div>
              <div role="group" aria-labelledby="nav-projects-graphic">
                <div id="nav-projects-graphic" className={styles.groupHeading}>
                  Graphic design
                </div>
                {graphicDesign.map((kind) => (
                  <div key={kind} className={`${styles.dropdownItem} ${styles.dropdownItemPending}`}>
                    {kind}
                  </div>
                ))}
              </div>
            </div>
          </li>
          <li>
            <a href="/#skills" onClick={(e) => handleSectionLink(e, '/#skills')}>
              Skills
            </a>
          </li>
          <li>
            <a href="/#contact" onClick={(e) => handleSectionLink(e, '/#contact')}>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
