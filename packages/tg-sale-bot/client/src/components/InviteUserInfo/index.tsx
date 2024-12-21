import React from "react";
import styles from "./index.module.scss";

// interface InviteUserInfoProps {}

const InviteUserInfo: React.FC = () => {
  return (
    <div className={styles.container}>
      <img className={styles.avatar} src="/invite_user.png" alt="invite user" />
      <div className={styles.instro}>
        <div className={styles.relation}>Your friend</div>
        <div className={styles.name}>Jacky</div>
        <div className={styles.desc}>
          You're being invited to join this group, do you have any ideas?
        </div>
      </div>
    </div>
  );
};

export default InviteUserInfo;
