"use client";
import { useMemo } from "react";
import styles from "./FrequencyAnalysis.module.css";

const ENGLISH_FREQ = {
  E: 12.7, T: 9.1, A: 8.2, O: 7.5, I: 7.0, N: 6.7, S: 6.3, H: 6.1,
  R: 6.0, D: 4.3, L: 4.0, C: 2.8, U: 2.8, M: 2.4, W: 2.4, F: 2.2,
  G: 2.0, Y: 2.0, P: 1.9, B: 1.5, V: 1.0, K: 0.8, J: 0.2, X: 0.2, Q: 0.1, Z: 0.1,
};

export default function FrequencyAnalysis({ text = "" }) {
  const freq = useMemo(() => {
    const counts = {};
    let total = 0;
    for (const ch of text.toUpperCase()) {
      if (ch >= "A" && ch <= "Z") {
        counts[ch] = (counts[ch] || 0) + 1;
        total++;
      }
    }
    return Object.fromEntries(
      Object.entries(counts).map(([k, v]) => [k, ((v / total) * 100).toFixed(1)])
    );
  }, [text]);

  const letters = "ETAOINSHRDLCUMWFGYPBVKJXQZ".split("");
  const maxPct = Math.max(...Object.values(freq).map(Number), 1);

  if (!text.trim()) {
    return (
      <div className={styles.empty}>
        Enter text above to see frequency analysis.
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>Letter Frequency</span>
        <span className={styles.subtitle}>vs. English average</span>
      </div>
      <div className={styles.chart}>
        {letters.map((letter) => {
          const textPct = parseFloat(freq[letter] || 0);
          const engPct = ENGLISH_FREQ[letter];
          const barH = (textPct / maxPct) * 100;
          const engH = (engPct / maxPct) * 100;
          return (
            <div key={letter} className={styles.col}>
              <div className={styles.bars}>
                <div
                  className={styles.barEng}
                  style={{ height: `${engH}%` }}
                  title={`English: ${engPct}%`}
                />
                <div
                  className={`${styles.barText} ${textPct > 0 ? styles.barTextFilled : ""}`}
                  style={{ height: `${barH}%` }}
                  title={`Text: ${textPct}%`}
                />
              </div>
              <span className={styles.letter}>{letter}</span>
            </div>
          );
        })}
      </div>
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles.swatchEng}`} />
          English average
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendSwatch} ${styles.swatchText}`} />
          Your text
        </div>
      </div>
    </div>
  );
}
