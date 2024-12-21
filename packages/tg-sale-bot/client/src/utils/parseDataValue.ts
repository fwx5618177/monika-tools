/**
 * 解析数据字符串，返回其中的数字值
 * @param dataString
 * @returns
 */
export const parseDataValue = (dataString: string) => {
  if (!dataString) return 0;

  const numericValue = dataString.match(/\d+/);
  return numericValue ? Number(numericValue[0]) : 0;
};
