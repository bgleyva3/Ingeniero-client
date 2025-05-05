import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      setProduct(data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{product.name || product.title}</h1>
      <img src={product.imageUrl} alt={product.name || product.title} className="w-full max-w-md mb-4" />
      <p className="mb-2">{product.description}</p>
      <p className="font-semibold">{product.price} €</p>
      <Link to="/productos" className="text-blue-500 hover:underline">Volver a productos</Link>
      {/* Add more details as needed */}
    </div>
  );
};

export default ProductDetails;