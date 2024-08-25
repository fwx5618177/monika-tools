import Home from '@pages/Home';
import ErrorPage from '@pages/ErrorPage';
import NotFound from '@pages/NotFound';
import { RouteObject } from 'react-router-dom';

export const ssgRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/error',
    element: <ErrorPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
