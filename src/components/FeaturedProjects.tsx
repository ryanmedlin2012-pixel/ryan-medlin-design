import { useState, useRef, useEffect, useCallback, Fragment } from 'react';
import { Link } from 'react-router-dom';
import styles from './FeaturedProjects.module.css';
import { useLayout } from '../context/LayoutContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import escalationFlow from '../assets/Escalation_1400x1400_b.png';
// The project page's opening graphic, played as an LLM chat (the PNG is its
// still).
import escalationChat from '../assets/Escalation_chat.svg';
// Voice Chat Reporting: the Problem section's chaos converging into the
// redesigned five-step report flow, on one line (the PNG is its finished
// still).
import vcrFlowOrder from '../assets/VCR_flow_order.svg';
import vcrFlowOrderStill from '../assets/VCR_flow_order_still.png';
// Token Redemption: a damaged code, scanned and resolved (the PNG is its
// finished still).
import tokenCodeScan from '../assets/Token_code_scan.svg';
import tokenCodeScanStill from '../assets/Token_code_scan_still.png';
// Unrecognized Charge: recent transactions fill a table, and the agent hones
// in on the one in question and names it plainly (the PNG is its still).
import chargeTransactions from '../assets/Charge_transactions.svg';
import chargeTransactionsStill from '../assets/Charge_transactions_still.png';
// Scrolling Article: the patented navigation on a TV — focus jumping between
// elements, the article scrolling through text between them (the PNG is its
// still).
import scrollingArticleFocus from '../assets/Scrolling_article_focus.svg';
import scrollingArticleFocusStill from '../assets/Scrolling_article_focus_still.png';
// The visual design carousel's cards: each piece on the studio backdrop.
import visualShootingEdge from '../assets/Visual_card_shooting_edge_book.jpg';
import visualWedding from '../assets/Visual_card_wedding.jpg';
import visualLivingNewEconomy from '../assets/Visual_card_living_new_economy.jpg';
import visualAlchimia from '../assets/Visual_card_alchimia.jpg';
import visualYaldaNight from '../assets/Visual_card_yalda_night_white.jpg';
import { readRestored, saveRestorable } from '../hooks/restore';
import { limitSideCrop } from './limitSideCrop';
import { useReplayOnView } from '../hooks/useReplayOnView';

interface Project {
  id: number;
  title: string;
  /** Where the title should break, if it has to: its phrases, kept whole
      (each wraps inside itself only if it can't fit a line on its own). */
  titlePhrases?: string[];
  /** Always break between the phrases, even where the title would fit one
      line (for the look of it). */
  titleAlwaysBreak?: boolean;
  description: string;
  tags: string[];
  image?: string;
  /** The most the image may lose off its left and right (its own pixels). */
  imageMaxSideCrop?: number;
  /** For an animated image: a still shown to readers who prefer reduced
      motion; and whether it replays each time it comes into view. */
  imageStill?: string;
  imageReplay?: boolean;
  /** The image is on the studio backdrop (the visual design cards): the card
      takes the backdrop's colours round it, where the image doesn't fill it. */
  studioBackdrop?: boolean;
  /** Where the photographed object sits in its image (fractions of the
      image's width and height: left, right, top, bottom — measured from the
      image). Phones and narrow tablets zoom the image as far as the object
      allows (never touching the card's top or bottom), and fade its sides
      all the way in to the object. */
  imageContent?: { left: number; right: number; top: number; bottom: number };
  path: string;
}

