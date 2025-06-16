import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const ProductDetails = () => {
  const location = useLocation();
  const [product, setProduct] = useState(null);

  // Helper to get query param
  function getQueryParam(param) {
    return new URLSearchParams(location.search).get(param);
  }

  useEffect(() => {
    const fetchProduct = async () => {
      const sku = getQueryParam('sku');
      const endpoint = `${API_ENDPOINTS.products.getBySku}${sku}`
      console.log('Endpoint:', endpoint);
      if (!sku) return;
      try {
        const response = await axios.get(endpoint);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [location]);

  if (!product) return <div>Cargando...</div>;

  console.log('ProductDetails product:', product);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{product.name || product.title}</h1>
      <img src={product.imageUrl} alt={product.name || product.title} className="w-full max-w-md mb-4" />
      <p className="mb-2">{product.description}</p>
      {product.sku && (
        <p className="mb-1 text-sm text-gray-600">SKU: {product.sku}</p>
      )}
      {product.category && (
        <p className="mb-1 text-sm text-gray-600">Categoría: {product.category}</p>
      )}
      {product.brand && (
        <p className="mb-1 text-sm text-gray-600">Marca: {product.brand}</p>
      )}
      {product.showPrice && (
        <p className="font-semibold">${product.price} MXN.</p>
      )}
      {/* PDF Link */}
      {product.pdfUrl && (
        <div className="mt-4">
          <a href={product.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium text-lg flex items-center gap-2">
            <span role="img" aria-label="PDF">📄</span> Ver ficha técnica (PDF)
          </a>
        </div>
      )}
      <Link to="/productos" className="text-blue-500 hover:underline">Volver a productos</Link>
      {/* Add more details as needed */}
    </div>
  );
};

export default ProductDetails;