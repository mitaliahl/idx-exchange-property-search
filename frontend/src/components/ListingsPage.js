import { useEffect, useState, useRef } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";
import Pagination from "./Pagination";

const ITEMS_PER_PAGE = 20;

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
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({});

  const latestRequestId = useRef(0);

  function loadProperties(filters, page) {
    const requestId = ++latestRequestId.current;
    setLoading(true);
    setError(null);

    const cleanedFilters = removeEmptyValues(filters);
    const offset = (page - 1) * ITEMS_PER_PAGE;

    fetchProperties({ ...cleanedFilters, limit: ITEMS_PER_PAGE, offset })
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
    loadProperties(activeFilters, currentPage);
  }, [currentPage]);

  // A new search always resets back to page 1
  function handleSearch(filters) {
    setActiveFilters(filters);
    setCurrentPage(1);
    loadProperties(filters, 1);
  }

  // Clearing filters also resets back to page 1
  function handleClear() {
    setActiveFilters({});
    setCurrentPage(1);
    loadProperties({}, 1);
  }

  // Changing pages keeps the active filters and scrolls back to the top
  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const firstItemNumber = total === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const lastItemNumber = Math.min(currentPage * ITEMS_PER_PAGE, total);

  return (
    <div style={{ padding: "20px" }}>
      <PropertyFilters onSearch={handleSearch} onClear={handleClear} />

      {loading && <div style={{ padding: "40px", textAlign: "center" }}>Loading properties...</div>}
      {error && <div style={{ padding: "40px", textAlign: "center", color: "#b00020" }}>Error: {error}</div>}

      {!loading && !error && (
        <>
          <p style={{ marginBottom: "16px" }}>
            Showing {firstItemNumber}-{lastItemNumber} of {total} properties
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default ListingsPage;