import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div className="flex justify-center items-center h-32">Loading...</div>;
  }

  // Debug the user object to see what's happening
  console.log('User in AdminRoute:', user);
  console.log('isadmin value:', user?.isadmin);
  
  // Check if user is authenticated and has admin privileges
  if (isAuthenticated && user && user.isadmin) {
    return children; // Correctly render children if user is admin
  }
  
  // If not admin, redirect to home page
  return <Navigate to="/" />;
};

export default AdminRoute;s