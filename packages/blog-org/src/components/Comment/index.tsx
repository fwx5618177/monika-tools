"use client";

import { FaComment } from "react-icons/fa";
import styles from "./index.module.scss";
import { useEffect, useRef } from "react";
import { config } from "@/config/dev";

const Comment = ({}) => {
  const commentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("valine").then((Valine) => {
        new Valine.default({
          el: commentRef?.current,
          appId: config.valine_appId,
          appKey: config.valine_appKey,
        });
      });
    }
  }, []);

  return (
    <div className={styles["comment-container"]}>
      <div className={styles["recommend-header"]}>
        <FaComment className={styles["recommend-header-icon"]} /> 评论
      </div>

      <div className={styles["comment-body"]}>
        <div className={styles["comment-body"]} ref={commentRef}></div>
      </div>
    </div>
  );
};

export default Comment;
