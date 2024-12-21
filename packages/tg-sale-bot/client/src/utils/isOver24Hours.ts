import moment from "moment";

/**
 * 判断当前时间距离给定时间是否超过24小时
 * @param targetTime - 需要判断的时间，类型为 Date 或 string
 * @returns {boolean} - 若超过24小时返回 true，否则返回 false；当参数为 null 或无效时间格式时，也返回 false
 */
export function isOver24Hours(
  targetTime: Date | string | null | undefined
): boolean {
  // 如果目标时间为空或无效，则直接返回 false
  if (!targetTime || !moment(targetTime).isValid()) {
    return false;
  }

  // 使用 moment 计算当前时间与目标时间的差值，单位为小时
  const hoursDifference = moment().diff(moment(targetTime), "hours");

  // 若时间差大于等于 24 小时，则返回 true，否则返回 false
  return hoursDifference >= 24;
}
