import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import Modal from "@components/Modal";
import CountryGrid from "@components/CountryGrid";
import { useTranslation } from "react-i18next";
import { getQueryParams } from "@utils/getQueryParams";
import { getCountries } from "@utils/region";
import useFetchRegion from "@hooks/useFetchRegion";
import { RegionItem } from "@interfaces/api";
import { encodeToBase64 } from "@utils/encodeToBase64";

const CountrySelection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const urlParams = getQueryParams<{ phoneNumber: string }>();
  const [selectedCountry, setSelectedCountry] = useState<RegionItem | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [errorModalVisible, setErrorModalVisible] = useState<boolean>(false);

  const { list, regions, loading } = useFetchRegion();
  const [selectedRegion, setSelectedRegion] = useState<string>("Asia");

  const handleCountrySelect = (country: RegionItem) => {
    setSelectedCountry(country);
    setIsModalVisible(true);
  };

  const handleConfirmSelection = async () => {
    if (selectedCountry) {
      navigate(
        `/packages${
          selectedCountry?.code
            ? "?countryCode=" + encodeToBase64(selectedCountry?.code)
            : ""
        }${
          urlParams?.phoneNumber ? "&phoneNumber=" + urlParams?.phoneNumber : ""
        }${
          selectedCountry?.name
            ? "&countryName=" + encodeToBase64(selectedCountry?.name)
            : ""
        }`
      );
    } else {
      setErrorModalVisible(true);
    }

    setIsModalVisible(false);
  };

  const handleCancelSelection = () => {
    setSelectedCountry(null);
    setIsModalVisible(false);
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.loadingMessage}>
          {t("packages-loading-data")}
        </div>
      ) : (
        <div className={styles.regionSelector}>
          {regions?.map((region, index) => (
            <span
              key={index + "_region"}
              className={`${styles.regionButton} ${
                selectedRegion === region ? styles.selected : ""
              }`}
              onClick={() => setSelectedRegion(region)}
            >
              {region}
            </span>
          ))}
        </div>
      )}

      {list && (
        <CountryGrid
          countries={getCountries(list, selectedRegion)}
          isLoading={loading}
          onCountrySelect={handleCountrySelect}
        />
      )}

      {/* 选择确认框 */}
      <Modal
        visible={isModalVisible}
        onClose={handleCancelSelection}
        title={t("packages-confirm-country")}
      >
        <div className={styles.modalContent}>
          <span className={styles.content}>
            {t("packages-confirm-country-selection", {
              country: selectedCountry?.name,
            })}
          </span>
          <button className={styles.confirm} onClick={handleConfirmSelection}>
            {t("confirm")}
          </button>
          <button className={styles.cancel} onClick={handleCancelSelection}>
            {t("cancel")}
          </button>
        </div>
      </Modal>

      {/* 错误提示框 */}
      <Modal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        title={t("error")}
      >
        <div className={styles.modalContent}>
          <span className={styles.content}>
            {t("packages-country-no-data")}
          </span>
          <button
            className={styles.cancel}
            onClick={() => setErrorModalVisible(false)}
          >
            {t("close")}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CountrySelection;
