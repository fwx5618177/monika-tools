import numeral from "numeral";

/**
 * 计算已用百分比
 * @param totalVolume {string} 总流量
 * @param usedData {string} 已用流量
 * @returns {string} 已用百分比
 */
export const calculateUsed = (
  totalVolume: string,
  usedData: string
): string => {
  const total = totalVolume === "-1" ? usedData : totalVolume;
  const percent = numeral(usedData)
    .divide(total || 1)
    .multiply(100)
    .value();

  return `${percent}%`;
};
