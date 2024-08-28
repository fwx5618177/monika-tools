import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';

import { getImageResolution } from '@utils/common';

interface ImagePreviewerProps {
  images: { file: File; src: string }[];
}

const ImagePreviewer: React.FC<ImagePreviewerProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [resolutions, setResolutions] = useState<string[]>([]); // 新增状态来存储分辨率
  const currentImage = images[currentIndex];

  useEffect(() => {
    // 初始化分辨率数组
    const initResolutions = async () => {
      const resolutionPromises = images.map(async (img) => {
        const { width, height } = await getImageResolution(img.file);
        return `${width}x${height}`;
      });

      const resolutions = await Promise.all(resolutionPromises);
      setResolutions(resolutions);
    };

    initResolutions();
  }, [images]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFocused(false);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const toggleFocusMode = () => {
    setIsFocused(!isFocused);
  };

  const closeFocusMode = () => {
    setIsFocused(false);
  };

  return (
    <div className={styles.imagePreviewer}>
      {images.length > 4 && !isFocused && (
        <div className={styles.navBoxLeft} onClick={handlePrev}>
          &#10094;
        </div>
      )}
      <div className={styles.thumbnailContainer}>
        {images.slice(0, 4).map((img, index) => (
          <div
            key={index}
            className={styles.thumbnail}
            onClick={toggleFocusMode}
          >
            <div className={styles.imageBackground}>
              <img src={img.src} alt={img.file.name} />
            </div>
            <div className={styles.info}>
              <p>{img.file.name}</p>
              <p>{(img.file.size / 1024 / 1024).toFixed(2)} MB</p>
              <p>{resolutions[index] || 'Loading...'}</p>
            </div>
            <div className={styles.tooltip}>
              <p>{img.file.name}</p>
              <p>{(img.file.size / 1024 / 1024).toFixed(2)} MB</p>
              <p>分辨率: {resolutions[index] || 'Loading...'}</p>{' '}
              <p>类型: {img.file.type}</p>
            </div>
          </div>
        ))}
      </div>
      {images.length > 4 && !isFocused && (
        <div className={styles.navBoxRight} onClick={handleNext}>
          &#10095;
        </div>
      )}

      {isFocused && (
        <div className={styles.focusMode}>
          <div className={styles.modal}>
            <div className={styles.closeButton} onClick={closeFocusMode}>
              &times;
            </div>
            <div className={styles.modalContent}>
              <div className={styles.imageContainer}>
                <div className={styles.imageBackground}>
                  <img src={currentImage.src} alt={currentImage.file.name} />
                </div>
              </div>
              <div className={styles.details}>
                <h3>{currentImage.file.name}</h3>
                <p>
                  大小: {(currentImage.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p>分辨率: {resolutions[currentIndex] || 'Loading...'}</p>{' '}
                <p>类型: {currentImage.file.type}</p>
                <p>文件类型: {currentImage.file.type}</p>
                <p>
                  上传时间:{' '}
                  {new Date(currentImage.file.lastModified).toLocaleString()}
                </p>
              </div>
            </div>
            <div className={styles.navButtons}>
              <button onClick={handlePrev}>&#10094;</button>
              <button onClick={handleNext}>&#10095;</button>
            </div>
          </div>
          <div className={styles.overlay} onClick={closeFocusMode}></div>
        </div>
      )}
    </div>
  );
};

export default ImagePreviewer;
