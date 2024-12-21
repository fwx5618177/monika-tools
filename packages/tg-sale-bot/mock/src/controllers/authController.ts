import { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/responseUtils";
import { Buffer } from "buffer"; // 用于解码 base64
import {
  CheckTokenResponse,
  CheckTonRegistrationRequest,
  CheckTonRegistrationResponse,
  LoginRequestData,
  LoginResponse,
  RegisterRequestData,
  RegisterResponse,
  UserInfo,
} from "../types/request";

// 模拟的检查 TON 钱包地址注册状态的 API
export const checkWalletAccount = (req: Request, res: Response) => {
  const { walletAddress } = req.body as CheckTonRegistrationRequest;

  if (walletAddress === "UQBbxBCpgcMvz5JXjg-UjcYVM0Wrsukjj53XfuPB1527Qz7o") {
    return res.json(
      successResponse<CheckTonRegistrationResponse>({
        exists: true,
        username: "test",
      })
    );
  } else {
    return res.json(
      errorResponse<CheckTonRegistrationResponse>(
        {
          exists: false,
          username: "",
        },
        "Wallet address is not registered"
      )
    );
  }
};

// 模拟的 Token 验证 API
export const checkToken = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token === "mocked_token") {
    return res.json(
      successResponse<CheckTokenResponse>({
        valid: true,
      })
    );
  } else {
    return res.json(
      errorResponse<CheckTokenResponse>(
        {
          valid: false,
        },
        "Unauthorized: Token is invalid"
      )
    );
  }
};

// 模拟的登录 API
export const login = (req: Request, res: Response) => {
  const { username, password, walletAddress } = req.body as LoginRequestData;
  const userInfo: UserInfo = {
    id: "1",
    username: "test",
    walletAddress: "UQBbxBCpgcMvz5JXjg-UjcYVM0Wrsukjj53XfuPB1527Qz7o",
    isVerifiedEmail: true,
    email: null,
    inviteCode: null,
    integral: 0,
  };

  if (password) {
    // 假设密码是 base64 编码的，需要解码
    const decodedPassword = Buffer.from(password, "base64").toString("utf-8");

    if (username === "test" && decodedPassword === "123456") {
      return res.json(
        successResponse<LoginResponse>({
          success: true,
          token: "mocked_token",
          timestamp: new Date().toString(),
          userInfo,
        })
      );
    } else {
      return res.json(
        errorResponse<LoginResponse>(
          {
            success: false,
            token: "",
            timestamp: "",
            userInfo: {
              id: "",
              username: "",
              walletAddress: "",
              isVerifiedEmail: false,
              email: null,
              inviteCode: null,
              integral: 0,
            },
          },
          "Invalid username or password"
        )
      );
    }
  }

  if (walletAddress) {
    if (
      username === "test" &&
      walletAddress === "UQBbxBCpgcMvz5JXjg-UjcYVM0Wrsukjj53XfuPB1527Qz7o"
    ) {
      return res.json(
        successResponse<LoginResponse>({
          success: true,
          token: "mocked_token",
          timestamp: new Date().toString(),
          userInfo,
        })
      );
    } else {
      return res.json(
        errorResponse<LoginResponse>(
          {
            success: false,
            token: "",
            timestamp: "",
            userInfo: {
              id: "",
              username: "",
              walletAddress: "",
              isVerifiedEmail: false,
              email: null,
              inviteCode: null,
              integral: 0,
            },
          },
          "Invalid username or wallet address, please register first"
        )
      );
    }
  }
};

