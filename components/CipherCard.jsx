import Link from "next/link";
import styles from "./CipherCard.module.css";

export default function CipherCard({ name, slug, description, category, tag }) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.meta}>
          {category && <span className={styles.category}>{category}</span>}
          {tag && <span className={styles.tag}>{tag}</span>}
        </div>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.desc}>{description}</p>
      </div>
      <div className={styles.actions}>
        <Link href={`/cipher/${slug}`} className={styles.linkBtn}>
          View Theory
        </Link>
        <Link href={`/cipher/${slug}`} className={styles.primaryBtn}>
          Open Tool →
        </Link>
      </div>
    </div>
  );
}
