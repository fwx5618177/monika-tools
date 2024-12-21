import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "@styles/orders.module.scss";
import numeral from "numeral";
import { formatValidity } from "@utils/formatValidity";
import PackageCard from "@components/PackageCard";
import { useTranslation } from "react-i18next";
import { useOrderData } from "@hooks/useOrderData";
import Modal from "@components/Modal";
import PurchaseForm from "@components/PurchaseForm";
import SelectSimCardType from "@components/SelectSimCardType";
import { BuySimRequestData, SimCardType } from "@interfaces/api";
import { buyEsim, buyPackage, buySim } from "@apis/request_api";
import PaymentMethod, { SelectMethod } from "@components/PaymentMethod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, updatePayOrderId } from "@store/store";
import { encodeToBase64 } from "@utils/encodeToBase64";
import { getQueryParams } from "@utils/getQueryParams";
import DataLoading from "@components/DataLoading";

const Packages = () => {
  const urlParams = getQueryParams<{
    phoneNumber: string;
    merchenId: string;
  }>();

  const dispatch = useDispatch<AppDispatch>();
  const { payOrderId } = useSelector((state: RootState) => state.info);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { info, userInfo, isLoading } = useOrderData();
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null
  );
  const [isPurchased, setIsPurchased] = useState<boolean>(false);

  // 控制显示 modal 的状态
  const [showTypeModal, setShowTypeModal] = useState<boolean>(false);
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [showPayModal, setShowPayModal] = useState<boolean>(false);

  const handleBackClick = () => {
    navigate(-1); // 返回上一页
    dispatch(updatePayOrderId("")); // 清空支付订单 ID
  };

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackageId(packageId); // 设置选中的套餐 ID
    setIsPurchased(true); // 设置已购买状态
  };

  const handleConfirmPayment = () => {
    setShowPayModal(true);
  };

  const handlePurchaseTypeSelect = (type: SimCardType) => {
    setShowTypeModal(false);

    if (type === SimCardType.SIM) {
      setShowAddressModal(true); // 显示填写收件信息的 modal
    } else {
      handleEsimPurchase(); // 直接调用接口购买 eSIM
    }
  };

  const handlePurchaseNewPackage = async () => {
    const data = await buyPackage(
      urlParams?.merchenId ?? "",
      urlParams?.phoneNumber
    );
    //message.success("Successfully purchased Package");
    dispatch(updatePayOrderId(data.orderId));
  };

  const handleEsimPurchase = async () => {
    const data = await buyEsim(urlParams?.merchenId);
    dispatch(updatePayOrderId(data.orderId));
  };

  const handleSimPurchase = async (values: BuySimRequestData) => {
    setShowAddressModal(false);
    const data = await buySim(urlParams?.merchenId, values);
    dispatch(updatePayOrderId(data.orderId));
  };

  const handlePay = async (method: SelectMethod) => {
    const payType = encodeToBase64(method);
    const orderId = encodeToBase64(payOrderId || "");

    navigate(`/payment?payType=${payType}&orderId=${orderId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.backIcon} onClick={handleBackClick}>
          <FaChevronLeft />
        </div>
        <h2 className={styles.title}>{t("order-title")}</h2>
      </div>

      <h2 className={styles.orderTitle}>{t("order-title-information")}</h2>

      <div className={styles.orderInfo}>
        <div className={styles.itemName}>{t("order-package-name")}</div>
        <div className={styles.itemInfo}>{info?.name}</div>
        <div className={styles.itemName}>{t("order-package-region")}</div>
        <div className={styles.itemInfo}>
          {info?.specification?.zoneDataName}
        </div>
        <div className={styles.itemName}>{t("order-package-duration")}</div>
        <div className={styles.itemInfo}>
          {formatValidity(info?.specification?.validDays?.toString() ?? "")}
        </div>
        <div className={styles.itemName}>{t("order-package-limit")}</div>
        <div className={styles.itemInfo}>{info?.description}</div>
        <div className={styles.itemName}>{t("price")}</div>
        <div className={styles.icons}>
          <div className={styles.currency}>
            <img src="/dollar.svg" alt="dollar" />
            <span>{numeral(info?.price).format("0,0.00")}</span>
          </div>
          <span className={styles.mention}>{t("or")}</span>
          <div className={styles.currency}>
            <img src="/gold.svg" alt="gold" />
            <span>{numeral(info?.integralPrice).format("0,0")}</span>
          </div>
        </div>
      </div>

      <h2 className={styles.orderTitle}>{t("order-select-package")}</h2>

      <div className={styles.cardList}>
        {isLoading ? (
          <DataLoading />
        ) : (
          userInfo
            ?.filter((pkg) => {
              return pkg.cardExisted;
            })
            .map((pkg, index) => (
              <PackageCard
                key={index + "_card"}
                startTime={pkg.startTime}
                packageId={pkg.packageId}
                endTime={pkg.endTime}
                totalVolume={pkg.totalVolume}
                usedData={pkg.usedData}
                phoneNumber={pkg.phoneNumber}
                packageName={pkg.packageName}
                merchanId={pkg.id}
                isSelected={selectedPackageId === pkg.packageId}
                onSelect={handlePackageSelect}
              />
            ))
        )}
      </div>

      <div className={styles.buttons}>
        <button
          className={`${styles.button} ${styles.purchased}`}
          onClick={() => setShowTypeModal(true)}
        >
          {t("order-newly-purchased")}
        </button>

        {urlParams?.phoneNumber && urlParams?.phoneNumber !== "undefined" && (
          <button
            className={`${styles.button} ${isPurchased ? styles.purchased : styles.buttonDisabled}`}
            onClick={handlePurchaseNewPackage}
            disabled={!isPurchased}
          >
            {t("order-package-purchased")}
          </button>
        )}

        {payOrderId && payOrderId !== "" && (
          <button
            className={`${styles.button} ${styles.confirm}`}
            onClick={handleConfirmPayment}
          >
            {t("order-confirm-payment")}
          </button>
        )}
      </div>

      {/* 支付 */}
      <Modal
        visible={showPayModal}
        onClose={() => {
          setShowPayModal(false);
        }}
        title={t("order-payment-type")}
      >
        <PaymentMethod
          packageName={info?.name as string}
          points={info?.integralPrice || "0"}
          // TODO: credit card
          // allowCreditCard
          allowDigitalWallet
          allowPoints
          onClose={() => {
            setShowPayModal(false);
          }}
          onSelect={handlePay}
        />
      </Modal>

      {/* SIM 卡类型选择 modal */}
      <Modal
        visible={showTypeModal}
        onClose={() => {
          setShowTypeModal(false);
        }}
        title={t("order-payment-sim-card-buy-title")}
      >
        <SelectSimCardType onSelect={handlePurchaseTypeSelect} />
      </Modal>

      {/* 填写收件信息 modal */}
      <Modal
        visible={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
        }}
        title={t("order-sim-purchase-title")}
        type="bottom"
      >
        <PurchaseForm onSubmit={handleSimPurchase} />
      </Modal>
    </div>
  );
};

export default Packages;
