import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-600">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white hover:text-blue-200">Ingeniero Gonzalez</Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/productos" className="text-white hover:text-blue-200 transition-colors">Productos</Link>
            </li>
            <li>
              <Link to="/nosotros" className="text-white hover:text-blue-200 transition-colors">Nosotros</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 