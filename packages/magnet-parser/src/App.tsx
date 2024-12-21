import React from "react";
import InputForm from "./components/InputForm";
import FileInfo from "./components/FileInfo";
import LoadingSpinner from "./components/LoadingSpinner";
import useMagnetParser from "./hooks/useMagnetParser";
import "./styles/global.css";

const App: React.FC = () => {
  const { files, isLoading, parseMagnetLink, progress } = useMagnetParser();

  const handleParse = (magnetLink: string) => {
    parseMagnetLink(magnetLink);
  };

  return (
    <div className="app-container">
      <h1>Magnet Link Parser</h1>
      <InputForm onParse={handleParse} />
      {isLoading ? (
        <LoadingSpinner progress={progress} />
      ) : (
        <FileInfo files={files} />
      )}
    </div>
  );
};

export default App;
