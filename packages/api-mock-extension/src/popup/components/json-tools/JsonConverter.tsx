import React, { useState, useCallback } from 'react';
import styles from '../../styles/components/JsonTools.module.scss';
import {
  FiCopy,
  FiCheck,
  FiRotateCcw,
  FiCode,
  FiHelpCircle,
  FiAlertCircle,
  FiCheckCircle,
  FiRefreshCw,
} from 'react-icons/fi';
import { validateJson } from '@/utils/jsonUtils';
import { stringify as stringifyYaml } from 'yaml';
import { js2xml } from 'xml-js';

type ConversionType = 'yaml' | 'xml';

interface ConversionOption {
  value: ConversionType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const conversionOptions: ConversionOption[] = [
  {
    value: 'yaml',
    label: 'YAML',
    description: '转换为 YAML 格式',
    icon: <FiCode />,
  },
  {
    value: 'xml',
    label: 'XML',
    description: '转换为 XML 格式',
    icon: <FiRefreshCw />,
  },
];

export const JsonConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [conversionType, setConversionType] = useState<ConversionType>('yaml');
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleConvert = useCallback(() => {
    const validation = validateJson(input);
    if (!validation.isValid) {
      setError('请输入有效的 JSON 格式');
      return;
    }

    try {
      const parsedJson = JSON.parse(input);
      let result = '';

      switch (conversionType) {
        case 'yaml':
          result = stringifyYaml(parsedJson, {
            indent: 2,
            lineWidth: -1,
          });
          break;
        case 'xml':
          // 为 XML 转换准备数据结构
          const xmlData = {
            _declaration: {
              _attributes: {
                version: '1.0',
                encoding: 'utf-8',
              },
            },
            root: parsedJson,
          };

          result = js2xml(xmlData, {
            compact: true,
            spaces: 2,
            fullTagEmptyElement: true,
          });
          break;
      }

      setOutput(result);
      setError('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError('转换失败，请检查输入格式');
      setOutput('');
    }
  }, [input, conversionType]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('复制到剪贴板失败');
    }
  }, [output]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setError('');
    setSuccess(false);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <select
          className={styles.select}
          value={conversionType}
          onChange={(e) => setConversionType(e.target.value as ConversionType)}
        >
          {conversionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          className={styles.primaryButton}
          onClick={handleConvert}
          disabled={!input}
        >
          <FiRefreshCw />
          转换
        </button>
        <button
          className={styles.toolButton}
          onClick={handleClear}
          disabled={!input && !output}
        >
          <FiRotateCcw />
          清空
        </button>
      </div>

      <div className={styles.splitView}>
        <div className={styles.editorContainer}>
          <textarea
            className={`${styles.editor} ${error ? styles.error : ''}`}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
              setSuccess(false);
            }}
            placeholder="在此输入 JSON..."
            spellCheck={false}
          />
        </div>

        <div className={styles.editorContainer}>
          <textarea
            className={styles.editor}
            value={output}
            readOnly
            placeholder={`转换为 ${conversionType.toUpperCase()} 的结果将显示在这里...`}
            spellCheck={false}
          />
          {output && (
            <button
              className={`${styles.copyButton} ${copied ? styles.success : ''}`}
              onClick={handleCopy}
              title="复制到剪贴板"
            >
              {copied ? <FiCheck /> : <FiCopy />}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <FiAlertCircle /> {error}
        </div>
      )}

      {success && !error && (
        <div className={styles.success}>
          <FiCheckCircle /> 转换成功
        </div>
      )}

      <div className={styles.helpPanel}>
        <h4>
          <FiHelpCircle /> 功能说明
        </h4>
        <ul>
          {conversionOptions.map((option) => (
            <li key={option.value}>
              {option.icon} {option.description}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.helpPanel}>
        <h4>
          <FiHelpCircle /> 使用说明
        </h4>
        <ul>
          <li>输入必须是有效的 JSON 格式</li>
          <li>YAML 转换支持复杂的数据结构</li>
          <li>YAML 转换会保持数据的层级关系</li>
          <li>XML 转换会自动添加 XML 声明</li>
          <li>XML 转换支持数组和嵌套对象</li>
        </ul>
      </div>
    </div>
  );
};

export default JsonConverter;
