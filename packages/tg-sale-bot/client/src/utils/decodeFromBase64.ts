/**
 * 解码base64字符串
 * @param str
 */
export const decodeFromBase64 = (str: string): string => {
  if (!str || str === "undefined") return "";
  // 将 URL 安全的 Base64 字符替换为标准 Base64 字符
  str = str.replace(/-/g, "+").replace(/_/g, "/");

  // 计算补齐 Base64 编码所需的等号
  while (str.length % 4 !== 0) {
    str += "=";
  }

  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (error) {
    console.error("Base64 解码失败:", error);
    return "";
  }
};
