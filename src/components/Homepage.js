import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);

  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [errorBlogs, setErrorBlogs] = useState(null);

  const [socialFeed, setSocialFeed] = useState(null);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [errorFeed, setErrorFeed] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setErrorProducts(err.message);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/blogs');
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const data = await response.json();

        if (data && Array.isArray(data.blogs)) {
          setBlogs(data.blogs);
        } else {
          setErrorBlogs('Blog data is not in the expected format.');
        }
      } catch (err) {
        setErrorBlogs(err.message);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchInstagramFeed = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/social-media-feed');
        if (!response.ok) throw new Error('Failed to fetch Instagram feed');
        const data = await response.json();
        setSocialFeed(data.embedCode); // Assuming embed code is in the response
      } catch (err) {
        setErrorFeed(err.message);
      } finally {
        setLoadingFeed(false);
      }
    };

    fetchInstagramFeed();
  }, []);

  if (loadingProducts) return <p>Loading products...</p>;
  if (errorProducts) return <p>Error: {errorProducts}</p>;

  if (loadingBlogs) return <p>Loading blogs...</p>;
  if (errorBlogs) return <p>Error: {errorBlogs}</p>;

  if (loadingFeed) return <p>Loading Instagram feed...</p>;
  if (errorFeed) return <p>Error: {errorFeed}</p>;

  return (
    <div>
      <header className="header">
        <nav className="navbar">
          <h1 className="logo">Smart Yoga</h1>
          <ul className="nav-links">
            <li><a href="#products">Products</a></li>
            <li><Link to="/main/login">Main</Link></li>
            <li><a href="#blogs">Blogs</a></li>
            <li><a href="#shop">Shop Now</a></li>
            <li><a href="#benefits-section">Benefits</a></li>
          </ul>
        </nav>
      </header>

      <section id="products" className="product-overview">
        <h2>Our Smart Yoga Products</h2>
        <div className="products">
          {products.map((product) => (
            <div className="product-card" key={product._id}>
            <img
  src={`http://localhost:5000/uploads/images/${product.image}?t=${new Date().getTime()}`}
  alt={product.name}
  className="product-image"
/>

              <h3>{product.name}</h3>
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Price:</strong> ${product.price}</p>
              <Link to={`/product/${product._id}`} className="view-details">View Details</Link>
            </div>
          ))}
        </div>
      </section>

      <section id="shop" className="cta-section">
        <h2>Ready to elevate your practice?</h2>
        <p>Explore our smart yoga products today and take your yoga journey to the next level!</p>
        <a href="#shop" className="cta-button">Shop Now</a>
      </section>

      <section id="benefits-section" className="benefits-section">
        <h2>Why Choose Smart Yoga?</h2>
        <ul>
          <li><strong>Premium Quality:</strong> Our yoga products are made from the finest materials, ensuring durability and comfort.</li>
          <li><strong>Innovative Designs:</strong> Experience modern designs that enhance your practice and bring convenience to your yoga routine.</li>
          <li><strong>Eco-Friendly:</strong> All our products are designed with the environment in mind, using sustainable materials wherever possible.</li>
        </ul>
      </section>

      <section id="blogs" className="blog-section">
        <h2>Yoga Blogs</h2>
        <div className="blogs">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div className="blog-card" key={blog._id}>
                <h3>{blog.title}</h3>
                <p>{blog.content.substring(0, 150)}...</p>
                <Link to={`/blog/${blog._id}`} className="view-details">Read More</Link>
              </div>
            ))
          ) : (
            <p>No blogs available at the moment.</p>
          )}
        </div>
      </section>

      <section id="social-media" className="social-media-feed">
        <h2>Follow Us on Instagram</h2>
        {socialFeed ? (
          <div
            className="instagram-feed"
            dangerouslySetInnerHTML={{ __html: socialFeed }}
          />
        ) : (
          <p>No feed available at the moment.</p>
        )}
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h1>Smart Yoga</h1>
          </div>
          <div className="footer-links">
            <ul>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-social">
            <ul>
              <li><a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            </ul>
          </div>
          <div className="footer-copy">
            <p>&copy; 2024 Smart Yoga. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
