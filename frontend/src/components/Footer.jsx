import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>About ShoeMart</h4>
          <p>Your one-stop shop for premium quality shoes and footwear for men and women.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/products">Shop All Shoes</Link></li>
            <li><Link to="/products?category=men">Men's Shoes</Link></li>
            <li><Link to="/products?category=women">Women's Shoes</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Customer Service</h4>
          <ul>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#shipping">Shipping Info</a></li>
            <li><a href="#returns">Returns Policy</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact Info</h4>
          <p>Email: support@shoemart.com</p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 Shoe Street, NY 10001</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 ShoeMart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
