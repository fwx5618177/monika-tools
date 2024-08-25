import ErrorBoundary from '@components/ErrorBoundary';
import Loading from '@components/Loading';
import routes from '@config/routes';
import { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { useRoutes } from 'react-router-dom';

function App() {
  const routing = useRoutes(routes);
  const isSSG = process.env.BUILD_TARGET === 'ssg';

  return (
    <HelmetProvider>
      <ErrorBoundary>
        {isSSG ? (
          <>{routing}</>
        ) : (
          <Suspense fallback={<Loading />}>{routing}</Suspense>
        )}
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
