import React from 'react';
import { FiX, FiExternalLink } from 'react-icons/fi';
import styles from '../../styles/components/ImageViewer.module.scss';

interface ImageViewerProps {
  imageUrl: string;
  onClose: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  imageUrl,
  onClose,
}) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <FiX />
        </button>
        <img src={imageUrl} alt="预览图片" className={styles.image} />
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.viewOriginal}
        >
          <FiExternalLink />
          查看原图
        </a>
      </div>
    </div>
  );
};
