import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './FeaturedProjects.module.css';
import { useLayout } from '../context/LayoutContext';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  path: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'SVA Improved Escalation to Assisted Support',
    description:
      'Redesigned the Xbox SVA escalation path, collapsing 4 clicks to 1–2 actions. Reduced abandonment from 31% to 18% and lifted CSAT from 3.4 to 4.2/5. Validated in HITS study with 91% task success.',
    tags: ['Conversational UX', 'AI Design', 'Research'],
    path: '/project/support-escalation',
  },
  {
    id: 2,
    title: 'Persistent Chat & the OCC Floating Surface',
    description:
      'Designed the Xbox OCC floating chat layer that travels across account pages with full context persistence. Chat engagement doubled (+107%) and CSAT rose to 4.4/5.',
    tags: ['Interaction Design', 'AI Design', 'Platform'],
    path: '/project/persistent-chat-occ',
  },
  {
    id: 3,
    title: 'Unrecognized Charge Agent',
    description:
      'Evolved the Xbox charge-dispute agent from MVP text links to rich adaptive cards. Click-through rate improved 102% and self-service resolution jumped from 18.7% to 31.2%.',
    tags: ['Conversational UX', 'Visual Design', 'AI Design'],
    path: '/project/unrecognized-charge-agent',
  },
  {
    id: 4,
    title: 'Voice Chat Reporting & Voice Safety',
    description:
      'Redesigned Xbox\'s evidence-first voice harassment reporting flow. Report submissions up 21%, evidence attachments up 60%, and action rate on violators up 43%.',
    tags: ['UX Design', 'Trust & Safety', 'Research'],
    path: '/project/voice-chat-reporting',
  },
  {
    id: 5,
    title: 'Token Redemption Agent',
    description:
      'Designed an AI-assisted image upload flow for damaged Xbox game codes, with three distinct error states and pre-attached escalation context. CSAT 4.2/5, escalations avoided –11%.',
    tags: ['Conversational UX', 'AI Design', 'Accessibility'],
    path: '/project/token-redemption-agent',
  },
];

// Projects lives at panel index 1 in the horizontal layout
const SECTION_INDEX = 1;

function padNum(n: number) {
  return String(n).padStart(2, '0');
}

export const FeaturedProjects: React.FC = () => {
  const { wheelHandlersRef } = useLayout();
  const isPointerFine = useMediaQuery('(pointer: fine)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const useCarousel = isPointerFine && !prefersReducedMotion;

  const [currentCard, setCurrentCard] = useState(0);
  const currentCardRef = useRef(0);
  const isCardAnimatingRef = useRef(false);

  useEffect(() => {
    currentCardRef.current = currentCard;
  }, [currentCard]);

  const goToCard = useCallback((index: number) => {
    if (isCardAnimatingRef.current) return;
    if (index < 0 || index >= projects.length) return;
    isCardAnimatingRef.current = true;
    setCurrentCard(index);
  }, []);

  const handleCardTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== 'transform') return;
      setTimeout(() => {
        isCardAnimatingRef.current = false;
      }, 50);
    },
    []
  );

  // Register wheel/keyboard handler with the layout for this panel
  useEffect(() => {
    if (!useCarousel) {
      wheelHandlersRef.current.delete(SECTION_INDEX);
      return;
    }

    const handler = (direction: number): boolean => {
      if (isCardAnimatingRef.current) return true; // block but consume

      if (direction > 0 && currentCardRef.current < projects.length - 1) {
        isCardAnimatingRef.current = true;
        setCurrentCard((c) => c + 1);
        return true; // consumed
      }
      if (direction < 0 && currentCardRef.current > 0) {
        isCardAnimatingRef.current = true;
        setCurrentCard((c) => c - 1);
        return true; // consumed
      }
      return false; // at boundary — let layout advance to next/prev section
    };

    wheelHandlersRef.current.set(SECTION_INDEX, handler);
    return () => {
      wheelHandlersRef.current.delete(SECTION_INDEX);
    };
  }, [useCarousel, wheelHandlersRef]);

  // ─── Mobile / reduced-motion: compact scrollable grid ─────────────────────
  if (!useCarousel) {
    return (
      <section id="projects" className={styles.projectsMobile}>
        <div className={styles.mobileContainer}>
          <h2
            className={styles.heading}
            data-section-heading="true"
            tabIndex={-1}
          >
            Featured Projects
          </h2>
          <div className={styles.compactGrid}>
            {projects.map((project) => (
              <Link
                key={project.id}
                to={project.path}
                className={styles.compactCard}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className={styles.tags}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ─── Desktop: full-panel card carousel ────────────────────────────────────
  return (
    <section id="projects" className={styles.projectsDesktop}>
      {/* Header row: title + card indicator dots + prev/next nav */}
      <div className={styles.carouselHeader}>
        <h2
          className={styles.heading}
          data-section-heading="true"
          tabIndex={-1}
        >
          Featured Projects
        </h2>
        <div
          className={styles.cardDots}
          role="tablist"
          aria-label="Project cards"
        >
          {projects.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === currentCard}
              aria-label={`Project ${i + 1} of ${projects.length}`}
              className={`${styles.cardDot} ${
                i === currentCard ? styles.cardDotActive : ''
              }`}
              onClick={() => goToCard(i)}
            />
          ))}
        </div>
        <div className={styles.carouselNav}>
          <button
            className={styles.navButton}
            onClick={() => goToCard(currentCard - 1)}
            disabled={currentCard === 0}
            aria-label="Previous project"
          >
            ←
          </button>
          <span
            className={styles.navCounter}
            aria-live="polite"
            aria-atomic="true"
          >
            {padNum(currentCard + 1)} / {padNum(projects.length)}
          </span>
          <button
            className={styles.navButton}
            onClick={() => goToCard(currentCard + 1)}
            disabled={currentCard === projects.length - 1}
            aria-label="Next project"
          >
            →
          </button>
        </div>
      </div>

      {/* Carousel viewport */}
      <div className={styles.carouselViewport}>
        <div
          className={styles.carouselTrack}
          style={{
            transform: `translateX(calc(-${currentCard} * 100%))`,
            transition: 'transform 0.6s cubic-bezier(0.77, 0, 0.175, 1)',
          }}
          onTransitionEnd={handleCardTransitionEnd}
        >
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={styles.carouselSlide}
              aria-hidden={i !== currentCard ? 'true' : undefined}
            >
              <div className={styles.carouselCard}>
                <div className={styles.cardInfo}>
                  <span className={styles.cardCounter}>
                    {padNum(i + 1)} / {padNum(projects.length)}
                  </span>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  <p className={styles.cardDescription}>{project.description}</p>
                  <div className={styles.tags}>
                    {project.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link to={project.path} className={styles.viewProject}>
                    View project <span aria-hidden="true">→</span>
                  </Link>
                </div>
                <div className={styles.cardVisual}>
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className={styles.cardImage}
                    />
                  ) : (
                    <div className={styles.cardImagePlaceholder} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};
