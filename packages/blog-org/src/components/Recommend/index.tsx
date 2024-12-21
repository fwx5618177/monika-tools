import { FaCalendarAlt, FaThumbsUp } from "react-icons/fa";
import styles from "./index.module.scss";
import Image from "next/image";
import moment from "moment";
import { FC } from "react";

const Recommend: FC<{
  data: {
    updatedDate: string | Date | number;
    title: string;
    imageUrl: string;
    language: string;
  }[];
}> = ({ data = [] }) => {
  return (
    <div className={styles["recommend-container"]}>
      <div className={styles["recommend-header"]}>
        <FaThumbsUp className={styles["recommend-header-icon"]} /> 相关推荐
      </div>

      <div className={styles["recommend-article-display"]}>
        {data?.map((item, index) => (
          <div key={index} className={styles["recommend-article"]}>
            <div className={styles["ribbon-language"]}>{item?.language}</div>
            <Image
              className={styles["recommend-article-image"]}
              width={256}
              height={200}
              src={item?.imageUrl}
              alt={"recommend"}
            />
            <div className={styles["recommend-article-body"]}>
              <span>
                <FaCalendarAlt />{" "}
                {item?.updatedDate
                  ? moment(item?.updatedDate).format("YYYY-MM-DD")
                  : "--"}
              </span>
              <h1>{item?.title}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommend;
