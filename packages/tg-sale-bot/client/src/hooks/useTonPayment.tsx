import { useCallback, useEffect, useRef, useState } from "react";
import {
  useTonAddress,
  useTonConnectModal,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { message } from "@components/MessageProvider";
import { constants } from "@constants/variable";
import { fetchTonUsdtPrice } from "@apis/external_region";
import { convertCurrency } from "@utils/conversionUtils";
import { getPaymentPrice } from "@apis/request_api";
import { getQueryParams } from "@utils/getQueryParams";
import { SelectMethod } from "@components/PaymentMethod";
import { useTranslation } from "react-i18next";
import { decodeFromBase64 } from "@utils/decodeFromBase64";

interface TransactionRecord {
  txHash: string;
  amount: string;
  recipientAddress: string;
}

interface UseTonPayment {
  connect: () => void;
  sendPayment: () => Promise<TransactionRecord | null>;
  isConnected: boolean;
  //tonRate: string | undefined;
  loading: boolean;

  //price: string | undefined;
}

export const useTonPayment = (): UseTonPayment => {
  const isOpenRef = useRef(false);
  const urlParams = getQueryParams<{
    orderId: string;
    payType: SelectMethod;
  }>();
  //const [price, setPrice] = useState<string | undefined>(undefined);
  //const [tonRate, setTonRate] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const tonWalletAddress = useTonAddress(); // 获取 Ton 地址，无论是 Telegram Mini App 还是 H5/PC 都支持
  const [tonConnectUI] = useTonConnectUI();
  const { open } = useTonConnectModal();
  const { t } = useTranslation();

  // 初始化 TON 支付连接
  const connect = async () => {
    try {
      setLoading(true);
      if (!tonWalletAddress) {
        open();
      }
    } catch (error) {
      message.error(t("payment-connect-error"));
    } finally {
      setLoading(false);
    }
  };

  /** 处理支付交易逻辑 */
  const processSendTransaction = useCallback(
    async (recipientAddress: string): Promise<TransactionRecord | null> => {
      try {
        setLoading(true);
        const priceResponse = await getPaymentPrice({
          orderId: urlParams?.orderId,
        });
        const data = await fetchTonUsdtPrice();
        const tonRate = data?.last || "0";

        if (parseFloat(tonRate) === 0) {
          message.error(t("payment-rate-error"));
          return null;
        }

        const amountOutTon = convertCurrency(
          priceResponse.price,
          "USDT",
          "TON",
          {
            tonToUsdtRate: tonRate,
            usdtToUsdRate: tonRate,
          }
        ); // 转换成 TON 的数量

        const txConfig = {
          validUntil: constants.tonPayLimit,
          messages: [
            {
              address: recipientAddress,
              amount: amountOutTon, // 确保金额是字符串格式
            },
          ],
        };
        console.log("txConfig:", txConfig);

        const transactionResponse = await tonConnectUI.sendTransaction(
          txConfig
        );

        if (!transactionResponse) {
          console.log("transactionResponse:", transactionResponse);
          return null;
        }

        const txHash = transactionResponse.boc;

        // 将交易记录存储在 transactions 中
        const newTransaction: TransactionRecord = {
          txHash,
          amount: amountOutTon,
          recipientAddress,
        };

        message.success(t("payment-transaction-submit-wait-result"));
        return newTransaction;
      } catch (error) {
        console.error(t("payment-failed"), error);
        message.error(t("payment-transaction-error"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t, tonConnectUI, urlParams?.orderId]
  );

  /** 发送支付 */
  const sendPayment =
    useCallback(async (): Promise<TransactionRecord | null> => {
      const recipientAddress = process.env.VITE_APP_RECEIVE_ADDRESS_TON;

      if (!recipientAddress) {
        message.error(t("payment-get-address"));
        return null;
      }

      if (!tonWalletAddress) {
        message.error(t("payment-connect-wallet"));
        await tonConnectUI.openModal();
        // 等待用户完成钱包连接
        return null;
      }

      return await processSendTransaction(recipientAddress);
    }, [processSendTransaction, t, tonConnectUI, tonWalletAddress]);

  // 初始化检查连接状态
  useEffect(() => {
    if (
      !isOpenRef.current &&
      !tonConnectUI.connected &&
      decodeFromBase64(urlParams.payType) === "ton"
    ) {
      open();
      isOpenRef.current = true;
    }
  }, [open, tonConnectUI.connected, urlParams.payType]);

  // 获取 TON 汇率
  // useEffect(() => {
  //   getOrderPrice();
  //   if (decodeFromBase64(urlParams?.payType) === "ton") {
  //     fetchTonRate();
  //   }
  // }, [getOrderPrice, urlParams?.payType]);

  return {
    connect,
    sendPayment,
    isConnected: tonConnectUI.connected,
    //tonRate,
    loading,
    //price,
  };
};
