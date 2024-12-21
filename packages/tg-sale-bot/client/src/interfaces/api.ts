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
  id?: string;
  userId: string;
  isVerifiedEmail?: boolean;

  username: string;
  email: string;
  inviteCode: string;
  integral: string;
  walletAddress: string;
  twitterFollowed: boolean;
  lastCheckInDate: string;
}

export type UserInfoResponse = UserInfo;

// 更新用户信息
export interface UpdateUserInfoRequestData {
  username?: string;
  email?: string;
  walletAddress?: string;
}

// TODO:以下接口未接通

// 提交积分
export interface SubmitPointsRequestData {
  userId?: string; // 用户 ID
}

export type SubmitPointsResponse = UserInfo;

// 套餐信息
export interface PackageInfo {
  id: string; // 标识符
  packageId: string; // 套餐 ID
  packageName: string; // 套餐名称
  packageType: "eSIM" | "SIM"; // 套餐类型
  packageVolume: string; // 套餐数量余量，可购买次数
  packageStatus: boolean; // 套餐状态, 是否有效
  price: number; // 价格
  region: string; // 地区
  supportRegion: string[]; // 支持地区
  phoneNumber: string; // 手机号
  roamingData: string; // 漫游流量
  totalVolume: string; // 总流量
}

// 个人用户套餐信息
export interface UserPackageInfo {
  packageId?: string; // 套餐 ID
  orderId: string; // 订单号
  userId: string; // 用户 ID
  status: number; // SIM卡状态
  startTime: string; // 开始时间
  endTime: string; // 结束时间
  usedData: string; // 已用流量
  cardExisted: boolean;
}

// 获取个人用户套餐信息
// export interface GetUserPackageInfoRequest {
//   phoneNumber?: string; // 手机号
//   userId?: string;
// }

// 获取个人用户套餐信息响应
export type GetUserPackageInfoResponse = (UserPackageInfo & PackageInfo)[];

// 套餐信息请求
export interface PackageInfoRequest {
  userId?: string; // 用户 ID
  packageId?: string; // 套餐 ID
}

// 获取套餐信息详情
export interface GetPackageInfoDetailRequest {
  phoneNumber: string; // 手机号
}

// 套餐信息响应
export type PackageInfoResponse = PackageInfo[];

// 获取个人套餐信息详情
export type GetPackageInfoDetailResponse = (UserPackageInfo & PackageInfo)[];

// 检测地区是否有套餐
export interface CheckRegionHasPackageRequest {
  country: string; // 国家
  phoneNumber: string; // 手机号
}

// 检测地区是否有套餐响应
export interface CheckRegionHasPackageResponse {
  hasPackage: boolean; // 是否有套餐
}

// 获取支持的地区列表
export interface SupportRegionListRequest {
  phoneNumber: string; // 手机号
  countryCode: string; // 国家代码
}

export interface RawCountryItem {
  name: {
    common: string;
    official: string;
  };
  region: string;
  continents: string[];
  flags: {
    png: string;
    svg: string;
  };
  code: string;
}

export interface RegionItem {
  id?: number; // 地区 ID
  code?: string; // 地区代码
  name: string; // 地区名称
  flagUrl: string; // 地区国旗
  continent?: string; // 所属大洲
  enabled?: boolean; // 是否可用
}

// 获取支持的地区列表响应
export type SupportRegionListResponse = RegionItem;

export interface ProductDetail {
  productId: number; //套餐的产品ID
  validDays: number; //套餐有效天数
  dataTotal: number; //套餐可用流量：-1 表示无限流量(单位：MB)
  dataSpeedDefault: number; //默认限速
  zoneDataName: string; //可销售地区名称
  countryIdList: string; //可销售地区ID列表
}

export interface PackageItem {
  id: number; //商品ID
  name: string; //商品中文名称
  engName: string; //商品英文名称
  price: string; //商品的泰达币售价
  integralPrice: string; //商品的积分售价
  description: string; //商品的中文描述信息
  engDescription: string; //商品的英文描述信息
  specification: ProductDetail; //商品的规格-即套餐的相关信息
  stock: number; //库存 - 目前套餐和虚拟卡不校验库存，可以无限售卖， 实体卡可能会限制库存
  packageType: number; //套餐类型 0 - 天卡， 1 - 流量卡
}

// 判断卡类型, packageType 为 0 时为天卡, 为 1 时为流量卡
export enum CardType {
  Daily = 0,
  Mobile = 1,
}

