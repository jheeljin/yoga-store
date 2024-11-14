import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './adminPage.css';

const AdminPage = () => {
  // State variables for products
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [benefits, setBenefits] = useState('');
  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [productId, setProductId] = useState(null);
  const [loading, setLoading] = useState(false);

  // State variables for blogs
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [blogImage, setBlogImage] = useState(null);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [blogId, setBlogId] = useState(null);
  const [editBlogMode, setEditBlogMode] = useState(false);

  // Fetch products and blogs on mount
  useEffect(() => {
    fetchProducts();
    fetchBlogs();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs?page=1&limit=5&category=Yoga');
      setBlogs(response.data.blogs);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('benefits', benefits);
    if (image) formData.append('image', image);

    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/products/${productId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await axios.post('http://localhost:5000/api/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      fetchProducts();
      resetProductForm();

      // Show alert and redirect
      alert('Product saved successfully!');
      window.location.href = "http://localhost:3000/#shop";
    } catch (err) {
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('author', author);
    formData.append('category', category);
    formData.append('tags', tags.split(',').map(tag => tag.trim())); // Convert tags to array
    if (blogImage) formData.append('image', blogImage);

    try {
      if (editBlogMode) {
        await axios.patch(`http://localhost:5000/api/blogs/${blogId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await axios.post('http://localhost:5000/api/blogs', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      fetchBlogs();
      resetBlogForm();

      // Show alert and redirect
      alert('Blog saved successfully!');
      window.location.href = "http://localhost:3000/#shop";
    } catch (err) {
      console.error('Error saving blog:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetProductForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setBenefits('');
    setImage(null);
    setEditMode(false);
    setProductId(null);
  };

  const resetBlogForm = () => {
    setTitle('');
    setContent('');
    setAuthor('');
    setCategory('');
    setTags('');
    setBlogImage(null);
    setEditBlogMode(false);
    setBlogId(null);
  };

  const handleEditProduct = (product) => {
    setEditMode(true);
    setProductId(product._id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setBenefits(product.benefits);
  };

  const handleEditBlog = (blog) => {
    setEditBlogMode(true);
    setBlogId(blog._id);
    setTitle(blog.title);
    setContent(blog.content);
    setAuthor(blog.author);
    setCategory(blog.category);
    setTags(blog.tags.join(', ')); // Convert tags array to comma-separated string for editing
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`);
      fetchBlogs();
    } catch (err) {
      console.error('Error deleting blog:', err);
    }
  };

  return (
    <div>
      {/* Product Section */}
      <h1>{editMode ? 'Edit Product' : 'Add Product'}</h1>
      <form onSubmit={handleProductSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product Name" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required />
        <input type="text" value={benefits} onChange={(e) => setBenefits(e.target.value)} placeholder="Benefits" required />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit">{loading ? 'Saving...' : editMode ? 'Update Product' : 'Add Product'}</button>
      </form>

      {/* Blog Section */}
      <h1>{editBlogMode ? 'Edit Blog' : 'Add Blog'}</h1>
      <form onSubmit={handleBlogSubmit}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Blog Title" required />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" required />
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" required />
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />
        <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma-separated)" required />
        <input type="file" onChange={(e) => setBlogImage(e.target.files[0])} />
        <button type="submit">{loading ? 'Saving...' : editBlogMode ? 'Update Blog' : 'Add Blog'}</button>
      </form>

      {/* Product List */}
      <h2>Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            <h3>{product.name}</h3>
            <button onClick={() => handleEditProduct(product)}>Edit</button>
            <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Blog List */}
      <h2>Blogs</h2>
      <ul>
        {blogs.map((blog) => (
          <li key={blog._id}>
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>
            <button onClick={() => handleEditBlog(blog)}>Edit</button>
            <button onClick={() => handleDeleteBlog(blog._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
