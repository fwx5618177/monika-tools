import React from "react";
import { AvatarProps } from "./types";
import styles from "./avatar.module.scss";

/**
 * Avatar component
 * @param src - The source URL of the avatar image
 * @param name - The name to be displayed inside the avatar
 * @param isSquare - Whether the avatar should be square
 * @param className - Additional classes to be added to the avatar
 * @param stacked - Whether the avatar should be stacked
 * @returns An avatar component
 */
const Avatar: React.FC<AvatarProps> = ({
  src,
  name = "",
  isSquare = false,
  className = "",
  stacked = false,
  ...props
}) => {
  const showText = !src;
  const avatarClasses = `${styles.avatar} ${isSquare ? styles.avatarSquare : ""} ${stacked ? styles.stacked : ""} ${className}`;
  const initial = name ? name.charAt(0).toUpperCase() : "";

  return (
    <span
      className={avatarClasses}
      {...props}
      tabIndex={0}
      aria-label={name || "avatar"}
    >
      {!showText && (
        <img
          alt={name || "avatar"}
          className={styles.avatarImg}
          src={src}
          draggable={false}
        />
      )}
      {showText && <span className={styles.avatarText}>{initial}</span>}
    </span>
  );
};

export default React.memo(Avatar);
