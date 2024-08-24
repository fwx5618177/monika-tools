import { createElement, FC, lazy, LazyExoticComponent } from 'react';
import { RouteObject } from 'react-router-dom';

function LazyWrapper({
  component,
}: {
  component: LazyExoticComponent<FC<{}>>;
}) {
  return <>{createElement(component)}</>;
}

const routes: RouteObject[] = [
  {
    path: '/',
    element: <LazyWrapper component={lazy(() => import('@pages/Home'))} />,
  },
  {
    path: '/error',
    element: <LazyWrapper component={lazy(() => import('@pages/ErrorPage'))} />,
  },
  {
    path: '*',
    element: <LazyWrapper component={lazy(() => import('@pages/NotFound'))} />,
  },
];

export default routes;
