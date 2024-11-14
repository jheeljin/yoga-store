// controllers/cart.controller.js

import Cart from '../models/cart.model.js'
import  Product from '../models/Product.js';

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    
    // Get product details
    const product = await findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find or create the user's cart
    let cart = await findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    // Check if product is already in the cart
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (existingItemIndex > -1) {
      // Update quantity and total price
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.items.push({ productId, quantity, price: product.price, name: product.name, image: product.image });
    }

    // Update the total price
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
};

// Get Cart Items
 export const getCart = async (req, res) => {
  try {
    const cart = await findOne({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};

// Remove from Cart
 export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    await cart.save();
    res.status(200).json({ message: 'Product removed from cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error removing from cart', error: err.message });
  }
};


