import React from 'react';
import { createElement, FC, lazy, LazyExoticComponent } from 'react';
import { RouteObject } from 'react-router-dom';

function LazyWrapper({
  component,
}: {
  component: LazyExoticComponent<FC<object>>;
}) {
  return <>{createElement(component)}</>;
}

const fallbackRoutes: RouteObject[] = [
  {
    path: '/error',
    element: (
      <LazyWrapper component={lazy(() => import('@/pages/ErrorPage'))} />
    ),
  },
  {
    path: '/404',
    element: <LazyWrapper component={lazy(() => import('@/pages/NotFound'))} />,
  },
  {
    path: '*',
    element: <LazyWrapper component={lazy(() => import('@/pages/NotFound'))} />,
  },
];

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <LazyWrapper component={lazy(() => import('@/pages/index'))} />,
  },
  ...fallbackRoutes,
];
