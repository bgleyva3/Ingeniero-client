import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">Ingeniero González</Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-blue-200 transition-colors">Home</Link>
            </li>
            <li>
              <Link to="/productos" className="hover:text-blue-200 transition-colors">Productos</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 