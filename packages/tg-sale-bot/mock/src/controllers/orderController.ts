import { Request, Response } from "express";
import { successResponse } from "../utils/responseUtils";

// 模拟的订单数据
export const getOrders = (req: Request, res: Response) => {
  const orders = [
    { id: 1, item: "Item A", price: 100 },
    { id: 2, item: "Item B", price: 150 },
  ];

  return res.json(successResponse(orders));
};