// 模拟的注册 API
export const register = (req: Request, res: Response) => {
  const { username, password, confirmPassword } =
    req.body as RegisterRequestData;

  // 解析 base64 编码的密码
  const decodedPassword = Buffer.from(password, "base64").toString("utf-8");
  const decodedConfirmPassword = Buffer.from(
    confirmPassword,
    "base64"
  ).toString("utf-8");

  // 简单的验证逻辑，用户名为 'test' 且密码匹配
  if (
    username === "test" &&
    decodedPassword === "123456" &&
    decodedPassword === decodedConfirmPassword
  ) {
    return res.json(
      successResponse<RegisterResponse>({
        success: true,
      })
    );
  } else {
    return res.json(
      errorResponse<RegisterResponse>(
        {
          success: false,
        },
        "Registration failed"
      )
    );
  }
};

// 模拟的用户信息 API
export const userInfo = (req: Request, res: Response) => {
  return res.json(
    successResponse<UserInfo>({
      id: "1",
      username: "test",
      walletAddress: "UQBbxBCpgcMvz5JXjg-UjcYVM0Wrsukjj53XfuPB1527Qz7o",
      isVerifiedEmail: true,
      email: null,
      inviteCode: null,
      integral: 0,
    })
  );
};

// return user package info
export const userPkgInfo = (req: Request, res: Response) => {
  return res.json({
    code: 200,
    message: "success",
    data: [
      {
        id: "c2443e69-bbc9-4c37-ae14-6dcc9cba5226",
        packageId: "3539f26a-6d59-4511-ad94-daa12d6c0d23",
        packageName: "Business Plan",
        packageType: "SIM",
        packageVolume: "71 GB",
        packageStatus: false,
        price: 65.61,
        region: "Europe",
        supportRegion: ["China", "Japan", "England", "France"],
        phoneNumber: "+10123456789",
        roamingData: "1507 MB",
        totalVolume: "149 GB",
        orderId: "ac5118ce-d387-4ba7-880b-972f79021672",
        userId: "12345",
        status: false,
        startTime: "2024-08-26 18:37:04",
        endTime: "2024-09-23 18:37:04",
        usedData: "3329 MB",
      },
      {
        id: "9aedf16c-bc23-4be0-918d-2f74732438da",
        packageId: "c7b84c8f-71ea-4792-b474-52b73a27e1d5",
        packageName: "Business Plan",
        packageType: "eSIM",
        packageVolume: "43 GB",
        packageStatus: false,
        price: 53.33,
        region: "Asia",
        supportRegion: ["China", "Japan"],
        phoneNumber: "+12345678901",
        roamingData: "1180 MB",
        totalVolume: "122 GB",
        orderId: "b015b240-6845-4c52-be3e-d18fd841710e",
        userId: "12345",
        status: true,
        startTime: "2024-09-20 18:37:04",
        endTime: "2024-10-13 18:37:04",
        usedData: "4723 MB",
      },
      {
        id: "a557c466-16f3-4a81-b185-6f9712cac950",
        packageId: "5179b825-8065-4b6d-bc81-a1bcb2f5858b",
        packageName: "Basic Plan",
        packageType: "eSIM",
        packageVolume: "57 GB",
        packageStatus: true,
        price: 38.48,
        region: "Europe",
        supportRegion: ["China", "Japan"],
        phoneNumber: "+19876543210",
        roamingData: "1802 MB",
        totalVolume: "33 GB",
        orderId: "be442e70-634f-4885-b30c-8036edf2b294",
        userId: "12345",
        status: true,
        startTime: "2024-09-22 18:37:04",
        endTime: "2024-10-19 18:37:04",
        usedData: "2002 MB",
      },
      {
        id: "443f1f46-3ee8-4a44-ad7f-9ac1d6442258",
        packageId: "e4288e0b-c340-4bf0-9163-034ecd6b68de",
        packageName: "Basic Plan",
        packageType: "eSIM",
        packageVolume: "1 GB",
        packageStatus: false,
        price: 53.27,
        region: "Africa",
        supportRegion: ["China", "Japan"],
        phoneNumber: "+19876543210",
        roamingData: "1766 MB",
        totalVolume: "21 GB",
        orderId: "997f2300-75e9-428e-9535-cd6d189db7cd",
        userId: "12345",
        status: true,
        startTime: "2024-09-18 18:37:04",
        endTime: "2024-09-20 18:37:04",
        usedData: "2328 MB",
      },
      {
        id: "40552232-c3c4-48b1-88b7-d52f04bb59d4",
        packageId: "e2731988-037d-4ec9-9857-292a27ff22b9",
        packageName: "Ultimate Plan",
        packageType: "eSIM",
        packageVolume: "41 GB",
        packageStatus: true,
        price: 40.07,
        region: "Europe",
        supportRegion: ["China", "Japan"],
        phoneNumber: "+19876543210",
        roamingData: "712 MB",
        totalVolume: "102 GB",
        orderId: "a014d4bf-7ccc-4360-b259-a513dd824986",
        userId: "12345",
        status: true,
        startTime: "2024-08-28 18:37:04",
        endTime: "2024-09-03 18:37:04",
        usedData: "747 MB",
      },
      {
        id: "95218542-d69f-4f7b-8242-94deceb688ba",
        packageId: "216cdd51-14b9-4b74-8fbe-ed621e97ffa3",
        packageName: "Business Plan",
        packageType: "SIM",
        packageVolume: "80 GB",
        packageStatus: true,
        price: 12.7,
        region: "Africa",
        supportRegion: ["China", "Japan"],
        phoneNumber: "+12345678901",
        roamingData: "1062 MB",
        totalVolume: "140 GB",
        orderId: "dce0c563-82d1-4b7f-9cce-a0858e761bae",
        userId: "12345",
        status: false,
        startTime: "2024-09-21 18:37:04",
        endTime: "2024-09-25 18:37:04",
        usedData: "4925 MB",
      },
      {
        id: "10d5c33a-bc99-47dc-94a1-37eb1a470873",
        packageId: "6b512bcf-aea6-4b88-8f63-d504a4923248",
        packageName: "Basic Plan",
        packageType: "eSIM",
        packageVolume: "95 GB",
        packageStatus: false,
        price: 51.34,
        region: "Europe",
        supportRegion: ["China", "Japan"],
        phoneNumber: "+10987654321",
        roamingData: "1448 MB",
        totalVolume: "51 GB",
        orderId: "c1789e0c-ba36-4b88-aebe-1e10c5dadbf7",
        userId: "12345",
        status: false,
        startTime: "2024-09-19 18:37:04",
        endTime: "2024-09-29 18:37:04",
        usedData: "1263 MB",
      },
      {
        id: "fd59eeae-14a5-4985-9f84-941a03190278",
        packageId: "52126b16-ccd3-4c1c-b731-8e0d165255bc",
        packageName: "Family Plan",
        packageType: "SIM",
        packageVolume: "79 GB",
        packageStatus: false,
        price: 78.27,
        region: "Africa",
        supportRegion: ["China", "Japan"],
        phoneNumber: "+10987654321",
        roamingData: "1765 MB",
        totalVolume: "52 GB",
        orderId: "cb578dea-378d-4f43-a0af-38b2d1731788",
        userId: "12345",
        status: false,
        startTime: "2024-08-31 18:37:04",
        endTime: "2024-09-25 18:37:04",
        usedData: "3269 MB",
      },
    ],
  });
};

