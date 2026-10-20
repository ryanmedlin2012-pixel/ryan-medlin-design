import { useLayout } from '../context/LayoutContext';
import styles from './ProgressBar.module.css';

export const ProgressBar = () => {
  const { currentSection, sectionCount, projectProgress } = useLayout();
  const sectionSpan = 100 / (sectionCount - 1);
  let progress = currentSection * sectionSpan;

  // Sub-divide a carousel section's slice of the bar across its own cards
  // (desktop only — projectProgress is null on mobile).
  const isInCarousel = !!projectProgress && projectProgress.section === currentSection;
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
