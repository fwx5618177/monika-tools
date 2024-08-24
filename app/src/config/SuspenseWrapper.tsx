import React, { Suspense } from 'react';

interface SuspenseWrapperProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const SuspenseWrapper: React.FC<SuspenseWrapperProps> = ({
  fallback,
  children,
}) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default SuspenseWrapper;
