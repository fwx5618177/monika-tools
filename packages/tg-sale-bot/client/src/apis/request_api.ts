import {
  BuyEsimRequestData,
  BuyEsimResponse,
  BuyPackageRequestData,
  BuySimRequestData,
  BuySimResponseData,
  CheckInResponse,
  CheckTokenResponse,
  CheckTonRegistrationRequest,
  CheckTonRegistrationResponse,
  FollowPointResponse,
  GetCheckInIntegralResponse,
  GetInviteRewardsResponse,
  GetPackageDetailRequest,
  GetPackageInfoDetailRequest,
  GetPackageInfoDetailResponse,
  GetPaymentPriceRequestData,
  GetPaymentPriceResponse,
  GetUserOrderDetailRequest,
  GetUserOrderDetailResponse,
  GetUserOrderListRequest,
  GetUserOrderListResponse,
  GetUserPackageInfoResponse,
  HistoryCardRequest,
  HistoryCardResponse,
  LoginRequestData,
  LoginResponse,
  PackageInfoRequest,
  PackageInfoResponse,
  PaymentRequestData,
  PaymentResponseData,
  RegionItem,
  RegisterRequestData,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SendResetPasswordEmailRequest,
  SendResetPasswordEmailResponse,
  SendVerifyCodeRequest,
  SendVerifyCodeResponse,
  SubmitPointsRequestData,
  SubmitPointsResponse,
  SupportRegionListRequest,
  SupportRegionListResponse,
  SupportRegionPackages,
  UpdateUserInfoRequestData,
  UserInfoResponse,
  ValidInviteCodeRequest,
  ValidInviteCodeResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  VerifyEmailRequestData,
  VerifyEmailResponse,
} from "@interfaces/api";
import { get, post } from "@utils/request";
import { Api } from "./Api";
import { encodeToBase64 } from "@utils/encodeToBase64";

// 检测 TON 地址是否注册
export const checkWalletAccount = async (walletAddress: string) => {
  const response = await post<
    CheckTonRegistrationResponse,
    CheckTonRegistrationRequest
  >(Api.checkTonRegistration, { walletAddress });
  return response.data;
};

// 检测 Token 是否有效
export const checkTokenWithApi = async () => {
  const response = await get<CheckTokenResponse>(Api.checkToken);
  return response.data;
};

// 登录
export const loginAccount = async (values: LoginRequestData) => {
  const response = await post<LoginResponse, LoginRequestData>(
    Api.login,
    values
  );
  return response.data;
};

// 注册
export const register = async (values: RegisterRequestData) => {
  const response = await post<RegisterResponse, RegisterRequestData>(
    Api.register,
    values
  );
  return response.data;
};

// 获取用户信息
export const getUserInfo = async (): Promise<UserInfoResponse> => {
  const response = await get<UserInfoResponse>(Api.userInfo);

  return response.data;
};

// 更新用户信息
export const updateUserInfo = async (
  values: UpdateUserInfoRequestData
): Promise<UserInfoResponse> => {
  const response = await post<UserInfoResponse, UpdateUserInfoRequestData>(
    Api.updateUserInfo,
    values
  );

  return response.data;
};

// TODO:以下接口未接通

/** 提交积分 */
export const submitPointsApi = async ({ userId }: SubmitPointsRequestData) => {
  const link = `${Api.submitPoints}${userId ? `?userId=${userId}` : ""}`;
  const response = await get<SubmitPointsResponse>(link);

  return response.data;
};

/** 获取个人套餐信息 */
export const getUserPackagesInfo = async () => {
  const response = await get<GetUserPackageInfoResponse>(Api.userPackagesInfo);
  return response.data;
};

/** 获取所有套餐信息 */
export const getPackagesInfo = async () => {
  const response = await get<GetUserPackageInfoResponse>(Api.packagesInfo);
  return response.data;
};

/** 获取个人套餐信息列表 */
export const getPackageInfoList = async ({
  userId,
  packageId,
}: PackageInfoRequest) => {
  const link = `${Api.userPackagesInfo}${userId ? `?userId=${userId}` : ""}${
    packageId ? `&packageId=${packageId}` : ""
  }`;

  const response = await get<PackageInfoResponse>(link);
  return response.data;
};

