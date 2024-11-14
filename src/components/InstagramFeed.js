import React, { useState, useEffect } from 'react';
import './InstagramFeed.css'
const InstagramFeed = () => {
  const [embedCode, setEmbedCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstagramFeed = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/social-media-feed');
        if (!response.ok) {
          throw new Error('Failed to fetch Instagram feed');
        }
        const data = await response.json();
        setEmbedCode(data.embedCode); // Set embed code from the API
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramFeed();
  }, []); // Fetch once when the component mounts

  if (loading) return <p>Loading Instagram feed...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="instagram-feed">
      <h2 className="feed-title">Follow Smart Yoga on Instagram</h2>
      <div className="instagram-embed" dangerouslySetInnerHTML={{ __html: embedCode }} />
    </div>
  );
};

export default InstagramFeed;
