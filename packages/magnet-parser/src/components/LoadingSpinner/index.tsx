import React from "react";
import "./index.css";
const LoadingSpinner: React.FC<{
  progress: number;
}> = ({ progress }) => (
  <>
    <div className="spinner">
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>
    <span>{progress} %</span>
  </>
);

export default LoadingSpinner;
