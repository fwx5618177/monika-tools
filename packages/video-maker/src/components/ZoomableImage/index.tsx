import React, { useState, useRef, useEffect } from 'react';
import styles from './index.module.scss';

interface ZoomableImageProps {
  src: string;
  alt: string;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt }) => {
  const [scale, setScale] = useState<number>(1);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleGestureChange = (event: any) => {
      event.preventDefault();
      const newScale = Math.max(1, Math.min(scale * event.scale, 3));
      setScale(newScale);
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? 0.09 : 1.01;
      setScale((prevScale) => Math.max(1, Math.min(prevScale * delta, 3)));
    };

    const imageWrapper = imageWrapperRef.current;
    if (imageWrapper) {
      imageWrapper.addEventListener('gesturechange', handleGestureChange);
      imageWrapper.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (imageWrapper) {
        imageWrapper.removeEventListener('gesturechange', handleGestureChange);
        imageWrapper.removeEventListener('wheel', handleWheel);
      }
    };
  }, [scale]);

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      event.preventDefault();
      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const scaleFactor = distance / 200; // 简单的比例转换
      setScale(Math.max(1, Math.min(scaleFactor, 3)));
    }
  };

  const handleScaleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(event.target.value));
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale * 1.01, 3)); // 使用乘法实现平滑缩放
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale * 0.09, 1)); // 使用乘法实现平滑缩放
  };

  return (
    <div
      className={styles.zoomableImageContainer}
      onTouchMove={handleTouchMove}
      ref={imageWrapperRef}
    >
      <div
        className={`${styles.imageWrapper} ${scale > 1 ? styles.zoomed : ''}`}
        style={{ '--scale': scale } as React.CSSProperties}
      >
        <img src={src} alt={alt} />
      </div>
      <div className={styles.controls}>
        <button onClick={handleZoomOut} className={styles.zoomButton}>
          -
        </button>
        <input
          type="range"
          min="1"
          max="3"
          step="0.01"
          value={scale}
          onChange={handleScaleChange}
          className={styles.zoomSlider}
        />
        <button onClick={handleZoomIn} className={styles.zoomButton}>
          +
        </button>
        <div className={styles.scaleIndicator}>{scale.toFixed(2)}x</div>
      </div>
    </div>
  );
};

export default ZoomableImage;