const interactionProjects: Project[] = [
  {
    id: 1,
    title: 'Improved Escalation to Assisted Support',
    titlePhrases: ['Improved Escalation', 'to Assisted Support'],
    description:
      'Redesigned the Xbox escalation path, collapsing 4 clicks to 1–2 actions. Reduced abandonment from 31% to 18% and lifted CSAT from 3.4 to 4.2. Validated in study with 91% task success.',
    tags: ['Conversational UX', 'LLM design'],
    image: escalationChat,
    imageStill: escalationFlow,
    imageReplay: true,
    imageMaxSideCrop: 212,
    path: '/project/support-escalation',
  },
  {
    id: 4,
    title: 'Voice Chat Reporting & Voice Safety',
    titlePhrases: ['Voice Chat Reporting', '& Voice Safety'],
    titleAlwaysBreak: true,
    description:
      "Redesigned Xbox's evidence-first voice harassment reporting flow. Report submissions up 21%, evidence attachments up 60%, and action rate on violators up 43%.",
    tags: ['UX Design', 'Trust & Safety', 'Research'],
    image: vcrFlowOrder,
    imageStill: vcrFlowOrderStill,
    imageReplay: true,
    imageMaxSideCrop: 212,
    path: '/project/voice-chat-reporting',
  },
  {
    id: 5,
    title: 'Token Redemption Agent',
    description:
      'Designed an AI-assisted image upload flow for damaged Xbox game codes, with three distinct error states and pre-attached escalation context. CSAT 4.2/5, escalations avoided –11%.',
    tags: ['Conversational UX', 'AI Design', 'Accessibility'],
    image: tokenCodeScan,
    imageStill: tokenCodeScanStill,
    imageReplay: true,
    imageMaxSideCrop: 212,
    path: '/project/token-redemption-agent',
  },
  {
    id: 12,
    title: 'Unrecognized Charge: Purchase Lookup',
    titlePhrases: ['Unrecognized Charge:', 'Purchase Lookup'],
    description:
      'Designed how the Xbox support agent finds a charge a player doesn’t recognize: two questions, a confirmation, then a match, a near match or the five latest purchases, written the way a bank statement reads.',
    tags: ['Conversational UX', 'Content Design', 'AI Design'],
    image: chargeTransactions,
    imageStill: chargeTransactionsStill,
    imageReplay: true,
    imageMaxSideCrop: 212,
    path: '/project/unrecognized-charge-lookup',
  },
  {
    id: 6,
    title: 'Scrolling Article — 10-Foot Experience',
    description:
      'Designed a controller-navigable article experience for Xbox console: focusable, expandable content set on a baseline grid, combining vertical scroll with focus jumping. Patented (US12427412B2).',
    tags: ['Interaction Design', '10-Foot UI', 'Design Systems'],
    image: scrollingArticleFocus,
    imageStill: scrollingArticleFocusStill,
    imageReplay: true,
    imageMaxSideCrop: 212,
    path: '/project/scrolling-article-10-foot-experience',
  },
];

// The graphic design work, from the gallery pages.
const visualProjects: Project[] = [
  {
    id: 101,
    title: "America's Shooting Edge",
    description:
      "Book cover for Nita Renfrew's portrait of the 1990s constitutional militias: hunting camouflage, laid flat, wraps from back to front around a spare typographic spine.",
    tags: ['Book Design', 'Typography', 'Art Direction'],
    image: visualShootingEdge,
    imageContent: { left: 0.269, right: 0.694, top: 0.182, bottom: 0.798 },
    imageMaxSideCrop: 212,
    studioBackdrop: true,
    path: '/graphic-design/editorial',
  },
  {
    id: 102,
    title: 'The Wedding of the Century',
    description:
      "A trifold wedding invitation after Saul Bass's Vertigo poster: a falling couple in an orange spiral outside; the cast, ceremony and reception, set like film credits, within.",
    tags: ['Print', 'Illustration', 'Typography'],
    image: visualWedding,
    imageContent: { left: 0.136, right: 0.864, top: 0.313, bottom: 0.647 },
    imageMaxSideCrop: 212,
    studioBackdrop: true,
    path: '/graphic-design/ephemera',
  },
  {
    id: 103,
    title: 'Living the New Economy',
    description:
      'Poster for Convergence, a gathering on the new economy in Oakland: a white koru spiral, the Māori symbol of new beginnings, over a full-color road map of the Bay Area.',
    tags: ['Poster', 'Event Identity', 'Typography'],
    image: visualLivingNewEconomy,
    imageContent: { left: 0.221, right: 0.782, top: 0.139, bottom: 0.881 },
    imageMaxSideCrop: 212,
    studioBackdrop: true,
    path: '/graphic-design/posters',
  },
  {
    id: 104,
    title: 'Alchimia',
    description:
      'Identity for a jewelry maker: a hand-drawn diamond and hand-lettered name, carried from the mark onto boxes and cards.',
    tags: ['Brand Identity', 'Lettering', 'Packaging'],
    image: visualAlchimia,
    imageContent: { left: 0.167, right: 0.872, top: 0.202, bottom: 0.726 },
    imageMaxSideCrop: 212,
    studioBackdrop: true,
    path: '/graphic-design/ephemera',
  },
  {
    id: 105,
    title: 'Yalda Night',
    description:
      'Poster for a new play by Morgan Ludlow: the title in Persian script, in black on white, among butterflies and pomegranate flowers under a black lace border.',
    tags: ['Poster', 'Collage', 'Typography'],
    image: visualYaldaNight,
    imageContent: { left: 0.204, right: 0.79, top: 0.101, bottom: 0.896 },
    imageMaxSideCrop: 212,
    studioBackdrop: true,
    path: '/graphic-design/posters',
  },
];

// Where the carousels sit in the home page's horizontal layout.
export const SECTION_INDEX = 1;
export const VISUAL_SECTION_INDEX = 2;

/** The interaction carousel's projects, in its order (the nav lists them first, to match). */
export const FEATURED_PROJECT_PATHS = interactionProjects.map((project) => project.path);

