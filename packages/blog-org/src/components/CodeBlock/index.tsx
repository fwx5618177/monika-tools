import { FC } from "react";
import * as themes from "react-syntax-highlighter/dist/esm/styles/prism";
import style from "./index.module.scss";
import { FaCopy, FaCamera, FaCaretRight, FaRotate } from "react-icons/fa6";
import CopyBoard from "@/components/CopyBoard";
import { CodeBlockProps } from "Components";
// import DropdownSelector from "@/components/DropdownSelector";

// const themeOptions = Object.keys(themes);

const CodeBlock: FC<CodeBlockProps> = ({
  language,
  children,
  text,
  setTheme,
}) => {
  return (
    <div className={style["code-block"]}>
      <div className={style["code-block-title"]}>
        <div className={style["buttons"]}>
          <div className={style["red"]}></div>
          <div className={style["yellow"]}></div>
          <div className={style["green"]}></div>
        </div>
        <span>{language}</span>
      </div>
      <div className={style["code-block-exec"]}>
        {/* <DropdownSelector dataList={themeOptions} onChange={setTheme} /> */}
        <CopyBoard onCopy={console.log} text={text}>
          <FaCopy />
        </CopyBoard>

        <FaCamera />
        <FaCaretRight />
      </div>
      {children}
    </div>
  );
};

export default CodeBlock;
