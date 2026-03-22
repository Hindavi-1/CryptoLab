import Link from "next/link";
import styles from "./SimulationCard.module.css";

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

export default function SimulationCard({ name, slug, description, category, tag }) {
  const colorKey = CATEGORY_COLORS[category] || "accent";
  const catIcon  = CATEGORY_ICONS[category] || "◈";
  const tagIcon  = TAG_ICONS[tag] || "·";

  return (
    <div className={`${styles.card} ${styles[`card_${colorKey}`]}`}>
      {/* Decorative top bar */}
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
          <div className={styles.simBadge}>
            <span className={styles.pulseDot}></span>
            Interactive
          </div>
        </div>

        <p className={styles.desc}>{description}</p>
      </div>

      <div className={styles.actions}>
        <Link href={`/simulation/${slug}`} className={`${styles.primaryBtn} ${styles[`primaryBtn_${colorKey}`]}`}>
          Start Simulation
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"></polygon>
          </svg>
        </Link>
      </div>
    </div>
  );
}
