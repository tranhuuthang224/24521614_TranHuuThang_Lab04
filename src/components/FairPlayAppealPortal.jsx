import React from 'react';
import { NavLink, Outlet } from 'react-router';
import styles from './FairPlayAppealPortal.module.css';

/**
 * Slide 21 & Slide 32 / 33 Code Contract: FairPlayAppealPortal.jsx
 * Homework 3: Full-Stack Esports Fair-Play Appeal Tribunal (Himass & TanVuu Case Study).
 * Multi-Route Dossiers for Himass & TanVuu with responsive case switching.
 */
export function FairPlayAppealPortal() {
  return (
    <section className={styles.portalShell} aria-labelledby="tribunal-heading">
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.hwBadge}>Homework 3 Specification</span>
          <span className={styles.auditBadge}>Post-Mortem AI Failure Audit</span>
        </div>
        <h2 id="tribunal-heading" className={styles.title}>
          Esports Fair-Play Appeal Tribunal Portal
        </h2>
        <p className={styles.subtitle}>
          Himass &amp; TanVuu Case Studies: Multi-Route Dossier Navigation, Disproportionality Severity Matrix, and Zero-Drift SLA Countdown.
        </p>

        {/* Multi-Route Case NavLinks (Slide 32) */}
        <nav className={styles.dossierNav} aria-label="Tribunal Case Selector">
          <NavLink
            to="/dossier/himass"
            className={({ isActive }) =>
              `${styles.dossierLink} ${isActive ? styles.dossierLinkActive : ''}`
            }
          >
            <span className={styles.playerTag}>CASE #1: HIMASS</span>
            <span className={styles.caseSub}>Cerberus Esports • Tick Anomaly</span>
          </NavLink>

          <NavLink
            to="/dossier/tanvuu"
            className={({ isActive }) =>
              `${styles.dossierLink} ${isActive ? styles.dossierLinkActive : ''}`
            }
          >
            <span className={styles.playerTag}>CASE #2: TANVUU</span>
            <span className={styles.caseSub}>The Dice Esports • Voice Leak</span>
          </NavLink>
        </nav>
      </header>

      {/* Main Dossier Content Area rendering child routes */}
      <main className={styles.portalContent}>
        <Outlet />
      </main>
    </section>
  );
}

export default FairPlayAppealPortal;
