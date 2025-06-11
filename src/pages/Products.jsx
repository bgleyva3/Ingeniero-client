import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import ProductFilters from '../components/ProductFilters';
import { API_ENDPOINTS } from '../config/api';

const PAGE_SIZE = 10;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = `?page=${page}&limit=${PAGE_SIZE}`;
        Object.entries(filters).forEach(([key, value]) => {
          if (value) query += `&${key}=${encodeURIComponent(value)}`;
        });

        const response = await axios.get(API_ENDPOINTS.products.getAll + query);
        setProducts(response.data);
        // Since FastAPI doesn't have built-in pagination, we'll calculate total pages
        setTotalPages(Math.ceil(response.data.length / PAGE_SIZE));
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error al cargar los productos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, filters]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      <ProductFilters filters={filters} setFilters={setFilters} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length > 0 && (
        <Pagination page={page} setPage={setPage} totalPages={totalPages} />
      )}
      {products.length === 0 && !loading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No se encontraron productos.</p>
        </div>
      )}
    </div>
  );
};

export default Products;
