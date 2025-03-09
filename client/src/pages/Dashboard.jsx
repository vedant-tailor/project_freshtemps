import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    video_link: '',
    actual_price: '',
    dis_price: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const { name, video_link, actual_price, dis_price } = formData;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
    }
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      video_link: '',
      actual_price: '',
      dis_price: ''
    });
    setEditingId(null);
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    const productData = {
      name,
      video_link,
      actual_price: parseFloat(actual_price),
      dis_price: parseFloat(dis_price)
    };
    
    try {
      if (editingId) {
        await axios.put(`/api/products/${editingId}`, productData);
        setSuccessMessage('Product updated successfully');
      } else {
        await axios.post('/api/products', productData);
        setSuccessMessage('Product created successfully');
      }
      
      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = product => {
    setFormData({
      name: product.name,
      video_link: product.video_link,
      actual_price: product.actual_price,
      dis_price: product.dis_price
    });
    setEditingId(product.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        setSuccessMessage('Product deleted successfully');
        fetchProducts();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  if (loading) return <div className="flex justify-center items-center h-32">Loading...</div>;

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      
      <div className="dashboard-section">
        <h2 className="dashboard-title">Your Profile</h2>
        <p className="mb-2"><strong>Username:</strong> {user?.username}</p>
        <p className="mb-2"><strong>Email:</strong> {user?.email}</p>
        <p className="mb-2"><strong>Role:</strong> {user?.isAdmin ? 'Admin' : 'User'}</p>
        <p className="mb-2"><strong>Admin Status:</strong> {JSON.stringify(user?.isAdmin)}</p>
        
        {user?.isAdmin && (
          <div className="mt-4">
            <Link to="/upload-product" className="btn bg-green-500 hover:bg-green-600">
              Upload New Product
            </Link>
          </div>
        )}
      </div>
      
      {user?.isAdmin && (
        <div className="dashboard-section">
          <h2 className="dashboard-title">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
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
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="actual_price" className="block text-gray-700 mb-1">Regular Price</label>
              <input
                type="number"
                step="0.01"
                id="actual_price"
                name="actual_price"
                value={actual_price}
                onChange={onChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="dis_price" className="block text-gray-700 mb-1">Discount Price</label>
              <input
                type="number"
                step="0.01"
                id="dis_price"
                name="dis_price"
                value={dis_price}
                onChange={onChange}
                className="form-control"
                required
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn">
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  className="btn bg-gray-500 hover:bg-gray-600" 
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
      
      {user?.isAdmin && (
        <div className="dashboard-section">
          <h2 className="dashboard-title">Manage Products</h2>
          {products.length === 0 ? (
            <p>No products found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Regular Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map(product => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${product.actual_price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${product.dis_price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => handleEdit(product)} 
                          className="btn bg-blue-500 hover:bg-blue-600 mr-2"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)} 
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;