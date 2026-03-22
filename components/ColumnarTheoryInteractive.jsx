"use client";

import { useMemo, useState } from "react";
import { buildColumnarTrace } from "../lib/ciphers/columnar";
import ColumnarVisualizer from "./ColumnarVisualizer";
import styles from "./ColumnarTheoryInteractive.module.css";

export default function ColumnarTheoryInteractive() {
  const [keyword, setKeyword] = useState("BAC");
  const [plain, setPlain] = useState("HELLO");
  const [pad, setPad] = useState("X");

  const trace = useMemo(() => {
    try {
      const p = (pad || "X").toUpperCase().replace(/[^A-Z]/g, "")[0] || "X";
      return buildColumnarTrace(plain, keyword, p, "encrypt");
    } catch {
      return null;
    }
  }, [keyword, plain, pad]);

  const err = useMemo(() => {
    try {
      const p = (pad || "X").toUpperCase().replace(/[^A-Z]/g, "")[0] || "X";
      buildColumnarTrace(plain, keyword, p, "encrypt");
      return null;
    } catch (e) {
      return e.message || "Invalid input";
    }
  }, [keyword, plain, pad]);

  return (
    <div className={styles.wrap}>
      <p className={styles.intro}>
        Use a keyword of letters <strong>A–Z</strong> and/or digits <strong>0–9</strong> (digits order before letters). Only letters <strong>A–Z</strong> go into the grid (spaces and punctuation are ignored, matching the tool).
      </p>

      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.lab}>Keyword</span>
          <input
            className={styles.input}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. CIPHER or 3142"
            spellCheck={false}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.lab}>Plaintext</span>
          <input
            className={styles.input}
            value={plain}
            onChange={(e) => setPlain(e.target.value)}
            placeholder="letters A–Z"
            spellCheck={false}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.lab}>Pad letter</span>
          <input
            className={styles.inputPad}
            value={pad}
            onChange={(e) => {
              const u = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
              setPad(u[0] || "X");
            }}
            maxLength={1}
            placeholder="X"
          />
        </label>
      </div>

      {err && <div className={styles.error}>{err}</div>}

      {trace && !err && (
        <div className={styles.viz}>
          <ColumnarVisualizer data={trace} />
        </div>
      )}
    </div>
  );
}
