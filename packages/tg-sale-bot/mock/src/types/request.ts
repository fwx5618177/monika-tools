// 登录请求数据
export interface LoginRequestData {
  username: string;
  password?: string;
  walletAddress?: string;
}

// 登录响应数据
export interface LoginResponse {
  success: boolean;
  token: string;
  timestamp: string;
  userInfo: UserInfo;
}

// 注册请求数据
export interface RegisterRequestData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  inviteCode?: string;
  address?: string;
}

// 注册响应数据
export interface RegisterResponse {
  success: boolean;
}

// 检测 TON 地址是否注册的请求数据
export interface CheckTonRegistrationRequest {
  walletAddress: string;
}

// 检测 TON 地址是否注册的响应数据
export interface CheckTonRegistrationResponse {
  exists: boolean;
  username: string;
}

// 检测 Token 的请求数据 -> 从 get 请求中 Authorization 头里获取 -> Bearer <Token>

// 检测 Token 的响应数据 / API 请求错误的 Token 响应数据
export interface CheckTokenResponse {
  valid: boolean;
}

// 用户信息
export interface UserInfo {
  id: string;
  isVerifiedEmail: boolean;

  username: string;
  email: string | null;
  inviteCode: string | null;
  integral: number;
  walletAddress: string | null;
}

export type UserInfoResponse = UserInfo;
