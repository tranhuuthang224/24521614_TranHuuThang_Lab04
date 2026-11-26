import React, { useMemo, useState } from 'react';
import { useParams, NavLink } from 'react-router';
import { DOSSIERS, computeMatrix } from '../data/dossiers';
import { FormContext, validateAppealForm } from '../context/FormContext';
import InputField from './InputField';
import useAppealSlaTimer from '../hooks/useAppealSlaTimer';
import styles from './DossierView.module.css';

const initialAppealValues = {
  representative: '',
  email: '',
  statement: '',
};

/**
 * Isolated per-dossier case view keyed by targetId so timer and form state reset cleanly on switch.
 */
function DossierCase({ targetId }) {
  const dossier = DOSSIERS[targetId];

  // 1. Slide 32 Code Contract: Disproportionality Derived Matrix computation during render
  const matrix = useMemo(() => computeMatrix(dossier), [dossier]);

  // 2. Slide 32 Code Contract: Zero-Drift SLA Countdown Hook
  const { formattedTime, isExpired, resyncCount } = useAppealSlaTimer(
    dossier ? dossier.appealDeadlineHours : 48,
    targetId
  );

  // 3. Slide 21 Appeal Form Engine: Context-driven synchronous real-time field validation
  const [values, setValues] = useState(initialAppealValues);
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAppeal, setSubmittedAppeal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitNotice, setSubmitNotice] = useState('');

  // Synchronous derived errors in 1 render pass (zero useEffect waterfalls)
  const errors = validateAppealForm(values);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleAppealSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!isValid || !dossier) return;

    const appealRecord = {
      caseNumber: dossier.caseNumber,
      playerName: dossier.playerName,
      representative: values.representative.trim(),
      email: values.email.trim(),
      statement: values.statement.trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      setSubmitting(true);
      setSubmitNotice('');
      const res = await fetch('/api/appeals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appealRecord),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }
      const saved = await res.json();
      setSubmittedAppeal(saved);
    } catch (err) {
      setSubmittedAppeal(appealRecord);
      setSubmitNotice(`Local receipt recorded (API offline: ${err.message})`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!dossier) {
    return (
      <div role="alert" className={styles.notFound}>
        <h3>404: Case Dossier Not Found</h3>
        <p>No esports appeal dossier registered under identifier &ldquo;{targetId}&rdquo;.</p>
        <NavLink to="/dossier/himass" className={styles.returnLink}>
          View Himass Dossier
        </NavLink>
      </div>
    );
  }

  return (
    <article className={styles.dossierContainer} aria-labelledby="dossier-heading">
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.tribunalBadge}>Fair-Play Appeal Tribunal</span>
          <span className={styles.caseBadge}>{dossier.caseNumber}</span>
          <span className={styles.slaBadge} title="Synchronized via Page Visibility API">
            ⏱️ SLA: {formattedTime} ({resyncCount} resyncs)
          </span>
        </div>

        <h2 id="dossier-heading" className={styles.title}>
          {dossier.playerName}
        </h2>
        <p className={styles.metaLine}>
          <strong>Team:</strong> {dossier.team} • <strong>Role:</strong> {dossier.role}
        </p>
      </header>

      {/* SLA Countdown Timer Banner */}
      <section className={styles.timerBanner} aria-label="SLA Appeal Countdown">
        <div className={styles.timerContent}>
          <div>
            <span className={styles.timerLabel}>Appeal Window Deadline</span>
            <div className={styles.timerValue}>{isExpired ? 'DEADLINE EXPIRED' : formattedTime}</div>
          </div>
          <p className={styles.timerSubtext}>
            Zero-drift synchronized against absolute system clock via Page Visibility API.
          </p>
        </div>
      </section>

      {/* Case Details Definition List */}
      <section className={styles.sectionBlock}>
        <h3 className={styles.sectionHeading}>Sanction &amp; Allegation Overview</h3>
        <dl className={styles.definitionList}>
          <div className={styles.dlRow}>
            <dt className={styles.dt}>Applied Penalty</dt>
            <dd className={`${styles.dd} ${styles.penaltyText}`}>{dossier.penaltyApplied}</dd>
          </div>
          <div className={styles.dlRow}>
            <dt className={styles.dt}>Alleged Offense</dt>
            <dd className={styles.dd}>{dossier.offenseType}</dd>
          </div>
          <div className={styles.dlRow}>
            <dt className={styles.dt}>Player Statement</dt>
            <dd className={styles.dd}>&ldquo;{dossier.statement}&rdquo;</dd>
          </div>
        </dl>
      </section>

      {/* Slide 32: Disproportionality Derived Matrix */}
      {matrix && (
        <section className={styles.matrixBlock} aria-label="Disproportionality Metric Analysis">
          <header className={styles.matrixHeader}>
            <span className={styles.matrixStatus}>{matrix.parityStatus}</span>
            <h3 className={styles.matrixTitle}>Disproportionality Severity Matrix</h3>
          </header>

          <div className={styles.metricGrid}>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Applied Severity</span>
              <strong className={styles.metricNum}>{dossier.offenseSeverity} / 10</strong>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Benchmark Standard</span>
              <strong className={styles.metricNum}>{dossier.benchmarkOffenseSeverity} / 10</strong>
            </div>
            <div className={styles.metricCard}>
              <span className={styles.metricLabel}>Disproportionality Ratio</span>
              <strong className={`${styles.metricNum} ${styles.ratioNum}`}>{matrix.ratio}x</strong>
            </div>
          </div>

          <p className={styles.matrixRecommendation}>
            <strong>Tribunal Guidance:</strong> {matrix.recommendation}
          </p>
        </section>
      )}

      {/* Forensic Evidence Items */}
      <section className={styles.sectionBlock}>
        <h3 className={styles.sectionHeading}>Submitted Technical Evidence ({dossier.evidenceItems.length})</h3>
        <ul className={styles.evidenceList}>
          {dossier.evidenceItems.map((item) => (
            <li key={item.id} className={styles.evidenceItem}>
              <span className={styles.evidenceType}>{item.type}</span>
              <span className={styles.evidenceName}>{item.name}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Context-Driven Appeal Submission Form */}
      <section className={styles.appealFormSection}>
        <div className={styles.formHeaderRow}>
          <h3 className={styles.sectionHeading}>File Official Appeal Rebuttal</h3>
          {!submittedAppeal && (
            <span
              className={`${styles.formStatusPill} ${
                isValid ? styles.formStatusValid : styles.formStatusInvalid
              }`}
            >
              {isValid ? '● Appeal Ready' : `● ${Object.keys(errors).length} Required Field(s)`}
            </span>
          )}
        </div>

        {submittedAppeal ? (
          <div className={styles.appealSuccessAlert} role="status">
            <h4>✅ Appeal Registered Successfully</h4>
            <p>
              Rebuttal for <strong>{submittedAppeal.playerName}</strong> ({submittedAppeal.caseNumber}) has been recorded.
            </p>
            {submitNotice && <p className={styles.offlineNotice}>{submitNotice}</p>}
            <div className={styles.receiptBox}>
              <div><strong>Representative:</strong> {submittedAppeal.representative}</div>
              <div><strong>Email:</strong> {submittedAppeal.email}</div>
              <div><strong>Submission Time:</strong> {new Date(submittedAppeal.submittedAt).toLocaleString()}</div>
            </div>
          </div>
        ) : (
          <FormContext.Provider
            value={{
              values,
              errors,
              touched,
              isSubmitted,
              isValid,
              handleChange,
              handleBlur,
              setValues,
            }}
          >
            <form onSubmit={handleAppealSubmit} className={styles.appealForm} noValidate>
              <InputField
                label="Authorized Representative / Advocate"
                name="representative"
                type="text"
                placeholder="e.g. Trần Hữu Thắng (Lead Counsel)"
              />

              <InputField
                label="Official Communication Email"
                name="email"
                type="email"
                placeholder="e.g. 24521614@gm.uit.edu.vn"
              />

              <InputField
                label="Technical Rebuttal & Packet Evidence Summary"
                name="statement"
                as="textarea"
                rows={4}
                placeholder="Detail network hardware anomalies, tickrate packet integrity, and zero third-party software evidence..."
              />

              <button
                type="submit"
                disabled={submitting}
                className={styles.submitAppealBtn}
              >
                {submitting ? 'Submitting Appeal...' : 'Submit Appeal to Fair-Play Commission'}
              </button>
            </form>
          </FormContext.Provider>
        )}
      </section>
    </article>
  );
}

/**
 * Slide 32 / 33 Code Contract: DossierView.jsx
 * Multi-Route Dossiers for Himass & TanVuu, Disproportionality Derived Matrix,
 * Zero-Drift Appeal SLA Countdown, and Context-driven Real-Time Appeal Form Engine.
 */
export function DossierView({ user }) {
  const params = useParams();
  const targetId = (user ? user.toLowerCase() : params.playerId || 'himass').toLowerCase();

  return <DossierCase key={targetId} targetId={targetId} />;
}

export default DossierView;
