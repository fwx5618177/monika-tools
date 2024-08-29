import React, { useEffect, useRef } from 'react';
import styles from './index.module.scss';

interface ThumbnailPreviewProps {
  images: { file: File; src: string }[];
  currentIndex: number;
  onThumbnailClick: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({
  images,
  currentIndex,
  onThumbnailClick,
  onPrev,
  onNext,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const activeThumbnail = containerRef.current.children[
        currentIndex
      ] as HTMLElement;
      const containerWidth = containerRef.current.clientWidth;
      const thumbnailWidth = activeThumbnail.clientWidth;
      const scrollPosition =
        activeThumbnail.offsetLeft - containerWidth / 2 + thumbnailWidth / 2;

      containerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  return (
    <div className={styles.thumbnailPreviewContainer}>
      <button className={styles.navButton} onClick={onPrev}>
        &#10094;
      </button>
      <div className={styles.thumbnailPreview} ref={containerRef}>
        {images.map((img, index) => (
          <div
            key={index}
            className={`${styles.thumbnail} ${
              currentIndex === index ? styles.active : ''
            }`}
            onClick={() => onThumbnailClick(index)}
          >
            <img src={img.src} alt={img.file.name} />
          </div>
        ))}
      </div>
      <button className={styles.navButton} onClick={onNext}>
        &#10095;
      </button>
    </div>
  );
};

export default ThumbnailPreview;
