import { createHash } from "crypto";

class GenerateHash {
  static maxSubstringLength = 30;

  /**
   * 生成一个SHA256哈希值的前30个字符
   * @param content 内容
   * @returns {string} 返回一个SHA256哈希值的前30个字符
   */
  static generateId(content: string): string {
    return createHash("sha256")
      .update(content)
      .digest("hex")
      .substring(0, this.maxSubstringLength);
  }
}

export default GenerateHash;
