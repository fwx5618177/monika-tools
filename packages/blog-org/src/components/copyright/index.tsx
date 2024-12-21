import { FaCopyright } from "react-icons/fa";
import styles from "./index.module.scss";

const CopyRight = ({ author, articleLink, rightDeclare = "", email }) => {
  return (
    <div className={styles["copyright-container"]}>
      <div>
        文章作者: <a href={`mailto:${email}`}>{author}</a>
      </div>
      <div>
        原文链接: <a>{articleLink}</a>
      </div>
      <div>
        版权声明:{" "}
        <span>
          本站所有内容除特别声明外, 均采用
          <a href={rightDeclare}>CC BY-NC-SA 4.0</a>。
          转载请注意声明来源作者等信息。
        </span>
      </div>
      <FaCopyright color="#49b1f5" className={styles.icon} />
    </div>
  );
};

export default CopyRight;
