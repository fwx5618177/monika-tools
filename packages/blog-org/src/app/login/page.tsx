import React from "react";
import { Metadata } from "next";
import LoginView from "@/views/LoginView";

export const metadata: Metadata = {
  title: "Login 登陆",
  description: "Login Page for Moxi",
  authors: {
    url: "https://moxixii.com",
    name: "Moxi",
  },
  keywords: [
    "blog",
    "moxi",
    "moxixii",
    "hyou",
    "bunken",
    "hyoubunken",
    "博客",
    "个人站",
    "login",
  ],
  icons: "/moxi_transparent.ico",
};

const Page = () => {
  return <LoginView />;
};

export default Page;
