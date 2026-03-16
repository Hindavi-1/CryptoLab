import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.wrap}>
      <div className={styles.container}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonSubtitle} />
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonTag} />
              <div className={styles.skeletonCardTitle} />
              <div className={styles.skeletonLine} />
              <div className={styles.skeletonLineShort} />
              <div className={styles.skeletonBtn} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
