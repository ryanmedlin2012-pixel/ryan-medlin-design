import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styles from './FeaturedProjects.module.css';
import { useLayout } from '../context/LayoutContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import scrollingArticleImg from '../assets/scrolling_article_card_800x400.png';

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
    title: 'Token redemption agent',
    description:
      'Redesigned an e-commerce platform serving 100K+ monthly users, reducing cart abandonment from 35% to 18% through user research and iterative prototyping.',
    tags: ['UI Design', 'Product Strategy', 'Research'],
    path: '/project/token-redemption-agent',
  },
  {
    id: 2,
    title: 'Support escalation',
    description:
      'Built a comprehensive design system for a B2B SaaS analytics platform, cutting component rework by 40% and reducing accessibility violations from 120 to 8.',
    tags: ['UX Design', 'Design Systems', 'Accessibility'],
    path: '/project/support-escalation',
  },
  {
    id: 3,
    title: 'Unrecognized charge agent',
    description:
      'Redesigned a consumer banking app for 2M+ active users, achieving WCAG AAA certification while improving mobile adoption by 55%.',
    tags: ['Mobile Design', 'Accessibility', 'Fintech'],
    path: '/project/unrecognized-charge-agent',
  },
  {
    id: 4,
    title: 'Voice chat reporting',
    description:
      'Redesigned a healthcare patient portal, growing adoption from 12% to 48% while passing HIPAA compliance audits and serving 500K+ patients.',
    tags: ['Enterprise Design', 'Research', 'Healthcare'],
    path: '/project/voice-chat-reporting',
  },
  {
    id: 5,
    title: 'Scrolling article for 10 foot experience',
    description:
      'Designed and patented (US12427412B2) a focusable content expander system for console/TV UI, adopted by 15 institutions in 6 months.',
    image: scrollingArticleImg,
    tags: ['Product Design', '10-Foot UI', 'Innovation'],
    path: '/project/scrolling-article-10-foot-experience',
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
