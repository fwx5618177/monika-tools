import moment from "moment";

export const formatValidity = (validity: string | number) => {
  // 解析有效期并计算持续时间
  const duration = moment.duration(Number(validity), 'days');

  // 从时间戳计算天数和小时数
  const days = duration.days();

  // 返回格式化的字符串
  return `${days} Days`;
};
