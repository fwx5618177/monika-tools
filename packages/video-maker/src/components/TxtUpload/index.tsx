import { useState } from 'react';
import styles from './index.module.scss';
import FileSystemManager from '../FileSystemManager';
import fs from '@utils/MemoryFs';
import { useDropzone } from 'react-dropzone';

const TxtUpload = () => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileList, setFileList] = useState<File[]>([]);
  const [chapters, setChapters] = useState<
    { title: string; content: string }[]
  >([]);
  const [update, setUpdate] = useState<boolean>(false); // 用于触发重新渲染
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null); // 当前选中的章节

  const chunkSize = 1000; // 默认分块大小

  // 分章处理函数
  const processChapters = (text: string) => {
    const sentences = text.split(/(?<=[。！？])/); // 按中文句号、感叹号、问号分句
    const chapterList: { title: string; content: string }[] = [];

    let currentChapterTitle = '开始阅读';
    let currentChapterContent = '';

    sentences.forEach((sentence, index) => {
      // 简单规则：当句子长度较长且有特定标志词时，作为新的章节标题
      if (sentence.length > 10 && /序|章|节/.test(sentence)) {
        if (currentChapterContent.trim()) {
          chapterList.push({
            title: currentChapterTitle,
            content: currentChapterContent.trim(),
          });
        }
        currentChapterTitle =
          sentence.trim().slice(0, 10) + (sentence.length > 10 ? '...' : '');
        currentChapterContent = ''; // 清空当前章节内容
      } else {
        currentChapterContent += sentence + ' ';
      }

      // 如果是最后一个句子，保存当前章节
      if (index === sentences.length - 1 && currentChapterContent.trim()) {
        chapterList.push({
          title: currentChapterTitle,
          content: currentChapterContent.trim(),
        });
      }
    });

    // 如果没有合适的分章标志，按照 chunkSize 分章
    if (chapterList.length === 1) {
      chapterList.length = 0;
      for (let i = 0; i < text.length; i += chunkSize) {
        chapterList.push({
          title: `章节 ${i / chunkSize + 1}`,
          content: text.slice(i, i + chunkSize),
        });
      }
    }

    setChapters(chapterList);
  };

  // 处理文件上传
  const handleFileUpload = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const decoder = new TextDecoder('gb2312');
        const text = decoder.decode(arrayBuffer);
        setFileContent(text);
        setFileList([...fileList, file]);
        fs.writeFileSync(`/${file.name}`, text); // 保存到虚拟文件系统
        processChapters(text); // 分章处理
        setUpdate(!update); // 触发重新渲染
      };

      reader.readAsArrayBuffer(file);
    }
  };

  // 使用 react-dropzone 实现拖放和点击上传
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
    },
    onDrop: handleFileUpload,
  });

  return (
    <div className={styles.txtUploadContainer}>
      {/* 上传按钮和拖放区域 */}
      <div {...getRootProps({ className: styles.uploadArea })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>拖放文件到这里...</p>
        ) : (
          <button type="button">上传 TXT 文件</button>
        )}
      </div>

      {/* 文件内容展示 */}
      <div className={styles.fileContent}>
        <FileSystemManager fs={fs} update={update} />
        {fileContent && (
          <div className={styles.textContent}>
            <div className={styles.chapterList}>
              {chapters.map((chapter, index) => (
                <a
                  key={index}
                  href={`#chapter-${index}`}
                  onClick={() => setSelectedChapter(index)}
                >
                  {chapter.title}
                </a>
              ))}
            </div>
            {selectedChapter !== null && (
              <div id={`chapter-${selectedChapter}`}>
                <h3>{chapters[selectedChapter].title}</h3>
                <pre>{chapters[selectedChapter].content}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TxtUpload;
