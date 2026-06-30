import { useLayout, SECTION_LABELS } from '../context/LayoutContext';
import styles from './SectionDots.module.css';

export const SectionDots = () => {
  const { currentSection, goToSection, sectionCount } = useLayout();

  return (
    <div className={styles.container} role="tablist" aria-label="Portfolio sections">
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
