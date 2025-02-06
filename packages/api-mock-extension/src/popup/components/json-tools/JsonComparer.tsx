import React, { useState } from 'react';
import styles from '../../styles/pages/JsonToolsPage.module.scss';
import { compareJson, validateJson } from '@/utils/jsonUtils';

export const JsonComparer: React.FC = () => {
  const [leftInput, setLeftInput] = useState('');
  const [rightInput, setRightInput] = useState('');
  const [diffs, setDiffs] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleCompare = () => {
    if (!validateJson(leftInput) || !validateJson(rightInput)) {
      setError('请确保两侧都是有效的 JSON 格式');
      return;
    }

    try {
      const differences = compareJson(leftInput, rightInput);
      setDiffs(differences);
      setError('');
    } catch (err) {
      setError('比较过程中发生错误');
    }
  };

  const handleClear = () => {
    setLeftInput('');
    setRightInput('');
    setDiffs([]);
    setError('');
  };

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
        <div className={styles.editorContainer}>
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

        <div className={styles.editorContainer}>
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
        <div className={styles.diffResults}>
          <h3>差异对比结果：</h3>
          <ul className={styles.diffList}>
            {diffs.map((diff, index) => (
              <li key={index} className={styles[diff.type]}>
                <span className={styles.path}>{diff.path}</span>
                {diff.type === 'changed' ? (
                  <>
                    <span className={styles.oldValue}>
                      {JSON.stringify(diff.oldValue)}
                    </span>
                    <span className={styles.arrow}>→</span>
                    <span className={styles.newValue}>
                      {JSON.stringify(diff.newValue)}
                    </span>
                  </>
                ) : diff.type === 'added' ? (
                  <span className={styles.newValue}>
                    新增: {JSON.stringify(diff.newValue)}
                  </span>
                ) : (
                  <span className={styles.oldValue}>
                    删除: {JSON.stringify(diff.oldValue)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
