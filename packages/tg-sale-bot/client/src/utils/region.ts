import { RawCountryItem, RegionItem } from "@interfaces/api";

/**
 * 扁平化区域列表
 * @param list 地区列表
 * @returns
 */
export const flatRegionList = (list: RawCountryItem[]): RegionItem[] => {
  return list?.map((item) => ({
    name: item?.name?.common,
    flagUrl: item?.flags?.svg || item?.flags?.png,
    region: item?.region,
    continent: item?.continents?.[0],
  }));
};

/**
 * 获取地区列表
 * @param list 地区列表
 * @returns 地区列表
 */
export const getRegions = (list: RegionItem[]): Array<string> => {
  const regions = list
    .map((item) => item?.continent)
    .filter((continent): continent is string => !!continent);

  return Array.from(new Set(regions));
};

/**
 * 获取地区的国家列表
 * @param list 地区列表
 * @param region 地区
 * @returns 国家列表
 */
export const getCountries = (
  list: RegionItem[],
  region: string
): RegionItem[] => {
  const filterList = list?.filter(
    (item: RegionItem) =>
      (item as RegionItem)?.continent === region || item?.continent === region
  );

  return filterList?.map((item) => ({
    id: (item as RegionItem)?.id,
    name: item?.name,
    code: (item as RegionItem)?.code,
    flagUrl: item?.flagUrl,
    continent: (item as RegionItem)?.continent,
    enabled: (item as RegionItem)?.enabled,
  }));
};
