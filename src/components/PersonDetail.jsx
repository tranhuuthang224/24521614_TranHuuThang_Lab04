import { useParams } from 'react-router';
import styles from './PersonDetail.module.css';

/**
 * Slide 11 & Slide 22 Code Contract: PersonDetail.jsx
 * Safe URL parameter extraction via useParams(), entity lookup via people.find(),
 * explicit 404 boundary guard with role="alert", and semantic definition list <dl>/<dt>/<dd>.
 */
export default function PersonDetail({ people = [] }) {
  // Parameter extraction with useParams
  const { id } = useParams();

  // Record retrieval: people.find()
  const person = people.find((p) => p.id === id);

  // Explicit 404 boundary guard
  if (!person) {
    return (
      <div role="alert" className={styles.errorAlert}>
        <div className={styles.errorCode}>404</div>
        <div className={styles.errorMessage}>404: Person Not Found</div>
        <p className={styles.errorSubtext}>
          The identifier &ldquo;{id}&rdquo; does not correspond to any registered pioneer.
        </p>
      </div>
    );
  }

  // Accessible semantic HTML rendering
  return (
    <article className={styles.detailContainer} aria-labelledby="person-heading">
      <header className={styles.header}>
        <h2 id="person-heading" className={styles.heading}>
          {person.name}
        </h2>
        <span className={styles.badge}>{person.role}</span>
      </header>

      <dl className="person-details">
        <div className={styles.fieldRow}>
          <dt className={styles.label}>Name</dt>
          <dd className={styles.value}>{person.name}</dd>
        </div>

        <div className={styles.fieldRow}>
          <dt className={styles.label}>Role</dt>
          <dd className={styles.value}>{person.role}</dd>
        </div>

        {person.age !== undefined && (
          <div className={styles.fieldRow}>
            <dt className={styles.label}>Age</dt>
            <dd className={styles.value}>{person.age}</dd>
          </div>
        )}

        {person.iq !== undefined && (
          <div className={styles.fieldRow}>
            <dt className={styles.label}>IQ Metric</dt>
            <dd className={styles.value}>{person.iq}</dd>
          </div>
        )}

        {person.field && (
          <div className={styles.fieldRow}>
            <dt className={styles.label}>Domain / Specialty</dt>
            <dd className={styles.value}>{person.field}</dd>
          </div>
        )}

        {person.bio && (
          <div className={styles.fieldRow}>
            <dt className={styles.label}>Biography</dt>
            <dd className={styles.valueBio}>{person.bio}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}
