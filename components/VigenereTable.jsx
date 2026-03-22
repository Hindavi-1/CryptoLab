"use client";
import { useState } from "react";
import styles from "./VigenereTable.module.css";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function VigenereTable() {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredCol, setHoveredCol] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const [activeCol, setActiveCol] = useState(null);
  const [pinned, setPinned] = useState(false);

  const effectiveRow = pinned ? activeRow : hoveredRow;
  const effectiveCol = pinned ? activeCol : hoveredCol;

  const activeLetter =
    effectiveRow !== null && effectiveCol !== null
      ? ALPHABET[(effectiveRow + effectiveCol) % 26]
      : null;

  const handleCellClick = (ri, ci) => {
    if (pinned && activeRow === ri && activeCol === ci) {
      setPinned(false);
      setActiveRow(null);
      setActiveCol(null);
    } else {
      setActiveRow(ri);
      setActiveCol(ci);
      setPinned(true);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.legend}>
          <span className={styles.legendKey}>■ Key row</span>
          <span className={styles.legendPlain}>■ Plaintext column</span>
          <span className={styles.legendActive}>■ Ciphertext cell</span>
        </div>
        {activeLetter && (
          <div className={styles.resultBadge}>
            {pinned ? "📌 " : ""}
            {effectiveRow !== null && ALPHABET[effectiveRow]} ⊕{" "}
            {effectiveCol !== null && ALPHABET[effectiveCol]} ={" "}
            <strong>{activeLetter}</strong>
          </div>
        )}
      </div>
      <p className={styles.hint}>
        Hover or click a cell to see the key row (horizontal), plaintext column
        (vertical), and the resulting ciphertext letter highlighted.
      </p>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.corner}>K\P</th>
              {ALPHABET.split("").map((l, ci) => (
                <th
                  key={ci}
                  className={`${styles.colHeader} ${
                    ci === effectiveCol ? styles.colHl : ""
                  }`}
                  onMouseEnter={() => !pinned && setHoveredCol(ci)}
                  onMouseLeave={() => !pinned && setHoveredCol(null)}
                >
                  {l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ALPHABET.split("").map((rowLetter, ri) => (
              <tr key={ri}>
                <th
                  className={`${styles.rowHeader} ${
                    ri === effectiveRow ? styles.rowHl : ""
                  }`}
                  onMouseEnter={() => !pinned && setHoveredRow(ri)}
                  onMouseLeave={() => !pinned && setHoveredRow(null)}
                >
                  {rowLetter}
                </th>
                {ALPHABET.split("").map((_, ci) => {
                  const letter = ALPHABET[(ri + ci) % 26];
                  const isActive = ri === effectiveRow && ci === effectiveCol;
                  const inRow = ri === effectiveRow && !isActive;
                  const inCol = ci === effectiveCol && !isActive;
                  return (
                    <td
                      key={ci}
                      className={`${styles.cell} ${
                        isActive
                          ? styles.cellActive
                          : inRow
                          ? styles.cellRow
                          : inCol
                          ? styles.cellCol
                          : ""
                      }`}
                      onMouseEnter={() => {
                        if (!pinned) {
                          setHoveredRow(ri);
                          setHoveredCol(ci);
                        }
                      }}
                      onMouseLeave={() => {
                        if (!pinned) {
                          setHoveredRow(null);
                          setHoveredCol(null);
                        }
                      }}
                      onClick={() => handleCellClick(ri, ci)}
                      title={`Key: ${ALPHABET[ri]}, Plain: ${ALPHABET[ci]} → Cipher: ${letter}`}
                    >
                      {letter}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
