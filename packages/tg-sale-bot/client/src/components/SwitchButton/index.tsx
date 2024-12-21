import React, { FC, useState, useCallback } from "react";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";
import { FaArrowsAltV } from "react-icons/fa";
import Modal from "@components/Modal";
import { useNavigate } from "react-router-dom";
import { encodeToBase64 } from "@utils/encodeToBase64";

interface SwitchButtonProps {
  data: {
    userId: string;
    phoneNumber: string;
    region: string;
    supportRegion: string[];
  }[];
}

const SwitchButton: FC<SwitchButtonProps> = ({ data }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const handleSelect = useCallback(
    (phoneNumber: string) => {
      if (!phoneNumber) return;
      const encodedPhoneNumber = encodeToBase64(phoneNumber);
      navigate(`/map?phoneNumber=${encodedPhoneNumber}`);
      handleCloseModal();
    },
    [handleCloseModal, navigate]
  );

  return (
    <>
      <button className={styles.switch} onClick={handleOpenModal}>
        {t("packages-change-mobile-type")}
        <FaArrowsAltV size={12} />
      </button>

      {/* Modal 显示其他套餐列表 */}
      <Modal
        visible={isModalVisible}
        onClose={handleCloseModal}
        title={t("packages-available-list")}
        type="center"
      >
        <div className={styles.packageList}>
          {data.length > 0 ? (
            data.map((item, index) => (
              <div
                key={item.userId + "switch_" + index}
                className={styles.packageItem}
              >
                <div>
                  <strong>{t("phoneNumber")} </strong>
                  {item.phoneNumber}
                </div>
                <div className={styles.supportRegion}>
                  <strong>{t("region")} </strong>
                  {item.supportRegion.join(',')}
                </div>
                <span
                  className={styles.selectButton}
                  onClick={() => handleSelect(item?.phoneNumber)}
                >
                  {t("select")}
                </span>
              </div>
            ))
          ) : (
            <p>{t("no-packages-available")}</p>
          )}
        </div>
      </Modal>
    </>
  );
};

export default SwitchButton;
