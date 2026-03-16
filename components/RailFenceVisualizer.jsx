"use client";
import { useMemo } from "react";
import styles from "./RailFenceVisualizer.module.css";

export default function RailFenceVisualizer({ text = "", rails = 3 }) {
  const r = Math.max(2, Math.min(parseInt(rails) || 3, 6));

  const matrix = useMemo(() => {
    if (!text) return [];
    const n = text.length;
    const grid = Array.from({ length: r }, () => new Array(n).fill(null));
    let rail = 0;
    let dir = 1;
    for (let i = 0; i < n; i++) {
      grid[rail][i] = text[i];
      if (rail === 0) dir = 1;
      else if (rail === r - 1) dir = -1;
      rail += dir;
    }
    return grid;
  }, [text, r]);

  if (!text.trim()) {
    return <div className={styles.empty}>Enter text to visualize the rail fence pattern.</div>;
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.label}>Rail Fence Visualization — {r} rails</div>
      <div className={styles.grid} style={{ "--cols": text.length }}>
        {matrix.map((row, ri) => (
          <div key={ri} className={styles.row}>
            <span className={styles.railNum}>Rail {ri + 1}</span>
            <div className={styles.cells}>
              {row.map((cell, ci) => (
                <div
                  key={ci}
                  className={`${styles.cell} ${cell !== null ? styles.cellFilled : ""}`}
                  style={{ "--rail": ri, "--total-rails": r }}
                >
                  {cell !== null ? cell : ""}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
