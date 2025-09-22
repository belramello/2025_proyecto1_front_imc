import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <nav aria-label="Historial paginación" className="mt-4">
      <ul className="pagination justify-content-center flex-wrap">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={handlePrev}>
            ← Anterior
          </button>
        </li>

        <li className="page-item disabled d-flex align-items-center px-3">
          <span className="fw-semibold text-primary">
            Página {currentPage} de {totalPages}
          </span>
        </li>

        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button className="page-link" onClick={handleNext}>
            Siguiente →
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
