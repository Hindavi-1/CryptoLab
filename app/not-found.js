import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.code}>404</div>
        <div className={styles.cipher}>
          <span className={styles.plain}>PAGE NOT FOUND</span>
          <span className={styles.arrow}>→</span>
          <span className={styles.encrypted}>CNTR ABG SBHAQ</span>
        </div>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.desc}>
          The page you&apos;re looking for doesn&apos;t exist — or it may have been moved. Perhaps it was encrypted?
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.homeBtn}>← Back to Home</Link>
          <Link href="/tools" className={styles.toolsBtn}>Explore Tools</Link>
        </div>
        <p className={styles.hint}>
          <span className={styles.hintLabel}>Hint:</span> Caesar cipher, shift 13
        </p>
      </div>
    </div>
  );
}
