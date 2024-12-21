import { TocAccordionProps, TocTypes } from "Components";
import { FC, useState } from "react";
import styles from "./index.module.scss";
import useHocTree from "./useHocTree";
import useHocSpan from "./useHocSpan";

const TocAccordion: FC<TocAccordionProps> = ({ toc, currentTitle }) => {
  //   const hocTree = useHocTree(toc);
  //   const tocSpans = useHocSpan(toc, currentTitle, 2);

  //   console.log({
  //     hocTree,
  //     toc,
  //   });

  return (
    <ul className={styles["toc-ul"]}>
      {toc?.map((item) => (
        <li
          key={item.key}
          style={{
            marginLeft: `${item.level - 1}em`,
          }}
          className={`${styles["toc-li"]} ${
            styles[item.key === currentTitle ? "toc-selected" : ""]
          }`}
          data-key={item.key}
        >
          <div style={{ cursor: "pointer" }}>
            <a href={item.href}>{item.text}</a>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TocAccordion;
