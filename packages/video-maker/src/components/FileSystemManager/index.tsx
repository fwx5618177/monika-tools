import { useEffect, useState } from 'react';
import styles from './index.module.scss';
import MemoryFS from 'memory-fs';

interface FileSystemManagerProps {
  fs: MemoryFS;
  update: boolean; // 用于触发重新渲染
}

const FileSystemManager: React.FC<FileSystemManagerProps> = ({
  fs,
  update,
}) => {
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const updateFiles = () => {
      const fileList = fs.readdirSync('/');
      setFiles(fileList);
    };

    updateFiles();
  }, [fs, update]);

  return (
    <div className={styles.fileSystemManager}>
      <h2 className={styles.title}>目录</h2>
      <ul className={styles.fileList}>
        {files.map((file, index) => (
          <li key={index} className={styles.fileItem}>
            {file}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileSystemManager;
