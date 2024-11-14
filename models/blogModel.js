import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    image: {
      type: String,  // URL or path to the blog image (optional)
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],  // Tags related to the blog (optional)
      required: false,
    },
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
