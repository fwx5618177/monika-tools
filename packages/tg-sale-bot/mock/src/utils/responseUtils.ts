import { ApiResponse } from "../types/common";

// 统一返回成功响应
export const successResponse = <T>(data: T): ApiResponse<T> => {
  return {
    code: 200,
    message: "success",
    data,
  };
};

// 统一返回错误响应
export const errorResponse = <T>(data: T, message: string): ApiResponse<T> => {
  return {
    code: 999,
    data,
    message,
  };
};
