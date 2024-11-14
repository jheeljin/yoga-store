import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import productRoutes from './routes/productRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import socialMediaRoutes from './routes/socialMediaRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import cartRoutes from './routes/cartRoutes.js'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (like images) from the 'uploads/images' directory

app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
app.get('/uploads/images/:imageName', (req, res) => {
  const { imageName } = req.params;
  const imagePath = path.join(__dirname, 'uploads', 'images', imageName);
  console.log(product.image); // Check the image filename being used

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).json({ message: 'Image not found' });
    }
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API routes for products, blogs, etc.
app.use('/api/products', productRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api', socialMediaRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
