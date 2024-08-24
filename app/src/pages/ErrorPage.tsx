import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Something went wrong.</h1>
      <p>We encountered an unexpected error. Please try again later.</p>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

export default ErrorPage;
