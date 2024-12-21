import { get, post } from "@/utils/post.method";
import {
  UseQueryResult,
  useQuery,
  useMutation,
  UseMutationResult,
} from "react-query";
import { LoginServiceApi } from "./LoginServiceApi";

/**
 * @description 获取登录页背景图
 * @returns
 */
export const useLoginBgImage = <U>(): UseQueryResult<U> => {
  return useQuery({
    queryKey: ["loginBgImage"],
    queryFn: async () => {
      return await get<U>(LoginServiceApi.getLoginPageBgImage);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60 * 24,
  });
};

/**
 * @description 登录
 * @param params { username: string, password: string }
 * @returns
 */
export const useLoginDashboard = <U, T>(): UseMutationResult<U, unknown, T> => {
  return useMutation<U, unknown, T>(async (params) => {
    return await post<U>(LoginServiceApi.loginDashboard, params);
  });
};
