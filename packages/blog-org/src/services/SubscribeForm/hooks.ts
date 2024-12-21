import { post } from "@/utils/post.method";
import { UseMutationResult, useMutation } from "react-query";
import { SubscribeServiceApi } from "./SubscribeServiceApi";

export const useSubscribeEmail = <U, T>(): UseMutationResult<U> => {
  return useMutation({
    mutationFn: async (variables: T) => {
      return await post<U>(SubscribeServiceApi.subscribeEmail, variables);
    },
    mutationKey: ["subscribeEmail"],
  });
};
