import ProtectedRoute from "@providers/ProtectedRoute";
import React from "react";
import { createElement, FC, lazy, LazyExoticComponent } from "react";
import { RouteObject } from "react-router-dom";

function LazyWrapper({
  component,
}: {
  component: LazyExoticComponent<FC<object>>;
}) {
  return <>{createElement(component)}</>;
}

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <LazyWrapper component={lazy(() => import("@pages/index"))} />,
  },
  {
    path: "/join",
    element: <LazyWrapper component={lazy(() => import("@pages/JoinPage"))} />,
  },
  {
    path: "/invite",
    element: (
      <LazyWrapper component={lazy(() => import("@pages/InvitePage"))} />
    ),
  },
  {
    path: "/login",
    element: <LazyWrapper component={lazy(() => import("@pages/LoginPage"))} />,
  },
  {
    path: "/register",
    element: (
      <LazyWrapper component={lazy(() => import("@pages/RegisterPage"))} />
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <LazyWrapper
        component={lazy(() => import("@pages/ForgotPasswordPage"))}
      />
    ),
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <LazyWrapper component={lazy(() => import("@pages/Home"))} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/esim",
    element: (
      <ProtectedRoute>
        <LazyWrapper component={lazy(() => import("@pages/ESimPage"))} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/topup",
    element: (
      <ProtectedRoute>
        <LazyWrapper component={lazy(() => import("@pages/TopUp"))} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/earn",
    element: (
      <ProtectedRoute>
        <LazyWrapper component={lazy(() => import("@pages/EarnPage"))} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/map",
    element: (
      <ProtectedRoute>
        <LazyWrapper component={lazy(() => import("@pages/MapPage"))} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/packages",
    element: (
      <ProtectedRoute>
        <LazyWrapper component={lazy(() => import("@pages/Packages"))} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute>
        <LazyWrapper component={lazy(() => import("@pages/OrdersPage"))} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment",
    element: (
      <ProtectedRoute>
        <LazyWrapper component={lazy(() => import("@pages/PaymentPage"))} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mine",
    element: (
      <ProtectedRoute>
        <LazyWrapper component={lazy(() => import("@pages/MinePage"))} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/history",
    element: (
      <ProtectedRoute>
        <LazyWrapper component={lazy(() => import("@pages/HistoryPage"))} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/terms",
    element: <LazyWrapper component={lazy(() => import("@pages/Terms"))} />,
  },
  {
    path: "/privacy",
    element: (
      <LazyWrapper component={lazy(() => import("@pages/PrivacyPage"))} />
    ),
  },
  {
    path: "/error",
    element: <LazyWrapper component={lazy(() => import("@pages/ErrorPage"))} />,
  },
  {
    path: "/404",
    element: <LazyWrapper component={lazy(() => import("@pages/NotFound"))} />,
  },
  {
    path: "*",
    element: <LazyWrapper component={lazy(() => import("@pages/NotFound"))} />,
  },
];
