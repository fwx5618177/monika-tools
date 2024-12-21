import numeral from "numeral";

/**
 * 转换 MB 或 GB 为 GB 单位，并保留指定格式
 * @param value {number | string} - 需要转换的值，支持字符串格式如 "123 MB" 或 "12 GB"
 * @param format {string} - 格式化规则，默认为 "0,0.00"
 * @returns {string} - 转换后的 GB 值，格式为 0.00 GB
 */
export const formatToGB = (
  value: number | string,
  format: string = "0,0.00"
): string => {
  // 检查特殊情况，如果为空或为 "0"，统一处理为 "0 MB"
  if (value == null || value === "" || value === 0 || value === "0") {
    value = "0 GB";
  }

  // 若输入为字符串，去掉所有空格并转换为小写
  const normalizedValue =
    typeof value === "string" ? value.replace(/\s+/g, "").toLowerCase() : value;

  // 解析数值并转换为 MB
  let mbValue: number;
  if (typeof normalizedValue === "string") {
    // 检查并处理单位
    if (normalizedValue.endsWith("gb")) {
      mbValue = parseFloat(normalizedValue) * 1024; // GB 转换为 MB
    } else if (normalizedValue.endsWith("mb")) {
      mbValue = parseFloat(normalizedValue); // 已是 MB
    } else {
      throw new Error("无效的单位格式，仅支持 MB 或 GB");
    }
  } else if (typeof normalizedValue === "number") {
    mbValue = normalizedValue;
  } else {
    throw new Error("无效的输入类型，仅支持字符串或数字");
  }

  // 转换 MB 为 GB
  const gbValue = mbValue / 1024;

  // 返回格式化后的字符串
  return `${numeral(gbValue).format(format)} GB`;
};
