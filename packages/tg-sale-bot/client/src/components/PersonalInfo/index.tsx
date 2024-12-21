import React, { useCallback, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, updatePackageInfo } from "@store/store";
import SimCardInfo from "@components/SimCardInfo";
import { getUserPackagesInfo } from "@apis/request_api";
import { PackageInfo, UserPackageInfo } from "@interfaces/api";
import NoData from "@components/NoData";

const PersonalInfo: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo, packageInfo } = useSelector(
    (state: RootState) => state.auth
  );
  const [simCards, setSimCards] = useState<(UserPackageInfo & PackageInfo)[]>(
    packageInfo || []
  );

  const handleDelete = (id: string) => {
    setSimCards(simCards?.filter((sim) => sim.id !== id));
  };

  const fetchUserPackageInfoList = useCallback(async () => {
    const list = await getUserPackagesInfo();

    dispatch(updatePackageInfo(list));
    setSimCards(list);
  }, [dispatch]);

  useEffect(() => {
    fetchUserPackageInfoList();
  }, [fetchUserPackageInfoList]);

  return (
    <div className={styles.profile}>
      <header className={styles.header}>
        <div className={styles.avatar}>
          <img
            className={styles.avatarImage}
            src="/invite_user.png"
            alt="Profile"
          />
          <span className={styles.username}>{userInfo?.username}</span>
        </div>
      </header>

      <div className={styles.list}>
        {simCards?.length > 0 ? (
          simCards?.map((sim, index) => (
            <SimCardInfo
              key={index + "_sim_card"}
              id={sim.id}
              phoneNumber={sim.phoneNumber}
              packageName={sim.packageName}
              usedData={sim.usedData}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <NoData />
        )}
      </div>
    </div>
  );
};

export default PersonalInfo;
