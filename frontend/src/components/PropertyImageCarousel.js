import { useState } from "react";

// L_Photos is stored as a JSON string not always valid
function parsePhotos(photosJson) {
  if (!photosJson) return [];
  try {
    const photos = JSON.parse(photosJson);
    return Array.isArray(photos) ? photos : [];
  } catch (err) {
    return [];
  }
}

function PropertyImageCarousel({ photosJson, altText }) {
  const photos = parsePhotos(photosJson);
  const [index, setIndex] = useState(0);

  // stopPropagation and preventDefault so clicking the arrows doesn't
  // navigate to the detail page (the whole card is a link)
  function goPrev(event) {
    event.stopPropagation();
    event.preventDefault();
    setIndex(index === 0 ? photos.length - 1 : index - 1);
  }

  function goNext(event) {
    event.stopPropagation();
    event.preventDefault();
    setIndex(index === photos.length - 1 ? 0 : index + 1);
  }

  if (photos.length === 0) {
    return <div className="no-photo">No photo available</div>;
  }

  return (
    <div className="carousel">
      <img className="property-photo" src={photos[index]} alt={altText} />

      {photos.length > 1 && (
        <>
          <button className="carousel-arrow carousel-arrow-left" onClick={goPrev}>‹</button>
          <button className="carousel-arrow carousel-arrow-right" onClick={goNext}>›</button>
          <div className="carousel-counter">{index + 1} / {photos.length}</div>
        </>
      )}
    </div>
  );
}

export default PropertyImageCarousel;