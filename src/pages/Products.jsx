import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import ProductFilters from '../components/ProductFilters';

const PAGE_SIZE = 10;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      let query = `?page=${page}&limit=${PAGE_SIZE}`;
      Object.entries(filters).forEach(([key, value]) => {
        if (value) query += `&${key}=${encodeURIComponent(value)}`;
      });

      const res = await fetch(`/api/products${query}`);
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    };
    fetchProducts();
  }, [page, filters]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      <ProductFilters filters={filters} setFilters={setFilters} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default Products;
