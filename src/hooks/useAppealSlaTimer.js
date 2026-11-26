import { useState, useEffect, useCallback } from 'react';

/**
 * Resolve or initialize the persisted absolute deadline timestamp for a dossier case.
 */
function resolveDeadlineForCase(targetDurationHours, caseId) {
  const key = `sla_deadline_${caseId}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    const parsed = parseInt(stored, 10);
    if (parsed > Date.now()) return parsed;
  }
  const newDeadline = Date.now() + targetDurationHours * 3600 * 1000;
  localStorage.setItem(key, String(newDeadline));
  return newDeadline;
}

/**
 * Slide 21 & Slide 32 / 33 Code Contract: useAppealSlaTimer.js
 * High-precision countdown hook with zero tab-drift using Page Visibility API.
 * Recalculates remaining time against absolute system clock timestamps to prevent drift.
 */
export const useAppealSlaTimer = (targetDurationHours = 48, caseId = 'default') => {
  const [deadline, setDeadline] = useState(() =>
    resolveDeadlineForCase(targetDurationHours, caseId)
  );
  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, deadline - Date.now()));
  const [resyncCount, setResyncCount] = useState(0);

  // Sync deadline immediately whenever dossier caseId or duration target changes
  useEffect(() => {
    const caseDeadline = resolveDeadlineForCase(targetDurationHours, caseId);
    setDeadline(caseDeadline);
    setRemainingMs(Math.max(0, caseDeadline - Date.now()));
  }, [targetDurationHours, caseId]);

  // Recalculate remaining time against absolute system clock timestamps
  const resyncTimerWithServer = useCallback(() => {
    const currentDelta = Math.max(0, deadline - Date.now());
    setRemainingMs(currentDelta);
    setResyncCount((prev) => prev + 1);
  }, [deadline]);

  useEffect(() => {
    // 1. Regular 1-second interval update
    const timer = setInterval(() => {
      const delta = Math.max(0, deadline - Date.now());
      setRemainingMs(delta);
    }, 1000);

    // 2. Slide 32 Code Contract: Page Visibility API listener
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        resyncTimerWithServer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [deadline, resyncTimerWithServer]);

  // Derived formatted units
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}:${String(seconds).padStart(2, '0')}`;

  const resetDeadline = (hoursToSet = targetDurationHours) => {
    const newDeadline = Date.now() + hoursToSet * 3600 * 1000;
    localStorage.setItem(`sla_deadline_${caseId}`, String(newDeadline));
    setDeadline(newDeadline);
    setRemainingMs(hoursToSet * 3600 * 1000);
  };

  return {
    remainingMs,
    hours,
    minutes,
    seconds,
    formattedTime,
    isExpired: remainingMs <= 0,
    resyncCount,
    resyncTimerWithServer,
    resetDeadline,
  };
};

export default useAppealSlaTimer;
