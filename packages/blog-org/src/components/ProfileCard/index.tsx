import React from "react";
import InfoBox from "@/components/InfoBox";
import styles from "./index.module.scss";
import { FaGithub, FaQq, FaEnvelope } from "react-icons/fa";
import { ProfileCardProps } from "Components";

const ProfileCard: React.FC<ProfileCardProps> = ({
  avatarUrl,
  name,
  description,
  articlesCount,
  tagsCount,
  categoriesCount,
  qqLink,
  emailLink,
  githubLink,
}) => {
  return (
    <InfoBox>
      <div className={styles.container}>
        <div
          className={styles.avatar}
          style={{
            backgroundImage: `url(${avatarUrl || "/gibe.png"})`,
          }}
        ></div>
        <div className={styles.name}>{name}</div>
        <div className={styles.description}>{description}</div>

        <div className={styles.categories}>
          <span>
            文章<div>{articlesCount}</div>
          </span>
          <span>
            标签<div>{tagsCount}</div>
          </span>
          <span>
            分类<div>{categoriesCount}</div>
          </span>
        </div>

        <div className={styles.links}>
          <a href={qqLink} className={styles.link}>
            <FaQq size={24} color="#444" />
          </a>
          <a href={`mailto:${emailLink}`} className={styles.link}>
            <FaEnvelope size={24} color="#444" />
          </a>
          <a href={githubLink} className={styles.link}>
            <FaGithub size={24} color="#444" />
          </a>
        </div>
      </div>
    </InfoBox>
  );
};

export default ProfileCard;
