import { Query, UseQueryResult, useQuery } from "react-query";
import { PostServiceApi } from "./PostServiceApi";
import { DetailArticleDisplayResponse } from "Response";
import { post } from "@/utils/post.method";

/**
 * 获取远端的文档详细数据
 * @param params
 * @param content
 * @returns
 */
export const usePostDetailData = <T>(
  params: T,
  content: string
): UseQueryResult<DetailArticleDisplayResponse> => {
  return useQuery({
    queryKey: ["detail", params],
    queryFn: async () => {
      const response = await post<DetailArticleDisplayResponse>(
        PostServiceApi.postDetail,
        params as T
      );

      return response;
    },

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !content || !!params,
  });
};

/**
 * 推送数据到远端
 * @param params
 * @returns
 */
export const usePostPushLocalPost = <T, U>(params: T): UseQueryResult<U> => {
  return useQuery({
    queryKey: ["pushLocalPost", params],
    queryFn: async () => {
      const response = await post<U>(PostServiceApi.postPushLocalPost, params);

      return response;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !!params,
  });
};
