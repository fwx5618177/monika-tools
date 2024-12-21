import React, { useState } from "react";
import "./index.css";

interface InputFormProps {
  onParse: (magnetLink: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onParse }) => {
  const [magnetLink, setMagnetLink] = useState("");

  const handleParseClick = () => {
    if (magnetLink.trim()) {
      onParse(magnetLink);
    }
  };

  return (
    <div className="input-form">
      <input
        type="text"
        value={magnetLink}
        onChange={(e) => setMagnetLink(e.target.value)}
        placeholder="Enter magnet link..."
        className="input"
      />
      <button onClick={handleParseClick} className="parse-button">
        Parse
      </button>
    </div>
  );
};

export default InputForm;
