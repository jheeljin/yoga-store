// routes/cart.routes.js

import { Router } from 'express';
const router = Router();
import { addToCart, getCart, removeFromCart } from '../controllers/cart.controller.js'

// Add to Cart
router.post('/add', addToCart);

// Get Cart Items
router.get('/:userId', getCart);

// Remove from Cart
router.delete('/remove/:userId/:productId', removeFromCart);

export default router;
