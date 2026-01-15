import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Fetch all products and find the one with matching ID
        const response = await axios.get(`/all`);
        const foundProduct = response.data.find(p => p.id === parseInt(id));
        
        if (foundProduct) {
          setProduct(foundProduct);
          if (foundProduct.sizes && foundProduct.sizes.length > 0) {
            setSelectedSize(foundProduct.sizes[0]);
          }
          if (foundProduct.colors && foundProduct.colors.length > 0) {
            setSelectedColor(foundProduct.colors[0]);
          }
          setError(null);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>;
  if (error) return <div style={{ padding: '3rem', textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!product) return <div style={{ padding: '3rem', textAlign: 'center' }}>Product not found</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <button 
        onClick={() => navigate('/products')}
        style={{
          padding: '0.5rem 1rem',
          marginBottom: '2rem',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.95rem',
          fontWeight: 'bold'
        }}
      >
        ← Back to Products
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        {/* Product Image */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '500px',
          overflow: 'hidden'
        }}>
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextElementSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div style={{
            display: product.image_url ? 'none' : 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '5rem'
          }}>
            👟
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: '#2c3e50' }}>
            {product.name}
          </h1>
          
          <p style={{ fontSize: '1.1rem', color: '#667eea', marginBottom: '1rem', fontWeight: 'bold' }}>
            {product.brand}
          </p>

          <div style={{ fontSize: '0.95rem', color: '#666', marginBottom: '1rem' }}>
            Category: <strong>{product.category}</strong>
          </div>

          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#667eea',
            marginBottom: '2rem'
          }}>
            ${product.price}
          </div>

          <p style={{ color: '#555', lineHeight: '1.8', marginBottom: '2rem', fontSize: '1rem' }}>
            {product.description || 'Premium quality shoes with superior comfort and style. Perfect for everyday wear or special occasions.'}
          </p>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.8rem', fontSize: '1rem' }}>
                Available Sizes:
              </strong>
              <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: '0.6rem 1rem',
                      border: selectedSize === size ? '2px solid #667eea' : '1px solid #ddd',
                      background: selectedSize === size ? '#667eea' : 'white',
                      color: selectedSize === size ? 'white' : '#333',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: selectedSize === size ? 'bold' : 'normal',
                      transition: 'all 0.3s'
                    }}
                  >
                    Size {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.8rem', fontSize: '1rem' }}>
                Available Colors:
              </strong>
              <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    style={{
                      padding: '0.6rem 1rem',
                      border: selectedColor === color ? '2px solid #667eea' : '1px solid #ddd',
                      background: selectedColor === color ? '#667eea' : 'white',
                      color: selectedColor === color ? 'white' : '#333',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: selectedColor === color ? 'bold' : 'normal',
                      transition: 'all 0.3s',
                      textTransform: 'capitalize'
                    }}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Occasions */}
          {product.occasions && product.occasions.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.8rem', fontSize: '1rem' }}>
                Perfect For:
              </strong>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.occasions.map((occasion, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.4rem 0.8rem',
                      background: '#e8eaf6',
                      color: '#667eea',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      textTransform: 'capitalize'
                    }}
                  >
                    {occasion}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button style={{
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'opacity 0.3s, transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.opacity = '0.9'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
