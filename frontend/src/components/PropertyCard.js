import { Link } from "react-router-dom";
import PropertyImageCarousel from "./PropertyImageCarousel";
import "./PropertyCard.css";

function PropertyCard({ property }) {
  const stats = [];
  if (property.L_Keyword2) stats.push(`${property.L_Keyword2} beds`);
  if (property.LM_Dec_3) stats.push(`${property.LM_Dec_3} baths`);
  if (property.LM_Int2_3) stats.push(`${property.LM_Int2_3} sqft`);

  return (
    <Link to={`/property/${property.L_ListingID}`} className="property-card">
      <PropertyImageCarousel photosJson={property.L_Photos} altText={property.L_Address} />

      <div className="property-info">
        <div className="property-price">
          {property.L_SystemPrice
            ? `$${Number(property.L_SystemPrice).toLocaleString("en-US")}`
            : "Price not available"}
        </div>
        <div>{property.L_Address}</div>
        <div className="property-city">
          {property.L_City}, {property.L_State}
        </div>
        <div className="property-stats">{stats.join(" · ")}</div>
      </div>
    </Link>
  );
}

export default PropertyCard;