import React, { useState, Fragment } from 'react';
import useForumMessages from '../hooks/useForumMessages';
import styles from './ForumChannelViewer.module.css';

const CHANNELS = [
  { id: 'nasa', label: '🚀 NASA Deep Space', desc: 'Space exploration & lunar mission telemetry' },
  { id: 'esports-tribunal', label: '⚖️ Esports Tribunal', desc: 'Himass & TanVuu fair-play appeals dossier' },
  { id: 'notNasa', label: '🔭 notNasa Community', desc: 'Amateur rocketry & astronomy forum' },
];

/**
 * Slide 16 & 17 Component: ForumChannelViewer.jsx
 * Multi-channel switcher with AbortController-driven async data fetching.
 * Renders messages using semantic keyed <React.Fragment key={msg.id}> inside a <dl>.
 */
export function ForumChannelViewer() {
  const [activeChannel, setActiveChannel] = useState('nasa');
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [postError, setPostError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Consume full-stack custom hook with AbortController signal handling
  const { data: messages, loading, error, postMessage, abortedCount } = useForumMessages(activeChannel, {
    simulatedDelay: 350,
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) {
      setPostError('Both Author name and Message text are required');
      return;
    }

    try {
      setIsSubmitting(true);
      setPostError(null);
      await postMessage({ author: author.trim(), text: text.trim() });
      setText('');
    } catch (err) {
      setPostError(err.message || 'Failed to submit message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.viewerContainer} aria-labelledby="forum-heading">
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.engineBadge}>Sprint 3 Full-Stack Engine</span>
          <span className={styles.abortBadge}>
            AbortController Protected • {abortedCount} In-Flight Cancellation(s)
          </span>
        </div>
        <h2 id="forum-heading" className={styles.title}>
          Real-Time Channel Switcher &amp; REST API Forum
        </h2>
        <p className={styles.subtitle}>
          Demonstrating race condition prevention via AbortController signal cleanup under simulated Slow 3G.
        </p>

        {/* Channel Selector Bar */}
        <nav className={styles.channelBar} aria-label="Forum Channels">
          {CHANNELS.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => setActiveChannel(ch.id)}
              className={`${styles.channelBtn} ${
                activeChannel === ch.id ? styles.channelBtnActive : ''
              }`}
              aria-current={activeChannel === ch.id ? 'page' : undefined}
            >
              <span className={styles.channelLabel}>{ch.label}</span>
              <span className={styles.channelDesc}>{ch.desc}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* Live Status Region */}
      <output
        role="status"
        aria-live="polite"
        className={styles.statusRegion}
      >
        {loading ? (
          <span className={styles.loadingPill}>
            <span className={styles.spinner} />
            Fetching telemetry for &ldquo;{activeChannel}&rdquo; (AbortController armed)...
          </span>
        ) : error ? (
          <span className={styles.errorPill}>⚠️ {error}</span>
        ) : (
          <span className={styles.readyPill}>
            ● Channel &ldquo;{activeChannel}&rdquo; synchronized • {messages.length} message(s) loaded
          </span>
        )}
      </output>

      {/* Semantic Definition List for Messages (Slide 16) */}
      <div className={styles.messageListContainer}>
        <h3 className={styles.feedHeading}>
          Active Feed: <span className={styles.channelTag}>#{activeChannel}</span>
        </h3>

        {messages.length === 0 && !loading ? (
          <p className={styles.emptyFeed}>No messages in this channel yet. Be the first to post!</p>
        ) : (
          <dl className={styles.messageDl}>
            {messages.map((msg) => (
              /* Slide 16: Keyed <React.Fragment key={msg.id}> inside <dl> */
              <Fragment key={msg.id}>
                <div className={styles.messageCard}>
                  <dt className={styles.messageHeader}>
                    <span className={styles.authorName}>{msg.author}</span>
                    <time className={styles.timestamp} dateTime={msg.timestamp}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </time>
                  </dt>
                  <dd className={styles.messageBody}>{msg.text}</dd>
                </div>
              </Fragment>
            ))}
          </dl>
        )}
      </div>

      {/* Message Submission Form */}
      <form onSubmit={handleSendMessage} className={styles.postForm} noValidate>
        <h4 className={styles.formTitle}>Post Message to #{activeChannel}</h4>

        {postError && (
          <div role="alert" className={styles.postErrorAlert}>
            {postError}
          </div>
        )}

        <div className={styles.formRow}>
          <div className={styles.fieldItem}>
            <label htmlFor="msg-author" className={styles.fieldLabel}>
              Your Name / Handle
            </label>
            <input
              id="msg-author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Trần Hữu Thắng (24521614)"
              className={styles.inputField}
              required
            />
          </div>

          <div className={`${styles.fieldItem} ${styles.fieldFlex}`}>
            <label htmlFor="msg-text" className={styles.fieldLabel}>
              Message Body
            </label>
            <input
              id="msg-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a message payload to dispatch via POST /api/messages..."
              className={styles.inputField}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className={styles.sendButton}
            aria-label="Send message"
          >
            {isSubmitting ? 'Posting...' : 'Dispatch Message'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default ForumChannelViewer;