export type SupportRegionPackages = PackageItem;

// 获取套餐详情
export interface GetPackageDetailRequest {
  productId: string | number; // 产品 ID
}

// sim 卡类型
export enum SimCardType {
  SIM = "SIM",
  eSIM = "eSIM",
}

// 购买 eSIM 卡请求数据
export interface BuyEsimRequestData {
  userId?: string; // 用户 ID
  merchanId?: string;
}

export interface BuyEsimResponse {
  orderId: string; // 订单号
}

// 购买 SIM 卡请求数据
export interface BuySimRequestData {
  merchanId?: string;
  userId?: string; // 用户 ID
  region: string; // 地区
  country: string; // 国家
  address: string; // 地址
  zipcode: string; // 邮编
  telephone: string; // 电话
  receiverName: string; // 收件人姓名
}

export interface BuyPackageRequestData {
  skus: string[];
  simCardAccount: string;
}

export type BuySimResponseData = BuyEsimResponse;

/** TON-USDT 汇率  */

export interface PriceData {
  instType: string; // 交易类型，例如 "SPOT"
  instId: string; // 交易对，例如 "TON-USDT"
  last: string; // 最新成交价
  lastSz: string; // 最新成交量
  askPx: string; // 卖一价格
  askSz: string; // 卖一数量
  bidPx: string; // 买一价格
  bidSz: string; // 买一数量
  open24h: string; // 24小时开盘价
  high24h: string; // 24小时最高价
  low24h: string; // 24小时最低价
  volCcy24h: string; // 24小时成交量，按计价货币
  vol24h: string; // 24小时成交量
  ts: string; // 时间戳
  sodUtc0: string; // UTC0的开盘价
  sodUtc8: string; // UTC8的开盘价
}

export interface TonUsdtResponse {
  code: string;
  msg: string;
  data: PriceData[];
}

// 获取支付价格
export interface GetPaymentPriceRequestData {
  orderId?: string; // 用户 ID
}

export interface GetPaymentPriceResponse {
  price: string; // 价格
}

// 支付
export interface PaymentRequestData {
  orderId: string; // 订单 ID
  payType: "integral" | "tether" | "ton"; // 支付类型
  succeed_url?: string; // 支付成功后的跳转 URL（可选）
  timeout_url?: string; // 超时后的跳转 URL（可选）
  ton_hx?: string; // TON 交易哈希（可选）
  ton_amount?: string; // TON 支付金额（可选）
  ton_recipientAddress?: string; // TON 收款地址（可选）
}

export interface PaymentResponseData {
  orderId: string; // 订单ID
  payUrl?: string; // 支付跳转链接，如果是aurpay，这个会返回，其他支付这里是null
  payType: "integral" | "tether" | "ton"; // 支付类型
  payment_success: boolean; //支付请求状态，true标识已完成支付请求，false标识支付请求失败
}

// 邀请数据
export interface InviteRecord {
  inviteeName: string;
  rewardIntegral: string;
  inviteTime: Date | string;
}

export interface GetInviteRewardsResponse {
  count: string;
  integralTotal: string;
  records: InviteRecord[];
}

// 签到拿积分
export interface CheckInResponse {
  checkInSucceed: boolean;
}

// 关注获取积分
export interface FollowPointResponse {
  integralId: number;
  isVerified: boolean;
}

// 获取签到积分数量
export interface GetCheckInIntegralResponse {
  CheckInIntegral: string;
  FollowTwitter: string;
  InviteUser: string;
}

// 发送验证码
export interface SendVerifyCodeRequest {
  email: string;
}

export interface SendVerifyCodeResponse {
  clientVerifyCode: string;
  sendAt: Date;
}

// 验证邮箱
export interface VerifyEmailRequestData {
  email: string;
  code: string;
  clientVerifyCode: string;
}

export interface VerifyEmailResponse {
  verified: boolean;
}

// 获取用户 order list
export enum UserOrderStatus {
  NOT_PAID = 0,
  NOT_VERIFY = 1,
  PAID = 2,
  APPLY_REFUND = 3,
  REFUNDED = 4,
  EXPRESS = 5,
  CANCELED = 6,
  COMPLETED = 7,
}

export enum UserOrderType {
  VC = "VC",
  PC = "PC",
  Package = "Package",
}

export enum UserOrderPayType {
  INTEGRAL = "integral",
  TON = "ton",
  TETHER = "tether",
}

