import {
  getCheckInIntegral,
  getCheckInPoints,
  getFollowPoint,
} from "@apis/request_api";
import { GetCheckInIntegralResponse } from "@interfaces/api";
import { formatNumber } from "@utils/formatUnit";
import { useCallback, useEffect, useState } from "react";

export const useEarnIntergral = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [checkInIntegral, setCheckInIntegral] =
    useState<GetCheckInIntegralResponse>({
      CheckInIntegral: formatNumber("0"),
      FollowTwitter: formatNumber("0"),
      InviteUser: formatNumber("0"),
    });

  const handleCheckPoints = useCallback(async () => {
    setIsLoading(true);
    const result = await getCheckInIntegral();

    setCheckInIntegral({
      CheckInIntegral: formatNumber(result.CheckInIntegral),
      FollowTwitter: formatNumber(result.FollowTwitter),
      InviteUser: formatNumber(result.InviteUser),
    });
    setIsLoading(false);
  }, []);

  const handleCheckIn = useCallback(async () => {
    setIsLoading(true);
    const result = await getCheckInPoints();

    setIsLoading(false);

    return result;
  }, []);

  const handleFollowPoints = useCallback(async () => {
    setIsLoading(true);
    const result = await getFollowPoint();

    setIsLoading(false);

    return result;
  }, []);

  useEffect(() => {
    handleCheckPoints();
  }, [handleCheckPoints]);

  return {
    isLoading,
    checkInIntegral,
    handleCheckIn,
    handleFollowPoints,
  };
};
