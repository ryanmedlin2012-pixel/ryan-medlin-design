import { useLayout } from '../context/LayoutContext';
import styles from './ProgressBar.module.css';

export const ProgressBar = () => {
  const { currentSection, sectionCount } = useLayout();
  const progress = (currentSection / (sectionCount - 1)) * 100;

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Portfolio navigation progress"
    >
      <div className={styles.fill} style={{ width: `${progress}%` }} />
    </div>
  );
};
