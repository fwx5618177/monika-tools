import React from "react";
import { FileData } from "../../hooks/useMagnetParser";
import "./index.css";

interface FileInfoProps {
  files: FileData[];
}

const FileInfo: React.FC<FileInfoProps> = ({ files }) => (
  <div className="file-info">
    {files?.map((file, index) => (
      <div key={index} className="file-card">
        <h3>{file.name}</h3>
        <p>Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
        <p>Type: {file.type}</p>
        {file?.screenshot && Array.isArray(file.screenshot) ? (
          <>
            {file?.screenshot?.map((screenshot, index) => (
              <img
                key={index}
                src={screenshot}
                alt="Screenshot"
                className="file-screenshot"
              />
            ))}
          </>
        ) : (
          <img
            src={file?.screenshot}
            alt="Screenshot"
            className="file-screenshot"
          />
        )}
      </div>
    ))}
  </div>
);

export default FileInfo;
