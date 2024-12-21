import { FC } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Content Post",
    template: "%s - Blog",
  },
  description: "Dynamic Description",
};

const Layout: FC<{
  children: React.ReactNode;
}> = async ({ children }) => {
  return <>{children}</>;
};

export default Layout;
