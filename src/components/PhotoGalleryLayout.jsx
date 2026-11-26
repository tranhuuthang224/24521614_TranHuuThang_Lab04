import React, { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { PHOTOS, CATEGORIES } from '../data/photos';
import styles from './PhotoGalleryLayout.module.css';

/**
 * Slide 19 & Slide 29 / 30 Code Contract: PhotoGalleryLayout.jsx
 * Homework 1: Production Multi-Route Photo & Evidence Gallery SPA.
 * Upgrading useSearchParams() for deep linking and native HTML5 <dialog> with WCAG 2.2 AA focus management.
 */
export function PhotoGalleryLayout({ photos = PHOTOS }) {
  // 1. URL query string synchronization
  const [searchParams, setSearchParams] = useSearchParams();

  // 2. Modal state & category filter derived directly from URL
  const selectedPhotoId = searchParams.get('photoId');
  const currentCategory = searchParams.get('category') || 'all';

  // 3. HTML5 <dialog> ref binding
  const dialogRef = useRef(null);

  // Derived selected photo object
  const selectedPhoto = photos.find((p) => p.id === selectedPhotoId);

  // Derived filtered photos based on active URL category
  const filteredPhotos =
    currentCategory === 'all'
      ? photos
      : photos.filter((p) => p.category === currentCategory);

  // 4. Focus trap & open trigger (WCAG 2.2 AA Focus Management)
  useEffect(() => {
    if (selectedPhotoId) {
      if (!dialogRef.current?.open) {
        dialogRef.current?.showModal();
      }
    } else {
      if (dialogRef.current?.open) {
        dialogRef.current?.close();
      }
    }
  }, [selectedPhotoId]);

  // 5. Close handler syncing back to URL
  const handleCloseDialog = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('photoId');
      return next;
    });
  };

  const handleSelectPhoto = (photoId) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('photoId', photoId);
      return next;
    });
  };

  const handleSelectCategory = (catId) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (catId === 'all') {
        next.delete('category');
      } else {
        next.set('category', catId);
      }
      return next;
    });
  };

  // Navigate between photos in modal
  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    handleSelectPhoto(filteredPhotos[nextIndex].id);
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    handleSelectPhoto(filteredPhotos[prevIndex].id);
  };

  return (
    <section className={styles.galleryShell} aria-labelledby="gallery-heading">
      <header className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.hwBadge}>Homework 1 Specification</span>
          <span className={styles.urlBadge}>Deep Linking with useSearchParams()</span>
        </div>
        <h2 id="gallery-heading" className={styles.title}>
          Multi-Route Evidence &amp; Photo Gallery
        </h2>
        <p className={styles.subtitle}>
          Native HTML5 &lt;dialog&gt; lightbox modal with deep link URL synchronization and 100/100 WCAG 2.2 AA accessibility.
        </p>

        {/* Category Filter Pills (URL State) */}
        <nav className={styles.categoryNav} aria-label="Evidence Category Filter">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelectCategory(cat.id)}
              className={`${styles.filterBtn} ${
                currentCategory === cat.id ? styles.filterBtnActive : ''
              }`}
              aria-pressed={currentCategory === cat.id}
            >
              {cat.label}
              {cat.id !== 'all' && (
                <span className={styles.countPill}>
                  {photos.filter((p) => p.category === cat.id).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </header>

      {/* Grid of Photo Cards */}
      <div className={styles.photoGrid}>
        {filteredPhotos.map((photo) => (
          <article
            key={photo.id}
            className={styles.photoCard}
            aria-labelledby={`title-${photo.id}`}
          >
            <button
              type="button"
              onClick={() => handleSelectPhoto(photo.id)}
              className={styles.imageButton}
              aria-label={`Inspect ${photo.title} in native modal lightbox`}
            >
              <div className={styles.imageWrapper}>
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  loading="lazy"
                  width="600"
                  height="338"
                  className={styles.thumbnail}
                />
                <span className={styles.zoomOverlay} aria-hidden="true">
                  🔍 View Lightbox
                </span>
              </div>
            </button>
            <div className={styles.cardContent}>
              <span className={styles.categoryTag}>{photo.category}</span>
              <h3 id={`title-${photo.id}`} className={styles.cardTitle}>
                {photo.title}
              </h3>
              <p className={styles.cardCaption}>{photo.caption}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Slide 29 / 30 Code Contract: Native HTML5 <dialog> with focus trap */}
      <dialog
        ref={dialogRef}
        onClose={handleCloseDialog}
        className={styles.nativeDialog}
        aria-labelledby={selectedPhoto ? `modal-title-${selectedPhoto.id}` : undefined}
      >
        {selectedPhoto && (
          <div className={styles.modalContent}>
            <header className={styles.modalHeader}>
              <div className={styles.modalMeta}>
                <span className={styles.modalCategory}>{selectedPhoto.category}</span>
                <span className={styles.modalDate}>{selectedPhoto.date}</span>
              </div>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className={styles.closeButton}
                aria-label="Close modal lightbox"
                autoFocus
              >
                ✕
              </button>
            </header>

            <div className={styles.modalMediaWrapper}>
              <img
                src={selectedPhoto.fullUrl}
                alt={selectedPhoto.title}
                className={styles.modalImage}
              />
            </div>

            <footer className={styles.modalFooter}>
              <div className={styles.modalTextGroup}>
                <h3
                  id={`modal-title-${selectedPhoto.id}`}
                  className={styles.modalTitle}
                >
                  {selectedPhoto.title}
                </h3>
                <p className={styles.modalCaption}>{selectedPhoto.caption}</p>
                <div className={styles.modalSpecs}>
                  <span>📸 Camera: {selectedPhoto.camera}</span>
                  <span>🔗 Deep Link ID: <code>{selectedPhoto.id}</code></span>
                </div>
              </div>

              <div className={styles.navButtonGroup}>
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  className={styles.navButton}
                  aria-label="Previous photo"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className={styles.navButton}
                  aria-label="Next photo"
                >
                  Next →
                </button>
              </div>
            </footer>
          </div>
        )}
      </dialog>
    </section>
  );
}

export default PhotoGalleryLayout;
