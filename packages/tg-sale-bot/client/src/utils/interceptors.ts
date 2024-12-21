import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { navigateToLogin } from "@utils/navigation"; // 跳转工具
import { ApiResponse } from "@interfaces/common";
import { message } from "@components/MessageProvider";
import { getTokenFromStore } from "./tokenHelper";
import { getI18n } from "react-i18next";

console.log("baseUrl:", process.env.VITE_APP_BASE_URL);

const apiClient = axios.create({
  baseURL: process.env.VITE_APP_BASE_URL, // 使用环境变量的基础 URL
  timeout: 20000, // 请求超时时间
  timeoutErrorMessage: "timeout...",
  withCredentials: true,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  maxRedirects: 5,
});

// 请求拦截器：在请求发出之前自动添加 token 到请求头
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getTokenFromStore(); // 从 Redux store 获取 token
    if (token) {
      const language = getI18n().language;
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`; // 添加 Authorization 头
      config.headers["Accept-Language"] = language; // 添加 Accept-Language 头
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理全局错误，并返回响应
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown & { valid: boolean }>>) => {
    if (response.data && response.data.code === 200) {
      if (response.data.data?.valid === false) {
        message.error("Token is invalid, please login again");
        navigateToLogin();
        return Promise.reject(
          new Error("Token is invalid, please login again")
        );
      }

      return response;
    }

    const errorMessage = response.data?.message || "Request failed";
    message.error(errorMessage);
    return Promise.reject(new Error(errorMessage));
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    // 处理网络或服务器错误
    if (error.response) {
      // 请求已发送，服务器返回状态码错误的情况
      const errorMessage = error.response.data?.message || "Server Error";
      message.error(errorMessage);
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // 请求已发送，但没有响应
      message.error("No response received from server");
      return Promise.reject(new Error("No response received from server"));
    } else {
      // 请求未发出，出现了错误
      message.error(error.message || "Unexpected error");
      return Promise.reject(error);
    }
  }
);

export default apiClient;
