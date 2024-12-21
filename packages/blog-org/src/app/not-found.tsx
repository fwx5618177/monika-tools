import React from "react";
import Link from "next/link";
import { MdErrorOutline } from "react-icons/md";
import styles from "@/styles/NotFound.module.scss";

export default async function NotFound() {
  return (
    <main className={styles["not-found-container"]}>
      <div className={styles["not-found-card"]}>
        <MdErrorOutline size={80} className={styles["icon"]} />
        <h1>404 - Page Not Found</h1>
        <p>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link href="/">Go to Home</Link>
      </div>
    </main>
  );
}
