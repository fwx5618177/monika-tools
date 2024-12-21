import React, { useCallback, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./index.module.scss";
import { useTranslation } from "react-i18next";
import { fetchRegions } from "@apis/external_region";
import { flatRegionList, getRegions } from "@utils/region";
import { message } from "@components/MessageProvider";
import { BuySimRequestData } from "@interfaces/api";

interface PurchaseFormProps {
  onSubmit: (values: BuySimRequestData) => void;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({ onSubmit }) => {
  const [regions, setRegions] = useState<string[]>([]);
  const [countries, setCountries] = useState<
    { region: string; name: string }[]
  >([]);
  const { t } = useTranslation();

  const fetchRegionsAndCountries = useCallback(async () => {
    try {
      const data = await fetchRegions();

      const uniqueRegions = getRegions(flatRegionList(data));

      const countriesList = data.map(
        (item: { region: string; name: { common: string } }) => ({
          region: item.region,
          name: item.name.common,
        })
      );

      setRegions(uniqueRegions);
      setCountries(countriesList);
    } catch (error) {
      console.error("Error fetching countries and regions:", error);
    }
  }, []);

  useEffect(() => {
    fetchRegionsAndCountries();
  }, [fetchRegionsAndCountries]);

  const initialValues = {
    receiverName: "",
    telephone: "",
    region: "",
    country: "",
    address: "",
    zipcode: "",
  };

  const validationSchema = Yup.object({
    receiverName: Yup.string().required(t("validation-required")),
    telephone: Yup.string().required(t("validation-required")),
    region: Yup.string().required(t("validation-required")),
    country: Yup.string().required(t("validation-required")),
    address: Yup.string().required(t("validation-required")),
    zipcode: Yup.string().required(t("validation-required")),
  });

  const handleSubmit = (values: typeof initialValues) => {
    try {
      console.log("Form submitted with values:", values);
      onSubmit(values);
    } catch (error) {
      message.error("Failed to submit form");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values }) => (
        <Form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="receiverName">
              {t("order-sim-purchase-receiver")}
            </label>
            <Field name="receiverName" />
            <ErrorMessage
              name="receiverName"
              component="div"
              className={styles.error}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="telephone">{t("order-sim-purchase-phone")}</label>
            <Field name="telephone" />
            <ErrorMessage
              name="telephone"
              component="div"
              className={styles.error}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="region">{t("order-sim-receive-region")}</label>
            <Field as="select" name="region">
              <option value="">{t("select-region")}</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="region"
              component="div"
              className={styles.error}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="country">{t("order-sim-receive-country")}</label>
            <Field as="select" name="country" disabled={!values.region}>
              <option value="">{t("select-country")}</option>
              {countries
                .filter((country) => country.region === values.region)
                .map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
            </Field>
            <ErrorMessage
              name="country"
              component="div"
              className={styles.error}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">{t("order-sim-purchase-address")}</label>
            <Field name="address" />
            <ErrorMessage
              name="address"
              component="div"
              className={styles.error}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="zipcode">{t("order-sim-purchase-zipcode")}</label>
            <Field name="zipcode" />
            <ErrorMessage
              name="zipcode"
              component="div"
              className={styles.error}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            {t("submit")}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default PurchaseForm;
