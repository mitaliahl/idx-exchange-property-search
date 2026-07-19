import "./PropertyCard.css";

// L_Photos is stored as a JSON string and isn't always valid or present
// so this safely returns the first photo URL or null
function getFirstPhoto(photosJson) {
  if (!photosJson) return null;

  try {
    const photos = JSON.parse(photosJson);
    if (Array.isArray(photos) && photos.length > 0) {
      return photos[0];
    }
    return null;
  } catch (err) {
    return null;
  }
}

function PropertyCard({ property }) {
  const photoUrl = getFirstPhoto(property.L_Photos);

  return (
    <div className="property-card">
      {photoUrl ? (
        <img
          className="property-photo"
          src={photoUrl}
          alt={property.L_Address || "Property"}
        />
      ) : (
        <div className="no-photo">No photo available</div>
      )}

      <div className="property-info">
        <div className="property-price">
          ${Number(property.L_SystemPrice).toLocaleString("en-US")}
        </div>
        <div>{property.L_Address}</div>
        <div className="property-city">
          {property.L_City}, {property.L_State}
        </div>
        <div className="property-stats">
          {property.L_Keyword2} beds · {property.LM_Dec_3} baths · {property.LotSizeSquareFeet} sqft
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;