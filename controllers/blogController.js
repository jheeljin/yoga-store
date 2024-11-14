import Blog from '../models/blogModel.js';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import mongoose from 'mongoose';

// Correct the path to be relative to the project root, not the controller folder
const uploadDir = path.resolve('uploads', 'images');  // Creates 'uploads/images' relative to the root of your project

// Check if the directory exists; if not, create it
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });  // Ensures 'uploads' and 'images' directories are created
    console.log("Upload directory created.");
  } catch (error) {
    console.error("Error creating upload directory:", error.message);
  }
}

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Use the correct upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // File name as timestamp-originalName
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only jpeg, png, and gif are allowed.'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },  // Limit file size to 10MB
}).single('image');  // Field name for image should be 'image' in form-data

export const createBlog = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    // Extract data from form-data fields
    const { title, content, author, category, tags } = req.body;

    // Validate that required fields are present
    if (!title || !content || !author) {
      return res.status(400).json({ error: 'Title, content, and author are required.' });
    }

    // Check if a blog with the same title already exists
    const existingBlog = await Blog.findOne({ title });
    if (existingBlog) {
      return res.status(400).json({ error: 'A blog with this title already exists. Please choose another title.' });
    }

    // Get the file path for the uploaded image (if any)
    const imagePath = req.file ? req.file.path : null;

    // Check if tags is a string, and split it if necessary
    const tagsArray = tags && typeof tags === 'string' ? tags.split(',') : tags || [];

    try {
      // Create a new Blog document
      const newBlog = new Blog({
        title,
        content,
        author,
        image: imagePath,
        category,
        tags: tagsArray,  // Use the validated tags array
      });

      // Save the new blog to the database
      const savedBlog = await newBlog.save();
      res.status(201).json(savedBlog);
    } catch (error) {
      console.error('Error while creating blog:', error);
      res.status(500).json({ error: 'An error occurred while creating the blog post.' });
    }
  });
};



// Get all blogs with optional pagination and filtering by category
export const getAllBlogs = async (req, res) => {
  const { page = 1, limit = 10, category } = req.query;  // Default to page 1 and limit 10
  try {
    const query = category ? { category } : {};  // Filter by category if provided

    // Fetch blogs with pagination
    const blogs = await Blog.find(query)
      .skip((page - 1) * limit)  // Skip blogs based on the current page
      .limit(parseInt(limit))    // Limit to the requested number of blogs per page
      .sort({ createdAt: -1 });  // Sort by latest blog

    // Fetch total count of blogs (for pagination info)
    const totalBlogs = await Blog.countDocuments(query);

    res.status(200).json({
      blogs,
      totalBlogs,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),  // Calculate total pages
    });
  } catch (err) {
    console.error('Error fetching blogs:', err.message);  // Log error with details
    res.status(500).json({ message: 'Error fetching blogs', error: err.message });
  }
};

// Get a single blog by ID
export const getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.status(200).json(blog);
  } catch (err) {
    console.error('Error fetching blog by ID:', err.message);  // Log error with details
    res.status(500).json({ message: 'Error fetching blog', error: err.message });
  }
};

// Update an existing blog post
export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, author, image, category, tags } = req.body;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Update blog fields
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.author = author || blog.author;
    blog.image = image || blog.image;
    blog.category = category || blog.category;
    blog.tags = tags || blog.tags;

    await blog.save();
    res.status(200).json(blog);  // Return the updated blog
  } catch (err) {
    console.error('Error updating blog:', err.message);  // Log error with details
    res.status(500).json({ message: 'Error updating blog', error: err.message });
  }
};


export const deleteBlog = async (req, res) => {
  const { id } = req.params;

  // Validate if the provided ID is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid blog ID format' });
  }

  try {
    // Use findByIdAndDelete to find and delete the blog by its ID
    const blog = await Blog.findByIdAndDelete(id);

    // Check if blog exists
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Successfully deleted the blog
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('Error deleting blog:', err.message);
    res.status(500).json({ error: 'Error deleting blog', details: err.message });
  }
};


