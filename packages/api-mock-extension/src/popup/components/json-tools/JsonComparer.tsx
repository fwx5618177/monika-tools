import React, { useState, useCallback } from 'react';
import styles from '../../styles/pages/JsonToolsPage.module.scss';
import { compareJson, validateJson } from '@/utils/jsonUtils';
import {
  FiPlus,
  FiMinus,
  FiEdit2,
  FiCopy,
  FiEye,
  FiChevronRight,
  FiChevronDown,
  FiCheck,
  FiX,
} from 'react-icons/fi';

interface FullViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  path: string;
  value: any;
  type: 'added' | 'removed' | 'changed';
  oldValue?: any;
  newValue?: any;
}

const FullViewModal: React.FC<FullViewModalProps> = ({
  isOpen,
  onClose,
  path,
  value,
  type,
  oldValue,
  newValue,
}) => {
  if (!isOpen) return null;

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const formatValue = (val: any) => {
    try {
      if (typeof val === 'string') {
        return `"${val}"`;
      }
      return typeof val === 'object'
        ? JSON.stringify(val, null, 2)
        : String(val);
    } catch (e) {
      return String(val);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={handleModalClick}>
        <div className={styles.modalHeader}>
          <h3>完整路径和值</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.modalSection}>
            <h4>路径</h4>
            <div className={`${styles.pathDisplay} ${styles[type]}`}>
              {path}
            </div>
          </div>
          {type === 'changed' ? (
            <div className={styles.modalSection}>
              <div>
                <div className={`${styles.valueLabel} ${styles.oldValue}`}>
                  原始值
                </div>
                <pre className={`${styles.valueDisplay} ${styles.oldValue}`}>
                  {formatValue(oldValue)}
                </pre>
              </div>
              <div>
                <div className={`${styles.valueLabel} ${styles.newValue}`}>
                  新值
                </div>
                <pre className={`${styles.valueDisplay} ${styles.newValue}`}>
                  {formatValue(newValue)}
                </pre>
              </div>
            </div>
          ) : (
            <div className={styles.modalSection}>
              <h4>值</h4>
              <pre className={`${styles.valueDisplay} ${styles[type]}`}>
                {formatValue(value)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const JsonComparer: React.FC = () => {
  const [leftInput, setLeftInput] = useState('');
  const [rightInput, setRightInput] = useState('');
  const [diffs, setDiffs] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [fullViewData, setFullViewData] = useState<{
    isOpen: boolean;
    path: string;
    value: any;
    type: 'added' | 'removed' | 'changed';
    oldValue?: any;
    newValue?: any;
  }>({
    isOpen: false,
    path: '',
    value: null,
    type: 'added',
  });

  const handleCompare = useCallback(() => {
    if (!validateJson(leftInput) || !validateJson(rightInput)) {
      setError('请确保两侧都是有效的 JSON 格式');
      return;
    }

    try {
      const differences = compareJson(leftInput, rightInput);
      setDiffs(differences);
      setError('');
      // 默认展开所有差异
      setExpandedPaths(new Set(differences.map((d) => d.path)));
    } catch (err) {
      setError('比较过程中发生错误');
    }
  }, [leftInput, rightInput]);

  const handleClear = useCallback(() => {
    setLeftInput('');
    setRightInput('');
    setDiffs([]);
    setError('');
    setExpandedPaths(new Set());
    setCopiedPath(null);
  }, []);

  const handleCopy = useCallback(async (text: string, path: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 2000);
    } catch (err) {
      setError('复制到剪贴板失败');
    }
  }, []);

  const handleViewFull = useCallback((diff: any) => {
    setFullViewData({
      isOpen: true,
      path: diff.path,
      value: diff.type === 'changed' ? diff.newValue : diff.value,
      type: diff.type,
      oldValue: diff.type === 'changed' ? diff.oldValue : undefined,
      newValue: diff.type === 'changed' ? diff.newValue : diff.value,
    });
  }, []);

  const closeFullView = useCallback(() => {
    setFullViewData((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const togglePath = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const formatValue = useCallback((value: any): string => {
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    return JSON.stringify(value, null, 2);
  }, []);

  const formatPath = useCallback((path: string): string => {
    return path
      .replace(/\$/g, '')
      .replace(/\[(\d+)\]/g, '[$1]')
      .replace(/\./g, ' → ');
  }, []);

  const getDiffStats = useCallback(() => {
    return {
      added: diffs.filter((d) => d.type === 'added').length,
      removed: diffs.filter((d) => d.type === 'removed').length,
      changed: diffs.filter((d) => d.type === 'changed').length,
    };
  }, [diffs]);

  const stats = getDiffStats();

  return (
    <div>
      <div className={styles.toolbar}>
        <button
          className={styles.toolButton}
          onClick={handleCompare}
          title="比较两侧的 JSON"
        >
          比较
        </button>
        <button
          className={styles.toolButton}
          onClick={handleClear}
          title="清空内容"
        >
          清空
        </button>
      </div>

      <div className={styles.compareContainer}>
        <div className={styles.editorContainer} data-label="原始 JSON">
          <textarea
            className={styles.editor}
            value={leftInput}
            onChange={(e) => {
              setLeftInput(e.target.value);
              setError('');
              setDiffs([]);
            }}
            placeholder="在此输入第一个 JSON..."
            spellCheck={false}
          />
        </div>

        <div className={styles.editorContainer} data-label="比较 JSON">
          <textarea
            className={styles.editor}
            value={rightInput}
            onChange={(e) => {
              setRightInput(e.target.value);
              setError('');
              setDiffs([]);
            }}
            placeholder="在此输入第二个 JSON..."
            spellCheck={false}
          />
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {diffs.length > 0 && (
        <>
          <div className={styles.diffStats}>
            <div className={styles.statItem}>
              <span className={`${styles.statValue} ${styles.added}`}>
                {stats.added}
              </span>
              <span className={styles.statLabel}>新增</span>
            </div>
            <div className={styles.statItem}>
              <span className={`${styles.statValue} ${styles.removed}`}>
                {stats.removed}
              </span>
              <span className={styles.statLabel}>删除</span>
            </div>
            <div className={styles.statItem}>
              <span className={`${styles.statValue} ${styles.changed}`}>
                {stats.changed}
              </span>
              <span className={styles.statLabel}>修改</span>
            </div>
          </div>

          <div className={styles.diffResults}>
            <h3>
              差异对比结果
              <span className={styles.diffCount}>{diffs.length}</span>
            </h3>
            <ul className={styles.diffList}>
              {diffs.map((diff, index) => {
                const isExpanded = expandedPaths.has(diff.path);
                const isCopied = copiedPath === diff.path;
                return (
                  <li key={index} className={styles[diff.type]}>
                    <div className={styles.diffIcon}>
                      {diff.type === 'added' && <FiPlus />}
                      {diff.type === 'removed' && <FiMinus />}
                      {diff.type === 'changed' && <FiEdit2 />}
                    </div>
                    <div className={styles.diffContent}>
                      <div
                        className={styles.path}
                        onClick={() => togglePath(diff.path)}
                      >
                        {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                        <span>{formatPath(diff.path)}</span>
                      </div>
                      {isExpanded && (
                        <>
                          <div className={styles.diffValue}>
                            {diff.type === 'changed' ? (
                              <>
                                <span className={styles.oldValue}>
                                  {formatValue(diff.oldValue)}
                                </span>
                                <span className={styles.arrow}>→</span>
                                <span className={styles.newValue}>
                                  {formatValue(diff.newValue)}
                                </span>
                              </>
                            ) : diff.type === 'added' ? (
                              <span className={styles.newValue}>
                                {formatValue(diff.newValue)}
                              </span>
                            ) : (
                              <span className={styles.oldValue}>
                                {formatValue(diff.oldValue)}
                              </span>
                            )}
                          </div>
                          <div className={styles.diffActions}>
                            <button
                              className={styles.actionButton}
                              onClick={() =>
                                handleCopy(
                                  JSON.stringify(
                                    diff.type === 'changed'
                                      ? diff.newValue
                                      : diff.type === 'added'
                                        ? diff.newValue
                                        : diff.oldValue
                                  ),
                                  diff.path
                                )
                              }
                              title="复制值"
                            >
                              {isCopied ? <FiCheck /> : <FiCopy />}
                              {isCopied ? '已复制' : '复制'}
                            </button>
                            <button
                              className={styles.actionButton}
                              onClick={() => handleViewFull(diff)}
                              title="查看完整路径和值"
                            >
                              <FiEye />
                              查看完整
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
      <FullViewModal
        isOpen={fullViewData.isOpen}
        onClose={closeFullView}
        path={fullViewData.path}
        value={fullViewData.value}
        type={fullViewData.type}
        oldValue={fullViewData.oldValue}
        newValue={fullViewData.newValue}
      />
    </div>
  );
};

export default JsonComparer;
