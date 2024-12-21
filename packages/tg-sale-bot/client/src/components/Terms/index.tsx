import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import styles from "./index.module.scss";
import { FaCheck } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { message } from "@components/MessageProvider";
import { constants } from "@constants/variable";

export interface TermsProps {
  validate: () => boolean;
}

const Terms = forwardRef<TermsProps>((_props, ref) => {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);
  const { t } = useTranslation("common");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState<boolean>(true);
  const [isCheckboxInvalid, setIsCheckboxInvalid] = useState<boolean>(false);

  const handleCheckboxChange = () => {
    setIsCheckboxChecked(!isCheckboxChecked);
    if (isCheckboxInvalid) {
      setIsCheckboxInvalid(false);
    }
  };

  useImperativeHandle(ref, () => ({
    validate() {
      if (!isCheckboxChecked) {
        message.error(t("terms-mention"));
        setIsCheckboxInvalid(true);
        checkboxRef.current?.focus();

        if (labelRef.current) {
          labelRef.current.classList.add(styles.shake);

          setTimeout(() => {
            labelRef.current?.classList.remove(styles.shake);
          }, constants.termsShakeDuration);
        }
        return false;
      }
      return true;
    },
  }));

  return (
    <div className={styles.footer}>
      <div
        className={`${styles.check} ${isCheckboxInvalid ? styles.invalid : ""}`}
      >
        <input
          type="checkbox"
          id="terms"
          checked={isCheckboxChecked}
          onChange={handleCheckboxChange}
          ref={checkboxRef}
        />
        <FaCheck
          className={styles.checkIcon}
          style={{ display: isCheckboxChecked ? "block" : "none" }}
        />
      </div>
      <label htmlFor="terms" ref={labelRef}>
        {t("read-terms")}
        <a href="/terms">{t("terms")}</a>
      </label>
    </div>
  );
});

export default Terms;
