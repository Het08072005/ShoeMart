import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter';
import PriceFilter from '../components/PriceFilter';
import SearchBar from '../components/SearchBar';
import axios from '../api/axios';
import { connectWebSocket, disconnectWebSocket } from '../websocket.js';
import '../styles/Products.css';

const Products = () => {
  const [searchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  );
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // 🔑 SEARCH STATE (single source of truth)
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ----------------------------------------
  // Fetch all products
  // ----------------------------------------
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/all');
        setAllProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // ----------------------------------------
  // ✅ WebSocket voice search → AUTOFILL FIX
  // ----------------------------------------
  useEffect(() => {
    connectWebSocket((data) => {
      if (data.type === 'SEARCH_RESULT') {
        // 🔥 THIS IS THE KEY
        setSearchInput(data.query || '');
        setSearchResults(data.products || []);
        setAllProducts(data.products || []);
      }
    });

    return () => disconnectWebSocket();
  }, []);

  // ----------------------------------------
  // Apply filters automatically
  // ----------------------------------------
  useEffect(() => {
    let filtered = [...allProducts];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (product) => product.gender === selectedCategory
      );
    }

    if (minPrice) {
      filtered = filtered.filter(
        (product) => product.price >= Number(minPrice)
      );
    }

    if (maxPrice) {
      filtered = filtered.filter(
        (product) => product.price <= Number(maxPrice)
      );
    }

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, minPrice, maxPrice, sortBy, allProducts]);

  // ----------------------------------------
  // Manual Search (API)
  // ----------------------------------------
  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      setSearchLoading(true);
      await axios.get('/search', { params: { q: searchTerm } });
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchResults(null);
  };

  const displayProducts =
    searchResults !== null ? searchResults : filteredProducts;

  return (
    <div className="products-container">
      {/* 🔑 CONTROLLED SEARCH BAR */}
      <SearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSearch={handleSearch}
      />

      {searchResults !== null && (
        <div style={{ padding: '0 20px' }}>
          <button
            onClick={handleClearSearch}
            className="apply-filters-btn"
          >
            ← Clear Search
          </button>
          <p style={{ color: '#666' }}>
            {searchLoading
              ? 'Searching...'
              : `Found ${searchResults.length} result(s)`}
          </p>
        </div>
      )}

      <div className="products-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <PriceFilter
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />
          <button className="apply-filters-btn">
            ✓ Apply Filters
          </button>
        </aside>

        {/* Products */}
        <div className="products-main">
          <div className="products-header">
            <h1>
              {searchResults !== null
                ? 'Search Results'
                : 'Our Premium Shoes Collection'}
            </h1>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : displayProducts.length > 0 ? (
            <div className="products-grid">
              {displayProducts.map((product) => (
                <a
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="product-card"
                >
                  <img
                    src={product.image_url || ''}
                    alt={product.name}
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                  <h3>{product.name}</h3>
                  <p>{product.brand}</p>
                  <p>${product.price}</p>
                </a>
              ))}
            </div>
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
