"use client";

import React from "react";
import { QueryClient, QueryClientProvider as Provider } from "react-query";

const QueryClientProvider = ({ children }: React.PropsWithChildren) => {
  const [client] = React.useState(new QueryClient());

  return <Provider client={client}>{children}</Provider>;
};

export default QueryClientProvider;