export const checkRegionHasPackage = (req: Request, res: Response) => {
  const { country, phoneNumber } = req.body;
  return res.json({
    code: 200,
    message: "success",
    data: {
      hasPackage: true,
      country,
      phoneNumber,
    },
  });
};

export const handleRegionList = (req: Request, res: Response) => {
  return res.json({
    code: 200,
    data: [
      {
        id: 1004,
        name: "Afghanistan",
        code: "93",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/afghanistan-flag-png-large.png",
        continent: "Asia",
        enabled: true,
      },
      {
        id: 1005,
        name: "Albania",
        code: "355",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/albania-flag-png-large.png",
        continent: "Europe",
        enabled: true,
      },
      {
        id: 1006,
        name: "Algeria",
        code: "213",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/algeria-flag-png-large.png",
        continent: "Africa",
        enabled: true,
      },
      {
        id: 1007,
        name: "Andorra",
        code: "376",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/andorra-flag-png-large.png",
        continent: "Europe",
        enabled: true,
      },
      {
        id: 1008,
        name: "Angola",
        code: "244",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/angola-flag-png-large.png",
        continent: "Africa",
        enabled: true,
      },
      {
        id: 1009,
        name: "Antigua and Barbuda",
        code: "1-268",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/antigua-and-barbuda-flag-png-large.png",
        continent: "North America",
        enabled: true,
      },
      {
        id: 1010,
        name: "Argentina",
        code: "54",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/argentina-flag-png-large.png",
        continent: "South America",
        enabled: true,
      },
      {
        id: 1011,
        name: "Armenia",
        code: "374",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/armenia-flag-png-large.png",
        continent: "Asia",
        enabled: true,
      },
      {
        id: 1012,
        name: "Australia",
        code: "61",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/australia-flag-png-large.png",
        continent: "Oceania",
        enabled: true,
      },
      {
        id: 1013,
        name: "Austria",
        code: "43",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/austria-flag-png-large.png",
        continent: "Europe",
        enabled: true,
      },
      {
        id: 1014,
        name: "Azerbaijan",
        code: "994",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/azerbaijan-flag-png-large.png",
        continent: "Asia",
        enabled: true,
      },
      {
        id: 1015,
        name: "Bahamas",
        code: "1-242",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/bahamas-flag-png-large.png",
        continent: "North America",
        enabled: true,
      },
      {
        id: 1016,
        name: "Bahrain",
        code: "973",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/bahrain-flag-png-large.png",
        continent: "Asia",
        enabled: true,
      },
      {
        id: 1017,
        name: "Bangladesh",
        code: "880",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/bangladesh-flag-png-large.png",
        continent: "Asia",
        enabled: true,
      },
      {
        id: 1018,
        name: "Barbados",
        code: "1-246",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/barbados-flag-png-large.png",
        continent: "North America",
        enabled: true,
      },
      {
        id: 1019,
        name: "Belarus",
        code: "375",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/belarus-flag-png-large.png",
        continent: "Europe",
        enabled: true,
      },
      {
        id: 1020,
        name: "Belgium",
        code: "32",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/belgium-flag-png-large.png",
        continent: "Europe",
        enabled: true,
      },
      {
        id: 1021,
        name: "Belize",
        code: "501",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/belize-flag-png-large.png",
        continent: "North America",
        enabled: true,
      },
      {
        id: 1022,
        name: "Benin",
        code: "229",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/benin-flag-png-large.png",
        continent: "Africa",
        enabled: true,
      },
      {
        id: 1023,
        name: "Bhutan",
        code: "975",
        flagUrl:
          "https://www.countryflags.com/wp-content/uploads/bhutan-flag-png-large.png",
        continent: "Asia",
        enabled: true,
      },
    ],
    message: "get regions succeed",
    total: 194,
  });
};

