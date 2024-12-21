import { getInviteData } from "@apis/request_api";
import { GetInviteRewardsResponse } from "@interfaces/api";
import { useCallback, useEffect, useState } from "react";

export const useInviteData = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GetInviteRewardsResponse>({
    count: "0",
    integralTotal: "0",
    records: [],
  });

  const handleInviteData = useCallback(async () => {
    setLoading(true);
    const result = await getInviteData();

    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    handleInviteData();
  }, [handleInviteData]);

  return {
    data,
    loading,
  };
};
