import { SynchronizedIDProps } from "Dashboard";
import { Button } from "antd";
import { FC } from "react";
import styles from "./index.module.scss";
import { useLocalPostStatus } from "@/services/Local/hooks";

const SynchronizeId: FC<Partial<SynchronizedIDProps>> = ({
  value,
  onChange,
}) => {
  //   const { mutateAsync, isLoading, data } = useLocalPostStatus();
  //   const { isExist } = data || { isExist: false };

  return (
    <div className={styles["synchronizedIDBox"]}>
      <span className={styles["synchronized-id"]}>{value}</span>
      {/* <Button
        type="primary"
        disabled={!isExist}
        loading={isLoading}
        onClick={() => mutateAsync(value)}
      >
        同步
      </Button> */}
    </div>
  );
};

export default SynchronizeId;
