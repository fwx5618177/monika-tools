import React, { useState } from 'react';
import styles from '../../styles/pages/JsonToolsPage.module.scss';
import { validateJson, formatJson } from '@/utils/jsonUtils';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  line?: number;
  column?: number;
  formattedJson?: string;
}

export const JsonValidator: React.FC = () => {
  const [input, setInput] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: false,
  });

  const handleValidate = () => {
    if (!input.trim()) {
      setValidationResult({
        isValid: false,
        error: '请输入要验证的 JSON',
      });
      return;
    }

    try {
      const result = validateJson(input);
      if (result.isValid) {
        setValidationResult({
          isValid: true,
          formattedJson: formatJson(input),
        });
      } else {
        setValidationResult(result);
      }
    } catch (err) {
      setValidationResult({
        isValid: false,
        error: '验证过程中发生错误',
      });
    }
  };

  const handleClear = () => {
    setInput('');
    setValidationResult({ isValid: false });
  };

  const handleFormat = () => {
    if (!input.trim()) {
      setValidationResult({
        isValid: false,
        error: '请输入要格式化的 JSON',
      });
      return;
    }

    try {
      const formatted = formatJson(input);
      setInput(formatted);
      setValidationResult({
        isValid: true,
        formattedJson: formatted,
      });
    } catch (err) {
      setValidationResult({
        isValid: false,
        error: '格式化失败，请检查 JSON 格式是否正确',
      });
    }
  };

  return (
    <div>
      <div className={styles.toolbar}>
        <button
          className={styles.toolButton}
          onClick={handleValidate}
          title="验证 JSON"
        >
          验证
        </button>
        <button
          className={styles.toolButton}
          onClick={handleFormat}
          title="格式化 JSON"
        >
          格式化
        </button>
        <button
          className={styles.toolButton}
          onClick={handleClear}
          title="清空内容"
        >
          清空
        </button>
      </div>

      <div className={styles.validatorContainer}>
        <div className={styles.editorContainer}>
          <textarea
            className={`${styles.editor} ${
              validationResult.isValid === false && input
                ? styles.errorEditor
                : ''
            }`}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setValidationResult({ isValid: false });
            }}
            placeholder="在此输入要验证的 JSON..."
            spellCheck={false}
          />
        </div>

        <div className={styles.validationResult}>
          {input && (
            <div
              className={`${styles.resultStatus} ${
                validationResult.isValid ? styles.valid : styles.invalid
              }`}
            >
              {validationResult.isValid ? (
                <>
                  <span className={styles.icon}>✓</span>
                  JSON 格式有效
                </>
              ) : (
                <>
                  <span className={styles.icon}>✗</span>
                  JSON 格式无效
                </>
              )}
            </div>
          )}

          {validationResult.error && (
            <div className={styles.errorDetails}>
              <h4>错误信息：</h4>
              <p>{validationResult.error}</p>
              {validationResult.line && validationResult.column && (
                <p>
                  位置：第 {validationResult.line} 行，第{' '}
                  {validationResult.column} 列
                </p>
              )}
            </div>
          )}

          {validationResult.isValid && (
            <div className={styles.validDetails}>
              <h4>验证通过</h4>
              <p>JSON 格式正确，可以放心使用。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
