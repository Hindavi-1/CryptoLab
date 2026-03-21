import Link from "next/link";
import styles from "./CipherCard.module.css";

const CATEGORY_ICONS = {
  Classical: "⟳",
  Modern: "◈",
  Hash: "⊞",
};

const CATEGORY_COLORS = {
  Classical: "accent",
  Modern: "purple",
  Hash: "orange",
};

const TAG_ICONS = {
  Symmetric:    "⇄",
  Asymmetric:   "⤢",
  "Block Cipher": "⊡",
  Transposition: "⊠",
  Keyless:      "◉",
};

export default function CipherCard({ name, slug, description, category, tag }) {
  const colorKey = CATEGORY_COLORS[category] || "accent";
  const catIcon  = CATEGORY_ICONS[category] || "◈";
  const tagIcon  = TAG_ICONS[tag] || "·";

  return (
    <div className={`${styles.card} ${styles[`card_${colorKey}`]}`}>
      {/* Shimmer top bar */}
      <div className={`${styles.cardBar} ${styles[`cardBar_${colorKey}`]}`} />

      <div className={styles.top}>
        <div className={styles.meta}>
          {category && (
            <span className={`${styles.category} ${styles[`cat_${colorKey}`]}`}>
              <span className={styles.catIcon}>{catIcon}</span>
              {category}
            </span>
          )}
          {tag && (
            <span className={styles.tag}>
              {tagIcon} {tag}
            </span>
          )}
        </div>

        <div className={styles.nameRow}>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.slugChip}>{slug}</span>
        </div>

        <p className={styles.desc}>{description}</p>
      </div>

      <div className={styles.actions}>
        <Link href={`/cipher/${slug}`} className={styles.linkBtn}>
          Theory
        </Link>
        <Link href={`/tools/${slug}`} className={`${styles.primaryBtn} ${styles[`primaryBtn_${colorKey}`]}`}>
          Open Tool
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
