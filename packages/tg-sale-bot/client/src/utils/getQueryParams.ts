import { message } from "@components/MessageProvider";

/**
 * 获取 URL 中的查询参数
 *
 * @returns {string} 查询参数对象
 */
export const getQueryParams = <T>(): T | Record<string, string> => {
  try {
    const url = window.location.href;
    const urlObj = new URL(url);

    // 获取 URL 中的查询参数
    const params = new URLSearchParams(urlObj.search);

    // 将查询参数转换成对象
    const queryParams: Record<string, string> = {};
    params.forEach((value, key) => {
      queryParams[key] = value;
    });

    return queryParams;
  } catch (error) {
    message.error("Failed to get query params");
    return {};
  }
};