export interface UserOrder {
  orderId: string; //订单编号
  amount: string; //订单金额
  status: UserOrderStatus; //订单状态  0 - 已提交未支付，  1 - 支付已提交，待验证， 2 - 已支付， 3 - 已申请退款， 4 - 已退款， 5 - 已发货 6 - 已取消， 7 - 已完成
  orderType: string; //订单类型，多个类型用英文逗号[,]分隔。VC - 表示订单包含虚拟卡， PC - 表示订单包含实体卡， Pakcage - 表示订单包含套餐，目前一个订单只会有一种类型
  createdAt: string; //下单时间
  phoneNumber: string; //关联手机号，如果是实体卡或虚拟卡订单，则显示卡的号码，如果是套餐，则显示充值的卡的号码
  packageInfo?: PackageInfo; //套餐信息，如果是套餐订单，则有值，卡订单则没有
  sendingAddress: string; //TON支付的支付地址
  receivingAddress: string; //TON支付的接收地址
  payType: UserOrderPayType; //支付方式

  validity: string; // 有效期
  instructions: string; // 说明

  usedData: string; // 已用流量
}

export interface GetUserOrderListRequest {
  current: number;
  pageSize: number;
}

// export type GetUserOrderListResponse = UserOrder[];

//SIM卡订单列表项
export interface GetUserOrderListResponse {
  orderId: string; //订单编号
  createTime: string; //SIM卡创建时间
  phoneNumber: string | null; //关联手机号，如果是实体卡或虚拟卡订单，则显示卡的号码，如果是套餐，则显示充值的卡的号码
  activeTime: string; //SIM卡激活时间
}

// 获取用户 order 详情

export interface UserOrderDetail {
  logisticsType: string; //快递公司，若非实体卡订单则为空
  logisticsNum: string; //快递单号，若非实体卡订单则为空
  region: string; //收货人所在大洲，若非实体卡订单则为空
  country: string; //收货人所在国家，若非实体卡订单则为空
  zipcode: string; //收货人邮编，若非实体卡订单则为空
  telephone: string; //收货人联系电话，若非实体卡订单则为空
  receiverName: string; //收货人姓名，若非实体卡订单则为空
  payTime: Date; //支付完成时间
  qrcode: string; //如果下单的虚拟卡，则有一个激活的二维码，此处为文本形式
  qrcodeImage: string; //如果下单的虚拟卡，则有一个激活的二维码，此处为base64编码的图片

  smdpAddress?: string; // 实体卡的 SM-DP+ 地址
  activationCode?: string; // 实体卡的激活码
}

export interface GetUserOrderDetailRequest {
  orderId: string;
}

// export type GetUserOrderDetailResponse = UserOrder & UserOrderDetail;

//SIM卡订单激活页面
export type GetUserOrderDetailResponse = {
  qrcode: string; //如果下单的虚拟卡，则有一个激活的二维码，此处为文本形式
  qrcodeImage: string; //如果下单的虚拟卡，则有一个激活的二维码，此处为base64编码的图片
  smdpAddress: string;
  activeCode: string;
};

// 历史订单卡片
export interface HistoryCardRequest {
  current: number;
  pageSize: number;
}

export interface HistoryCardResponse {
  orderId: string; // 订单号
  payType?: UserOrderPayType; // 区分货币类型
  sendingAddress?: string; // 发送地址
  receivingAddress?: string; // 接收地址
  phoneNumber: string; // SIM 卡号
  amount: string; // 支付金额
  createdAt: string; // 订单创建时间
  validity: string; // 有效期
  instructions: string; // 说明
  packageInfo?: PackageInfo;
  orderStatus?: UserOrderStatus; // 订单状态
}

// 验证 invite code 是否有效
export interface ValidInviteCodeRequest {
  inviteCode: string;
}

export interface ValidInviteCodeResponse {
  valid: boolean;
}

// 发送重置密码邮件
export interface SendResetPasswordEmailRequest {
  email: string;
}
export interface SendResetPasswordEmailResponse {
  success: boolean;
  clientVerifyCode: string;
  sendAt: Date;
}

// 验证验证码
export interface VerifyCodeRequest {
  email: string;
  code: string;
  clientVerifyCode: string;
}
export interface VerifyCodeResponse {
  success: boolean;
  username?: string; // 验证成功时返回用户名
  resetCredential: string;
}

// 重置密码
export interface ResetPasswordRequest {
  email: string;
  password: string;
  confirmPassword: string;
  resetCredential: string;
}
export interface ResetPasswordResponse {
  success: boolean;
}
