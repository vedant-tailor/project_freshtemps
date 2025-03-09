import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const ProductUpload = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useContext(AuthContext); // Get user from context
  const [formData, setFormData] = useState({
    name: '',
    video_link: '',
    actual_price: '',
    dis_price: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { name, video_link, actual_price, dis_price } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    
    const productData = {
      name,
      video_link,
      actual_price: parseFloat(actual_price),
      dis_price: parseFloat(dis_price)
    };
    
    try {
      await axios.post('/api/products/upload', productData);
      setSuccessMessage('Product uploaded successfully!');
      setFormData({
        name: '',
        video_link: '',
        actual_price: '',
        dis_price: ''
      });
      setTimeout(() => {
        navigate('/products');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload product');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while authentication status is being determined
  if (isLoading) {
    return <div className="flex justify-center items-center h-32">Loading...</div>;
  }

  // Debug the user object to see what's happening
  console.log('User in ProductUpload:', user);
  console.log('isadmin value:', user?.isadmin);

  // Check if user is admin

  if (!isAuthenticated || !user || user.isadmin !== true) {
    return (
      <div>
        <h1 className="page-title">Upload New Product</h1>
        <div className="alert alert-danger">Access denied: Admin privileges required</div>
        <button 
          type="button" 
          className="ml-4 px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
          onClick={() => navigate('/products')}
        >
          Go to Products
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Upload New Product</h1>
      
      <div className="dashboard-section">
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        
        <form onSubmit={onSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name" className="block text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="video_link" className="block text-gray-700 mb-1">Video Link</label>
            <input
              type="text"
              id="video_link"
              name="video_link"
              value={video_link}
              onChange={onChange}
              className="form-control"
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
            <p className="text-sm text-gray-500 mt-1">Enter a YouTube video URL for the product</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="actual_price" className="block text-gray-700 mb-1">Regular Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                id="actual_price"
                name="actual_price"
                value={actual_price}
                onChange={onChange}
                className="form-control"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dis_price" className="block text-gray-700 mb-1">Discount Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                id="dis_price"
                name="dis_price"
                value={dis_price}
                onChange={onChange}
                className="form-control"
                required
              />
            </div>
          </div>
          
          <div className="mt-6">
            <button 
              type="submit" 
              className="btn px-6 py-2"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Product'}
            </button>
            <button 
              type="button" 
              className="ml-4 px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              onClick={() => navigate('/products')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Tips for adding products:</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Use descriptive product names</li>
          <li>Ensure video links are from YouTube</li>
          <li>Set the regular price higher than the discount price</li>
          <li>Double-check all information before submitting</li>
        </ul>
      </div>
    </div>
  );
};

export default ProductUpload;