import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './BlogDetail.css'
const BlogDetail = () => {
  const { id } = useParams();  // Get the blog ID from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/blogs/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog');
        }
        const data = await response.json();
        setBlog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);  // Re-run this effect when the `id` changes

  if (loading) return <p>Loading blog...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="blog-detail">
      <h2>{blog.title}</h2>
      <p><strong>Author:</strong> {blog.author}</p>
      <p><strong>Category:</strong> {blog.category}</p>
      <div>
        <strong>Tags:</strong> {blog.tags.length > 0 ? blog.tags.join(', ') : 'No tags available'}
      </div>
      {/* Use relative path for the image */}
      <img src="/images/yogaasan.jpg" alt={blog.title} style={{ maxWidth: '100%', height: 'auto' }} />
      <p><strong>Content:</strong> {blog.content}</p>
      <p><strong>Created At:</strong> {new Date(blog.createdAt).toLocaleDateString()}</p>
      <p><strong>Last Updated:</strong> {new Date(blog.updatedAt).toLocaleDateString()}</p>
    </div>
  );
};

export default BlogDetail;

