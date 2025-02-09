import React, { useState, useCallback, useRef, useEffect } from 'react';
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

interface ValidationError {
  line: number;
  column: number;
  message: string;
  length?: number;
}

interface ValidationResult {
  isValid: boolean;
  details: {
    type: 'info' | 'error';
    message: string;
  }[];
  error?: ValidationError;
}

export const JsonValidator: React.FC = () => {
  const [input, setInput] = useState('');
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [errorHighlight, setErrorHighlight] = useState<{
    start: number;
    end: number;
  } | null>(null);

  const getPositionFromLineAndColumn = (
    text: string,
    line: number,
    column: number
  ): number => {
    const lines = text.split('\n');
    let position = 0;
    for (let i = 0; i < line - 1; i++) {
      position += lines[i].length + 1; // +1 for newline character
    }
    return position + column - 1;
  };

  const validateInput = useCallback((jsonString: string): ValidationResult => {
    const details = [];
    let isValid = true;
    let error: ValidationError | undefined;

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
      const checkPattern = (pattern: RegExp, message: string): void => {
        const match = pattern.exec(jsonString);
        if (match) {
          const lines = jsonString.substring(0, match.index).split('\n');
          const line = lines.length;
          const column =
            match.index - jsonString.lastIndexOf('\n', match.index);
          error = {
            line,
            column,
            message,
            length: match[0].length,
          };
          details.push({
            type: 'error' as const,
            message: `${message} (行 ${line}, 列 ${column})`,
          });
          isValid = false;
        }
      };

      checkPattern(/undefined/g, '包含未定义值 (undefined)');
      checkPattern(/NaN/g, '包含非数字值 (NaN)');
      checkPattern(/Infinity/g, '包含无限值 (Infinity)');
      checkPattern(/,\s*[}\]]/g, '包含尾随逗号');

      return {
        isValid,
        details,
        error,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      const match = errorMessage.match(/at position (\d+)/);

      if (match) {
        const position = parseInt(match[1], 10);
        const lines = jsonString.substring(0, position).split('\n');
        const line = lines.length;
        const column = position - jsonString.lastIndexOf('\n', position);

        error = {
          line,
          column,
          message: errorMessage,
        };
      }

      return {
        isValid: false,
        details: [
          {
            type: 'error',
            message: `解析错误: ${errorMessage} ${error ? `(行 ${error.line}, 列 ${error.column})` : ''}`,
          },
        ],
        error,
      };
    }
  }, []);

  const handleValidate = useCallback(() => {
    const result = validateInput(input);
    setValidationResult(result);

    if (result.error && editorRef.current) {
      const { line, column, length = 1 } = result.error;
      const start = getPositionFromLineAndColumn(input, line, column);
      setErrorHighlight({ start, end: start + length });

      // 滚动到错误位置
      const textArea = editorRef.current;
      const lineHeight = parseInt(
        getComputedStyle(textArea).lineHeight || '20'
      );
      const scrollTop = (line - 1) * lineHeight;
      textArea.scrollTop = scrollTop;
    } else {
      setErrorHighlight(null);
    }
  }, [input, validateInput]);

  const handleClear = useCallback(() => {
    setInput('');
    setValidationResult(null);
    setErrorHighlight(null);
  }, []);

  const formatJson = useCallback(() => {
    try {
      const formatted = JSON.stringify(JSON.parse(input), null, 2);
      setInput(formatted);
      setValidationResult(null);
      setErrorHighlight(null);
    } catch (err) {
      // 如果格式化失败，保持原样
    }
  }, [input]);

  useEffect(() => {
    if (errorHighlight && editorRef.current) {
      const textArea = editorRef.current;
      textArea.focus();
      textArea.setSelectionRange(errorHighlight.start, errorHighlight.end);
    }
  }, [errorHighlight]);

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
          ref={editorRef}
          className={`${styles.editor} ${validationResult?.isValid === false ? styles.error : ''} ${errorHighlight ? styles.hasError : ''}`}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setValidationResult(null);
            setErrorHighlight(null);
          }}
          placeholder="在此输入要验证的 JSON..."
          spellCheck={false}
          style={{
            // 添加行号
            backgroundImage: input
              ? `linear-gradient(transparent 0%, transparent 100%), linear-gradient(transparent ${errorHighlight ? '0%' : '100%'}, rgba(255, 0, 0, 0.1) ${errorHighlight ? '0%' : '100%'})`
              : 'none',
            backgroundSize: input ? '100% 100%, 100% 100%' : 'auto',
            backgroundPosition: input
              ? `0 0, 0 ${errorHighlight ? `${(errorHighlight.start / input.length) * 100}%` : '0'}`
              : '0 0',
          }}
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
                className={`${styles.resultItem} ${detail.type === 'error' ? styles.errorItem : styles.infoItem}`}
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
          <li>错误位置精确标注和高亮显示</li>
        </ul>
      </div>
    </div>
  );
};

export default JsonValidator;
