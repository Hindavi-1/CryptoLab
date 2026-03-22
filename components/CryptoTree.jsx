"use client";
import { useState } from "react";
import Link from "next/link";
import { cryptoTree } from "../data/cryptoTree";
import styles from "./CryptoTree.module.css";

// Color / accent per node type
const TYPE_CONFIG = {
  root:        { accent: "#a78bfa", glow: "rgba(167,139,250,0.18)" },
  category:    { accent: "#38bdf8", glow: "rgba(56,189,248,0.15)"  },
  subcategory: { accent: "#34d399", glow: "rgba(52,211,153,0.14)"  },
  group:       { accent: "#fb923c", glow: "rgba(251,146,60,0.13)"  },
  cipher:      { accent: "#f472b6", glow: "rgba(244,114,182,0.12)" },
};

function TreeNode({ node, depth = 0, parentAccent }) {
  const cfg   = TYPE_CONFIG[node.type] || TYPE_CONFIG.cipher;
  const acc   = cfg.accent;
  const glow  = cfg.glow;

  const hasChildren = node.children && node.children.length > 0;
  const isLeaf      = !hasChildren && node.slug;

  // Root & categories start expanded; deeper nodes start collapsed
  const [expanded, setExpanded] = useState(depth < 1);
  const [selected, setSelected] = useState(false);

  const handleClick = () => {
    if (hasChildren) setExpanded((v) => !v);
    else if (isLeaf)  setSelected((v) => !v);
  };

  return (
    <div className={styles.nodeWrapper} style={{ "--depth": depth, "--acc": acc, "--glow": glow }}>
      {/* Connector line from parent */}
      {depth > 0 && <div className={styles.connector} style={{ "--parent-acc": parentAccent || acc }} />}

      {/* Node pill */}
      <div
        className={`
          ${styles.node}
          ${styles[`type_${node.type}`]}
          ${expanded ? styles.nodeExpanded : ""}
          ${selected ? styles.nodeSelected : ""}
        `}
        onClick={handleClick}
        role={hasChildren ? "button" : "listitem"}
        aria-expanded={hasChildren ? expanded : undefined}
      >
        {/* Left icon */}
        <span className={styles.nodeIcon}>{node.icon}</span>

        {/* Label */}
        <span className={styles.nodeLabel}>{node.label}</span>

        {/* Right side: badge or chevron */}
        {isLeaf && (
          <span className={styles.badge}>{node.slug}</span>
        )}
        {hasChildren && (
          <span className={`${styles.chevron} ${expanded ? styles.chevronOpen : ""}`}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
      </div>

      {/* Expanded cipher card */}
      {isLeaf && selected && (
        <div className={styles.card} style={{ "--acc": acc, "--glow": glow }}>
          <div className={styles.cardIcon}>{node.icon}</div>
          <p className={styles.cardDesc}>{node.description}</p>
          <div className={styles.cardActions}>
            <Link href={`/cipher/${node.slug}`} className={styles.cardBtn} style={{ "--acc": acc }}>
              📖 Theory
            </Link>
            <Link href={`/tools/${node.slug}`} className={styles.cardBtnOutline} style={{ "--acc": acc }}>
              🛠 Tool
            </Link>
            <Link href={`/simulation?cipher=${node.slug}`} className={styles.cardBtnOutline} style={{ "--acc": acc }}>
              🎮 Simulate
            </Link>
          </div>
        </div>
      )}

      {/* Children */}
      {hasChildren && expanded && (
        <div className={styles.children}>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} parentAccent={acc} />
          ))}
        </div>
      )}
    </div>
  );
}

// Legend item
function LegendItem({ type }) {
  const cfg   = TYPE_CONFIG[type];
  const names = { category: "Key Type", subcategory: "Technique", group: "Class", cipher: "Cipher" };
  return (
    <div className={styles.legendItem}>
      <span className={styles.legendDot} style={{ "--acc": cfg.accent, "--glow": cfg.glow }} />
      <span className={styles.legendLabel}>{names[type]}</span>
    </div>
  );
}

export default function CryptoTree() {
  return (
    <section className={styles.section}>
      {/* Background decorations */}
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />
      <div className={styles.bgOrb3} />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>🗺 Interactive Map</span>
          <h2 className={styles.title}>Cryptography Classification Tree</h2>
          <p className={styles.subtitle}>
            Explore the complete landscape of cryptographic techniques — expand any
            branch and click a cipher to dive in.
          </p>
          {/* Legend */}
          <div className={styles.legend}>
            {["category","subcategory","group","cipher"].map((t) => (
              <LegendItem key={t} type={t} />
            ))}
          </div>
        </div>

        {/* Tree panel */}
        <div className={styles.treePanel}>
          <div className={styles.treePanelGlow} />
          <TreeNode node={cryptoTree} depth={0} />
        </div>
      </div>
    </section>
  );
}
