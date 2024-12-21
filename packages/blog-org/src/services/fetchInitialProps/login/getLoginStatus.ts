import { get } from "@/utils/post.method";
import { cache } from "react";

export const revalidate = 3600;

export const getLoginStatus = cache(async (url = "/api/login") => {
  return await get(url);
});
