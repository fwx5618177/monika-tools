import ErrorBoundary from '@components/ErrorBoundary';
import Loading from '@components/Loading';
import { routes } from '@config/routes';
import { ssgRoutes } from '@config/routes.ssg';
import { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { useRoutes } from 'react-router-dom';
import '@styles/global.scss';

function App({ helmetContext }: { helmetContext?: any }) {
  const isSSG = process.env.isSSG as unknown as boolean;
  const routing = useRoutes(isSSG ? ssgRoutes : routes);

  return (
    <HelmetProvider context={helmetContext}>
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
