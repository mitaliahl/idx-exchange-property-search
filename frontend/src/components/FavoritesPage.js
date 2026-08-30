import { useEffect, useState } from "react";
import { fetchPropertyDetail } from "../api/client";
import useFavorites from "../hooks/useFavorites.js";
import PropertyCard from "./PropertyCard";

function FavoritesPage() {
  const { favoriteIds } = useFavorites();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(favoriteIds.map((id) => fetchPropertyDetail(id)))
      .then((results) => {
        setProperties(results);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [favoriteIds]);

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading favorites...</div>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <p style={{ marginBottom: "16px" }}>
        {properties.length} favorite {properties.length === 1 ? "property" : "properties"}
      </p>

      {properties.length === 0 ? (
        <p>You haven't favorited any properties yet.</p>
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
    </div>
  );
}

export default FavoritesPage;