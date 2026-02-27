import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: "light" | "dark";
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  variant = "light",
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  const styles = {
    light: {
      container: "bg-white text-gray-900",
      button: "bg-white border-gray-200 text-gray-600 hover:bg-gray-50",
      active: "bg-black border-black text-white",
      dots: "text-gray-400",
    },
    dark: {
      container: "text-white",
      button:
        "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white",
      active: "bg-blue-600 border-blue-600 text-white",
      dots: "text-gray-500",
    },
  }[variant];

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-2 py-4 ${
        variant === "dark" ? "bg-transparent" : ""
      }`}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${styles.button}`}
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`dots-${index}`} className={`px-1 ${styles.dots}`}>
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(Number(page))}
              className={`w-10 h-10 rounded-lg border text-sm font-medium transition-all ${
                currentPage === page ? styles.active : styles.button
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${styles.button}`}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
