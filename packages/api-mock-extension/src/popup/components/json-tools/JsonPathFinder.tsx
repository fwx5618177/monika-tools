import React, { useState, useCallback, useEffect } from 'react';
import styles from '../../styles/components/JsonTools.module.scss';
import {
  FiSearch,
  FiCopy,
  FiCheck,
  FiRotateCcw,
  FiHelpCircle,
  FiAlertCircle,
  FiCheckCircle,
  FiKey,
  FiHash,
  FiCode,
} from 'react-icons/fi';
import { validateJson } from '@/utils/jsonUtils';
import jsonpath from 'jsonpath';

interface PathResult {
  path: string;
  value: any;
  type: string;
}

type SearchMode = 'path' | 'key' | 'value';

interface SearchResult {
  path: string;
  value: any;
  type: string;
}

interface CopyState {
  [key: string]: boolean;
}

export const JsonPathFinder: React.FC = () => {
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('path');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [dynamicExamples, setDynamicExamples] = useState<PathResult[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copyStates, setCopyStates] = useState<CopyState>({});

  // 生成动态示例
  const generateDynamicExamples = useCallback((jsonData: any) => {
    try {
      const examples: PathResult[] = [];
      const addExample = (path: string, value: any) => {
        examples.push({
          path,
          value,
          type: Array.isArray(value) ? 'array' : typeof value,
        });
      };

      // 遍历 JSON 生成示例
      const traverse = (obj: any, currentPath: string = '$') => {
        if (Array.isArray(obj)) {
          addExample(currentPath, obj);
          if (obj.length > 0) {
            // 数组的第一个元素
            addExample(`${currentPath}[0]`, obj[0]);
            // 数组的所有元素
            addExample(`${currentPath}[*]`, obj);
          }
        } else if (typeof obj === 'object' && obj !== null) {
          Object.entries(obj).forEach(([key, value]) => {
            const newPath =
              currentPath === '$' ? `$.${key}` : `${currentPath}.${key}`;
            addExample(newPath, value);
            traverse(value, newPath);
          });
        }
      };

      traverse(jsonData);
      setDynamicExamples(examples.slice(0, 6)); // 只显示前6个示例
    } catch (err) {
      console.error('生成示例失败:', err);
    }
  }, []);

  // 当输入的 JSON 改变时更新动态示例
  useEffect(() => {
    if (input && validateJson(input).isValid) {
      try {
        const jsonData = JSON.parse(input);
        generateDynamicExamples(jsonData);
      } catch (err) {
        console.error('解析 JSON 失败:', err);
      }
    }
  }, [input, generateDynamicExamples]);

  // 判断是否为原始值类型
  const isPrimitiveValue = (value: any): boolean => {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null
    );
  };

  // 搜索 JSON
  const searchJson = useCallback(() => {
    if (!input.trim()) {
      setError('请输入 JSON 数据');
      return;
    }

    if (!searchTerm.trim()) {
      setError('请输入搜索内容');
      return;
    }

    if (!validateJson(input)) {
      setError('请输入有效的 JSON 格式');
      return;
    }

    try {
      const json = JSON.parse(input);
      const foundResults: SearchResult[] = [];

      if (searchMode === 'path') {
        try {
          // 使用 JSONPath 进行查询
          const result = jsonpath.query(json, searchTerm);
          if (result.length > 0) {
            foundResults.push({
              path: searchTerm,
              value: result,
              type: Array.isArray(result) ? 'array' : typeof result,
            });
          }
        } catch (err) {
          setError('JSONPath 表达式无效');
          return;
        }
      } else {
        // 用于存储已经找到的路径，避免重复
        const foundPaths = new Set<string>();

        const traverse = (obj: any, path: string = '$') => {
          if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
              if (searchMode === 'value' && isPrimitiveValue(item)) {
                const stringValue = String(item).toLowerCase();
                const searchValue = searchTerm.toLowerCase();
                if (stringValue.includes(searchValue)) {
                  const resultPath = `${path}[${index}]`;
                  if (!foundPaths.has(resultPath)) {
                    foundPaths.add(resultPath);
                    foundResults.push({
                      path: resultPath,
                      value: item,
                      type: typeof item,
                    });
                  }
                }
              }
              traverse(item, `${path}[${index}]`);
            });
          } else if (typeof obj === 'object' && obj !== null) {
            Object.entries(obj).forEach(([key, value]) => {
              const currentPath =
                path === '$' ? `${path}.${key}` : `${path}.${key}`;

              // 键名搜索
              if (
                searchMode === 'key' &&
                key.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                if (!foundPaths.has(currentPath)) {
                  foundPaths.add(currentPath);
                  foundResults.push({
                    path: currentPath,
                    value: value,
                    type: Array.isArray(value) ? 'array' : typeof value,
                  });
                }
              }

              // 值搜索
              if (searchMode === 'value') {
                if (isPrimitiveValue(value)) {
                  const stringValue = String(value).toLowerCase();
                  const searchValue = searchTerm.toLowerCase();
                  if (stringValue.includes(searchValue)) {
                    if (!foundPaths.has(currentPath)) {
                      foundPaths.add(currentPath);
                      foundResults.push({
                        path: currentPath,
                        value: value,
                        type: typeof value,
                      });
                    }
                  }
                }
              }

              traverse(value, currentPath);
            });
          }
        };

        traverse(json);
      }

      setResults(foundResults);
      setError('');

      if (foundResults.length === 0) {
        setError('未找到匹配结果');
      }
    } catch (err) {
      setError('搜索过程中发生错误');
    }
  }, [input, searchTerm, searchMode]);

  const handleModeChange = (mode: SearchMode) => {
    setSearchMode(mode);
    setResults([]);
    setError('');
    setSearchTerm('');
  };

  const handleCopy = useCallback(async (path: string, value: any) => {
    try {
      const textToCopy =
        typeof value === 'string' ? value : JSON.stringify(value, null, 2);
      await navigator.clipboard.writeText(textToCopy);

      // 更新特定路径的复制状态
      setCopyStates((prev) => ({ ...prev, [path]: true }));

      // 2秒后重置该路径的复制状态
      setTimeout(() => {
        setCopyStates((prev) => ({ ...prev, [path]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const handleClear = useCallback(() => {
    setInput('');
    setSearchTerm('');
    setResults([]);
    setError('');
    setSuccess(false);
    setDynamicExamples([]);
  }, []);

  const handleExampleClick = useCallback((example: PathResult) => {
    setSearchTerm(example.path);
    setSearchMode('path');
    setError('');
  }, []);

  const renderResults = () => {
    if (!results.length) {
      return <div className={styles.placeholder}>无搜索结果</div>;
    }

    return (
      <div className={styles.resultsList}>
        {results.map((result, index) => (
          <div key={`${result.path}-${index}`} className={styles.resultItem}>
            <div className={styles.resultPath}>
              <code>{result.path}</code>
              <button
                className={`${styles.copyButton} ${copyStates[result.path] ? styles.success : ''}`}
                onClick={() => handleCopy(result.path, result.value)}
                title="复制值"
              >
                {copyStates[result.path] ? <FiCheck /> : <FiCopy />}
              </button>
            </div>
            <div className={styles.resultValue}>
              <pre>
                {typeof result.value === 'string'
                  ? result.value
                  : JSON.stringify(result.value, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.searchModeGroup}>
          <button
            className={`${styles.modeButton} ${searchMode === 'path' ? styles.active : ''}`}
            onClick={() => handleModeChange('path')}
            title="使用 JSONPath 表达式查询"
          >
            <FiCode /> JSONPath
          </button>
          <button
            className={`${styles.modeButton} ${searchMode === 'key' ? styles.active : ''}`}
            onClick={() => handleModeChange('key')}
            title="搜索键名"
          >
            <FiKey /> 键名
          </button>
          <button
            className={`${styles.modeButton} ${searchMode === 'value' ? styles.active : ''}`}
            onClick={() => handleModeChange('value')}
            title="搜索值"
          >
            <FiHash /> 值
          </button>
        </div>

        <input
          type="text"
          className={styles.pathInput}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setError('');
          }}
          placeholder={
            searchMode === 'path'
              ? '输入 JSONPath 表达式，例如: $.store.book[*].author'
              : searchMode === 'key'
                ? '输入要搜索的键名'
                : '输入要搜索的值'
          }
        />

        <button
          className={styles.primaryButton}
          onClick={searchJson}
          disabled={!input || !searchTerm}
        >
          <FiSearch /> 搜索
        </button>

        <button
          className={styles.toolButton}
          onClick={handleClear}
          disabled={!input && !searchTerm && results.length === 0}
        >
          <FiRotateCcw /> 清空
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
            }}
            placeholder="在此输入 JSON 数据..."
            spellCheck={false}
          />
        </div>

        <div className={styles.resultsContainer}>{renderResults()}</div>
      </div>

      {dynamicExamples.length > 0 && (
        <div className={styles.helpPanel}>
          <h4>
            <FiHelpCircle /> 从当前 JSON 中检测到的示例
          </h4>
          <div className={styles.examples}>
            {dynamicExamples.map((example, index) => (
              <button
                key={index}
                className={styles.exampleButton}
                onClick={() => handleExampleClick(example)}
              >
                <code>{example.path}</code>
                <span>{JSON.stringify(example.value).slice(0, 30)}...</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.helpPanel}>
        <h4>
          <FiHelpCircle /> 语法说明
        </h4>
        <div className={styles.syntaxGrid}>
          <div className={styles.syntaxItem}>
            <code>$</code>
            <span>根节点</span>
          </div>
          <div className={styles.syntaxItem}>
            <code>.</code>
            <span>子节点</span>
          </div>
          <div className={styles.syntaxItem}>
            <code>[]</code>
            <span>数组下标</span>
          </div>
          <div className={styles.syntaxItem}>
            <code>[*]</code>
            <span>所有数组元素</span>
          </div>
          <div className={styles.syntaxItem}>
            <code>[start:end]</code>
            <span>数组切片</span>
          </div>
          <div className={styles.syntaxItem}>
            <code>[?(@.key)]</code>
            <span>过滤表达式</span>
          </div>
        </div>
      </div>
    </div>
  );
};
