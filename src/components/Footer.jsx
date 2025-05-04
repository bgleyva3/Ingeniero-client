import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Ingeniero González</h3>
            <p className="text-gray-300 mt-2">Electrical Products E-commerce</p>
          </div>
          
          <div className="text-center md:text-right">
            <p>&copy; {currentYear} Ingeniero González. All rights reserved.</p>
            <p className="text-gray-400 text-sm mt-1">Developed for demonstration purposes</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 