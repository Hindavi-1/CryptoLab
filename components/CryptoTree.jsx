"use client";
import { useState } from "react";
import Link from "next/link";
import { cryptoTree } from "../data/cryptoTree";
import styles from "./CryptoTree.module.css";

function TreeNode({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const [selected, setSelected] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isLeaf = !hasChildren && node.slug;

  return (
    <div className={styles.nodeWrapper} style={{ "--depth": depth }}>
      <div
        className={`${styles.node} ${isLeaf ? styles.leaf : styles.branch} ${selected ? styles.selected : ""}`}
        onClick={() => {
          if (hasChildren) setExpanded((v) => !v);
          if (isLeaf) setSelected((v) => !v);
        }}
      >
        {hasChildren && (
          <span className={`${styles.arrow} ${expanded ? styles.arrowOpen : ""}`}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 3L5 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
        {!hasChildren && <span className={styles.dot} />}
        <span className={styles.nodeLabel}>{node.label}</span>
        {isLeaf && (
          <span className={styles.badge}>{node.slug}</span>
        )}
      </div>

      {/* Leaf card */}
      {isLeaf && selected && (
        <div className={styles.card}>
          <p className={styles.cardDesc}>{node.description}</p>
          <div className={styles.cardActions}>
            <Link href={`/cipher/${node.slug}`} className={styles.cardBtn}>
              View Theory
            </Link>
            <Link href={`/cipher/${node.slug}`} className={styles.cardBtnOutline}>
              Open Tool
            </Link>
            <Link href={`/simulation?cipher=${node.slug}`} className={styles.cardBtnOutline}>
              Simulation
            </Link>
          </div>
        </div>
      )}

      {/* Children */}
      {hasChildren && expanded && (
        <div className={styles.children}>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CryptoTree() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Interactive Map</span>
          <h2 className={styles.title}>Cryptography Classification Tree</h2>
          <p className={styles.subtitle}>
            Explore the full landscape of cryptographic techniques. Click any node to expand — click a cipher to learn more.
          </p>
        </div>
        <div className={styles.treeWrap}>
          <TreeNode node={cryptoTree} depth={0} />
        </div>
      </div>
    </section>
  );
}
