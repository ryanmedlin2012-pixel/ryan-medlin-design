import { useLayout, SECTION_LABELS } from '../context/LayoutContext';
import styles from './SectionDots.module.css';

// Sections with a dark background, where the dots turn light (Contact).
const DARK_SECTIONS = new Set([3]);

export const SectionDots = () => {
  const { currentSection, goToSection, sectionCount } = useLayout();

  return (
    <div
      className={`${styles.container} ${DARK_SECTIONS.has(currentSection) ? styles.onDark : ''}`}
      role="tablist"
      aria-label="Portfolio sections"
    >
      {Array.from({ length: sectionCount }, (_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === currentSection}
          aria-label={`Go to ${SECTION_LABELS[i]}`}
          className={`${styles.dot} ${i === currentSection ? styles.active : ''}`}
          onClick={() => goToSection(i)}
        />
      ))}
    </div>
  );
};
