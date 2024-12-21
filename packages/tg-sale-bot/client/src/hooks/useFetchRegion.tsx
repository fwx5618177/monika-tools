import { getAvailableRegions, getSupportRegions } from "@apis/request_api";
import { getQueryParams } from "@utils/getQueryParams";
import { getRegions } from "@utils/region";
import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, updateCountriesInfo } from "@store/store";
import { RegionItem } from "@interfaces/api";

const useFetchRegion = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { countriesInfo } = useSelector((state: RootState) => state.info);
  const urlParams = getQueryParams<{
    phoneNumber: string;
    countryCode: string;
  }>();
  const [list, setList] = useState<RegionItem[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  /** 获取所有地图(external) */
  const handleFetchAllRegions = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedList = await getAvailableRegions();
      if (countriesInfo?.length) {
        const mapList: RegionItem[] = fetchedList?.map((item) => {
          const find = countriesInfo?.find(
            (country) => country.code === item.code
          );

          return {
            ...item,
            flagUrl: find?.flagUrl as string,
          };
        });

        setList(mapList);
        setRegions(getRegions(fetchedList));
        return;
      }
      setList(fetchedList);
      setRegions(getRegions(fetchedList));
      dispatch(updateCountriesInfo(fetchedList));
    } catch (err) {
      setList([]);
      setRegions([]);
      dispatch(updateCountriesInfo([]));
    } finally {
      setLoading(false);
    }
  }, [dispatch, countriesInfo]);

  /** 获取手机号支持的地区列表 */
  const handleFetchSupportRegions = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedList = await getSupportRegions({
        phoneNumber: urlParams?.phoneNumber,
        countryCode: urlParams?.countryCode,
      });

      if (countriesInfo?.length) {
        const mapList: RegionItem[] = fetchedList?.map((item) => {
          const find = countriesInfo?.find((country) => {
            return country.code === item.code;
          });

          return {
            ...item,
            flagUrl: find?.flagUrl as string,
          };
        });

        setList(mapList);
        setRegions(getRegions(fetchedList));
        return;
      }

      setList(fetchedList);
      setRegions(getRegions(fetchedList));
    } catch (error) {
      setList([]);
      setRegions([]);
      console.error("Error fetching supported regions:", error);
    } finally {
      setLoading(false);
    }
  }, [countriesInfo, urlParams?.countryCode, urlParams?.phoneNumber]);

  useEffect(() => {
    // 如果 URL 参数中存在 phoneNumber，调用 handleFetchSupportRegions
    if (urlParams?.phoneNumber) {
      handleFetchSupportRegions();
    } else {
      handleFetchAllRegions();
    }
  }, [
    countriesInfo,
    handleFetchAllRegions,
    handleFetchSupportRegions,
    urlParams?.phoneNumber,
  ]);

  return {
    list,
    regions,
    loading,
    handleFetchAllRegions,
  };
};

export default useFetchRegion;
