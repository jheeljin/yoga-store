import express from 'express';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogController.js';

const router = express.Router();

// Route to get all blogs with optional pagination and filtering by category
router.get('/', getAllBlogs);

// Route to get a single blog by ID
router.get('/:id', getBlogById);

// Route to create a new blog post
router.post('/', createBlog);

// Route to update an existing blog post by ID
router.patch('/:id', updateBlog);

// Route to delete a blog post by ID
router.delete('/:id', deleteBlog);

export default router;
