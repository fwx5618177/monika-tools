import React, { useEffect, useRef } from 'react';
import styles from './index.module.scss';

interface ThumbnailPreviewProps {
  images: { file: File; src: string }[];
  selectedImage: { file: File; src: string };
  onThumbnailClick: (image: { file: File; src: string }) => void;
}

const ThumbnailPreview: React.FC<ThumbnailPreviewProps> = ({
  images,
  selectedImage,
  onThumbnailClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const activeThumbnail = Array.from(containerRef.current.children).find(
        (child) => (child as HTMLElement).dataset.src === selectedImage.src
      ) as HTMLElement;

      if (activeThumbnail) {
        const containerWidth = containerRef.current.clientWidth;
        const thumbnailWidth = activeThumbnail.clientWidth;
        const scrollPosition =
          activeThumbnail.offsetLeft - containerWidth / 2 + thumbnailWidth / 2;

        containerRef.current.scrollTo({
          left: scrollPosition,
          behavior: 'smooth',
        });
      }
    }
  }, [selectedImage]);

  const handlePrev = () => {
    const currentIndex = images.findIndex(
      (img) => img.src === selectedImage.src
    );
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onThumbnailClick(images[prevIndex]);
  };

  const handleNext = () => {
    const currentIndex = images.findIndex(
      (img) => img.src === selectedImage.src
    );
    const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    onThumbnailClick(images[nextIndex]);
  };

  return (
    <div className={styles.thumbnailPreviewContainer}>
      <button className={styles.navButton} onClick={handlePrev}>
        &#10094;
      </button>
      <div className={styles.thumbnailPreview} ref={containerRef}>
        {images.map((img) => (
          <div
            key={img.src}
            className={`${styles.thumbnail} ${
              selectedImage.src === img.src ? styles.active : ''
            }`}
            data-src={img.src}
            onClick={() => onThumbnailClick(img)}
          >
            <img src={img.src} alt={img.file.name} />
          </div>
        ))}
      </div>
      <button className={styles.navButton} onClick={handleNext}>
        &#10095;
      </button>
    </div>
  );
};

export default ThumbnailPreview;
