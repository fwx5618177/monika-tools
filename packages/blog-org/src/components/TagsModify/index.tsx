import React, { useEffect, useRef, useState } from "react";
import { Space, Tag, Input, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { EditableTagGroupProps } from "Dashboard";
import useTags from "./useTags";

import styles from "./index.module.scss";

const TagsModify: React.FC<Partial<EditableTagGroupProps>> = ({
  value,
  onChange,
}) => {
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const tagElement = useTags({ tags: value, setTags: onChange, color: "#f50" });

  const handleInputConfirm = () => {
    if (inputValue && value.indexOf(inputValue) === -1) {
      onChange([...value, inputValue]);
    }
    setInputValue("");
  };

  return (
    <Space size={[0, 8]} wrap>
      {tagElement}
      <Input
        type="text"
        size="small"
        className={styles["tag-input-add"]}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleInputConfirm}
        onPressEnter={handleInputConfirm}
        style={{
          width: "93px",
          marginRight: "8px",
          backgroundColor: "#108ee9",
          color: "#fff",
        }}
        placeholder="添加新的标签"
        ref={inputRef}
      />
      <Tag
        className={styles["site-tag-plus"]}
        onClick={() => {
          setInputValue("");
          inputRef?.current?.focus();
        }}
      >
        <PlusOutlined /> 新标签
      </Tag>
    </Space>
  );
};

export default TagsModify;
