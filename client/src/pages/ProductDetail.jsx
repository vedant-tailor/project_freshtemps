import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Assuming you have a 

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Using useContext to get the user
  const isadmin = user && user.isadmin === true; // Check if the user is admin

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
        setLoading(false);    
      } catch (err) {
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDeleteProduct = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          alert('Product deleted successfully');
          navigate('/products');
        } else {
          const data = await response.json();
          alert(`Failed to delete product: ${data.message}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('An error occurred while deleting the product');
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-32">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!product) return <div className="alert alert-danger">Product not found</div>;

  return (
    <div className="dashboard-section max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="page-title text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
      
      {isadmin && (
        <div className="admin-controls mt-4 mb-6 flex gap-3">
          <button 
            className="edit-btn bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center"
            onClick={() => navigate(`/products/edit/${id}`)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit Product
          </button>
          <button 
            className="delete-btn bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center" 
            onClick={handleDeleteProduct}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Delete Product
          </button>
        </div>
      )}
      
      <div className="product-details mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="mb-3 flex justify-between items-center border-b pb-2">
          <strong className="text-gray-700">Regular Price:</strong> 
          <span className="actual-price text-lg font-semibold text-gray-800">${product.actual_price}</span>
        </div>
        <div className="mb-3 flex justify-between items-center border-b pb-2">
          <strong className="text-gray-700">Discount Price:</strong> 
          <span className="dis-price text-lg font-semibold text-green-600">${product.dis_price}</span>
        </div>
        <div className="flex justify-between items-center">
          <strong className="text-gray-700">Video Link:</strong> 
          <a 
            href={product.video_link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:text-blue-700 hover:underline transition-colors duration-200"
          >
            Watch Video
          </a>
        </div>
      </div>
      
      {product.video_link && product.video_link.includes('youtube.com') && (
        <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden shadow-lg">
          <iframe
            className="w-full aspect-video"
            src={product.video_link.replace('watch?v=', 'embed/')}
            title={product.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;