export const handlePkgs = (req: Request, res: Response) => {
  return res.json({
    code: 200,
    message: "success",
    data: [
      {
        id: 350,
        name: "(Mock) 国家12 天12GB",
        engName: "(Mock) Country 2 22GB",
        price: "4.49",
        description: "(Mock) 国家62 13GB 套餐描述",
        engDescription: "(Mock) Country 62 27GB Package Description",
        integralPrice: 34,
        stock: 0,
        specification: {
          productId: 81435179,
          validDays: 30,
          dataTotal: -1,
          dataSpeedDefault: 10240,
          zoneDataName: "(Mock) 国家4",
          countryIdList: "215",
        },
        packageType: 0,
      },
      {
        id: 351,
        name: "(Mock) 国家32 天14GB",
        engName: "(Mock) Country 25 10GB",
        price: "1.14",
        description: "(Mock) 国家9 7GB 套餐描述",
        engDescription: "(Mock) Country 55 25GB Package Description",
        integralPrice: 74,
        stock: 31,
        specification: {
          productId: 84278977,
          validDays: 30,
          dataTotal: 3072,
          dataSpeedDefault: 40000,
          zoneDataName: "(Mock) 国家20",
          countryIdList: "113",
        },
        packageType: 1,
      },
      {
        id: 352,
        name: "(Mock) 国家38 天19GB",
        engName: "(Mock) Country 35 7GB",
        price: "6.49",
        description: "(Mock) 国家60 20GB 套餐描述",
        engDescription: "(Mock) Country 59 10GB Package Description",
        integralPrice: 52,
        stock: 78,
        specification: {
          productId: 83146723,
          validDays: 30,
          dataTotal: 3072,
          dataSpeedDefault: 40000,
          zoneDataName: "(Mock) 国家54",
          countryIdList: "160",
        },
        packageType: 1,
      },
      {
        id: 353,
        name: "(Mock) 国家18 天18GB",
        engName: "(Mock) Country 77 26GB",
        price: "5.71",
        description: "(Mock) 国家67 15GB 套餐描述",
        engDescription: "(Mock) Country 71 12GB Package Description",
        integralPrice: 41,
        stock: 48,
        specification: {
          productId: 84593277,
          validDays: 15,
          dataTotal: 1024,
          dataSpeedDefault: 7168,
          zoneDataName: "(Mock) 国家85",
          countryIdList: "212",
        },
        packageType: 1,
      },
      {
        id: 354,
        name: "(Mock) 国家65 天16GB",
        engName: "(Mock) Country 100 14GB",
        price: "3.07",
        description: "(Mock) 国家20 12GB 套餐描述",
        engDescription: "(Mock) Country 20 19GB Package Description",
        integralPrice: 39,
        stock: 3,
        specification: {
          productId: 85240065,
          validDays: 7,
          dataTotal: 1024,
          dataSpeedDefault: 40000,
          zoneDataName: "(Mock) 国家8",
          countryIdList: "275",
        },
        packageType: 1,
      },
    ],
  });
};

