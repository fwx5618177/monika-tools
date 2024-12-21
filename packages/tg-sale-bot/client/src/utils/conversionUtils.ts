import { message } from "@components/MessageProvider";
import numeral from "numeral";

export interface ConversionRates {
  usdtToUsdRate: string; // USDT 转 USD 的汇率
  tonToUsdtRate: string; // TON 转 USDT 的汇率
}

/**
 * TON 通用汇率转换函数
 * @param amount 转换金额
 * @param rate 汇率
 * @param operation 操作类型 (multiply 或 divide)
 * @returns {string} 转换后的金额，乘以 1e9 并返回整数值，返回整数形式，确保无小数
 */
const convertAmount = (
  amount: string | number,
  rate: string,
  operation: "multiply" | "divide"
): string => {
  const result =
    operation === "multiply"
      ? numeral(amount).multiply(rate).value() || 0
      : numeral(amount).divide(rate).value() || 0;

  return numeral(result).multiply(1e9).format("0");
};

/**
 * 计算汇率转换
 * @param amount 金额
 * @param fromCurrency 起始币种 (例如 'USDT', 'TON')
 * @param toCurrency 目标币种 (例如 'USD', 'USDT')
 * @param rates 汇率对象 { usdtToUsdRate, tonToUsdtRate }
 * @returns 转换后的金额
 */
export const convertCurrency = (
  amount: string | number,
  fromCurrency: "USDT" | "TON",
  toCurrency: "USD" | "USDT" | "TON",
  rates: ConversionRates
): string => {
  switch (`${fromCurrency}->${toCurrency}`) {
    case "USDT->USD":
      return convertAmount(amount, rates.usdtToUsdRate, "multiply");
    case "TON->USDT":
      return convertAmount(amount, rates.tonToUsdtRate, "multiply");
    case "USDT->TON":
      return convertAmount(amount, rates.tonToUsdtRate, "divide");
    default:
      message.warn("Unsupported currency conversion!");
      return numeral("0").format("0.0000");
  }
};
