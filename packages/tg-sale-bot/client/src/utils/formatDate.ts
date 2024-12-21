import moment from "moment";

/**
 * 格式化日期
 * @param date 时间字符串
 * @param format 格式
 * @returns 格式化后的时间字符串
 */
export const formatDate = (date: string, defaultValue: string, format = "YYYY-MM-DD HH:mm:ss") => {
  return date ? moment(date).format(format) : defaultValue;
};
