import styles from "./index.module.scss";
import { HeaderProps } from "Components";
import { FC } from "react";
import HeaderTitle from "./HeaderTitle";

const Header: FC<HeaderProps> = ({
  children,
  small,
  height = 150,
  isPost = false,
  postData,
}) => {
  return (
    <div
      className={styles["bg-image-small"]}
      style={{
        minHeight: height,
        backgroundImage: small ? `url(${small})` : undefined,
      }}
    >
      {isPost ? (
        <HeaderTitle
          title={postData?.title}
          publishedDate={postData?.publishedDate}
          updatedDate={postData?.updatedDate}
          readCount={postData?.meta?.readCount}
          wordCount={postData?.meta?.wordCount}
          readTimeCost={postData?.meta?.readTimeCost}
          type={postData?.meta?.type}
        />
      ) : null}
      {children}
    </div>
  );
};

export default Header;
