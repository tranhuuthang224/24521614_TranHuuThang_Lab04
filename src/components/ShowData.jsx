import styles from './ShowData.module.css';

/**
 * Slide 24 / 25 Code Contract: ShowData.jsx
 * Semantic JSON state inspector using <dl>/<dt>/<dd>.
 * Replaces unstructured JSON.stringify dumps with an accessible DOM tree for screen readers.
 */
export const ShowData = ({ data = {} }) => {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  return (
    <section className={styles.inspectorContainer} aria-label="Submitted Form State Inspector">
      <header className={styles.inspectorHeader}>
        <span className={styles.inspectorBadge}>Live State Inspector</span>
        <h3 className={styles.inspectorTitle}>Submitted Payload (&lt;ShowData /&gt;)</h3>
        <p className={styles.inspectorSubtext}>
          Accessible key-value representation via semantic &lt;dl&gt;/&lt;dt&gt;/&lt;dd&gt;.
        </p>
      </header>

      <dl className={`json-inspector ${styles.jsonInspector}`}>
        {Object.entries(data).map(([key, val]) => (
          <div key={key} className={`data-row ${styles.dataRow}`}>
            <dt className={styles.key}>{key}</dt>
            <dd className={styles.val}>{String(val)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default ShowData;
