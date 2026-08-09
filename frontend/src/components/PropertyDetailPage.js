import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPropertyDetail, fetchOpenHouses } from "../api/client";
import PropertyImageGallery from "./PropertyImageGallery";
import PropertyMap from "./PropertyMap";
import "./PropertyDetailPage.css";

// all_data is a JSON blob - OpenHouseRemarks lives inside it, not as its own column
function getRemarks(allDataJson) {
  if (!allDataJson) return null;
  try {
    const data = JSON.parse(allDataJson);
    return data.OpenHouseRemarks || null;
  } catch (err) {
    return null;
  }
}

// Formats a time like "14:00:00" into "2:00 PM"
function formatTime(timeString) {
  if (!timeString) return "";
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(hours, minutes);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [openHouses, setOpenHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([fetchPropertyDetail(id), fetchOpenHouses(id)])
      .then(([propertyData, openHouseData]) => {
        setProperty(propertyData);
        setOpenHouses(openHouseData);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading property...</div>;
  }

  // Handles invalid/unknown IDs without crashing
  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p style={{ color: "#b00020" }}>Error: {error}</p>
        <Link to="/">Back to listings</Link>
      </div>
    );
  }

  const stats = [];
  if (property.L_Keyword2) stats.push(`${property.L_Keyword2} beds`);
  if (property.LM_Dec_3) stats.push(`${property.LM_Dec_3} baths`);
  if (property.LM_Int2_3) stats.push(`${property.LM_Int2_3} sqft`);
  if (property.YearBuilt) stats.push(`Built ${property.YearBuilt}`);

  return (
    <div className="detail-page">
      <Link to="/" className="back-link">← Back to listings</Link>

      <PropertyImageGallery photosJson={property.L_Photos} altText={property.L_Address} />

      <div className="detail-info">
        <div className="detail-price">
          {property.L_SystemPrice
            ? `$${Number(property.L_SystemPrice).toLocaleString("en-US")}`
            : "Price not available"}
        </div>
        <h1 className="detail-address">{property.L_Address}</h1>
        <p className="detail-city">{property.L_City}, {property.L_State}</p>
        <p className="detail-stats">{stats.join(" · ")}</p>

        {property.L_Remarks && (
          <div className="detail-section">
            <h2>Description</h2>
            <p>{property.L_Remarks}</p>
          </div>
        )}

        <div className="detail-section">
          <h2>Property Details</h2>
          <ul>
            <li>Year built: {property.YearBuilt || "Not available"}</li>
            <li>Lot size: {property.LotSizeAcres ? `${property.LotSizeAcres} acres` : "Not available"}</li>
          </ul>
        </div>

        <div className="detail-section">
          <h2>Location</h2>
          <PropertyMap latitude={property.LMD_MP_Latitude} longitude={property.LMD_MP_Longitude} />
        </div>

        <div className="detail-section">
          <h2>Open Houses</h2>
          {openHouses.length === 0 ? (
            <p>No open houses scheduled</p>
          ) : (
            openHouses.map((openHouse) => {
              const remarks = getRemarks(openHouse.all_data);
              return (
                <div key={openHouse.id} className="open-house-item">
                  <p>
                    <strong>{openHouse.OpenHouseDate}</strong> · {formatTime(openHouse.OH_StartTime)} - {formatTime(openHouse.OH_EndTime)}
                  </p>
                  {remarks && <p className="open-house-remarks">{remarks}</p>}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyDetailPage;