"use client";

import styles from "./ColumnarVisualizer.module.css";

function plainLengthBeforePadding(paddedPlain, padChar) {
  let end = paddedPlain.length;
  while (end > 0 && paddedPlain[end - 1] === padChar) end--;
  return end;
}

function isPadCell(mode, row, col, nCols, paddedPlain, padChar) {
  if (mode !== "encrypt") return false;
  const idx = row * nCols + col;
  return idx >= plainLengthBeforePadding(paddedPlain, padChar);
}

export default function ColumnarVisualizer({ data }) {
  if (!data || !data.grid || !data.grid.length) return null;

  const {
    mode,
    keyword,
    ranks,
    readOrder,
    grid,
    paddedPlain,
    padChar,
    ciphertext,
    plaintext,
    columnStrings,
    nCols,
  } = data;

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>Columnar transposition — visual trace</div>

      <div className={styles.metaRow}>
        <span>
          Mode: <code>{mode}</code>
        </span>
        <span>
          Keyword: <code>{keyword}</code>
        </span>
        <span>
          Padding: <code>{padChar}</code> (only for incomplete last row)
        </span>
      </div>

      <div className={styles.keyTable}>
        <div className={styles.keyRow} aria-label="Keyword letters">
          {keyword.split("").map((ch, i) => (
            <div key={i} className={styles.keyCell}>
              {ch}
            </div>
          ))}
        </div>
        <div className={styles.rankRow} aria-label="Column read rank">
          {ranks.map((r, i) => (
            <div key={i} className={styles.rankCell}>
              {r}
            </div>
          ))}
        </div>
      </div>
      <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
        Ranks show the order columns are read: <strong>1</strong> first, then <strong>2</strong>, … Digits sort before letters (0–9 then A–Z); duplicate symbols use left column before right.
      </p>

      <div className={styles.gridWrap}>
        <div className={styles.gridLabel}>
          {mode === "encrypt"
            ? "Grid (plaintext written left → right, top → bottom; dashed rank row matches columns above)"
            : "Reconstructed grid (filled from ciphertext down each column in read order, then read rows for plaintext)"}
        </div>
        <div className={styles.gridRows}>
          {grid.map((row, ri) => (
            <div key={ri} className={styles.gridRow}>
              {row.map((cell, ci) => {
                const padCell =
                  mode === "encrypt" && isPadCell(mode, ri, ci, nCols, paddedPlain, padChar);
                return (
                  <div
                    key={ci}
                    className={`${styles.gridCell} ${padCell ? styles.gridCellPad : ""}`}
                    title={padCell ? "Padding" : undefined}
                  >
                    {cell}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.readSection}>
        <div className={styles.readTitle}>Column read sequence (encryption order)</div>
        <div className={styles.readFlow}>
          {readOrder.map((colIdx, i) => (
            <span key={`${colIdx}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <span className={styles.flowArrow}>→</span>}
              <span className={styles.flowChip}>col {colIdx + 1}</span>
            </span>
          ))}
        </div>

        <table className={styles.chunkTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Column (physical)</th>
              <th>Letters (top → bottom)</th>
            </tr>
          </thead>
          <tbody>
            {readOrder.map((colIdx, seq) => (
              <tr key={`${colIdx}-${seq}`}>
                <td className={styles.chunkOrder}>{seq + 1}</td>
                <td>
                  {colIdx + 1} · &quot;{keyword[colIdx]}&quot; · rank {ranks[colIdx]}
                </td>
                <td className={styles.chunkLetters}>{columnStrings[seq]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.outcome}>
        <div className={styles.outcomeLabel}>{mode === "encrypt" ? "Ciphertext" : "Plaintext (trailing padding removed)"}</div>
        <div className={styles.outcomeValue}>{mode === "encrypt" ? ciphertext : plaintext}</div>
      </div>
    </div>
  );
}
