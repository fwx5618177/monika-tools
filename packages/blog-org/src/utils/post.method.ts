import axios, { AxiosResponse, AxiosError } from "axios";
import { message } from "antd";
import { CODE_CONFIG, CODE_MESSAGE_CONFIG } from "./code.config";
import { config } from "@/config/dev";
import { ResponseConfig } from "Response";

const service = axios.create({
  timeout: 10000, // 设置请求超时时间10秒
  baseURL: config.baseURL, // 设置base url
});

// 请求拦截器 -> 对请求做一些处理和要求
service.interceptors.request.use(
  (config) => {
    // token setting
    const token = localStorage.getItem("token"); // 你可以根据实际情况更改token的获取方式
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    config.headers["Content-Type"] = "application/json;charset=UTF-8";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const code = +response?.data?.code;

    switch (code) {
      case CODE_CONFIG.ERROR:
        message.error(
          `${CODE_MESSAGE_CONFIG.ERROR}:${response?.data?.message}`
        );
        return Promise.reject(new Error(CODE_MESSAGE_CONFIG.ERROR));
      case CODE_CONFIG.TIMEOUT:
        message.error(CODE_MESSAGE_CONFIG.TIMEOUT);
        return Promise.reject(new Error(CODE_MESSAGE_CONFIG.TIMEOUT));
      case CODE_CONFIG.NOT_FOUND:
        message.error(CODE_MESSAGE_CONFIG.NOT_FOUND);
        return Promise.reject(new Error(CODE_MESSAGE_CONFIG.NOT_FOUND));
      case CODE_CONFIG.NOT_ALLOWED:
        console.log(CODE_MESSAGE_CONFIG.NOT_ALLOWED);
        message.error(CODE_MESSAGE_CONFIG.NOT_ALLOWED);
        return Promise.reject(new Error(CODE_MESSAGE_CONFIG.NOT_ALLOWED));
      case CODE_CONFIG.SERVER_ERROR:
        message.error(CODE_MESSAGE_CONFIG.SERVER_ERROR);
        return Promise.reject(new Error(CODE_MESSAGE_CONFIG.SERVER_ERROR));
      case CODE_CONFIG.BAD_GATEWAY:
        message.error(CODE_MESSAGE_CONFIG.BAD_GATEWAY);
        return Promise.reject(new Error(CODE_MESSAGE_CONFIG.BAD_GATEWAY));
      case CODE_CONFIG.SERVICE_UNAVAILABLE:
        message.error(CODE_MESSAGE_CONFIG.SERVICE_UNAVAILABLE);
        return Promise.reject(
          new Error(CODE_MESSAGE_CONFIG.SERVICE_UNAVAILABLE)
        );
      case CODE_CONFIG.GATEWAY_TIMEOUT:
        message.error(CODE_MESSAGE_CONFIG.GATEWAY_TIMEOUT);
        return Promise.reject(new Error(CODE_MESSAGE_CONFIG.GATEWAY_TIMEOUT));
      case CODE_CONFIG.NOT_AUTHORIZED:
        message.error(CODE_MESSAGE_CONFIG.NOT_AUTHORIZED);
        return Promise.reject(new Error(CODE_MESSAGE_CONFIG.NOT_AUTHORIZED));
      case CODE_CONFIG.FORBIDDEN:
        message.error(CODE_MESSAGE_CONFIG.FORBIDDEN);
        return Promise.reject(new Error(CODE_MESSAGE_CONFIG.FORBIDDEN));
      default:
        return response.data;
    }
  },
  (error: AxiosError) => {
    const code = +error?.code;

    switch (code) {
      case CODE_CONFIG.ERROR:
        message.error(`${CODE_MESSAGE_CONFIG.ERROR}:${error?.message}`);
        return Promise.reject(new Error(CODE_MESSAGE_CONFIG.ERROR));
      case CODE_CONFIG.TIMEOUT:
        message.error(CODE_MESSAGE_CONFIG.TIMEOUT);
        return Promise.reject(new Error(CODE_MESSAGE_CONFIG.TIMEOUT));
      case CODE_CONFIG.NOT_FOUND:
        message.error(CODE_MESSAGE_CONFIG.NOT_FOUND);
        return Promise.reject(new Error(CODE_MESSAGE_CONFIG.NOT_FOUND));
      case CODE_CONFIG.NOT_ALLOWED:
        console.log(CODE_MESSAGE_CONFIG.NOT_ALLOWED);
        message.error(CODE_MESSAGE_CONFIG.NOT_ALLOWED);
        return Promise.reject(new Error(CODE_MESSAGE_CONFIG.NOT_ALLOWED));
      case CODE_CONFIG.SERVER_ERROR:
        message.error(CODE_MESSAGE_CONFIG.SERVER_ERROR);
        return Promise.reject(new Error(CODE_MESSAGE_CONFIG.SERVER_ERROR));
      case CODE_CONFIG.BAD_GATEWAY:
        message.error(CODE_MESSAGE_CONFIG.BAD_GATEWAY);
        return Promise.reject(new Error(CODE_MESSAGE_CONFIG.BAD_GATEWAY));
      case CODE_CONFIG.SERVICE_UNAVAILABLE:
        message.error(CODE_MESSAGE_CONFIG.SERVICE_UNAVAILABLE);
        return Promise.reject(
          new Error(CODE_MESSAGE_CONFIG.SERVICE_UNAVAILABLE)
        );
      case CODE_CONFIG.GATEWAY_TIMEOUT:
        message.error(CODE_MESSAGE_CONFIG.GATEWAY_TIMEOUT);
        return Promise.reject(new Error(CODE_MESSAGE_CONFIG.GATEWAY_TIMEOUT));
      case CODE_CONFIG.NOT_AUTHORIZED:
        message.error(CODE_MESSAGE_CONFIG.NOT_AUTHORIZED);
        return Promise.reject(new Error(CODE_MESSAGE_CONFIG.NOT_AUTHORIZED));
      case CODE_CONFIG.FORBIDDEN:
        message.error(CODE_MESSAGE_CONFIG.FORBIDDEN);
        return Promise.reject(new Error(CODE_MESSAGE_CONFIG.FORBIDDEN));
      default:
        return Promise.reject(error);
    }
  }
);

// 封装 get, post, put, delete 方法
const get = <T = ResponseConfig<any>>(url: string, params?: any): Promise<T> =>
  service.get<T>(url, { params }).then((response) => response.data);
const post = <T = ResponseConfig<any>>(url: string, data?: any): Promise<T> =>
  service.post<T>(url, JSON.stringify(data)).then((response) => response.data);
const put = <T = ResponseConfig<any>>(url: string, data?: any): Promise<T> =>
  service.put<T>(url, data).then((response) => response.data);
const remove = <T = ResponseConfig<any>>(url: string, data?: any): Promise<T> =>
  service.delete<T>(url, { data }).then((response) => response.data);

export { get, post, put, remove };
