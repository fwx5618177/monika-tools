import express from "express";
import {
  checkWalletAccount,
  checkToken,
  login,
  register,
  userInfo,
  userPkgInfo,
  checkRegionHasPackage,
  handleRegionList,
  handlePkgs,
  handlePkgDetail,
  handlePkgInfoDetail,
  handleBuyEsim,
} from "../controllers/authController";
import { getOrders } from "../controllers/orderController";

const router = express.Router();

// Auth 路由
router.post("/check-ton", checkWalletAccount);
router.get("/check-token", checkToken);
router.post("/login", login); // 添加登录
router.post("/register", register); // 添加注册
router.get("/user-info", userInfo); // 添加检查 TON 钱包地址注册状态
router.get("/user-packages-info", userPkgInfo); // 添加获取用户信息
router.post("/check-region-has-package", checkRegionHasPackage); // 添加检查地区是否有套餐
router.get("/simcard/merchandise", handleRegionList); // 添加获取支持的地区列表
router.get("/simcard/regions", handlePkgs);
router.get("/simcard/merchandise-detail", handlePkgDetail);
router.get("/user-packages-info-detail", handlePkgInfoDetail);

router.post("/orders/esim", handleBuyEsim);

// 订单相关路由
router.get("/orders", getOrders);

export default router;
