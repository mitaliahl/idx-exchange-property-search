import { useEffect, useState, useRef } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";

// Removes empty string values so blank filters aren't sent to the API
function removeEmptyValues(filters) {
  const cleaned = {};
  for (const key in filters) {
    if (filters[key] !== "") {
      cleaned[key] = filters[key];
    }
  }
  return cleaned;
}

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tracks which request is the most recent one, so an older response
  // that resolves late doesn't overwrite newer results
  const latestRequestId = useRef(0);

  function loadProperties(filters = {}) {
    const requestId = ++latestRequestId.current;
    setLoading(true);
    setError(null);

    const cleanedFilters = removeEmptyValues(filters);

    fetchProperties({ ...cleanedFilters, limit: 20, offset: 0 })
      .then((data) => {
        if (requestId !== latestRequestId.current) return;
        setProperties(data.results);
        setTotal(data.total);
      })
      .catch((err) => {
        if (requestId !== latestRequestId.current) return;
        setError(err.message);
      })
      .finally(() => {
        if (requestId !== latestRequestId.current) return;
        setLoading(false);
      });
  }

  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <PropertyFilters onSearch={loadProperties} onClear={() => loadProperties()} />

      {loading && <div style={{ padding: "40px", textAlign: "center" }}>Loading properties...</div>}
      {error && <div style={{ padding: "40px", textAlign: "center", color: "#b00020" }}>Error: {error}</div>}

      {!loading && !error && (
        <>
          <p style={{ marginBottom: "16px" }}>
            Showing {properties.length} of {total} properties
          </p>

          {properties.length === 0 ? (
            <p>No properties found matching your filters.</p>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "16px",
            }}>
              {properties.map((property) => (
                <PropertyCard key={property.L_ListingID} property={property} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ListingsPage;