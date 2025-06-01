function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Generate page list with ellipsis for large page counts
  const pageNeighbors = 1;
  const totalNumbers = pageNeighbors * 2 + 5;
  let pages: (number | string)[] = [];
  if (totalPages <= totalNumbers) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    pages.push(1);
    const leftBound = currentPage - pageNeighbors;
    const rightBound = currentPage + pageNeighbors;
    if (leftBound > 2) pages.push("...");
    for (
      let i = Math.max(2, leftBound);
      i <= Math.min(totalPages - 1, rightBound);
      i++
    ) {
      pages.push(i);
    }
    if (rightBound < totalPages - 1) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center mt-4 gap-8 overflow-x-auto">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-zinc-800 bg-zinc-900 text-white rounded-lg hover:bg-bg-active transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>

      <div className="flex items-center justify-center space-x-2 w-75">
        {pages.map((page, idx) =>
          typeof page === "string" ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page as number)}
              className={`px-4 py-2 border rounded-lg transition-colors duration-300 focus:outline-none ${
                page === currentPage
                  ? "border-zinc-800 bg-bg-active text-gray-200"
                  : "border-zinc-800 bg-zinc-900 text-white hover:bg-bg-active"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-zinc-800 bg-zinc-900 text-white rounded-lg hover:bg-bg-active transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
