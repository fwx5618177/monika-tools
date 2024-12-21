import { AxiosRequestConfig } from "axios";
import apiClient from "./interceptors";
import { ApiResponse } from "@interfaces/common";

// 封装 GET 请求方法
const get = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await apiClient.get<ApiResponse<T>>(url, config);
  return response.data;
};

// 封装 POST 请求方法
const post = async <T, U>(
  url: string,
  data: U,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await apiClient.post<ApiResponse<T>>(url, data, config);
  return response.data;
};

// 封装 PUT 请求方法
const put = async <T, U>(
  url: string,
  data: U,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await apiClient.put<ApiResponse<T>>(url, data, config);
  return response.data;
};

// 封装 DELETE 请求方法
const remove = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await apiClient.delete<ApiResponse<T>>(url, config);
  return response.data;
};

// 封装支持重试的请求
const requestWithRetry = async <T>(
  config: AxiosRequestConfig,
  retries: number = 3
): Promise<ApiResponse<T>> => {
  try {
    return await apiClient(config);
  } catch (error) {
    if (retries > 0) {
      return requestWithRetry(config, retries - 1); // 递归重试
    }
    throw error;
  }
};

export { get, post, put, remove, requestWithRetry };
