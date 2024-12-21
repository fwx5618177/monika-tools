import Home from '@pages/Home';
import ErrorPage from '@pages/ErrorPage';
import NotFound from '@pages/NotFound';
import { RouteObject } from 'react-router-dom';
import AboutPage from '@pages/About';
import VideoPage from '@pages/Video';

export const ssgRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/video',
    element: <VideoPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
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
