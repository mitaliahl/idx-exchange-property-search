import { useState, useEffect, useRef } from "react";

function parsePhotos(photosJson) {
  if (!photosJson) return [];
  try {
    const photos = JSON.parse(photosJson);
    return Array.isArray(photos) ? photos : [];
  } catch (err) {
    return [];
  }
}

function PropertyImageGallery({ photosJson, altText }) {
  const photos = parsePhotos(photosJson);
  const [mainIndex, setMainIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const lightboxRef = useRef(null);

  // A div needs to actually have focus to receive keydown events
  // tabIndex={-1} makes it focusable, and this focuses it once it opens
  useEffect(() => {
    if (lightboxOpen && lightboxRef.current) {
      lightboxRef.current.focus();
    }
  }, [lightboxOpen]);

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setLightboxOpen(false);
    } else if (event.key === "ArrowLeft") {
      setMainIndex(mainIndex === 0 ? photos.length - 1 : mainIndex - 1);
    } else if (event.key === "ArrowRight") {
      setMainIndex(mainIndex === photos.length - 1 ? 0 : mainIndex + 1);
    }
  }

  if (photos.length === 0) {
    return <div className="no-photo-large">No photos available</div>;
  }

  return (
    <div className="gallery">
      <img
        className="gallery-main-image"
        src={photos[mainIndex]}
        alt={altText}
        onClick={() => setLightboxOpen(true)}
      />

      {photos.length > 1 && (
        <div className="gallery-thumbnails">
          {photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`${altText} thumbnail ${index + 1}`}
              className={index === mainIndex ? "thumbnail thumbnail-active" : "thumbnail"}
              onClick={() => setMainIndex(index)}
            />
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <div
            className="lightbox-content"
            ref={lightboxRef}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            onClick={(event) => event.stopPropagation()}
          >
            <img src={photos[mainIndex]} alt={altText} className="lightbox-image" />

            {photos.length > 1 && (
              <>
                <button
                  className="lightbox-arrow lightbox-arrow-left"
                  onClick={() => setMainIndex(mainIndex === 0 ? photos.length - 1 : mainIndex - 1)}
                >
                  ‹
                </button>
                <button
                  className="lightbox-arrow lightbox-arrow-right"
                  onClick={() => setMainIndex(mainIndex === photos.length - 1 ? 0 : mainIndex + 1)}
                >
                  ›
                </button>
              </>
            )}

            <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyImageGallery;