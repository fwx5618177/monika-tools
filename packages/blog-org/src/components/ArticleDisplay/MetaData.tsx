import React from "react";
import moment from "moment";
import styles from "./index.module.scss";
import { FaCalendarAlt, FaThumbtack } from "react-icons/fa";
import { MetaDataProps } from "Components";

const MetaData: React.FC<MetaDataProps> = ({
  isSticky = false,
  date,
  type,
  readCount = 0,
  wordCount = 0,
  readTimeCost = 0,
}) => {
  return (
    <div className={styles.date}>
      {isSticky && (
        <>
          <span className={styles.pin}>
            <FaThumbtack
              style={{
                display: "inline-block",
                marginRight: "0.5rem",
              }}
            />
            置顶
          </span>
          <span>|</span>
        </>
      )}
      <span>
        <FaCalendarAlt
          style={{
            display: "inline-block",
            marginRight: "0.5rem",
          }}
        />
        发表于 {moment(date).format("YYYY-MM-DD HH:mm:ss")} |{" "}
      </span>
      <span>类型: {type} | </span>
      <span>人气: {readCount}</span>
    </div>
  );
};

export default MetaData;
