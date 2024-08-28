import React, { useState, useRef } from 'react';
import ImagePreviewer from '@components/ImagePreviewer';
import { getImageResolution } from '@utils/common';

import styles from './index.module.scss';

interface UploadProps {
  accept: string; // 接受的文件类型
  displayType?: 'thumbnail' | 'list'; // 展示方式：缩略图或列表
  showInfo?: boolean; // 是否展示文件信息
  triggerType?: 'button' | 'box'; // 上传触发类型：按钮或盒子
}

const Upload: React.FC<UploadProps> = ({
  accept,
  displayType = 'thumbnail',
  showInfo = true,
  triggerType = 'button',
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<
    { file: File; src: string; resolution?: string }[]
  >([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleFilesUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    const filesWithSrc = await Promise.all(
      files.map(async (file) => {
        const resolution = await getImageResolution(file);
        return {
          file,
          src: URL.createObjectURL(file),
          resolution: `${resolution.width}x${resolution.height}`,
        };
      })
    );
    setUploadedFiles(filesWithSrc);
  };

  return (
    <div className={styles.upload}>
      {triggerType === 'button' ? (
        <button onClick={handleUploadClick} className={styles.uploadButton}>
          Upload Files
        </button>
      ) : (
        <div onClick={handleUploadClick} className={styles.uploadBox}>
          Click to Upload Files
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleFilesUpload}
        className={styles.fileInput}
      />
      {displayType === 'thumbnail' && uploadedFiles.length > 0 && (
        <ImagePreviewer images={uploadedFiles} />
      )}
      {displayType === 'list' && uploadedFiles.length > 0 && (
        <ul className={styles.listContainer}>
          {uploadedFiles.map((fileData, index) => (
            <li key={index} className={styles.listItem}>
              <span className={styles.fileName}>{fileData.file.name}</span>
              {showInfo && (
                <span className={styles.fileSize}>
                  {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Upload;
