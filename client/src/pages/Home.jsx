import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1 className="page-title">Welcome to Express PostgreSQL React App</h1>
      <div className="dashboard-section">
        <p className="mb-4">This is a full-stack application built with:</p>
        <ul className="list-disc ml-6 mb-6">
          <li>React with Vite for the frontend</li>
          <li>Tailwind CSS for styling</li>
          <li>Express.js for the backend API</li>
          <li>PostgreSQL for the database</li>
          <li>JWT for authentication</li>
        </ul>
        <div>
          <Link to="/products" className="btn">Browse Products</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;