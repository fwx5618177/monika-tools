import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/pages/JsonToolsPage.module.scss';
import { JsonFormatter } from '../components/json-tools/JsonFormatter';
import { JsonComparer } from '../components/json-tools/JsonComparer';
import { JsonConverter } from '../components/json-tools/JsonConverter';
import { JsonPathFinder } from '../components/json-tools/JsonPathFinder';
import { JsonValidator } from '../components/json-tools/JsonValidator';
import {
  FiCode,
  FiGitBranch,
  FiRefreshCw,
  FiSearch,
  FiCheckCircle,
  FiArrowLeft,
} from 'react-icons/fi';

type Tool = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  component: React.FC;
};

const tools: Tool[] = [
  {
    id: 'formatter',
    name: 'JSON 格式化',
    description: '格式化和美化 JSON 数据，支持折叠展开和键值分析',
    icon: <FiCode size={24} color="#0066FF" />,
    component: JsonFormatter,
  },
  {
    id: 'comparer',
    name: 'JSON 比较',
    description: '比较两个 JSON 的差异，高亮显示变更',
    icon: <FiGitBranch size={24} color="#00C7FF" />,
    component: JsonComparer,
  },
  {
    id: 'converter',
    name: 'JSON 转换',
    description: '转换 JSON 为 YAML 或 XML 格式',
    icon: <FiRefreshCw size={24} color="#48BB78" />,
    component: JsonConverter,
  },
  {
    id: 'pathFinder',
    name: 'JSON Path',
    description: '使用 JSONPath 查找和提取特定值',
    icon: <FiSearch size={24} color="#ECC94B" />,
    component: JsonPathFinder,
  },
  {
    id: 'validator',
    name: 'JSON 验证',
    description: '验证 JSON 格式并显示详细错误信息',
    icon: <FiCheckCircle size={24} color="#E53E3E" />,
    component: JsonValidator,
  },
];

export const JsonToolsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = React.useState<Tool | null>(null);

  const handleToolSelect = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleBack = () => {
    if (selectedTool) {
      setSelectedTool(null);
    } else {
      navigate('/');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <FiArrowLeft size={20} />
        </button>
        <h2>{selectedTool ? selectedTool.name : 'JSON 工具'}</h2>
      </div>

      {!selectedTool ? (
        <div className={styles.toolGrid}>
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={styles.toolCard}
              onClick={() => handleToolSelect(tool)}
            >
              <div className={styles.toolIcon}>{tool.icon}</div>
              <div className={styles.toolInfo}>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.toolContent}>
          <selectedTool.component />
        </div>
      )}
    </div>
  );
};
