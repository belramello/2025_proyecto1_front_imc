import React from 'react';

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
    <div style={styles.container}>
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        style={{
          ...styles.button,
          ...(currentPage === 1 ? styles.disabled : {}),
        }}
      >
        ← Anterior
      </button>

      <span style={styles.pageInfo}>
        Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        style={{
          ...styles.button,
          ...(currentPage === totalPages ? styles.disabled : {}),
        }}
      >
        Siguiente →
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
    flexWrap: 'wrap',
  },
  pageInfo: {
    color: '#0d6efd',
    fontWeight: 500,
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#0d6efd',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'background-color 0.2s ease',
  },
  disabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
  },
};

export default Pagination;
