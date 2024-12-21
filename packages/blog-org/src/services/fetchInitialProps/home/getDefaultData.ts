import { ssgData } from "@/controllers/home/ssgData";
import { cache } from "react";
import { HomeResponse } from "Response";
import { NextResponse } from "next/server";
import { HomePageProps } from "Components";

export const revalidate = 3600;

/**
 * Get Home Data
 */
export const getDefaultHomeData = cache(async () => {
  const res: NextResponse<HomeResponse> = await ssgData();
  const data: {
    data: HomePageProps;
  } = await res.json();

  return data?.data;
});
