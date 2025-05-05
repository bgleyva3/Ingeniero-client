import React from 'react';

const Pagination = ({ page, setPage, totalPages }) => (
  <div className="flex justify-center mt-4">
    <button
      onClick={() => setPage(page - 1)}
      disabled={page === 1}
      className="px-3 py-1 mx-1 border rounded disabled:opacity-50"
    >
      Anterior
    </button>
    <span className="px-3 py-1 mx-1">{page} / {totalPages}</span>
    <button
      onClick={() => setPage(page + 1)}
      disabled={page === totalPages}
      className="px-3 py-1 mx-1 border rounded disabled:opacity-50"
    >
      Siguiente
    </button>
  </div>
);

export default Pagination;