const TRACK_TRANSITION = 'transform 0.6s cubic-bezier(0.77, 0, 0.175, 1)';

function padNum(n: number) {
  return String(n).padStart(2, '0');
}

// A card's title, breaking (if it must) only between its phrases.
const ProjectTitle = ({ project }: { project: Project }) =>
  project.titlePhrases ? (
    <>
      {project.titlePhrases.map((phrase, i) => (
        <Fragment key={i}>
          {i > 0 && (project.titleAlwaysBreak ? <br /> : ' ')}
          <span className={styles.titlePhrase}>{phrase}</span>
        </Fragment>
      ))}
    </>
  ) : (
    <>{project.title}</>
  );

// Phones and narrow tablets zoom a card's image (up to this), and keep the
// object in it this far (a fraction of the card's height) from the card's
// top and bottom.
const PHONE_ZOOM = 1.5;
const EDGE_ROOM = 0.06;

/** For an image whose object's place is known: its zoom on phones, and how
    far in from each side its fade reaches (to the object). */
const contentFit = (content: Project['imageContent']) => {
  if (!content) return undefined;
  const reach = Math.max(0.5 - content.top, content.bottom - 0.5);
  const zoom = Math.min(PHONE_ZOOM, (0.5 - EDGE_ROOM) / reach);
  const fade = Math.min(content.left, 1 - content.right);
  return {
    '--phone-scale': zoom.toFixed(3),
    '--fade-x': `${(fade * 100).toFixed(1)}%`,
  } as React.CSSProperties;
};

