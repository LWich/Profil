import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="h-12 bg-gray-800 text-white flex items-center px-4">
      <Link to="/" className="text-white mr-4">Home</Link>
      <Link to="/login" className="text-white">Login</Link>
    </div>
  );
};

export default Navbar;