/** 获取个人套餐信息详情 */
export const getUserPackagesInfoDetail = async ({
  phoneNumber,
}: GetPackageInfoDetailRequest) => {
  const link = `${Api.userPackagesInfoDetail}${
    phoneNumber ? `?phoneNumber=${phoneNumber}` : ""
  }`;

  const response = await get<GetPackageInfoDetailResponse>(link);
  return response.data;
};

/** 获取国家地区列表 */
export const getAllCountries = async () => {
  const response = await get<RegionItem[]>(Api.getAllCountryList);

  return response.data;
};

/** 获取支持的地区列表 */
export const getSupportRegions = async ({
  phoneNumber,
}: SupportRegionListRequest) => {
  const link = `${Api.getSupportedRegionList}${
    phoneNumber ? `?phoneNumber=${phoneNumber}` : ""
  }`;
  const response = await get<SupportRegionListResponse[]>(link);

  return response.data;
};

/** 获取地区列表 */
export const getAvailableRegions = async () => {
  const link = `${Api.getAllRegionList}`;
  const response = await get<SupportRegionListResponse[]>(link);

  return response.data;
};

/** 支持地区的套餐列表 */
export const getSupportRegionPackages = async ({
  phoneNumber,
  countryCode,
}: SupportRegionListRequest) => {
  const link = `${Api.supportRegionPackages}${
    countryCode ? `?countryCode=${countryCode}` : ""
  }${phoneNumber ? `&phoneNumber=${phoneNumber}` : ""}`;

  const response = await get<SupportRegionPackages[]>(link);
  return response.data as SupportRegionPackages[];
};

/** 支持地区的套餐列表 */
export const getRegionPackages = async ({
  phoneNumber,
  countryCode,
}: SupportRegionListRequest) => {
  const link = `${Api.regionPackages}${
    countryCode ? `?countryCode=${countryCode}` : ""
  }${phoneNumber ? `&phoneNumber=${phoneNumber}` : ""}`;

  const response = await get<SupportRegionPackages[]>(link);
  return response.data as SupportRegionPackages[];
};

/** 获取套餐详情 */
export const getPackageDetail = async ({
  productId,
}: GetPackageDetailRequest) => {
  const link = `${Api.getPackageDetail}?productId=${productId}`;
  const response = await get<SupportRegionPackages>(link);

  return response.data;
};

/** **/
export const buyPackage = async (merchanId: string, phoneNumber: string) => {
  const response = await post<BuyEsimResponse, BuyPackageRequestData>(
    Api.buyPackage,
    {
      skus: [merchanId],
      simCardAccount: phoneNumber,
    }
  );

  return response.data;
};

/** 购买 esim 卡 */
export const buyEsim = async (merchanId: string) => {
  const response = await post<BuyEsimResponse, BuyEsimRequestData>(
    Api.buyEsim,
    {
      merchanId,
    }
  );

  return response.data;
};

/** 购买 sim 卡 */
export const buySim = async (
  merchanId: string,
  {
    userId,
    region,
    country,
    address,
    zipcode,
    telephone,
    receiverName,
  }: BuySimRequestData
) => {
  const response = await post<BuySimResponseData, BuySimRequestData>(
    Api.buySim,
    {
      merchanId,
      userId,
      region,
      country,
      address,
      zipcode,
      telephone,
      receiverName,
    }
  );

  return response.data;
};

/** 获取支付的价格 */
export const getPaymentPrice = async ({
  orderId,
}: GetPaymentPriceRequestData) => {
  const link = `${Api.paymentPrice}${orderId ? `?orderId=${orderId}` : ""}`;
  const response = await get<GetPaymentPriceResponse>(link);

  return response.data;
};

/** 支付 */
export const sendPaymentTx = async ({
  orderId,
  payType,
  succeed_url,
  timeout_url,
  ton_hx,
  ton_amount,
  ton_recipientAddress,
}: PaymentRequestData) => {
  const response = await post<PaymentResponseData, PaymentRequestData>(
    Api.paymentLink,
    {
      orderId,
      payType,
      succeed_url,
      timeout_url,
      ton_hx,
      ton_amount,
      ton_recipientAddress,
    }
  );

  return response.data;
};

