// 通用的 API 响应格式
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
