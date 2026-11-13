import styles from './PeopleIndex.module.css';

/**
 * Default empty state when no entity is selected in the master-detail route.
 */
export function PeopleIndex() {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>📋</div>
      <h3 className={styles.title}>No Pioneer Selected</h3>
      <p className={styles.text}>
        Select a profile from the left sidebar navigation to inspect detailed system specifications,
        metrics, and role definitions under React Router v7.
      </p>
    </div>
  );
}

export default PeopleIndex;