// A card's image: limited side crop, a still for reduced motion and replay
// on view, where the project asks for them.
const CardImage = ({ project }: { project: Project }) => {
  const replay = useReplayOnView(project.image ?? '', !!project.imageReplay);
  const maxCrop = project.imageMaxSideCrop;
  const ref = useCallback(
    (img: HTMLImageElement | null) => {
      replay.ref(img);
      if (maxCrop) limitSideCrop(maxCrop)(img);
      // Its shape, for the edge fade (phones) to trace it as it shows.
      if (img) {
        const shape = () => {
          if (img.naturalWidth && img.naturalHeight) {
            img.style.setProperty('--ratio', String(img.naturalWidth / img.naturalHeight));
          }
        };
        if (img.complete) shape();
        else img.addEventListener('load', shape, { once: true });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxCrop],
  );
  return (
    <picture className={styles.cardPicture}>
      {project.imageStill && (
        <source media="(prefers-reduced-motion: reduce)" srcSet={project.imageStill} />
      )}
      <img
        ref={ref}
        src={replay.src}
        alt={project.title}
        className={styles.cardImage}
        style={contentFit(project.imageContent)}
      />
    </picture>
  );
};

interface CarouselProps {
  projects: Project[];
  heading: string;
  /** The section's id (its hash) and its place in the home page's layout. */
  sectionId: string;
  sectionIndex: number;
  /** Where the current card is remembered for a refresh. */
  cardKey: string;
  /** What a card is called, for screen readers ("Project 2 of 5"). */
  noun?: string;
}

const FeaturedCarousel = ({
  projects,
  heading,
  sectionId,
  sectionIndex: SECTION_INDEX,
  cardKey: CARD_KEY,
  noun = 'Project',
}: CarouselProps) => {
  const { wheelHandlersRef, setProjectProgress, currentSection } = useLayout();
  const isPointerFine = useMediaQuery('(pointer: fine)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isNarrowViewport = useMediaQuery('(max-width: 767px)');
  const useCarousel = isPointerFine && !prefersReducedMotion && !isNarrowViewport;

  // A refresh returns to the card the reader was on.
  const [currentCard, setCurrentCard] = useState(() => {
    const saved = readRestored<number>(CARD_KEY);
    return typeof saved === 'number' && saved >= 0 && saved < projects.length ? saved : 0;
  });
  const currentCardRef = useRef(currentCard);
  const isCardAnimatingRef = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    currentCardRef.current = currentCard;
    saveRestorable(CARD_KEY, currentCard);
  }, [currentCard]);

  // Report this carousel's position into the macro progress bar while it's
  // the section in view — desktop carousel only; mobile's compact grid has no
  // card concept. (There are two carousels; only the one in view reports.)
  const inView = currentSection === SECTION_INDEX;
  useEffect(() => {
    if (!inView) return;
    setProjectProgress(
      useCarousel ? { current: currentCard, total: projects.length, section: SECTION_INDEX } : null,
    );
  }, [inView, useCarousel, currentCard, projects.length, SECTION_INDEX, setProjectProgress]);

  // Suppress the translateX transition while the window is being resized —
  // the track's transform is percentage-based against its own box, which
  // recomputes continuously during a drag-resize, and an always-on
  // transition makes the card visibly lag/chase instead of resizing live.
  useEffect(() => {
    const handleResize = () => {
      if (trackRef.current) trackRef.current.style.transition = 'none';
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        if (trackRef.current) trackRef.current.style.transition = TRACK_TRANSITION;
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, []);

  const goToCard = useCallback(
    (index: number) => {
      if (isCardAnimatingRef.current) return;
      if (index < 0 || index >= projects.length) return;
      isCardAnimatingRef.current = true;
      setCurrentCard(index);
    },
    [projects.length],
  );

  const handleCardTransitionEnd = useCallback((e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'transform') return;
    setTimeout(() => {
      isCardAnimatingRef.current = false;
    }, 50);
  }, []);

  // Register wheel/keyboard handler with the layout for this panel
  useEffect(() => {
    const handlers = wheelHandlersRef.current;

    if (!useCarousel) {
      handlers.delete(SECTION_INDEX);
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

    handlers.set(SECTION_INDEX, handler);
    return () => {
      handlers.delete(SECTION_INDEX);
    };
  }, [useCarousel, wheelHandlersRef, SECTION_INDEX, projects.length]);

  // ─── Mobile / reduced-motion: compact scrollable grid ─────────────────────
  if (!useCarousel) {
    return (
      <section id={sectionId} className={styles.projectsMobile}>
        <div className={styles.mobileContainer}>
          <h2 className={styles.heading} data-section-heading="true" tabIndex={-1}>
            {heading}
          </h2>
          <div className={styles.compactGrid}>
            {projects.map((project, i) => (
              <Link
                key={project.id}
                to={project.path}
                className={styles.compactCard}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  className={`${styles.cardVisual} ${i === 0 ? styles.cardVisualDimmed : ''} ${
                    project.imageMaxSideCrop ? styles.cardVisualLimitCrop : ''
                  } ${project.studioBackdrop ? styles.cardVisualStudio : ''}`}
                >
                  {project.image ? (
                    <CardImage project={project} />
                  ) : (
                    <div className={styles.cardImagePlaceholder} />
                  )}
                </div>
                <h3>
                  <ProjectTitle project={project} />
                </h3>
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
    <section id={sectionId} className={styles.projectsDesktop}>
      {/* Header row: title + card indicator dots + prev/next nav */}
      <div className={styles.carouselHeader}>
        <h2 className={styles.heading} data-section-heading="true" tabIndex={-1}>
          {heading}
        </h2>
        <div className={styles.cardDots} role="tablist" aria-label={`${heading}: cards`}>
          {projects.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === currentCard}
              aria-label={`${noun} ${i + 1} of ${projects.length}`}
              className={`${styles.cardDot} ${i === currentCard ? styles.cardDotActive : ''}`}
              onClick={() => goToCard(i)}
            />
          ))}
        </div>
        <div className={styles.carouselNav}>
          <button
            className={styles.navButton}
            onClick={() => goToCard(currentCard - 1)}
            disabled={currentCard === 0}
            aria-label={`Previous ${noun.toLowerCase()}`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className={styles.navCounter} aria-live="polite" aria-atomic="true">
            {padNum(currentCard + 1)} / {padNum(projects.length)}
          </span>
          <button
            className={styles.navButton}
            onClick={() => goToCard(currentCard + 1)}
            disabled={currentCard === projects.length - 1}
            aria-label={`Next ${noun.toLowerCase()}`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel viewport */}
      <div className={styles.carouselViewport}>
        <div
          ref={trackRef}
          className={styles.carouselTrack}
          style={{
            transform: `translateX(calc(-${currentCard} * 100%))`,
            transition: TRACK_TRANSITION,
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
                  <h3 className={styles.cardTitle}>
                    <ProjectTitle project={project} />
                  </h3>
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
                <div
                  className={`${styles.cardVisual} ${i === 0 ? styles.cardVisualDimmed : ''} ${
                    project.imageMaxSideCrop ? styles.cardVisualLimitCrop : ''
                  } ${project.studioBackdrop ? styles.cardVisualStudio : ''}`}
                >
                  {project.image ? (
                    <CardImage project={project} />
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

export const FeaturedProjects: React.FC = () => (
  <FeaturedCarousel
    projects={interactionProjects}
    heading="Featured Interaction Projects"
    sectionId="projects"
    sectionIndex={SECTION_INDEX}
    cardKey="featuredCard"
  />
);

export const FeaturedVisualDesign: React.FC = () => (
  <FeaturedCarousel
    projects={visualProjects}
    heading="Featured Visual Design"
    sectionId="visual-design"
    sectionIndex={VISUAL_SECTION_INDEX}
    cardKey="featuredVisualCard"
    noun="Piece"
  />
);
