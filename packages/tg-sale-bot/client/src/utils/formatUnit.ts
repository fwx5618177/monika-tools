import numeral from "numeral";

/**
 * 格式化数字
 * @param value {number | string} - 需要格式化的数字
 * @param format {string} - 格式化规则
 * @returns {string}
 */
export const formatNumber = (
  value: number | string,
  format: string = "0,0"
): string => {
  return numeral(value).format(format);
};
