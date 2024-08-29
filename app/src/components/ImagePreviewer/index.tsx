import React, { useState, useEffect, useRef } from 'react';
import ZoomableImage from '@components/ZoomableImage';
import ThumbnailPreview from '@components/ThumbnailPreview';
import styles from './index.module.scss';

interface ImagePreviewerProps {
  images: { file: File; src: string; resolution?: string }[];
}

const ImagePreviewer: React.FC<ImagePreviewerProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const currentImage = images[currentIndex];
  const overlayRef = useRef<HTMLDivElement>(null);

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

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
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
        <div
          className={styles.navBoxLeft}
          onClick={() =>
            setCurrentIndex((prev) =>
              prev === 0 ? images.length - 1 : prev - 1
            )
          }
        >
          &#10094;
        </div>
      )}
      <div className={styles.thumbnailContainer}>
        {images.slice(0, 4).map((img, index) => (
          <div
            key={index}
            className={styles.thumbnail}
            onClick={() => {
              toggleFocusMode();
              handleThumbnailClick(index);
            }}
          >
            <div className={styles.imageBackground}>
              <img src={img.src} alt={img.file.name} />
            </div>
            <div className={styles.info}>
              <p className={styles.fileName}>{img.file.name}</p>
              <p className={styles.fileSize}>
                {(img.file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <p>{currentImage.resolution || 'Loading...'}</p>
            </div>
          </div>
        ))}
      </div>
      {images.length > 4 && !isFocused && (
        <div
          className={styles.navBoxRight}
          onClick={() =>
            setCurrentIndex((prev) =>
              prev === images.length - 1 ? 0 : prev + 1
            )
          }
        >
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
              <ZoomableImage
                src={currentImage.src}
                alt={currentImage.file.name}
              />
              <div className={styles.details}>
                <h3>{currentImage.file.name}</h3>
                <p>
                  大小: {(currentImage.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p>分辨率: {currentImage.resolution || 'Loading...'}</p>
                <p>类型: {currentImage.file.type}</p>
                <p>文件类型: {currentImage.file.type}</p>
                <p>
                  上传时间:{' '}
                  {new Date(currentImage.file.lastModified).toLocaleString()}
                </p>
              </div>
            </div>
            <ThumbnailPreview
              images={images}
              currentIndex={currentIndex}
              onThumbnailClick={handleThumbnailClick}
              onPrev={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
              onNext={() =>
                setCurrentIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
            />
          </div>
          <div className={styles.overlay} ref={overlayRef}></div>
        </div>
      )}
    </div>
  );
};

export default ImagePreviewer;