/** 获取 earn 的邀请数据 */
export const getInviteData = async (): Promise<GetInviteRewardsResponse> => {
  const response = await get<GetInviteRewardsResponse>(Api.getInviteRewards);

  return response.data;
};

/** 签到拿积分 */
export const getCheckInPoints = async (): Promise<CheckInResponse> => {
  const response = await get<CheckInResponse>(Api.getCheckIn);

  return response.data;
};

/** 关注获取积分 */
export const getFollowPoint = async (): Promise<FollowPointResponse> => {
  const response = await get<FollowPointResponse>(Api.getFollowPoint);

  return response.data;
};

/** 获取签到积分数量 */
export const getCheckInIntegral =
  async (): Promise<GetCheckInIntegralResponse> => {
    const response = await get<GetCheckInIntegralResponse>(
      Api.getCheckInPoints
    );

    return response.data;
  };

/** 发送验证码 */
export const sendVerifyCode = async ({
  email,
}: SendVerifyCodeRequest): Promise<SendVerifyCodeResponse> => {
  const link = `${Api.sendVerificationCode}${email ? `?email=${email}` : ""}`;
  const response = await get<SendVerifyCodeResponse>(link);

  return response?.data;
};

/** 验证邮箱 */
export const verifyEmail = async ({
  email,
  code,
  clientVerifyCode,
}: VerifyEmailRequestData): Promise<VerifyEmailResponse> => {
  const response = await post<VerifyEmailResponse, VerifyEmailRequestData>(
    Api.updateUserInfo,
    {
      email,
      code,
      clientVerifyCode,
    }
  );

  return response.data;
};

/** 获取用户 order list */
export const getUserOrderList = async ({
  current = 1,
  pageSize = 20,
}: GetUserOrderListRequest): Promise<GetUserOrderListResponse[]> => {
  const link = `${Api.getUserOrder}?current=${current}&pageSize=${pageSize}`;
  const response = await get<GetUserOrderListResponse[]>(link);

  return response.data;
};

/** 获取用户 order 详情 */
export const getUserOrderDetail = async ({
  orderId,
}: GetUserOrderDetailRequest) => {
  const response = await post<
    GetUserOrderDetailResponse,
    GetUserOrderDetailRequest
  >(Api.getUserOrderDetail, {
    orderId,
  });

  return response.data;
};

/** 获取用户 history order list */
export const getUserHistoryOrder = async ({
  current,
  pageSize,
}: HistoryCardRequest) => {
  const link = `${Api.getUserHistoryOrder}?current=${current}&pageSize=${pageSize}`;
  const response = await get<HistoryCardResponse[]>(link);

  return response.data;
};

/** 检测 invite code 是否有效 */
export const validInviteCode = async ({
  inviteCode,
}: ValidInviteCodeRequest) => {
  const link = `${Api.validInviteCode}?inviteCode=${encodeToBase64(
    inviteCode
  )}`;

  const response = await get<ValidInviteCodeResponse>(link);

  return response.data;
};

/** 忘记密码 */
export const sendResetPasswordEmail = async ({
  email,
}: SendResetPasswordEmailRequest) => {
  const response = await post<
    SendResetPasswordEmailResponse,
    SendResetPasswordEmailRequest
  >(Api.sendResetPasswordEmail, {
    email,
  });

  return response.data;
};

/** 验证重置密码的邮箱验证码 */
export const verifyResetPasswordCode = async ({
  email,
  code,
  clientVerifyCode,
}: VerifyCodeRequest) => {
  const response = await post<VerifyCodeResponse, VerifyCodeRequest>(
    Api.verifyResetPasswordCode,
    {
      email,
      code,
      clientVerifyCode,
    }
  );

  return response.data;
};

/** 重置密码 */
export const resetPassword = async ({
  email,
  password,
  confirmPassword,
  resetCredential,
}: ResetPasswordRequest) => {
  const response = await post<ResetPasswordResponse, ResetPasswordRequest>(
    Api.resetPassword,
    {
      password,
      confirmPassword,
      email,
      resetCredential,
    }
  );

  return response.data;
};
