import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">👟</span>
        <span>ShoeMart</span>
      </Link>
      
      <div className="navbar-center">
        <Link to="/products" className="nav-link">
          All Shoes
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/products" className="nav-link">
          Shop
        </Link>
        <div className="cart-icon">
          🛒
          <span className="cart-badge">0</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


