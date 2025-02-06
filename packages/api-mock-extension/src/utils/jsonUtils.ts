import { stringify as stringifyYaml } from 'yaml';
import { js2xml } from 'xml-js';
import jsonpath from 'jsonpath';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  line?: number;
  column?: number;
}

/**
 * 验证 JSON 字符串的格式是否正确
 * @param jsonString JSON 字符串
 * @returns 验证结果
 */
export function validateJson(jsonString: string): ValidationResult {
  try {
    JSON.parse(jsonString);
    return { isValid: true };
  } catch (err) {
    if (err instanceof SyntaxError) {
      const match = err.message.match(/at position (\d+)/);
      if (match) {
        const position = parseInt(match[1], 10);
        const lines = jsonString.slice(0, position).split('\n');
        return {
          isValid: false,
          error: err.message,
          line: lines.length,
          column: lines[lines.length - 1].length + 1,
        };
      }
    }
    return {
      isValid: false,
      error: err instanceof Error ? err.message : '无效的 JSON 格式',
    };
  }
}

/**
 * 格式化 JSON 字符串
 * @param jsonString JSON 字符串
 * @returns 格式化后的 JSON 字符串
 */
export function formatJson(jsonString: string): string {
  const obj = JSON.parse(jsonString);
  return JSON.stringify(obj, null, 2);
}

/**
 * 压缩 JSON 字符串
 * @param jsonString JSON 字符串
 * @returns 压缩后的 JSON 字符串
 */
export function minifyJson(jsonString: string): string {
  const obj = JSON.parse(jsonString);
  return JSON.stringify(obj);
}

/**
 * 比较两个 JSON 字符串的差异
 * @param jsonString1 第一个 JSON 字符串
 * @param jsonString2 第二个 JSON 字符串
 * @returns 差异数组
 */
export function compareJson(jsonString1: string, jsonString2: string): any[] {
  const obj1 = JSON.parse(jsonString1);
  const obj2 = JSON.parse(jsonString2);
  const diffs: any[] = [];

  function compare(path: string, value1: any, value2: any) {
    if (value1 === value2) return;

    if (typeof value1 !== typeof value2) {
      diffs.push({
        path,
        type: 'changed',
        oldValue: value1,
        newValue: value2,
      });
      return;
    }

    if (Array.isArray(value1) && Array.isArray(value2)) {
      const maxLength = Math.max(value1.length, value2.length);
      for (let i = 0; i < maxLength; i++) {
        if (i >= value1.length) {
          diffs.push({
            path: `${path}[${i}]`,
            type: 'added',
            newValue: value2[i],
          });
        } else if (i >= value2.length) {
          diffs.push({
            path: `${path}[${i}]`,
            type: 'removed',
            oldValue: value1[i],
          });
        } else {
          compare(`${path}[${i}]`, value1[i], value2[i]);
        }
      }
      return;
    }

    if (
      typeof value1 === 'object' &&
      value1 !== null &&
      typeof value2 === 'object' &&
      value2 !== null
    ) {
      const keys1 = Object.keys(value1);
      const keys2 = Object.keys(value2);

      for (const key of keys1) {
        if (!(key in value2)) {
          diffs.push({
            path: path ? `${path}.${key}` : key,
            type: 'removed',
            oldValue: value1[key],
          });
        }
      }

      for (const key of keys2) {
        if (!(key in value1)) {
          diffs.push({
            path: path ? `${path}.${key}` : key,
            type: 'added',
            newValue: value2[key],
          });
        } else {
          compare(path ? `${path}.${key}` : key, value1[key], value2[key]);
        }
      }
      return;
    }

    diffs.push({
      path,
      type: 'changed',
      oldValue: value1,
      newValue: value2,
    });
  }

  compare('$', obj1, obj2);
  return diffs;
}

/**
 * 将 JSON 字符串转换为 YAML 字符串
 * @param jsonString JSON 字符串
 * @returns YAML 字符串
 */
export function convertJsonToYaml(jsonString: string): string {
  const obj = JSON.parse(jsonString);
  return stringifyYaml(obj);
}

/**
 * 将 JSON 字符串转换为 XML 字符串
 * @param jsonString JSON 字符串
 * @returns XML 字符串
 */
export function convertJsonToXml(jsonString: string): string {
  const obj = JSON.parse(jsonString);
  return js2xml(obj, { compact: true, spaces: 2 });
}

/**
 * 使用 JSONPath 在 JSON 中查找值
 * @param jsonString JSON 字符串
 * @param path JSONPath 表达式
 * @returns 查找结果
 */
export function findJsonPath(jsonString: string, path: string): any {
  const obj = JSON.parse(jsonString);
  return jsonpath.query(obj, path);
}
