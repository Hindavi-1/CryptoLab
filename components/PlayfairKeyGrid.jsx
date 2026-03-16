"use client";
import { useMemo } from "react";
import { buildKeySquare } from "../lib/ciphers/playfair";
import styles from "./PlayfairKeyGrid.module.css";

export default function PlayfairKeyGrid({ keyword = "KEY" }) {
  const grid = useMemo(() => {
    try { return buildKeySquare(keyword); }
    catch { return buildKeySquare("KEY"); }
  }, [keyword]);

  const keyLetters = useMemo(() => {
    return new Set(
      (keyword || "KEY").toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "")
    );
  }, [keyword]);

  return (
    <div className={styles.wrap}>
      <div className={styles.label}>5×5 Key Square</div>
      <div className={styles.grid}>
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`${styles.cell} ${keyLetters.has(cell) ? styles.cellKey : ""}`}
            >
              {cell}
            </div>
          ))
        )}
      </div>
      <div className={styles.hint}>Highlighted letters are from the keyword</div>
    </div>
  );
}
