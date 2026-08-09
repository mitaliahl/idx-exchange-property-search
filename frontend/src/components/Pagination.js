// Builds the list of page numbers to display, using "..." for gaps
function getPageNumbers(currentPage, totalPages) {
  const pages = [];

  // If there aren't many pages, just show all of them
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Current page is near the start
  if (currentPage <= 4) {
    pages.push(1, 2, "...", totalPages);
    return pages;
  }

  // Current page is near the end
  if (currentPage >= totalPages - 3) {
    pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    return pages;
  }

  // Current page is somewhere in the middle
  pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
  return pages;
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  // No need for pagination controls if everything fits on one page
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginTop: "20px" }}>
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} style={{ padding: "8px" }}>...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{ fontWeight: page === currentPage ? "bold" : "normal" }}
          >
            {page}
          </button>
        )
      )}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;