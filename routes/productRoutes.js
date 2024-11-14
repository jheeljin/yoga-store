import express from 'express';
import { getProducts, addProduct,getProductById,updateProduct,deleteProduct,patchProduct} from '../controllers/productController.js';

const router = express.Router();

// Route to get all products
router.get('/', getProducts);

// Route to add a new product (for testing)
router.post('/', addProduct);

// GET request to retrieve a product by ID
router.get('/:id', getProductById);

// PUT request to update a product by ID
router.put('/:id', updateProduct);

router.delete('/:id', deleteProduct);
router.patch('/:id', patchProduct);
;
export default router;
