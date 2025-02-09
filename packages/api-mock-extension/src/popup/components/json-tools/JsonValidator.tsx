import React, { useState, useCallback } from 'react';
import styles from '../../styles/components/JsonTools.module.scss';
import {
  FiCheck,
  FiRotateCcw,
  FiHelpCircle,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
} from 'react-icons/fi';
import { validateJson } from '@/utils/jsonUtils';

interface ValidationResult {
  isValid: boolean;
  details: {
    type: 'info' | 'error';
    message: string;
  }[];
}

export const JsonValidator: React.FC = () => {
  const [input, setInput] = useState('');
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);

  const validateInput = useCallback((jsonString: string): ValidationResult => {
    const details = [];
    let isValid = true;

    try {
      if (!jsonString.trim()) {
        return {
          isValid: false,
          details: [
            {
              type: 'error',
              message: '请输入 JSON 字符串',
            },
          ],
        };
      }

      // 尝试解析 JSON
      const parsed = JSON.parse(jsonString);

      // 添加基本信息
      details.push({
        type: 'info' as const,
        message: `数据类型: ${Array.isArray(parsed) ? 'Array' : typeof parsed}`,
      });

      if (typeof parsed === 'object' && parsed !== null) {
        const size = new TextEncoder().encode(jsonString).length;
        details.push({
          type: 'info' as const,
          message: `大小: ${(size / 1024).toFixed(2)} KB`,
        });

        if (Array.isArray(parsed)) {
          details.push({
            type: 'info' as const,
            message: `数组长度: ${parsed.length}`,
          });
        } else {
          details.push({
            type: 'info' as const,
            message: `属性数量: ${Object.keys(parsed).length}`,
          });
        }
      }

      // 检查常见问题
      if (jsonString.includes('undefined')) {
        details.push({
          type: 'error' as const,
          message: '包含未定义值 (undefined)',
        });
        isValid = false;
      }

      if (jsonString.includes('NaN')) {
        details.push({
          type: 'error' as const,
          message: '包含非数字值 (NaN)',
        });
        isValid = false;
      }

      if (jsonString.includes('Infinity')) {
        details.push({
          type: 'error' as const,
          message: '包含无限值 (Infinity)',
        });
        isValid = false;
      }

      // 检查尾随逗号
      if (/,\s*[}\]]/.test(jsonString)) {
        details.push({
          type: 'error' as const,
          message: '包含尾随逗号',
        });
        isValid = false;
      }

      return {
        isValid,
        details,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      return {
        isValid: false,
        details: [
          {
            type: 'error',
            message: `解析错误: ${errorMessage}`,
          },
        ],
      };
    }
  }, []);

  const handleValidate = useCallback(() => {
    const result = validateInput(input);
    setValidationResult(result);
  }, [input, validateInput]);

  const handleClear = useCallback(() => {
    setInput('');
    setValidationResult(null);
  }, []);

  const formatJson = useCallback(() => {
    try {
      const formatted = JSON.stringify(JSON.parse(input), null, 2);
      setInput(formatted);
    } catch (err) {
      // 如果格式化失败，保持原样
    }
  }, [input]);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <button
          className={styles.primaryButton}
          onClick={handleValidate}
          disabled={!input}
        >
          <FiCheck />
          验证
        </button>
        <button
          className={styles.toolButton}
          onClick={formatJson}
          disabled={!input}
        >
          格式化
        </button>
        <button
          className={styles.toolButton}
          onClick={handleClear}
          disabled={!input}
        >
          <FiRotateCcw />
          清空
        </button>
      </div>

      <div className={styles.editorContainer}>
        <textarea
          className={`${styles.editor} ${
            validationResult?.isValid === false ? styles.error : ''
          }`}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setValidationResult(null);
          }}
          placeholder="在此输入要验证的 JSON..."
          spellCheck={false}
        />
      </div>

      {validationResult && (
        <div
          className={`${styles.resultPanel} ${
            validationResult.isValid ? styles.success : styles.error
          }`}
        >
          <div className={styles.resultHeader}>
            <span
              className={`${styles.icon} ${
                validationResult.isValid ? styles.success : styles.error
              }`}
            >
              {validationResult.isValid ? <FiCheckCircle /> : <FiAlertCircle />}
            </span>
            <span className={styles.title}>
              {validationResult.isValid ? 'JSON 格式有效' : 'JSON 格式无效'}
            </span>
          </div>
          <div className={styles.resultContent}>
            {validationResult.details.map((detail, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '4px',
                }}
              >
                {detail.type === 'error' ? (
                  <FiAlertCircle color="var(--theme-error)" />
                ) : (
                  <FiInfo color="var(--theme-info)" />
                )}
                {detail.message}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.helpPanel}>
        <h4>
          <FiHelpCircle /> 验证说明
        </h4>
        <ul>
          <li>检查 JSON 语法是否正确</li>
          <li>检查是否包含无效值（undefined、NaN、Infinity）</li>
          <li>检查是否存在尾随逗号</li>
          <li>分析 JSON 结构（类型、大小、长度等）</li>
          <li>支持对象和数组格式</li>
        </ul>
      </div>
    </div>
  );
};

export default JsonValidator;
