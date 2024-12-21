"use client";

import { useLoginDashboard } from "@/services/Login/hooks";
import { get } from "@/utils/post.method";
import { LoginRequest } from "Components";
import { LoginResponse } from "Response";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useRef } from "react";

const useLogin = () => {
  const router = useRouter();
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem("token");
    }
    return null;
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const hasCheckedToken = useRef(false);
  const { mutate: loginDashboard } = useLoginDashboard<
    LoginResponse,
    LoginRequest
  >();

  const login = useCallback(
    async (credentials: LoginRequest) => {
      loginDashboard(credentials, {
        onSuccess: (data) => {
          setToken(data?.token);
          setIsLoggedIn(true);
          window.localStorage.setItem("token", data?.token);

          message.success("登录成功");
          router.push("/dashboard/home");
        },
        onError: (error: any) => {
          console.log(error);
          message.error("登录失败:" + error?.message);
        },
      });
    },
    [loginDashboard, router]
  );

  const logout = useCallback(() => {
    setToken(null);
    setIsLoggedIn(false);

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("token");
    }
  }, []);

  const checkAuth = useCallback(async () => {
    if (!token || hasCheckedToken.current) return;

    hasCheckedToken.current = true;
    try {
      await get("/api/login");
    } catch (error) {
      console.error("Auth check failed:", error);

      logout();
    }
  }, [logout, token]);

  useEffect(() => {
    if (token) {
      checkAuth();
    }
  }, [logout, checkAuth, token]);

  return { login, logout, token, isLoggedIn };
};

export default useLogin;
