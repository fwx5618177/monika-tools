import React, { useState, useCallback } from 'react';
import styles from '../../styles/components/WebCrawler.module.scss';
import {
  FiVideo,
  FiDownload,
  FiRotateCcw,
  FiHelpCircle,
  FiAlertCircle,
  FiSettings,
  FiCheck,
  FiCopy,
} from 'react-icons/fi';
import type { VideoResult, VideoOptions } from '@/types';

export const VideoCrawler: React.FC = () => {
  const [selector, setSelector] = useState('');
  const [results, setResults] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<VideoOptions>({
    includeEmbedded: true,
    includeHLS: true,
    includeDash: true,
    minDuration: 0,
    maxDuration: 0,
    minWidth: 0,
    minHeight: 0,
    formats: ['mp4', 'webm'],
  });

  const handleCrawl = useCallback(async () => {
    if (!selector) {
      setError('请输入选择器');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab.id) throw new Error('No active tab');

      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'CRAWL_VIDEOS',
        data: { selector, options },
      });

      if (response.error) {
        throw new Error(response.error);
      }

      setResults(Array.isArray(response) ? response : [response]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '视频提取失败');
    } finally {
      setLoading(false);
    }
  }, [selector, options]);

  const handleDownload = useCallback(async (video: VideoResult) => {
    try {
      const response = await fetch(video.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = video.filename || `video.${video.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('下载视频失败');
    }
  }, []);

  const handleCopy = useCallback(async () => {
    if (!results.length) return;

    try {
      await navigator.clipboard.writeText(results.map((r) => r.url).join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('复制到剪贴板失败');
    }
  }, [results]);

  const handleClear = useCallback(() => {
    setSelector('');
    setResults([]);
    setError('');
  }, []);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.input}
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          placeholder="输入 CSS 选择器，例如: video, .player"
        />
        <button
          className={styles.primaryButton}
          onClick={handleCrawl}
          disabled={loading || !selector}
        >
          <FiVideo />
          {loading ? '提取中...' : '提取视频'}
        </button>
        <button
          className={styles.toolButton}
          onClick={toggleOptions}
          title="选项设置"
        >
          <FiSettings />
        </button>
        <button
          className={styles.toolButton}
          onClick={handleClear}
          disabled={!selector && !results.length}
          title="清空"
        >
          <FiRotateCcw />
        </button>
      </div>

      {showOptions && (
        <div className={styles.optionsPanel}>
          <h4>提取选项</h4>
          <div className={styles.optionRow}>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.includeEmbedded}
                onChange={(e) =>
                  setOptions({ ...options, includeEmbedded: e.target.checked })
                }
              />
              包含嵌入式视频
            </label>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.includeHLS}
                onChange={(e) =>
                  setOptions({ ...options, includeHLS: e.target.checked })
                }
              />
              包含 HLS 流
            </label>
          </div>

          <div className={styles.optionRow}>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={options.includeDash}
                onChange={(e) =>
                  setOptions({ ...options, includeDash: e.target.checked })
                }
              />
              包含 DASH 流
            </label>
          </div>

          <div className={styles.optionGroup}>
            <h4>视频格式</h4>
            {['mp4', 'webm', 'm3u8', 'mpd'].map((format) => (
              <label key={format} className={styles.optionLabel}>
                <input
                  type="checkbox"
                  checked={options.formats.includes(format)}
                  onChange={(e) => {
                    const newFormats = e.target.checked
                      ? [...options.formats, format]
                      : options.formats.filter((f) => f !== format);
                    setOptions({ ...options, formats: newFormats });
                  }}
                />
                {format.toUpperCase()}
              </label>
            ))}
          </div>

          <div className={styles.optionGroup}>
            <h4>尺寸限制</h4>
            <div className={styles.optionRow}>
              <label>最小宽度：</label>
              <input
                type="number"
                className={styles.input}
                value={options.minWidth}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    minWidth: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
              />
              <label>最小高度：</label>
              <input
                type="number"
                className={styles.input}
                value={options.minHeight}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    minHeight: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
              />
            </div>
          </div>

          <div className={styles.optionGroup}>
            <h4>时长限制（秒）</h4>
            <div className={styles.optionRow}>
              <label>最短时长：</label>
              <input
                type="number"
                className={styles.input}
                value={options.minDuration}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    minDuration: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
              />
              <label>最长时长：</label>
              <input
                type="number"
                className={styles.input}
                value={options.maxDuration}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    maxDuration: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
              />
            </div>
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
          <div className={styles.resultActions}>
            <button className={styles.toolButton} onClick={handleCopy}>
              {copied ? <FiCheck /> : <FiCopy />}
              {copied ? '已复制' : '复制链接'}
            </button>
          </div>

          <div className={styles.videoGrid}>
            {results.map((video, index) => (
              <div key={index} className={styles.videoItem}>
                <video
                  src={video.url}
                  controls
                  poster={video.thumbnail}
                  className={styles.videoPlayer}
                />
                <div className={styles.videoInfo}>
                  <div className={styles.videoMeta}>
                    <span>{video.format.toUpperCase()}</span>
                    <span>{video.resolution}</span>
                    <span>{video.duration}s</span>
                    <span>{video.size}</span>
                  </div>
                  <button
                    className={styles.downloadButton}
                    onClick={() => handleDownload(video)}
                  >
                    <FiDownload /> 下载
                  </button>
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
          <li>输入 CSS 选择器来定位要提取的视频元素</li>
          <li>支持常见的视频格式（MP4、WebM）和流媒体（HLS、DASH）</li>
          <li>可以设置视频尺寸和时长的限制</li>
          <li>支持下载视频或复制视频链接</li>
          <li>可以预览视频内容和查看视频信息</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoCrawler;
