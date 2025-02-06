import React, { useState } from 'react';
import styles from '../styles/pages/JsonToolsPage.module.scss';
import { JsonFormatter } from '../components/json-tools/JsonFormatter';
import { JsonComparer } from '../components/json-tools/JsonComparer';
import { JsonConverter } from '../components/json-tools/JsonConverter';
import { JsonPathFinder } from '../components/json-tools/JsonPathFinder';
import { JsonValidator } from '../components/json-tools/JsonValidator';

type Tool = {
  id: string;
  name: string;
  description: string;
  icon: string;
  component: React.FC;
};

const tools: Tool[] = [
  {
    id: 'formatter',
    name: 'JSON 格式化',
    description: '格式化和美化 JSON 数据',
    icon: '🎨',
    component: JsonFormatter,
  },
  {
    id: 'comparer',
    name: 'JSON 比较',
    description: '比较两个 JSON 的差异',
    icon: '🔍',
    component: JsonComparer,
  },
  {
    id: 'converter',
    name: 'JSON 转换',
    description: '转换 JSON 为 YAML 或 XML',
    icon: '🔄',
    component: JsonConverter,
  },
  {
    id: 'pathFinder',
    name: 'JSON Path',
    description: '使用 JSONPath 查找和提取值',
    icon: '🔎',
    component: JsonPathFinder,
  },
  {
    id: 'validator',
    name: 'JSON 验证',
    description: '验证 JSON 格式并显示错误信息',
    icon: '✅',
    component: JsonValidator,
  },
];

export const JsonToolsPage: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<Tool>(tools[0]);

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const SelectedComponent = selectedTool.component;

  return (
    <div className={styles.page}>
      <div className={styles.toolList}>
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`${styles.toolCard} ${
              selectedTool.id === tool.id ? styles.active : ''
            }`}
            onClick={() => handleToolSelect(tool)}
          >
            <span className={styles.toolIcon}>{tool.icon}</span>
            <div className={styles.toolInfo}>
              <h3>{tool.name}</h3>
              <p>{tool.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className={styles.toolContent}>
        <SelectedComponent />
      </div>
    </div>
  );
};
