import moment from "moment";

/**
 * 计算传入时间距离当前时间相差的月份
 * @param dateTime 传入的时间（可以是字符串、日期对象或其他格式）
 * @returns 距离当前时间相差的月份数
 */
export const getMonthsAgo = (dateTime: string | Date): number => {
  const now = moment(); // 当前时间
  const pastTime = moment(dateTime); // 传入的时间

  // 计算两个时间的月份差
  const monthsDifference = now.diff(pastTime, "months");

  return monthsDifference;
};
