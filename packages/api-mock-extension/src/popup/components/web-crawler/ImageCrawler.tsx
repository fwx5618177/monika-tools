import React, { useState, useCallback } from 'react';
import styles from '../../styles/components/WebCrawler.module.scss';
import {
  FiImage,
  FiDownload,
  FiFilter,
  FiRotateCcw,
  FiHelpCircle,
  FiAlertCircle,
  FiCheckCircle,
  FiSettings,
} from 'react-icons/fi';

interface ImageResult {
  url: string;
  alt: string;
  size: string;
  type: string;
  filename: string;
}

interface FilterOptions {
  minWidth: number;
  minHeight: number;
  types: string[];
  excludeBase64: boolean;
}

export const ImageCrawler: React.FC = () => {
  const [selector, setSelector] = useState('');
  const [results, setResults] = useState<ImageResult[]>([]);
  const [error, setError] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minWidth: 100,
    minHeight: 100,
    types: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    excludeBase64: true,
  });

  const handleCrawl = useCallback(async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab.id) {
        throw new Error('No active tab found');
      }

      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'CRAWL_IMAGES',
        payload: {
          selector,
          options: filterOptions,
        },
      });

      if (response.error) {
        setError(response.error);
        return;
      }

      setResults(response);
      setError('');
      setSelectedImages(new Set());
    } catch (err) {
      setError('图片提取失败，请检查页面是否加载完成');
    }
  }, [selector, filterOptions]);

  const handleDownload = useCallback(async () => {
    const imagesToDownload = results.filter((img) =>
      selectedImages.has(img.url)
    );
    if (imagesToDownload.length === 0) return;

    try {
      for (const image of imagesToDownload) {
        const response = await fetch(image.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = image.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
      setError('');
    } catch (err) {
      setError('下载图片失败');
    }
  }, [results, selectedImages]);

  const handleClear = useCallback(() => {
    setSelector('');
    setResults([]);
    setError('');
    setSelectedImages(new Set());
  }, []);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const toggleImageSelection = (url: string) => {
    const newSelection = new Set(selectedImages);
    if (newSelection.has(url)) {
      newSelection.delete(url);
    } else {
      newSelection.add(url);
    }
    setSelectedImages(newSelection);
  };

  const selectAllImages = () => {
    if (selectedImages.size === results.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(results.map((img) => img.url)));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.input}
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          placeholder="输入CSS选择器，例如: img, .gallery img"
        />
        <button
          className={styles.primaryButton}
          onClick={handleCrawl}
          disabled={!selector}
        >
          <FiImage />
          提取图片
        </button>
        <button
          className={styles.toolButton}
          onClick={handleClear}
          disabled={!selector && results.length === 0}
        >
          <FiRotateCcw />
          清空
        </button>
        <button
          className={`${styles.toolButton} ${showOptions ? styles.active : ''}`}
          onClick={toggleOptions}
        >
          <FiSettings />
          选项
        </button>
      </div>

      {showOptions && (
        <div className={styles.optionsPanel}>
          <div className={styles.optionGroup}>
            <h4>尺寸限制</h4>
            <div className={styles.optionRow}>
              <label>最小宽度：</label>
              <input
                type="number"
                className={styles.input}
                value={filterOptions.minWidth}
                onChange={(e) =>
                  setFilterOptions({
                    ...filterOptions,
                    minWidth: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
              />
              <label>最小高度：</label>
              <input
                type="number"
                className={styles.input}
                value={filterOptions.minHeight}
                onChange={(e) =>
                  setFilterOptions({
                    ...filterOptions,
                    minHeight: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
              />
            </div>
          </div>

          <div className={styles.optionGroup}>
            <h4>图片类型</h4>
            {['jpg', 'jpeg', 'png', 'gif', 'webp'].map((type) => (
              <label key={type} className={styles.optionLabel}>
                <input
                  type="checkbox"
                  checked={filterOptions.types.includes(type)}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...filterOptions.types, type]
                      : filterOptions.types.filter((t) => t !== type);
                    setFilterOptions({ ...filterOptions, types: newTypes });
                  }}
                />
                {type.toUpperCase()}
              </label>
            ))}
          </div>

          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={filterOptions.excludeBase64}
                onChange={(e) =>
                  setFilterOptions({
                    ...filterOptions,
                    excludeBase64: e.target.checked,
                  })
                }
              />
              排除 Base64 图片
            </label>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <FiAlertCircle /> {error}
        </div>
      )}

      {results.length > 0 && (
        <div className={styles.results}>
          <div className={styles.toolbar}>
            <button className={styles.toolButton} onClick={selectAllImages}>
              {selectedImages.size === results.length ? '取消全选' : '全选'}
            </button>
            <button
              className={styles.primaryButton}
              onClick={handleDownload}
              disabled={selectedImages.size === 0}
            >
              <FiDownload />
              下载 ({selectedImages.size})
            </button>
          </div>

          <div className={styles.imageGrid}>
            {results.map((image, index) => (
              <div
                key={index}
                className={`${styles.imageItem} ${
                  selectedImages.has(image.url) ? styles.selected : ''
                }`}
                onClick={() => toggleImageSelection(image.url)}
              >
                <img src={image.url} alt={image.alt} loading="lazy" />
                <div className={styles.imageInfo}>
                  <div>{image.type}</div>
                  <div>{image.size}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.helpPanel}>
        <h4>
          <FiHelpCircle /> 使用说明
        </h4>
        <ul>
          <li>输入CSS选择器来定位要提取的图片</li>
          <li>支持常见的选择器语法，如 img, .gallery img 等</li>
          <li>可以设置最小尺寸和图片类型进行过滤</li>
          <li>点击图片可以选择/取消选择</li>
          <li>支持批量下载选中的图片</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageCrawler;
