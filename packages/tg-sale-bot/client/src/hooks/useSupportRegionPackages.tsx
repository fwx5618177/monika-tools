import { getRegionPackages, getSupportRegionPackages } from "@apis/request_api";
import { message } from "@components/MessageProvider";
import { SupportRegionPackages } from "@interfaces/api";
import { AppDispatch, updatePackagesInfo } from "@store/store";
import { getQueryParams } from "@utils/getQueryParams";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const useSupportRegionPackages = () => {
  const dispatch = useDispatch<AppDispatch>();
  const urlParams = getQueryParams<{
    phoneNumber: string;
    productId: string;
    countryCode: string;
  }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<SupportRegionPackages[]>([]);

  const handleSupportRegionPackages = useCallback(async () => {
    setLoading(true);
    try {
      if (urlParams?.countryCode) {
        const data = await getSupportRegionPackages({
          countryCode: urlParams?.countryCode,
          phoneNumber: urlParams?.phoneNumber,
        });

        dispatch(updatePackagesInfo(data));
        setList(data);
      } else {
        const data = await getRegionPackages({
          countryCode: urlParams?.countryCode,
          phoneNumber: urlParams?.phoneNumber,
        });

        dispatch(updatePackagesInfo(data));
        setList(data);
      }
    } catch (err) {
      message.error("Error fetching regions");
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [dispatch, urlParams?.countryCode, urlParams?.phoneNumber]);

  useEffect(() => {
    handleSupportRegionPackages();
  }, [handleSupportRegionPackages]);

  return {
    list,
    loading,
  };
};
