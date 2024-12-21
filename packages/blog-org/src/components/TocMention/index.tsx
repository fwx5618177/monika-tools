import { FaAlignLeft } from "react-icons/fa";
import { useToc } from "@/contexts/TocContext";
import InfoBox from "../InfoBox";
import useScrollSpy from "@/hooks/useScrollSPy";
import ProgressArticle from "../TocProgress/TocProgress";
import { useMemo, useRef } from "react";
import useAutoScroll from "./useAutoScroll";
import styles from "./index.module.scss";
import TocAccordion from "./TocAccordion";

const TocMention = ({ title, innerRef }) => {
  const { tocState } = useToc();
  const { toc } = tocState;
  const tocMemo = useMemo(() => toc.filter((item) => item?.level !== 0), [toc]);
  const currentTitle = useScrollSpy(tocState.toc);
  const tocBoxRef = useRef(null);
  const selectName = `li[data-key="${currentTitle}"]`;
  useAutoScroll(tocBoxRef, currentTitle, selectName);

  return (
    <InfoBox
      height={400}
      infoBoxStyle={{
        zIndex: 999,
        marginTop: 10,
        minHeight: 400,
        maxHeight: 500,
      }}
      ref={innerRef}
    >
      <div className={styles.tocBox}>
        <header className={styles.header}>
          <div className={styles["header-title"]}>
            <FaAlignLeft />
            {title}
          </div>
          <ProgressArticle active={currentTitle} total={tocMemo} />
        </header>
        <div className={styles["toc-body"]} ref={tocBoxRef}>
          <TocAccordion toc={tocMemo} currentTitle={currentTitle} />
        </div>
      </div>
    </InfoBox>
  );
};

export default TocMention;
