import React, { useState } from 'react';
import styles from '../styles/pages/WebCrawlerPage.module.scss';
import { TextCrawler } from '../components/web-crawler/TextCrawler';
import { LinkCrawler } from '../components/web-crawler/LinkCrawler';
import { ImageCrawler } from '../components/web-crawler/ImageCrawler';
import { RichTextCrawler } from '../components/web-crawler/RichTextCrawler';
import { VideoCrawler } from '../components/web-crawler/VideoCrawler';
import { DataCrawler } from '../components/web-crawler/DataCrawler';
import {
  FiType,
  FiImage,
  FiFileText,
  FiVideo,
  FiDatabase,
  FiArrowLeft,
  FiLink,
} from 'react-icons/fi';

type CrawlerType = 'text' | 'link' | 'image' | 'richText' | 'video' | 'data';

interface CrawlerOption {
  id: CrawlerType;
  name: string;
  description: string;
  icon: React.ReactNode;
  component: React.FC;
}

const crawlerOptions: CrawlerOption[] = [
  {
    id: 'text',
    name: '文本爬虫',
    description: '提取网页中的纯文本内容，支持选择器和正则匹配',
    icon: <FiType size={24} />,
    component: TextCrawler,
  },
  {
    id: 'link',
    name: '链接爬虫',
    description: '提取和分析页面中的所有链接，支持多级爬取',
    icon: <FiLink size={24} />,
    component: LinkCrawler,
  },
  {
    id: 'image',
    name: '图片爬虫',
    description: '批量下载网页中的图片，支持筛选和自动重命名',
    icon: <FiImage size={24} />,
    component: ImageCrawler,
  },
  {
    id: 'richText',
    name: '富文本爬虫',
    description: '提取保留格式的文本内容，包括标题、列表等结构',
    icon: <FiFileText size={24} />,
    component: RichTextCrawler,
  },
  {
    id: 'video',
    name: '视频爬虫',
    description: '下载网页中的视频资源，支持多种视频格式',
    icon: <FiVideo size={24} />,
    component: VideoCrawler,
  },
  {
    id: 'data',
    name: '数据爬虫',
    description: '提取结构化数据，如表格、JSON、API响应等',
    icon: <FiDatabase size={24} />,
    component: DataCrawler,
  },
];

export const WebCrawlerPage: React.FC = () => {
  const [selectedCrawler, setSelectedCrawler] = useState<CrawlerOption | null>(
    null
  );

  const handleBack = () => {
    setSelectedCrawler(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {selectedCrawler ? (
          <>
            <button className={styles.backButton} onClick={handleBack}>
              <FiArrowLeft size={20} />
            </button>
            <h2>{selectedCrawler.name}</h2>
          </>
        ) : (
          <h2>网页爬虫</h2>
        )}
      </div>

      {!selectedCrawler ? (
        <div className={styles.optionsGrid}>
          {crawlerOptions.map((option) => (
            <button
              key={option.id}
              className={styles.optionCard}
              onClick={() => setSelectedCrawler(option)}
            >
              <div className={styles.optionIcon}>{option.icon}</div>
              <div className={styles.optionInfo}>
                <h3>{option.name}</h3>
                <p>{option.description}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.crawlerContent}>
          <selectedCrawler.component />
        </div>
      )}
    </div>
  );
};

export default WebCrawlerPage;
