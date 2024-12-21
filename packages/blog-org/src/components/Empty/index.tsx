import React from "react";
import { FaSkull } from "react-icons/fa";
import styles from "./index.module.scss";

interface EmptyProps {
  width?: string;
  height?: string;
  iconSize?: string | number;
  iconColor?: string;
}

const Empty: React.FC<EmptyProps> = ({
  width = "200px",
  height = "200px",
  iconSize = "20px",
  iconColor = "#9ca3af",
}) => {
  return (
    <div className={styles["empty-container"]} style={{ width, height }}>
      <div className={styles["empty-box"]}>
        <FaSkull className="empty-icon" size={iconSize} color={iconColor} />
      </div>
    </div>
  );
};

export default React.memo(Empty);
