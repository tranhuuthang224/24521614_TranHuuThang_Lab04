import styles from './Skeleton.module.css';

/**
 * Dimension-matched skeleton fallback component ensuring CLS = 0 (Cumulative Layout Shift = 0).
 * Meets Slide 9 requirements with accessibility attributes aria-busy="true" and aria-live="polite".
 */
export function Skeleton() {
  return (
    <div
      className={styles.skeletonContainer}
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <span className="sr-only" style={{ display: 'none' }}>
        Loading details...
      </span>
      <div className={styles.skeletonRow}>
        <div className={`${styles.skeletonPulse} ${styles.skeletonLabel}`} />
        <div className={`${styles.skeletonPulse} ${styles.skeletonValue}`} />
      </div>
      <div className={styles.skeletonRow}>
        <div className={`${styles.skeletonPulse} ${styles.skeletonLabel}`} />
        <div className={`${styles.skeletonPulse} ${styles.skeletonValue}`} />
      </div>
      <div className={styles.skeletonRow}>
        <div className={`${styles.skeletonPulse} ${styles.skeletonLabel}`} />
        <div className={`${styles.skeletonPulse} ${styles.skeletonValueShort}`} />
      </div>
      <div className={styles.skeletonRow}>
        <div className={`${styles.skeletonPulse} ${styles.skeletonLabel}`} />
        <div className={`${styles.skeletonPulse} ${styles.skeletonValueLong}`} />
      </div>
    </div>
  );
}

export default Skeleton;
