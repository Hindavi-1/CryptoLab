"use client";
import { useState } from "react";
import styles from "./VigenereVisualizer.module.css";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/* Minimal inline Vigenère table (26×26) */
function MiniTable({ rowHighlight, colHighlight }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.vigTable}>
        <thead>
          <tr>
            <th className={styles.cornerCell}>K\P</th>
            {ALPHABET.split("").map((l, ci) => (
              <th
                key={l}
                className={`${styles.headerCell} ${ci === colHighlight ? styles.colHighlight : ""}`}
              >
                {l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ALPHABET.split("").map((rowLetter, ri) => (
            <tr key={rowLetter}>
              <th
                className={`${styles.rowHeader} ${ri === rowHighlight ? styles.rowHighlight : ""}`}
              >
                {rowLetter}
              </th>
              {ALPHABET.split("").map((_, ci) => {
                const cellLetter = ALPHABET[(ri + ci) % 26];
                const isActive = ri === rowHighlight && ci === colHighlight;
                const isRowHl = ri === rowHighlight && colHighlight === null;
                const isColHl = ci === colHighlight && rowHighlight === null;
                return (
                  <td
                    key={ci}
                    className={`${styles.cell} ${
                      isActive
                        ? styles.cellActive
                        : ri === rowHighlight
                        ? styles.cellRowHl
                        : ci === colHighlight
                        ? styles.cellColHl
                        : ""
                    }`}
                  >
                    {cellLetter}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function VigenereVisualizer({ stepsData, mode }) {
  const [activeStep, setActiveStep] = useState(0);

  const alphaSteps = stepsData.filter((s) => s.type === "alpha");
  if (alphaSteps.length === 0) return null;

  const current = alphaSteps[Math.min(activeStep, alphaSteps.length - 1)];

  // For encrypt: row = key letter (shift), col = plain letter (inputCode)
  // For decrypt: row = key letter (shift), col = cipher letter (inputCode)
  const rowHighlight = current.shift; // key letter row
  const colHighlight = current.inputCode; // plaintext or ciphertext column

  const keyword = stepsData
    .filter((s) => s.type === "alpha")
    .map((s) => s.keyLetter)
    .join("");

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>
          🔍 Vigenère Table Visualizer
        </span>
        <span className={styles.subtitle}>
          Click a step card to highlight its position in the table
        </span>
      </div>

      {/* Keyword alignment strip */}
      <div className={styles.alignStrip}>
        <span className={styles.stripLabel}>Plaintext</span>
        <div className={styles.stripLetters}>
          {stepsData.map((s, i) => (
            <span
              key={i}
              className={`${styles.stripLetter} ${s.type === "passthrough" ? styles.stripPass : ""}`}
            >
              {s.input}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.alignStrip}>
        <span className={styles.stripLabel}>Key</span>
        <div className={styles.stripLetters}>
          {stepsData.map((s, i) => (
            <span
              key={i}
              className={`${styles.stripLetter} ${styles.stripKey} ${s.type === "passthrough" ? styles.stripPass : ""}`}
            >
              {s.type === "passthrough" ? "-" : s.keyLetter}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.alignStrip}>
        <span className={styles.stripLabel}>Result</span>
        <div className={styles.stripLetters}>
          {stepsData.map((s, i) => (
            <span
              key={i}
              className={`${styles.stripLetter} ${styles.stripResult} ${s.type === "passthrough" ? styles.stripPass : ""}`}
            >
              {s.output}
            </span>
          ))}
        </div>
      </div>

      {/* Step cards */}
      <div className={styles.stepsRow}>
        {alphaSteps.map((step, i) => (
          <button
            key={i}
            className={`${styles.stepCard} ${i === activeStep ? styles.stepCardActive : ""}`}
            onClick={() => setActiveStep(i)}
          >
            <span className={styles.scPlain}>{step.input}</span>
            <span className={styles.scArrow}>→</span>
            <span className={styles.scResult}>{step.output}</span>
            <span className={styles.scKey}>key: {step.keyLetter}</span>
          </button>
        ))}
      </div>

      {/* Current step detail */}
      <div className={styles.stepDetail}>
        <div className={styles.detailBox}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>
              {mode === "encrypt" ? "Plaintext" : "Ciphertext"}
            </span>
            <span className={styles.detailVal}>{current.input} ({current.inputCode})</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Key Letter</span>
            <span className={styles.detailVal}>{current.keyLetter} ({current.shift})</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Formula</span>
            <span className={styles.detailFormula}>{current.formula}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>
              {mode === "encrypt" ? "Ciphertext" : "Plaintext"}
            </span>
            <span className={`${styles.detailVal} ${styles.detailResult}`}>
              {current.output} ({current.outputCode})
            </span>
          </div>
        </div>

        {/* Table lookup description */}
        <div className={styles.lookupHint}>
          <span className={styles.hintIcon}>📌</span>
          {mode === "encrypt"
            ? `Row "${current.keyLetter}" (key) ∩ Column "${current.input}" (plain) = "${current.output}"`
            : `Row "${current.keyLetter}" (key), find "${current.input}" → Column "${current.output}" (plain)`}
        </div>
      </div>

      {/* Mini Vigenère Table */}
      <MiniTable rowHighlight={rowHighlight} colHighlight={colHighlight} />
    </div>
  );
}
