import React, { useState, useEffect, useRef } from 'react';
import ZoomableImage from '@components/ZoomableImage';
import ThumbnailPreview from '@components/ThumbnailPreview';
import styles from './index.module.scss';

interface ImagePreviewerProps {
  images: { file: File; src: string; resolution?: string }[];
}

const ImagePreviewer: React.FC<ImagePreviewerProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
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

  const handleThumbnailClick = (image: { file: File; src: string }) => {
    setSelectedImage(image);
  };

  const toggleFocusMode = () => {
    setIsFocused(!isFocused);
  };

  const closeFocusMode = () => {
    setIsFocused(false);
  };

  const handlePrev = () => {
    const currentIndex = images.findIndex(
      (img) => img.src === selectedImage.src
    );
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setSelectedImage(images[newIndex]);
  };

  const handleNext = () => {
    const currentIndex = images.findIndex(
      (img) => img.src === selectedImage.src
    );
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(images[newIndex]);
  };

  return (
    <div className={styles.imagePreviewer}>
      {images.length > 4 && !isFocused && (
        <>
          <div className={styles.navBoxLeft} onClick={handlePrev}>
            &#10094;
          </div>
          <div className={styles.navBoxRight} onClick={handleNext}>
            &#10095;
          </div>
        </>
      )}
      <div className={styles.thumbnailContainer}>
        {images.slice(0, 4).map((img) => (
          <div
            key={img.src}
            className={styles.thumbnail}
            onClick={() => {
              toggleFocusMode();
              handleThumbnailClick(img);
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
              <p>{img.resolution || 'Loading...'}</p>
            </div>
          </div>
        ))}
      </div>

      {isFocused && (
        <div className={styles.focusMode}>
          <div className={styles.modal}>
            <div className={styles.closeButton} onClick={closeFocusMode}>
              &times;
            </div>
            <div className={styles.modalContent}>
              <ZoomableImage
                src={selectedImage.src}
                alt={selectedImage.file.name}
              />
              <div className={styles.details}>
                <h3>{selectedImage.file.name}</h3>
                <p>
                  大小: {(selectedImage.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p>分辨率: {selectedImage.resolution || 'Loading...'}</p>
                <p>类型: {selectedImage.file.type}</p>
                <p>文件类型: {selectedImage.file.type}</p>
                <p>
                  上传时间:{' '}
                  {new Date(selectedImage.file.lastModified).toLocaleString()}
                </p>
              </div>
            </div>
            <ThumbnailPreview
              images={images}
              selectedImage={selectedImage}
              onThumbnailClick={handleThumbnailClick}
            />
          </div>
          <div className={styles.overlay} ref={overlayRef}></div>
        </div>
      )}
    </div>
  );
};

export default ImagePreviewer;
