import React, { FC } from "react";
import { FaCheckCircle, FaRegClock } from "react-icons/fa";
import styles from "./index.module.scss";

export interface TaskStatusProps {
  status: boolean;
}
const TaskStatus: FC<TaskStatusProps> = ({ status }) => {
  return (
    <div className={styles.taskStatus}>
      {status ? (
        <span className="text-success">
          <FaCheckCircle color="#28a745cc" size={18} />
        </span>
      ) : (
        <span>
          <FaRegClock color="#ffc107cc" size={18} />
        </span>
      )}
    </div>
  );
};

export default TaskStatus;
