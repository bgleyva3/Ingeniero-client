import React from 'react';

const ProductFilters = ({ filters, setFilters }) => {
  return (
    <div className="mb-4 flex gap-4">
      <input
        type="text"
        placeholder="Buscar por nombre"
        value={filters.title || ''}
        onChange={e => setFilters(f => ({ ...f, title: e.target.value }))}
        className="border px-2 py-1 rounded"
      />
      {/* Add more filters as needed */}
    </div>
  );
};

export default ProductFilters;