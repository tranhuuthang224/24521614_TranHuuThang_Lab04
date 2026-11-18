import React, { useState, useEffect, useRef } from 'react';
import { PROFILES } from '../data/profiles';
import styles from './SwipeDeck.module.css';

/**
 * Slide 20 & Slide 30 / 31 Code Contract: SwipeDeck.jsx
 * Homework 2: Full-Stack Interactive Card-Swipe Deck ('Hen Ho Nhung Khong Yeu' Edition).
 * Dual Keyboard / Pointer gesture handling, LIFO Undo Stack, and Asymmetric Score Derived State.
 */
export function SwipeDeck({ initialProfiles = PROFILES }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [history, setHistory] = useState([]);
  const [startPos, setStartPos] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [persisting, setPersisting] = useState(false);
  const deckRef = useRef(null);

  // Derived state: Remaining profiles not yet swiped
  const activeProfiles = profiles.filter(
    (p) => !history.some((h) => h.profileId === p.id)
  );
  const currentProfile = activeProfiles[0] || null;

  // Slide 30 Code Contract: Asymmetric Score Derived State (pure computation during render)
  const score = history.reduce((acc, action) => {
    if (action.type === 'LIKE') {
      return acc + 10;
    } else if (action.type === 'SUPERLIKE') {
      return acc + 20;
    } else {
      return acc - 5;
    }
  }, 0);

  // Slide 30 Code Contract: LIFO Undo Stack Implementation
  const undoLastSwipe = () => {
    if (history.length === 0) return;
    setHistory((prev) => prev.slice(0, -1));
  };

  // Dispatch swipe action (both frontend derived state and backend persistence)
  const swipe = async (direction) => {
    if (!currentProfile) return;

    let actionType = 'PASS';
    let delta = -5;

    if (direction === 'right') {
      actionType = 'LIKE';
      delta = 10;
    } else if (direction === 'up') {
      actionType = 'SUPERLIKE';
      delta = 20;
    }

    const swipeAction = {
      profileId: currentProfile.id,
      profileName: currentProfile.name,
      type: actionType,
      scoreDelta: delta,
      timestamp: new Date().toISOString(),
    };

    // 1. Commit to LIFO state
    setHistory((prev) => [...prev, swipeAction]);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);

    // 2. Full-Stack persistence via POST /api/swipe (Slide 31)
    try {
      setPersisting(true);
      await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(swipeAction),
      });
    } catch (err) {
      console.warn('[SwipeDeck] Local state preserved; backend offline/error:', err.message);
    } finally {
      setPersisting(false);
    }
  };

  // Slide 30 Code Contract: Keyboard Navigation Mapping
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      swipe('left');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      swipe('right');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      swipe('up');
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      undoLastSwipe();
    }
  };

  // Slide 30 Code Contract: Pointer Event Gesture Tracking
  const handlePointerDown = (e) => {
    setStartPos({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !startPos) return;
    setDragOffset({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  const handlePointerUp = (e) => {
    if (!startPos) return;
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;

    if (dy < -60 && Math.abs(dx) < 60) {
      swipe('up');
    } else if (dx > 50) {
      swipe('right');
    } else if (dx < -50) {
      swipe('left');
    }

    setStartPos(null);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  };

  // Auto-focus container on mount so arrow keys work immediately
  useEffect(() => {
    deckRef.current?.focus();
  }, []);

  const handleReset = () => {
    setHistory([]);
  };

  return (
    <section
      ref={deckRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={styles.deckShell}
      aria-label="Interactive Card Swipe Stage (Use Arrow Keys or Swipe Gesture)"
    >
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.hwBadge}>Homework 2 Specification</span>
          <span className={styles.editionBadge}>&ldquo;Hẹn Hò Nhưng Không Yêu&rdquo; Edition</span>
        </div>
        <h2 className={styles.title}>Full-Stack Interactive Card-Swipe Deck</h2>
        <p className={styles.subtitle}>
          Dual Keyboard / Pointer events, LIFO Undo Stack, and Pure Asymmetric Score Derived State.
        </p>

        {/* Real-time Game HUD */}
        <div className={styles.hudBar}>
          <div className={styles.scoreBox}>
            <span className={styles.hudLabel}>Asymmetric Score</span>
            <span className={`${styles.hudValue} ${score >= 0 ? styles.positiveScore : styles.negativeScore}`}>
              {score >= 0 ? `+${score}` : score} pts
            </span>
          </div>

          <div className={styles.stackBox}>
            <span className={styles.hudLabel}>LIFO Stack Depth</span>
            <span className={styles.hudValue}>{history.length} Swiped</span>
          </div>

          <div className={styles.actionBox}>
            <button
              type="button"
              onClick={undoLastSwipe}
              disabled={history.length === 0}
              className={styles.undoBtn}
              title="Undo last swipe (Backspace)"
            >
              ↶ Undo (Backspace)
            </button>
            <button
              type="button"
              onClick={handleReset}
              className={styles.resetBtn}
              title="Reset all cards"
            >
              Reset Deck
            </button>
          </div>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <div className={styles.cardStage}>
        {currentProfile ? (
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`${styles.card} ${isDragging ? styles.cardDragging : ''}`}
            style={{
              transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${
                dragOffset.x * 0.08
              }deg)`,
            }}
          >
            {/* Visual Direction Indicator Stamps */}
            {dragOffset.x > 30 && (
              <span className={`${styles.stamp} ${styles.likeStamp}`}>LIKE +10</span>
            )}
            {dragOffset.x < -30 && (
              <span className={`${styles.stamp} ${styles.passStamp}`}>PASS -5</span>
            )}
            {dragOffset.y < -40 && Math.abs(dragOffset.x) < 30 && (
              <span className={`${styles.stamp} ${styles.superlikeStamp}`}>SUPERLIKE +20</span>
            )}

            <div className={styles.imageBox}>
              <img
                src={currentProfile.image}
                alt={currentProfile.name}
                className={styles.profileImg}
                draggable={false}
              />
              <div className={styles.imageGradient} />
              <div className={styles.nameOverlay}>
                <h3 className={styles.profileName}>
                  {currentProfile.name}, <span className={styles.profileAge}>{currentProfile.age}</span>
                </h3>
                <p className={styles.profileTagline}>{currentProfile.tagline}</p>
              </div>
            </div>

            <div className={styles.cardBody}>
              <p className={styles.profileBio}>{currentProfile.bio}</p>

              <div className={styles.metaRow}>
                <span className={styles.asymmetricTag}>
                  Asymmetric Factor: {currentProfile.asymmetricFactor}
                </span>
              </div>

              <div className={styles.tagsGroup}>
                <span className={styles.tagLabel}>Red Flags:</span>
                <div className={styles.pillList}>
                  {currentProfile.redFlags.map((flag, idx) => (
                    <span key={idx} className={styles.redFlagPill}>
                      🚩 {flag}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.tagsGroup}>
                <span className={styles.tagLabel}>Interests:</span>
                <div className={styles.pillList}>
                  {currentProfile.interests.map((item, idx) => (
                    <span key={idx} className={styles.interestPill}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Gesture Helper Controls */}
            <footer className={styles.cardFooter}>
              <button
                type="button"
                onClick={() => swipe('left')}
                className={`${styles.ctrlBtn} ${styles.btnPass}`}
                aria-label="Swipe Left: Pass (-5 pts)"
              >
                ✕ Pass (←)
              </button>
              <button
                type="button"
                onClick={() => swipe('up')}
                className={`${styles.ctrlBtn} ${styles.btnSuperlike}`}
                aria-label="Swipe Up: Superlike (+20 pts)"
              >
                ★ Super (↑)
              </button>
              <button
                type="button"
                onClick={() => swipe('right')}
                className={`${styles.ctrlBtn} ${styles.btnLike}`}
                aria-label="Swipe Right: Like (+10 pts)"
              >
                ♥ Like (→)
              </button>
            </footer>
          </div>
        ) : (
          <div className={styles.emptyStage}>
            <div className={styles.emptyIcon}>🎉</div>
            <h3 className={styles.emptyTitle}>Deck Finished!</h3>
            <p className={styles.emptyText}>
              You have swiped all profiles in the &ldquo;Hẹn Hò Nhưng Không Yêu&rdquo; catalog.
            </p>
            <div className={styles.finalScoreCard}>
              <span>Final Asymmetric Score:</span>
              <strong className={score >= 0 ? styles.positiveScore : styles.negativeScore}>
                {score} pts
              </strong>
            </div>
            <div className={styles.emptyButtonGroup}>
              <button
                type="button"
                onClick={undoLastSwipe}
                className={styles.undoBtn}
              >
                ↶ Undo Last Swipe
              </button>
              <button
                type="button"
                onClick={handleReset}
                className={styles.resetBtn}
              >
                Restart Deck
              </button>
            </div>
          </div>
        )}
      </div>

      {/* LIFO History Audit Log */}
      <footer className={styles.historySection}>
        <h4 className={styles.historyTitle}>
          LIFO Stack Audit Log ({history.length} operations)
        </h4>
        {history.length === 0 ? (
          <p className={styles.emptyHistory}>No actions recorded in LIFO stack yet.</p>
        ) : (
          <ol className={styles.historyList}>
            {[...history].reverse().map((h, i) => (
              <li key={i} className={styles.historyItem}>
                <span className={styles.historyAction}>
                  {h.type === 'LIKE' ? '❤️ LIKE' : h.type === 'SUPERLIKE' ? '⭐ SUPER' : '❌ PASS'}
                </span>
                <span className={styles.historyTarget}>{h.profileName}</span>
                <span className={h.scoreDelta > 0 ? styles.deltaPositive : styles.deltaNegative}>
                  {h.scoreDelta > 0 ? `+${h.scoreDelta}` : h.scoreDelta}
                </span>
                <time className={styles.historyTime}>
                  {new Date(h.timestamp).toLocaleTimeString()}
                </time>
              </li>
            ))}
          </ol>
        )}
      </footer>
    </section>
  );
}

export default SwipeDeck;
