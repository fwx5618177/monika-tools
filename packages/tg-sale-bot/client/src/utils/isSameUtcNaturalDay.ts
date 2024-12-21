import moment from "moment";

/**
 * 判断当前时间与给定时间是否超过24小时同一个自然日
 * @param targetTime - 需要判断的时间，类型为 Date 或 string
 * @returns {boolean} - 若是同一个自然日时返回 true，否则返回 false；当参数为 null 或无效时间格式时，也返回 false
 */
export function isSameUtcNaturalDay(
  targetTime: Date | string | null | undefined
): boolean {
  // 如果目标时间为空或无效，则直接返回 false
  if (!targetTime || !moment(targetTime).isValid()) {
    return false;
  }

  // 若是同一个自然日，则返回 true，否则返回 false
  return moment(targetTime).isSame(moment(), 'day');
}