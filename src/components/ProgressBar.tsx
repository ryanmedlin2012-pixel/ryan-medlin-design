import { useLayout } from '../context/LayoutContext';
import { SECTION_INDEX as PROJECTS_SECTION_INDEX } from './FeaturedProjects';
import styles from './ProgressBar.module.css';

export const ProgressBar = () => {
  const { currentSection, sectionCount, projectProgress } = useLayout();
  const sectionSpan = 100 / (sectionCount - 1);
  let progress = currentSection * sectionSpan;

  // Sub-divide the Projects section's slice of the bar across its own
  // carousel cards (desktop only — projectProgress is null on mobile).
  const isInCarousel = currentSection === PROJECTS_SECTION_INDEX && !!projectProgress;
  if (isInCarousel && projectProgress && projectProgress.total > 1) {
    const subFraction = projectProgress.current / (projectProgress.total - 1);
    progress = currentSection * sectionSpan + subFraction * sectionSpan;
  }

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Portfolio navigation progress"
    >
      <div
        className={`${styles.fill} ${isInCarousel ? styles.fillCarousel : styles.fillMacro}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
