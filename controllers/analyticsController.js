import Product from '../models/Product.js';
import Blog from '../models/blogModel.js';

// Controller to get analytics data
export const getAnalyticsData = async (_req, res) => {
  try {
    // Get the total number of products
    const totalProducts = await Product.countDocuments();

    // Get the total number of blogs
    const totalBlogs = await Blog.countDocuments();

    // Prepare the analytics data
    const analyticsData = {
      totalProducts,
      totalBlogs,
    };

    // Send the response with the analytics data
    res.status(200).json(analyticsData);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics data', error });
  }
};
