import { useSelector } from "react-redux";
import { RootState } from "@store/store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PackageInfo, PackageItem, UserPackageInfo } from "@interfaces/api";
import { getPackageDetail, getUserPackagesInfoDetail } from "@apis/request_api";
import { getQueryParams } from "@utils/getQueryParams";
import { message } from "@components/MessageProvider";

export const useOrderData = () => {
  const { selectedPackagesInfo, packagesInfo } = useSelector(
    (state: RootState) => state.info
  );

  const urlParams = useMemo(
    () => getQueryParams<{ productId: string; phoneNumber: string }>(),
    []
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [info, setInfo] = useState<PackageItem | undefined>(
    selectedPackagesInfo
  );
  const [userInfo, setUserInfo] = useState<(UserPackageInfo & PackageInfo)[]>(
    []
  );

  const handleFetchProductInfo = useCallback(async () => {
    if (!urlParams?.productId) {
      message.error("Invalid URL parameters for product ID");
      return;
    }

    try {
      const data = await getPackageDetail({ productId: urlParams.productId });
      setInfo(data);
    } catch (error) {
      message.error("Failed to fetch product info");
      console.error("Error fetching product info:", error);
    }
  }, [urlParams?.productId]);

  const handleFetchUserInfo = useCallback(async () => {
    if (!urlParams?.phoneNumber) {
      message.error("Invalid URL parameters for phone number");
      return;
    }

    try {
      setIsLoading(true);
      const data = await getUserPackagesInfoDetail({
        phoneNumber: urlParams.phoneNumber,
      });

      setIsLoading(false);
      setUserInfo(data);
    } catch (error) {
      message.error("Failed to fetch user info");
      console.error("Error fetching user info:", error);
    }
  }, [urlParams?.phoneNumber]);

  useEffect(() => {
    if (!info && urlParams?.productId) {
      handleFetchProductInfo();
    }

    if (urlParams?.phoneNumber) handleFetchUserInfo();
  }, [
    info,
    packagesInfo?.length,
    urlParams?.productId,
    urlParams?.phoneNumber,
    handleFetchProductInfo,
    handleFetchUserInfo,
  ]);

  return {
    info,
    userInfo,
    isLoading,
  };
};
