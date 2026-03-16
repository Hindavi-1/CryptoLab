"use client";
import { useEffect } from "react";
import Link from "next/link";
import styles from "./error.module.css";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error("CryptoLab error:", error);
  }, [error]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.icon}>⚠</div>
        <div className={styles.code}>
          <span className={styles.codeLabel}>Error</span>
          <span className={styles.codeMono}>{error?.message || "An unexpected error occurred"}</span>
        </div>
        <h1 className={styles.title}>Something went wrong</h1>
        <p className={styles.desc}>
          An error occurred while rendering this page. You can try again or return to the homepage.
        </p>
        <div className={styles.actions}>
          <button className={styles.retryBtn} onClick={reset}>
            ↺ Try Again
          </button>
          <Link href="/" className={styles.homeBtn}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
