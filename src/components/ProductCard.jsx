import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  console.log('ProductCard product:', product);
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/productos/${product.slug}?sku=${product.sku}`}>
        <div className="h-48 bg-gray-200 overflow-hidden">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name || product.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <span className="text-gray-500">No image</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{product.name || product.title}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center">
            {product.showPrice && (
              <span className="text-blue-600 font-bold">${product.price?.toFixed ? product.price.toFixed(2) : product.price}</span>
            )}
            <span className="text-sm text-gray-500">{product.category}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard; 