"use client";
import { useState, useEffect } from "react";
import { encryptCaesar, decryptCaesar } from "../lib/ciphers/caesar";
import { encryptVigenere, decryptVigenere } from "../lib/ciphers/vigenere";
import styles from "./SimulationPanel.module.css";

const CIPHERS = [
  { value: "caesar", label: "Caesar Cipher" },
  { value: "vigenere", label: "Vigenère Cipher" },
];

export default function SimulationPanel() {
  const [cipher, setCipher] = useState("caesar");
  const [plaintext, setPlaintext] = useState("HELLO WORLD");
  const [key, setKey] = useState("3");
  const [result, setResult] = useState("");
  const [steps, setSteps] = useState([]);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState("encrypt");

  const buildSteps = (text, cipherType, k, m) => {
    const stepsArr = [];
    if (cipherType === "caesar") {
      const shift = parseInt(k) || 3;
      stepsArr.push({ label: "Input", value: text, color: "blue" });
      stepsArr.push({ label: `Shift Value`, value: `+${shift} positions`, color: "yellow" });
      const partial = text
        .split("")
        .map((c) => {
          if (/[A-Za-z]/.test(c)) {
            const base = c >= "a" ? 97 : 65;
            const s = m === "encrypt" ? shift : 26 - shift;
            return String.fromCharCode(((c.charCodeAt(0) - base + s) % 26) + base);
          }
          return c;
        })
        .join("");
      stepsArr.push({ label: "Character Substitution", value: partial, color: "orange" });
      stepsArr.push({ label: "Output", value: partial, color: "green" });
    } else if (cipherType === "vigenere") {
      const cleanKey = (k || "KEY").toUpperCase().replace(/[^A-Z]/g, "") || "KEY";
      stepsArr.push({ label: "Input", value: text, color: "blue" });
      stepsArr.push({ label: "Keyword", value: cleanKey, color: "yellow" });
      const keyExpanded = text
        .split("")
        .map((c, i) => (/[A-Za-z]/.test(c) ? cleanKey[i % cleanKey.length] : "-"))
        .join("");
      stepsArr.push({ label: "Key Expansion", value: keyExpanded, color: "orange" });
      const out = m === "encrypt" ? encryptVigenere(text, cleanKey) : decryptVigenere(text, cleanKey);
      stepsArr.push({ label: "Output", value: out, color: "green" });
    }
    return stepsArr;
  };

  const runSimulation = () => {
    if (!plaintext.trim()) return;
    setRunning(true);
    setResult("");
    setSteps([]);

    const allSteps = buildSteps(plaintext, cipher, key, mode);
    allSteps.forEach((step, i) => {
      setTimeout(() => {
        setSteps((prev) => [...prev, step]);
        if (i === allSteps.length - 1) {
          setResult(step.value);
          setRunning(false);
        }
      }, i * 500);
    });
  };

  return (
    <div className={styles.panel}>
      <div className={styles.config}>
        <div className={styles.configRow}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Cipher Algorithm</label>
            <select
              className={styles.select}
              value={cipher}
              onChange={(e) => { setCipher(e.target.value); setSteps([]); setResult(""); }}
            >
              {CIPHERS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Mode</label>
            <div className={styles.modeSwitch}>
              {["encrypt", "decrypt"].map((m) => (
                <button
                  key={m}
                  className={`${styles.modeBtn} ${mode === m ? styles.modeBtnActive : ""}`}
                  onClick={() => { setMode(m); setSteps([]); setResult(""); }}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>
              {cipher === "caesar" ? "Shift (0–25)" : "Keyword"}
            </label>
            <input
              className={styles.input}
              type={cipher === "caesar" ? "number" : "text"}
              min="0"
              max="25"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={cipher === "caesar" ? "3" : "KEY"}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Plaintext Input</label>
          <input
            className={styles.textInput}
            type="text"
            value={plaintext}
            onChange={(e) => { setPlaintext(e.target.value); setSteps([]); setResult(""); }}
            placeholder="Enter text to encrypt…"
          />
        </div>

        <button
          className={styles.runBtn}
          onClick={runSimulation}
          disabled={running || !plaintext.trim()}
        >
          {running ? (
            <>
              <span className={styles.spinner} />
              Simulating…
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
              </svg>
              Run Simulation
            </>
          )}
        </button>
      </div>

      {steps.length > 0 && (
        <div className={styles.steps}>
          <div className={styles.stepsHeader}>
            <span className={styles.stepsTitle}>Simulation Steps</span>
            <span className={styles.stepCount}>{steps.length} / 4 steps</span>
          </div>
          <div className={styles.stepsList}>
            {steps.map((step, i) => (
              <div key={i} className={`${styles.step} ${styles[`step_${step.color}`]}`}>
                <div className={styles.stepNum}>{i + 1}</div>
                <div className={styles.stepBody}>
                  <span className={styles.stepLabel}>{step.label}</span>
                  <span className={styles.stepValue}>{step.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div className={styles.result}>
          <div className={styles.resultLabel}>
            {mode === "encrypt" ? "🔐 Encrypted Output" : "🔓 Decrypted Output"}
          </div>
          <div className={styles.resultText}>{result}</div>
        </div>
      )}
    </div>
  );
}
