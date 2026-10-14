"use client";

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
    <div className="mt-4 flex items-center justify-center gap-8 overflow-x-auto">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-white transition-colors duration-300 hover:bg-active disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>

      <div className="flex w-75 items-center justify-center space-x-2">
        {pages.map((page, idx) =>
          typeof page === "string" ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page as number)}
              className={`rounded-lg border px-4 py-2 transition-colors duration-300 focus:outline-none ${
                page === currentPage
                  ? "border-zinc-800 bg-active text-gray-200"
                  : "border-zinc-800 bg-zinc-900 text-white hover:bg-active"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-white transition-colors duration-300 hover:bg-active disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
