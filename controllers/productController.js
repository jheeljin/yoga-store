import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

// Specify the upload directory
const uploadDir = path.resolve('uploads', 'images');  // This will create 'uploads/images' relative to the root of your project

// Check if the directory exists, if not, create it
if (!fs.existsSync(uploadDir)) {
  console.log('Uploads directory does not exist, creating it...');
  fs.mkdirSync(uploadDir, { recursive: true });  // The 'recursive' option ensures that both 'uploads' and 'images' directories are created if they don't exist
  console.log('Uploads directory created.');
}

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Use the correct upload directory
  },
  filename: (req, file, cb) => {
    console.log('File being uploaded:', file.originalname);  // Log the name of the file being uploaded
    cb(null, Date.now() + '-' + file.originalname);  // Set the file name as timestamp-originalName
  },
});

// Set up multer upload handling
export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      console.log('File type is valid:', file.mimetype);  // Log valid file type
      cb(null, true);
    } else {
      console.log('Invalid file type:', file.mimetype);  // Log invalid file type
      cb(new Error('Invalid file type, allowed types: jpeg, png, gif'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },  // Max file size: 10MB
}).single('image');  // Assuming the field name for image is 'image'

// Get all products with image URL
export const getProducts = async (req, res) => {
  try {
    console.log('Fetching products from the database...');  // Log when fetching products starts
    const products = await Product.find();  // Fetch all products from the database

    // Map over each product and add the full image URL dynamically
    const productsWithImageURL = products.map(product => ({
      ...product.toObject(),  // Convert Mongoose document to plain object
      imageUrl: `http://localhost:5000/uploads/images/${product.image.split('/').pop()}`,  // Add the full image URL
    }));

    console.log('Products fetched successfully:', productsWithImageURL);  // Log the fetched products
    res.status(200).json(productsWithImageURL);  // Send the product data with image URLs as a response
  } catch (err) {
    console.error('Error fetching products:', err);  // Log any error that occurs while fetching products
    res.status(500).json({ message: "Error fetching products", error: err });
  }
};

// Add a new product with image upload
export const addProduct = async (req, res) => {
  console.log('Received request to add product:', req.body);  // Log the incoming request body

  // Handle image upload before proceeding
  upload(req, res, async (err) => {
    if (err) {
      // Handle multer-specific errors
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err.message);  // Log Multer-specific error
        return res.status(400).json({ message: 'Error uploading file', error: err.message });
      }
      // Handle custom errors
      console.error('Custom error:', err.message);  // Log custom error
      return res.status(400).json({ message: 'Invalid file type or error in file upload', error: err.message });
    }

    const { name, description, price, benefits } = req.body;
    const image = req.file;  // The uploaded file will be in `req.file`

    // Check if required fields are missing
    if (!name || !description || !price || !benefits || (image && !image.path)) {
      console.log('Missing required fields or image path');  // Log if any required fields or image path are missing
      return res.status(400).json({ message: 'Missing required fields or image' });
    }

    try {
      // Create a new product with the data and the image path
      const newProduct = new Product({
        name,
        description,
        price,
        image: image ? image.path : null,  // Store the file path of the uploaded image if it exists
        benefits,
      });

      console.log('Product created:', newProduct);  // Log the product that is about to be saved

      // Save the product to the database
      const savedProduct = await newProduct.save();

      console.log('Product saved successfully:', savedProduct);  // Log the saved product

      // Add the image URL dynamically to the saved product
      const savedProductWithImageUrl = {
        ...savedProduct.toObject(),
        imageUrl: `http://localhost:5000/uploads/images/${savedProduct.image.split('/').pop()}`,
      };

      // Send the saved product as a response
      res.status(201).json(savedProductWithImageUrl);
    } catch (err) {
      console.error('Error saving product:', err);  // Log error during save
      res.status(500).json({ message: 'Error saving product', error: err.message });
    }
  });
};

// Get product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    console.log('Fetching product with ID:', id);  // Log the product ID being fetched
    const product = await Product.findById(id);

    if (!product) {
      console.log(`Product with ID ${id} not found`);  // Log if product is not found
      return res.status(404).json({ message: `Product with ID ${id} not found` });
    }

    // Add the image URL dynamically to the found product
    const productWithImageUrl = {
      ...product.toObject(),
      imageUrl: `http://localhost:5000/uploads/images/${product.image.split('/').pop()}`,
    };

    console.log('Product found:', productWithImageUrl);  // Log the found product
    res.status(200).json(productWithImageUrl);
  } catch (err) {
    console.error('Error retrieving product:', err);  // Log error during retrieval
    res.status(500).json({ message: 'Error retrieving product', error: err });
  }
};

// Update product by ID
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image, benefits } = req.body;

  try {
    console.log('Updating product with ID:', id);  // Log the product ID being updated
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, image, benefits },
      { new: true }  // This ensures the updated document is returned
    );

    if (!updatedProduct) {
      console.log(`Product with ID ${id} not found`);  // Log if product is not found
      return res.status(404).json({ message: `Product with ID ${id} not found` });
    }

    console.log('Product updated:', updatedProduct);  // Log the updated product
    const updatedProductWithImageUrl = {
      ...updatedProduct.toObject(),
      imageUrl: `http://localhost:5000/uploads/images/${updatedProduct.image.split('/').pop()}`,
    };

    res.status(200).json(updatedProductWithImageUrl);
  } catch (err) {
    console.error('Error updating product:', err);  // Log error during update
    res.status(500).json({ message: 'Error updating product', error: err });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    console.log('Deleting product with ID:', id);  // Log the product ID being deleted
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      console.log(`Product with ID ${id} not found`);  // Log if product is not found for deletion
      return res.status(404).json({ message: `Product with ID ${id} not found` });
    }

    console.log('Product deleted:', deletedProduct);  // Log the deleted product
    res.status(200).json({ message: `Product with ID ${id} deleted successfully` });
  } catch (err) {
    console.error('Error deleting product:', err);  // Log error during deletion
    res.status(500).json({ message: 'Error deleting product', error: err });
  }
};

// Patch update product by ID (partial update)
export const patchProduct = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  try {
    console.log('Patching product with ID:', id);  // Log the product ID being patched
    const patchedProduct = await Product.findByIdAndUpdate(id, updateFields, {
      new: true,  // Return the updated document
    });

    if (!patchedProduct) {
      console.log(`Product with ID ${id} not found`);  // Log if product is not found for patch update
      return res.status(404).json({ message: `Product with ID ${id} not found` });
    }

    console.log('Product patched:', patchedProduct);  // Log the patched product
    const patchedProductWithImageUrl = {
      ...patchedProduct.toObject(),
      imageUrl: `http://localhost:5000/uploads/images/${patchedProduct.image.split('/').pop()}`,
    };

    res.status(200).json(patchedProductWithImageUrl);
  } catch (err) {
    console.error('Error patching product:', err);  // Log error during patch update
    res.status(500).json({ message: 'Error patching product', error: err });
  }
};
