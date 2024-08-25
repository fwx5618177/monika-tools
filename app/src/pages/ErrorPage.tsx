import { Lang } from '@seo/seoConfig';
import { useSeo } from '@seo/useSeo';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: Lang }>();
  const SeoComponent = useSeo('common', lang);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      {SeoComponent}
      <h1>Something went wrong.</h1>
      <p>We encountered an unexpected error. Please try again later.</p>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

export default ErrorPage;
