import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Using the Vite proxy - no need to specify the full URL
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <Link to="/" className="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <p className="text-gray-700 text-xl mb-4">Product not found</p>
          <Link to="/" className="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="container mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-blue-500 text-white flex justify-between items-center">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <Link to="/" className="px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-100">
              Back to Products
            </Link>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-100 rounded-lg overflow-hidden h-[300px] md:h-[400px]">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500 text-lg">No image available</span>
                  </div>
                )}
              </div>
              
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Product Details</h2>
                  <p className="text-gray-600">{product.description}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Specifications</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {product.specifications && Object.keys(product.specifications).length > 0 ? (
                      <ul className="space-y-2">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <li key={key} className="flex">
                            <span className="font-medium text-gray-700 w-1/3">{key}:</span>
                            <span className="text-gray-600">{value}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No specifications available</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-500 mb-1">Price</h3>
                    {product.showPrice && (
                      <p className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
                    )}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-500 mb-1">Category</h3>
                    <p className="text-lg font-medium text-gray-800">{product.category}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm text-gray-500 mb-1">Stock</h3>
                    <p className="text-lg font-medium">
                      {product.stockQuantity > 0 ? (
                        <span className="text-green-600">{product.stockQuantity} available</span>
                      ) : (
                        <span className="text-red-600">Out of stock</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 