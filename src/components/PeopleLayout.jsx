import { NavLink, Outlet } from 'react-router';
import styles from './PeopleLayout.module.css';

/**
 * Slide 11 & Slide 22 Code Contract: PeopleLayout.jsx
 * Nested React Router v7 <Outlet />, <NavLink>, and responsive CSS Grid layout.
 */
export default function PeopleLayout({ people = [] }) {
  return (
    <div className={`people-frame ${styles.peopleFrame}`}>
      <nav className={`sidebar ${styles.sidebar}`} aria-label="Pioneers Directory Navigation">
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Pioneer Directory</h2>
          <span className={styles.countBadge}>{people.length} Profiles</span>
        </div>

        <ul className={styles.navList}>
          {people.map((p) => (
            <li key={p.id} className={styles.navItem}>
              <NavLink
                to={`/people/${p.id}`}
                className={({ isActive }) =>
                  `${isActive ? 'active-link' : 'link'} ${styles.navLink} ${
                    isActive ? styles.navLinkActive : ''
                  }`
                }
              >
                <span className={styles.navLinkName}>{p.name}</span>
                <span className={styles.navLinkRole}>{p.role}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Render layout frame wrapping child routes */}
      <main className={`content-area ${styles.contentArea}`} tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}
