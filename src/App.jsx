import React, { Suspense } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router';
import { PEOPLE } from './data/people';
import PeopleLayout from './components/PeopleLayout';
import PeopleIndex from './components/PeopleIndex';
import Skeleton from './components/Skeleton';
import SimpleForm from './components/SimpleForm';
import ForumChannelViewer from './components/ForumChannelViewer';
import PhotoGalleryLayout from './components/PhotoGalleryLayout';
import SwipeDeck from './components/SwipeDeck';
import FairPlayAppealPortal from './components/FairPlayAppealPortal';
import DossierView from './components/DossierView';
import styles from './App.module.css';

// Slide 9: Code-Splitting via React.lazy() for route-level chunking
const PersonDetail = React.lazy(() => import('./components/PersonDetail'));

export function App() {
  return (
    <div className={styles.appShell}>
      <header className={styles.topHeader}>
        <div className={styles.headerContent}>
          <div className={styles.branding}>
            <span className={styles.institutionBadge}>UIT • S3T LAB 04 FULL-STACK</span>
            <h1 className={styles.appTitle}>
              Multi-Route SPA Architecture &amp; React Router v7
            </h1>
            <p className={styles.appSubtitle}>
              MSc. Tran Vinh Khiem | Student: Trần Hữu Thắng (MSSV: 24521614)
            </p>
          </div>

          <nav className={styles.headerNav} aria-label="Main Navigation">
            <NavLink
              to="/people"
              className={({ isActive }) =>
                `${styles.topNavLink} ${isActive ? styles.topNavLinkActive : ''}`
              }
            >
              Directory (Sprint 1)
            </NavLink>
            <NavLink
              to="/form"
              className={({ isActive }) =>
                `${styles.topNavLink} ${isActive ? styles.topNavLinkActive : ''}`
              }
            >
              Form Engine (Sprint 2)
            </NavLink>
            <NavLink
              to="/channels"
              className={({ isActive }) =>
                `${styles.topNavLink} ${isActive ? styles.topNavLinkActive : ''}`
              }
            >
              Forum API (Sprint 3)
            </NavLink>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `${styles.topNavLink} ${styles.hwLink} ${isActive ? styles.topNavLinkActive : ''}`
              }
            >
              Gallery (HW1)
            </NavLink>
            <NavLink
              to="/swipe"
              className={({ isActive }) =>
                `${styles.topNavLink} ${styles.hwLink} ${isActive ? styles.topNavLinkActive : ''}`
              }
            >
              Card Swipe (HW2)
            </NavLink>
            <NavLink
              to="/dossier/himass"
              className={({ isActive }) =>
                `${styles.topNavLink} ${styles.hwLink} ${isActive ? styles.topNavLinkActive : ''}`
              }
            >
              Tribunal (HW3)
            </NavLink>
            <NavLink
              to="/people/invalid-id-test"
              className={({ isActive }) =>
                `${styles.topNavLink} ${styles.testLink} ${
                  isActive ? styles.topNavLinkActive : ''
                }`
              }
              title="Test 404 Error Boundary Guard"
            >
              Test 404
            </NavLink>
          </nav>
        </div>
      </header>

      <main className={styles.mainContainer}>
        {/* Slide 10: Replace <Switch> with <Routes> & modern element prop syntax */}
        <Routes>
          <Route path="/" element={<Navigate to="/people" replace />} />

          {/* Sprint 1: Nested Route Layout via PeopleLayout & <Outlet /> */}
          <Route path="/people" element={<PeopleLayout people={PEOPLE} />}>
            <Route index element={<PeopleIndex />} />
            <Route
              path=":id"
              element={
                /* Slide 9: Resilient Suspense wrapper with dimension-matched Skeleton */
                <Suspense
                  fallback={<Skeleton aria-busy="true" aria-live="polite" />}
                >
                  <PersonDetail people={PEOPLE} />
                </Suspense>
              }
            />
          </Route>

          {/* Sprint 2: Context Form Engine */}
          <Route path="/form" element={<SimpleForm />} />

          {/* Sprint 3: Full-Stack Forum Channel Viewer (AbortController) */}
          <Route path="/channels" element={<ForumChannelViewer />} />
          <Route path="/forum" element={<Navigate to="/channels" replace />} />

          {/* Homework 1: Production Multi-Route Photo & Evidence Gallery SPA */}
          <Route path="/gallery" element={<PhotoGalleryLayout />} />

          {/* Homework 2: Full-Stack Interactive Card-Swipe Deck ('Hen Ho Nhung Khong Yeu' Edition) */}
          <Route path="/swipe" element={<SwipeDeck />} />

          {/* Homework 3: Full-Stack Esports Fair-Play Appeal Tribunal (Himass & TanVuu) */}
          <Route path="/dossier" element={<FairPlayAppealPortal />}>
            <Route index element={<Navigate to="/dossier/himass" replace />} />
            {/* Slide 32 Code Contract: Multi-Route Dossier routing for team members Himass & TanVuu */}
            <Route path="himass" element={<DossierView user="Himass" />} />
            <Route path="tanvuu" element={<DossierView user="TanVuu" />} />
            <Route path=":playerId" element={<DossierView />} />
          </Route>

          {/* Fallback global 404 */}
          <Route
            path="*"
            element={
              <div role="alert" className={styles.globalNotFound}>
                <h2>404: Page Not Found</h2>
                <p>The requested route does not exist.</p>
                <NavLink to="/people" className={styles.returnLink}>
                  Return to Pioneer Directory
                </NavLink>
              </div>
            }
          />
        </Routes>
      </main>

      <footer className={styles.appFooter}>
        <p>
          University of Information Technology (UIT - VNUHCM) • Smart Software System Team (S3T)
        </p>
        <p className={styles.footerInvariant}>
          Full-Stack React 19 Contracts: Router v7 &lt;Outlet /&gt; • Context Form Engine • AbortController • HTML5 &lt;dialog&gt; • LIFO Undo • Zero-Drift SLA
        </p>
      </footer>
    </div>
  );
}

export default App;
