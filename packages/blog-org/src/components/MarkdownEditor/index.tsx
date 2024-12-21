import React, { FC, useCallback } from "react";
import { MarkdownEditorProps } from "Dashboard";
import "@/styles/markdownStyles.module.scss";
import BasicEditor from "./components/plate/BasicEditor";
import { useHtmlSerializer } from "@/hooks/useSlateSerializer";

const MarkdownEditor: FC<Partial<MarkdownEditorProps>> = ({
  value,
  onChange,
}) => {
  const { serializeSlate2Markdown } = useHtmlSerializer();

  const handleChange = useCallback(
    (newValue) => {
      const data = serializeSlate2Markdown(newValue);

      console.log({
        data,
      });
      onChange(data);
    },
    [onChange, serializeSlate2Markdown]
  );

  return (
    <div style={{ overflowY: "auto" }}>
      <BasicEditor value={value} onChange={handleChange} />
    </div>
  );
};

export default MarkdownEditor;
