import React, { useEffect, useRef, useState } from "react";
import { Input, Tag, Tooltip } from "antd";
import { UseTagsProps } from "Dashboard";
import styles from "./index.module.scss";

const useTags = ({ tags, setTags, color = "#f50" }: UseTagsProps) => {
  const inputRef = useRef(null);
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");

  useEffect(() => {
    if (editInputIndex !== -1) {
      // 当editInputIndex改变时，聚焦到输入框
      inputRef.current?.focus();
    }
  }, [editInputIndex]);

  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    if (editInputIndex > -1 && editInputValue) {
      // 确保有有效的输入
      newTags[editInputIndex] = editInputValue;
      setTags(newTags);
    }

    // 重置状态
    setEditInputIndex(-1);
    setEditInputValue("");
  };

  const tagElements = tags.map((tag, index) => {
    if (editInputIndex === index) {
      return (
        <Input
          key={tag}
          ref={inputRef}
          className={styles["tag-input"]}
          value={editInputValue}
          onChange={handleEditInputChange}
          onBlur={handleEditInputConfirm}
          onPressEnter={handleEditInputConfirm}
        />
      );
    }

    const isLongTag = tag.length > 20;
    const tagElem = (
      <Tag
        className={styles["edit-tag"]}
        key={tag + "_" + index}
        closable
        color={color}
        onClose={() => handleClose(tag)}
      >
        <span
          onClick={(e) => {
            setEditInputIndex(index);
            setEditInputValue(tag);
            e.preventDefault();
          }}
        >
          {isLongTag ? `${tag.slice(0, 20)}...` : tag}
        </span>
      </Tag>
    );
    return isLongTag ? <Tooltip title={tag}>{tagElem}</Tooltip> : tagElem;
  });

  return tagElements;
};

export default useTags;
