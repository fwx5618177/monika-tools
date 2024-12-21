import { Highlight, themes } from "prism-react-renderer";
import React, { FC } from "react";
import styles from "./index.module.scss";
import CopyBoard from "@/components/CopyBoard";

const CodeRender: FC<{ code: string; language: string; theme?: any }> = ({
  code,
  language,
  theme = themes.nightOwl,
}) => {
  return (
    <Highlight {...{ code, language, theme }}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => {
        return (
          <div className={`${className} ${styles.codeHighLight}`} style={style}>
            <div className={styles.clipboard}>
              <CopyBoard onCopy={console.log} text={code}>
                {language}
              </CopyBoard>
            </div>
            {tokens.map((line, i) =>
              i !== tokens.length - 1 ? (
                <div
                  key={i}
                  {...getLineProps({
                    line,
                  })}
                >
                  {line.map((token, key) => (
                    <span
                      key={key}
                      {...getTokenProps({
                        token,
                      })}
                    />
                  ))}
                </div>
              ) : null
            )}
          </div>
        );
      }}
    </Highlight>
  );
};

export default CodeRender;
