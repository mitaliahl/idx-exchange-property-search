import { useEffect, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "./PropertyCard";

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchProperties({ limit: 20, offset: 0 })
      .then((data) => {
        setProperties(data.results);
        setTotal(data.total);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading properties...</div>;
  }

  if (error) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#b00020" }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <p style={{ marginBottom: "16px" }}>
        Showing {properties.length} of {total} properties
      </p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "16px",
      }}>
        {properties.map((property) => (
          <PropertyCard key={property.L_ListingID} property={property} />
        ))}
      </div>
    </div>
  );
}

export default ListingsPage;