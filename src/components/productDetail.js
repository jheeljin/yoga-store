import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To access the dynamic URL params
// Import the CSS file for styling
import './productDetail.css'
const ProductDetail = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]); // Re-fetch if the ID changes

  const handleAddToCart = () => {
    // Logic for adding to cart
    console.log('Product added to cart');
    // You can update the cart state here or use context to manage the cart
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="product-detail">
      {product && (
        <>
          <img src={`/images/yogamat.jpg`} alt={product.name} />
          <h2>{product.name}</h2>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Benefits:</strong></p>
          <ul>
            {product.benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
          <button onClick={handleAddToCart} className="add-to-cart">Add to Cart</button>
        </>
      )}
    </div>
  );
};

export default ProductDetail;
