class Api {
  static checkTonRegistration = "/api/check-ton";
  static checkToken = "/api/check-token";

  static login = "/api/login";
  static register = "/api/register";
  static userInfo = "/api/user-info";
  static logout = "/api/logout";

  static updateUserInfo = "/api/update-user-info";
  static verifyEmail = "/api/verify-email";

  /** 定时提交积分 */
  static submitPoints = "/api/users/submit-points";

  // home
  /** 获取个人套餐信息 */
  static userPackagesInfo = "/api/user-packages-info";
  /** 获取所有套餐信息 */
  static packagesInfo = "/api/packages-info";
  /** 获取个人套餐信息详情 */
  static userPackagesInfoDetail = "/api/user-packages-info-detail";

  // esim
  /** 获取套餐信息 */
  static purchasedEsimPackages = "/api/esim-packages";

  // packages
  // 获取国家地区列表
  static getAllCountryList = "/api/config/allregions";

  // 获取支持的地区列表
  static getSupportedRegionList = "/api/simcard/regions";

  // 获取支持的地区列表
  static getAllRegionList = "/api/config/availableRegions";

  // 获取套餐详情
  static getPackageDetail = "/api/simcard/merchandise-detail";

  // 支持地区的套餐列表
  static supportRegionPackages = "/api/simcard/merchandise";

  // 支持地区的套餐列表
  static regionPackages = "/api/merchandise";

  // 购买 esim 卡
  static buyEsim = "/api/orders/esim";

  // 购买套餐
  static buyPackage = "/api/orders";

  // 购买 sim 卡
  static buySim = "/api/orders/sim";

  // payment
  // 获取价格
  static paymentPrice = "/api/order/price";

  // 支付
  static paymentLink = "/api/orders/payment";

  // earn
  static getInviteRewards = "/api/users/invite-rewards";

  // valid invite code
  static validInviteCode = "/api/invodecode/valid";

  // 签到拿积分
  static getCheckIn = "/api/users/check-in";

  // 关注获取积分
  static getFollowPoint = "/api/user/followtwitter";

  // 查询签到奖励的积分数量
  static getCheckInPoints = "/api/config/checkinintegral";

  // mine
  // 发送验证码
  static sendVerificationCode = "/api/user/verifyCode";

  // 验证验证码
  static verifyEmailCode = "/api/user/verifyemail";

  // 获取用户 order list
  // static getUserOrder = "/api/users/orders";
  static getUserOrder = "/api/users/simcard/orders";

  // 获取用户的 order 详情
  // static getUserOrderDetail = "/api/users/order/detail";
  static getUserOrderDetail = "/api/users/simcard/order/detail";

  // 获取用户 history order list
  static getUserHistoryOrder = "/api/order/history";

  // 忘记密码-发送验证码
  static sendResetPasswordEmail = "/api/user/forgot-password/send-code";

  // 忘记密码-验证验证码
  static verifyResetPasswordCode = "/api/user/forgot-password/verify-code";

  // 忘记密码-重置密码
  static resetPassword = "/api/user/forgot-password/reset-password";
}

class ExternalApi {
  /** 区域信息 */
  static fetchRegions = "https://restcountries.com/v3.1/all";
  /** 指定区域国家 */
  static fetchCountriesByRegion = "https://restcountries.com/v3.1/region";

  /** okx 支付汇率 TON-USDT */
  static fetchOKXTonRate =
    "https://www.okx.com/api/v5/market/ticker?instId=TON-USDT";
}

export { Api, ExternalApi };
