import { ExternalApi } from "./Api";
import { PriceData, RawCountryItem, RegionItem } from "@interfaces/api";

// 根据所有国家信息
export const fetchAllCountries = async (): Promise<RegionItem[]> => {
  const response = await fetch(ExternalApi.fetchRegions);
  if (!response.ok) {
    throw new Error("Failed to fetch all countries");
  }

  const data = (await response.json()) as RawCountryItem[];

  return data?.map(
    (country: {
      name: { common: string };
      flags: { svg: string; png: string };
      region: string;
      code: string;
    }) => ({
      name: country.name.common,
      flagUrl: country.flags.svg || country.flags.png,
      region: country.region,
      code: country.code,
    })
  );
};

// 获取区域（大洲）信息
export const fetchRegions = async (): Promise<RawCountryItem[]> => {
  const response = await fetch(ExternalApi.fetchRegions);
  if (!response.ok) {
    throw new Error("Failed to fetch regions");
  }
  const data = await response.json();

  return data;
};

// 获取指定区域的国家信息
export const fetchCountriesByRegion = async (
  region: string
): Promise<RegionItem[]> => {
  const response = await fetch(
    `${ExternalApi.fetchCountriesByRegion}/${region}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch countries");
  }
  const data = await response.json();

  return data.map(
    (country: {
      name: { common: string };
      flags: { svg: string; png: string };
    }) => ({
      name: country.name.common,
      flagUrl: country.flags.svg || country.flags.png,
    })
  );
};

/** 通过 okx 获取 ton-usdt 的汇率 */
export const fetchTonUsdtPrice = async (): Promise<PriceData> => {
  const response = await fetch(ExternalApi.fetchOKXTonRate);

  if (!response.ok) {
    throw new Error("Failed to fetch ton-usdt price");
  }
  const data = await response.json();

  if (!data.data || data.data.length === 0 || data.code !== "0") {
    throw new Error("Invalid data format");
  }

  return data.data[0];
};
