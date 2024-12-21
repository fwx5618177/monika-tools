import { sendVerifyCode, verifyEmail } from "@apis/request_api";
import { message } from "@components/MessageProvider";
import {
  SendVerifyCodeRequest,
  SendVerifyCodeResponse,
  UserInfo,
  VerifyEmailRequestData,
} from "@interfaces/api";
import { RootState, updateUserInfo } from "@store/store";
import { encodeToBase64 } from "@utils/encodeToBase64";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useVerifyEmail = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verifyData, setVerifyData] = useState<
    SendVerifyCodeResponse | undefined
  >(undefined);

  const sentVerifyCode = useCallback(
    async ({ email }: SendVerifyCodeRequest) => {
      setIsLoading(true);

      const result = await sendVerifyCode({ email: encodeToBase64(email) });

      setVerifyData(result);
      setIsLoading(false);
    },
    []
  );

  const verify = useCallback(
    async ({
      email,
      code,
    }: Omit<VerifyEmailRequestData, "clientVerifyCode">) => {
      setIsLoading(true);

      if (!verifyData?.clientVerifyCode) {
        message.error("Please send verification code first!");
        return false;
      }

      const result = await verifyEmail({
        email: encodeToBase64(email),
        code,
        clientVerifyCode: verifyData?.clientVerifyCode,
      });

      setIsLoading(false);

      if (result?.verified) {
        dispatch(
          updateUserInfo({
            ...userInfo,
            isVerifiedEmail: result?.verified,
          } as UserInfo)
        );

        return result.verified;
      }

      return false;
    },
    [dispatch, userInfo, verifyData?.clientVerifyCode]
  );

  return {
    isLoading,
    verifyData,
    sentVerifyCode,
    verify,
  };
};
