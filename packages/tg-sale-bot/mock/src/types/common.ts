export interface ApiResponse<T> {
  code: 200 | 999; // 200: 成功, 999: 业务失败
  message: string;
  data: T;
}
