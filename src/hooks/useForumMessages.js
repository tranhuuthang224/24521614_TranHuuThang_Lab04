import { useState, useEffect, useCallback } from 'react';

/**
 * Slide 25 / 26 Code Contract: useForumMessages.js
 * Asynchronous data fetching with AbortController signal cleanup,
 * signal.aborted guards across try/catch/finally to prevent race conditions and memory leaks.
 */
export const useForumMessages = (forumId, options = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [abortedCount, setAbortedCount] = useState(0);

  const { simulatedDelay = 400 } = options;

  useEffect(() => {
    // 1. AbortController instantiation inside useEffect
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const fetchMessages = async () => {
      try {
        const queryParam = simulatedDelay > 0 ? `?delay=${simulatedDelay}` : '';
        const res = await fetch(`/api/messages/${forumId}${queryParam}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}: Failed to fetch messages for "${forumId}"`);
        }

        const result = await res.json();

        // 2. signal.aborted guard logic before state commit
        if (!controller.signal.aborted) {
          setData(result);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          // Cleanly aborted by user switching channels
          console.log(`[AbortController] Request for forum "${forumId}" was aborted cleanly.`);
          setAbortedCount((prev) => prev + 1);
        } else if (!controller.signal.aborted) {
          console.error(`[useForumMessages] Fetch error:`, err);
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchMessages();

    // 3. Cleanup function returning abort call
    return () => {
      controller.abort();
    };
  }, [forumId, simulatedDelay]);

  // Integrated POST message helper
  const postMessage = useCallback(
    async (payload) => {
      try {
        const res = await fetch(`/api/messages/${forumId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Failed to post message (${res.status})`);
        }

        const newMessage = await res.json();
        setData((prev) => [...prev, newMessage]);
        return newMessage;
      } catch (err) {
        console.error('[useForumMessages] Post error:', err);
        throw err;
      }
    },
    [forumId]
  );

  return { data, loading, error, postMessage, abortedCount };
};

export default useForumMessages;