export const handlePkgDetail = (req: Request, res: Response) => {
  return res.json({
    code: 200,
    message: "success",
    data: {
      id: 350,
      name: "(Mock) 国家12 天12GB",
      engName: "(Mock) Country 2 22GB",
      price: "4.49",
      description: "(Mock) 国家62 13GB 套餐描述",
      engDescription: "(Mock) Country 62 27GB Package Description",
      integralPrice: 34,
      stock: 0,
      specification: {
        productId: 81435179,
        validDays: 30,
        dataTotal: -1,
        dataSpeedDefault: 10240,
        zoneDataName: "(Mock) 国家4",
        countryIdList: "215",
      },
      packageType: 0,
    },
  });
};

export const handlePkgInfoDetail = (req: Request, res: Response) => {
  return res.json({
    code: 200,
    message: "success",
    data: [
      {
        id: "1",
        packageId: "PKG1001",
        packageName: "30-Day eSIM Asia",
        packageType: "eSIM",
        packageVolume: "5",
        packageStatus: true,
        price: 29.99,
        region: "Asia",
        supportRegion: ["China", "Japan", "Korea", "Thailand"],
        phoneNumber: "+10123456789",
        roamingData: "1024",
        totalVolume: "10240",
        orderId: "ORD10001",
        userId: "USR12345",
        status: true,
        startTime: "2024-01-01T00:00:00Z",
        endTime: "2024-10-02T23:59:59Z",
        usedData: "512",
      },
    ],
  });
};

export const handleBuyEsim = (req: Request, res: Response) => {
  return res.json({
    code: 200,
    message: "success",
    data: {
      orderId: "ORD10001",
    },
  });
};
