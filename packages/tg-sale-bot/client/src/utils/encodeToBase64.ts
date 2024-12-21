/**
 * 编码字符串为base64
 * @param str {string} 字符串
 * @returns {string} base64字符串
 */
export const encodeToBase64 = (str: string): string => {
  if (!str) return "";

  return btoa(unescape(encodeURIComponent(str)));
};
