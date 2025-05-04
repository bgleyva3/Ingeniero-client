import React from 'react';
import Avatar from '../components/Avatar';
import ProductList from '../components/ProductList';

const HomePage = () => {
  return (
    <div className="bg-gray-100 py-8 w-full">
      <div className="container mx-auto px-4 w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Electrical Products Store</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Empty space for Avatar (2/5) - Avatar is fixed position now */}
          <div className="lg:col-span-2 h-[550px]"></div>
          
          {/* Product list section (3/5) */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden min-h-[550px]" id="products">
            <div className="p-4 bg-blue-500 text-white">
              <h2 className="text-xl font-semibold">Our Products</h2>
            </div>
            <div className="h-[calc(550px-4rem)] overflow-y-auto">
              <ProductList />
            </div>
          </div>
        </div>
      </div>
      
      {/* Fixed Avatar container at bottom of viewport */}
      <div className="fixed bottom-0 left-0 w-full lg:w-2/5 h-[550px] pointer-events-none">
        <div className="h-full w-full pt-8">
          <Avatar />
        </div>
      </div>
    </div>
  );
};

export default HomePage; 