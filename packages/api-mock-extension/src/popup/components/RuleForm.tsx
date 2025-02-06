import React, { useState } from 'react';
import type { MockRule } from '../../background/interfaces/types';
import styles from '@/popup/styles/components/RuleForm.module.scss';

interface RuleFormProps {
  onSubmit: (rule: MockRule) => void;
  onCancel: () => void;
}

export const RuleForm: React.FC<RuleFormProps> = ({ onSubmit, onCancel }) => {
  const [rule, setRule] = useState<Partial<MockRule>>({
    method: 'GET',
    url: '',
    statusCode: 200,
    response: '',
    enabled: true,
    delay: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newRule: MockRule = {
        ...(rule as MockRule),
        id: crypto.randomUUID(),
        response: JSON.parse(rule.response as string),
      };
      onSubmit(newRule);
    } catch (error) {
      alert('Invalid JSON response');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Method:</label>
        <select
          value={rule.method}
          onChange={(e) =>
            setRule({ ...rule, method: e.target.value as MockRule['method'] })
          }
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
          <option value="PATCH">PATCH</option>
        </select>
      </div>

      <div className={styles.field}>
        <label>URL Pattern:</label>
        <input
          type="text"
          value={rule.url}
          onChange={(e) => setRule({ ...rule, url: e.target.value })}
          placeholder="URL or regex pattern"
          required
        />
      </div>

      <div className={styles.field}>
        <label>Status Code:</label>
        <input
          type="number"
          value={rule.statusCode}
          onChange={(e) =>
            setRule({ ...rule, statusCode: parseInt(e.target.value) })
          }
          min="100"
          max="599"
          required
        />
      </div>

      <div className={styles.field}>
        <label>Delay (ms):</label>
        <input
          type="number"
          value={rule.delay}
          onChange={(e) =>
            setRule({ ...rule, delay: parseInt(e.target.value) })
          }
          min="0"
          required
        />
      </div>

      <div className={styles.field}>
        <label>Response (JSON):</label>
        <textarea
          value={rule.response as string}
          onChange={(e) => setRule({ ...rule, response: e.target.value })}
          placeholder="Enter JSON response"
          required
        />
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton}>
          Add Rule
        </button>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
