import React, { useMemo, useState } from 'react';
import { useParams, NavLink } from 'react-router';
import { DOSSIERS, computeMatrix } from '../data/dossiers';
import useAppealSlaTimer from '../hooks/useAppealSlaTimer';
import styles from './DossierView.module.css';

/**
 * Slide 32 / 33 Code Contract: DossierView.jsx
 * Multi-Route Dossiers for Himass & TanVuu, Disproportionality Derived Matrix,
 * and Zero-Drift Appeal SLA Countdown with Page Visibility API.
 */
export function DossierView({ user }) {
  const params = useParams();
  const targetId = (user ? user.toLowerCase() : params.playerId || 'himass').toLowerCase();
  const dossier = DOSSIERS[targetId];

  // 1. Slide 32 Code Contract: Disproportionality Derived Matrix computation during render
  const matrix = useMemo(() => computeMatrix(dossier), [dossier]);

  // 2. Slide 32 Code Contract: Zero-Drift SLA Countdown Hook
  const { formattedTime, isExpired, resyncCount } = useAppealSlaTimer(
    dossier ? dossier.appealDeadlineHours : 48,
    targetId
  );

  // Appeal Form State
  const [repName, setRepName] = useState('');
  const [email, setEmail] = useState('');
  const [rebuttal, setRebuttal] = useState('');
  const [submittedAppeal, setSubmittedAppeal] = useState(null);
  const [errors, setErrors] = useState({});

  // Synchronous form validation on submit (Single render pass)
  const handleAppealSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!repName.trim()) newErrors.repName = 'Legal representative name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Valid corporate or player email is required';
    }
    if (!rebuttal.trim() || rebuttal.trim().length < 20) {
      newErrors.rebuttal = 'Rebuttal must be at least 20 characters explaining technical mitigating factors';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const appealRecord = {
        caseNumber: dossier.caseNumber,
        playerName: dossier.playerName,
        representative: repName.trim(),
        email: email.trim(),
        statement: rebuttal.trim(),
        submittedAt: new Date().toISOString(),
      };
      setSubmittedAppeal(appealRecord);
      // Optional async POST to /api/appeals
      fetch('/api/appeals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appealRecord),
      }).catch(() => {});
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
        <h3 className={styles.sectionHeading}>File Official Appeal Rebuttal</h3>

        {submittedAppeal ? (
          <div className={styles.appealSuccessAlert} role="status">
            <h4>✅ Appeal Registered Successfully</h4>
            <p>
              Rebuttal for <strong>{submittedAppeal.playerName}</strong> ({submittedAppeal.caseNumber}) has been recorded.
            </p>
            <div className={styles.receiptBox}>
              <div><strong>Representative:</strong> {submittedAppeal.representative}</div>
              <div><strong>Email:</strong> {submittedAppeal.email}</div>
              <div><strong>Submission Time:</strong> {new Date(submittedAppeal.submittedAt).toLocaleString()}</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAppealSubmit} className={styles.appealForm} noValidate>
            <div className={styles.fieldGroup}>
              <label htmlFor="rep-name" className={styles.label}>
                Authorized Representative / Advocate
              </label>
              <input
                id="rep-name"
                type="text"
                value={repName}
                onChange={(e) => setRepName(e.target.value)}
                placeholder="e.g. Trần Hữu Thắng (Lead Counsel)"
                className={`${styles.input} ${errors.repName ? styles.inputError : ''}`}
              />
              {errors.repName && <span className={styles.errorText} role="alert">{errors.repName}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="rep-email" className={styles.label}>
                Official Communication Email
              </label>
              <input
                id="rep-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. 24521614@gm.uit.edu.vn"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              />
              {errors.email && <span className={styles.errorText} role="alert">{errors.email}</span>}
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="rep-rebuttal" className={styles.label}>
                Technical Rebuttal &amp; Packet Evidence Summary
              </label>
              <textarea
                id="rep-rebuttal"
                rows="4"
                value={rebuttal}
                onChange={(e) => setRebuttal(e.target.value)}
                placeholder="Detail network hardware anomalies, tickrate packet integrity, and zero third-party software evidence..."
                className={`${styles.textarea} ${errors.rebuttal ? styles.inputError : ''}`}
              />
              {errors.rebuttal && <span className={styles.errorText} role="alert">{errors.rebuttal}</span>}
            </div>

            <button type="submit" className={styles.submitAppealBtn}>
              Submit Appeal to Fair-Play Commission
            </button>
          </form>
        )}
      </section>
    </article>
  );
}

export default DossierView;
