import React, { useState } from "react";
import styles from "./index.module.scss";
import SkeletonLoader from "@components/SkeletonLoader";
import LazyImage from "@components/LazyImage";
import { RegionItem } from "@interfaces/api";
import { useTranslation } from "react-i18next";

export interface CountryGridProps {
  countries: RegionItem[];
  isLoading: boolean;
  onCountrySelect: (country: RegionItem) => void;
}

const CountryGrid: React.FC<CountryGridProps> = ({
  countries,
  isLoading,
  onCountrySelect,
}) => {
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState<RegionItem | null>(
    null
  );

  const handleCountrySelect = (country: RegionItem) => {
    setSelectedCountry(country);
    onCountrySelect(country);
  };

  return (
    <div className={styles.countryGrid}>
      {isLoading ? (
        Array(countries?.length || 8)
          .fill(0)
          .map((_, index) => <SkeletonLoader key={index} />)
      ) : countries.length > 0 ? (
        countries?.map((country, index) => {
          return (
            <div
              key={country.name + "_" + index}
              className={`${styles.countryCard} ${
                selectedCountry?.name === country?.name
                  ? styles.selectedCountry
                  : ""
              }`}
              onClick={() => handleCountrySelect(country)}
            >
              <LazyImage src={country?.flagUrl} alt={country?.name} />
              <span className={styles.countryName}>{country?.name}</span>
            </div>
          );
        })
      ) : (
        <div className={styles.noDataMessage}>{t("no-country")}</div>
      )}
    </div>
  );
};

export default CountryGrid;
