"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useLogin from "@/hooks/__deprecated__useLogin";

const useAuth = () => {
  const params = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useLogin();

  useEffect(() => {
    // 如果token不存在且当前页面不是登录页，则重定向到登录页
    if (!isLoggedIn && params !== "/login") {
      router.push("/login");
    } else if (isLoggedIn && params !== "/dashboard/home") {
      // 如果token存在且当前页面是登录页，则重定向到首页
      router.push("/dashboard/home");
    }
  }, [isLoggedIn, params, router]);
};

export default useAuth;
