import moment from "moment";

// 规格化时间计算函数
export const calculateRemainingTime = (startTime: string, deadline: string) => {
  const now = moment();
  const deadlineMoment = moment(deadline);

  const remainingDays = deadlineMoment.diff(now, "days");
  const remainingHours = deadlineMoment.diff(now, "hours") % 24; // 计算小时数
  const remainingMinutes = deadlineMoment.diff(now, "minutes") % 60; // 计算分钟数

  return {
    isRemaining:
      startTime === '' || remainingDays > 0 || remainingHours > 0 || remainingMinutes > 0,
    remainingDays,
    remainingHours,
    remainingMinutes,
  };
};
