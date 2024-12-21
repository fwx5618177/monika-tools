import ErrorBoundary from '@/components/ErrorBoundary';
import { routes } from '@/config/routes';
import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import Load from '@/components/Loading';

const App: React.FC = () => {
  const routing = useRoutes(routes);

  return (
    <ErrorBoundary>
      <Suspense fallback={<Load />}>{routing}</Suspense>
    </ErrorBoundary>
  );
};

export default App;
