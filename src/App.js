import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './components/Homepage';
import ProductDetail from './components/productDetail';
import BlogDetail from './components/BlogDetail';
import InstagramFeed from './components/InstagramFeed'; // Import Instagram feed component
import AdminPage from './components/AdminPage';
import MainPage from './components/MainPage';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} /> {/* Homepage route */}
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        
        {/* Add a new route for Instagram feed */}
        <Route path="/instagram" element={<InstagramFeed />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/main/login" element={<MainPage />} />
        <Route path="/main/register" element={<MainPage />} />
         {/* Instagram Feed route */}
      </Routes>
    </Router>
  );
};

export default App;
