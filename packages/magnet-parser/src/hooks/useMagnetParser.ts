import { useState } from "react";

export interface FileData {
  name: string;
  size: number;
  type: string;
  screenshot?: string;
}

const useMagnetParser = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0); // 添加进度状态

  const parseMagnetLink = async (magnetLink: string) => {
    setIsLoading(true);
    setProgress(0); // 重置进度

    try {
      // 向后端发送 HTTP 请求
      const response = await fetch("http://localhost:3000/api/query-magnet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ magnetLink }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch magnet link data");
      }

      const data = await response.json();
      setFiles(data.files || []); // 假设后端返回的文件信息在 `data.files` 中
      setProgress(100); // 假设完成请求即表示查询完成
    } catch (error) {
      console.error("Error parsing magnet link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { files, isLoading, progress, parseMagnetLink };
};

export default useMagnetParser;
