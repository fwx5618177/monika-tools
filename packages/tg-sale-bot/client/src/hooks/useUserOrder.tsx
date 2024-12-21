import {
  getUserHistoryOrder,
  getUserOrderDetail,
  getUserOrderList,
} from "@apis/request_api";
import {
  GetUserOrderDetailResponse,
  GetUserOrderListResponse,
  HistoryCardResponse,
} from "@interfaces/api";
import { encodeToBase64 } from "@utils/encodeToBase64";
import { useCallback, useEffect, useState } from "react";

export const useUserOrder = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderList, setOrderList] = useState<GetUserOrderListResponse[]>([]);
  const [orderDetail, setOrderDetail] = useState<GetUserOrderDetailResponse>();
  const [historyList, setHistoryList] = useState<HistoryCardResponse[]>([]);

  const getOrderList = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getUserOrderList({
        current: 1,
        pageSize: 20,
      });
      setOrderList(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOrderDetail = useCallback(async (orderId: string) => {
    setIsLoading(true);

    try {
      const result = await getUserOrderDetail({
        orderId: encodeToBase64(orderId),
      });

      setOrderDetail(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getHistoryList = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getUserHistoryOrder({
        current: 1,
        pageSize: 20,
      });
      setHistoryList(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getOrderList();
    getHistoryList();
  }, [getOrderList, getHistoryList]);

  return {
    isLoading,
    orderList,
    orderDetail,
    historyList,
    getOrderDetail,
    getHistoryList,
  };
};
