"use client";
import { useState } from "react";
import {
  encryptCaesar, decryptCaesar,
  encryptVigenere, decryptVigenere,
  encryptPlayfair, decryptPlayfair,
  encryptRailFence, decryptRailFence,
} from "../lib/ciphers/index";
import styles from "./CipherTool.module.css";

const CIPHERS = [
  { value: "caesar",    label: "Caesar Cipher",    keyLabel: "Shift (0–25)",    keyType: "number", keyPlaceholder: "3" },
  { value: "vigenere",  label: "Vigenère Cipher",  keyLabel: "Keyword",         keyType: "text",   keyPlaceholder: "SECRET" },
  { value: "playfair",  label: "Playfair Cipher",  keyLabel: "Keyword",         keyType: "text",   keyPlaceholder: "KEYWORD" },
  { value: "railfence", label: "Rail Fence Cipher", keyLabel: "Number of Rails", keyType: "number", keyPlaceholder: "3" },
];

function runCipher(cipher, mode, text, key) {
  switch (cipher) {
    case "caesar": {
      const s = parseInt(key) || 3;
      return mode === "encrypt" ? encryptCaesar(text, s) : decryptCaesar(text, s);
    }
    case "vigenere": {
      const k = key || "KEY";
      return mode === "encrypt" ? encryptVigenere(text, k) : decryptVigenere(text, k);
    }
    case "playfair": {
      const k = key || "KEYWORD";
      return mode === "encrypt" ? encryptPlayfair(text, k) : decryptPlayfair(text, k);
    }
    case "railfence": {
      const r = parseInt(key) || 3;
      return mode === "encrypt" ? encryptRailFence(text, r) : decryptRailFence(text, r);
    }
    default:
      return text;
  }
}

export default function CipherTool({ initialCipher = "caesar" }) {
  const [cipher, setCipher] = useState(initialCipher);
  const [mode, setMode]     = useState("encrypt");
  const [input, setInput]   = useState("");
  const [key, setKey]       = useState("");
  const [output, setOutput] = useState("");
  const [error, setError]   = useState("");
  const [copied, setCopied] = useState(false);

  const meta = CIPHERS.find((c) => c.value === cipher) || CIPHERS[0];

  const run = () => {
    if (!input.trim()) return;
    setError("");
    try {
      const result = runCipher(cipher, mode, input, key);
      setOutput(result);
    } catch (e) {
      setError(e.message || "An error occurred.");
      setOutput("");
    }
  };

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swap = () => {
    setInput(output);
    setOutput("");
    setError("");
    setMode((m) => (m === "encrypt" ? "decrypt" : "encrypt"));
  };

  const reset = () => {
    setInput("");
    setKey("");
    setOutput("");
    setError("");
  };

  return (
    <div className={styles.tool}>
      {/* Controls row */}
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label className={styles.label}>Cipher</label>
          <select
            className={styles.select}
            value={cipher}
            onChange={(e) => { setCipher(e.target.value); setOutput(""); setError(""); }}
          >
            {CIPHERS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>Mode</label>
          <div className={styles.modeSwitch}>
            {["encrypt", "decrypt"].map((m) => (
              <button
                key={m}
                className={`${styles.modeBtn} ${mode === m ? styles.modeBtnActive : ""}`}
                onClick={() => { setMode(m); setOutput(""); setError(""); }}
              >
                {m === "encrypt" ? "🔒 Encrypt" : "🔓 Decrypt"}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>{meta.keyLabel}</label>
          <input
            className={styles.input}
            type={meta.keyType}
            min="0"
            max={meta.keyType === "number" ? "25" : undefined}
            placeholder={meta.keyPlaceholder}
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </div>
      </div>

      {/* I/O panels */}
      <div className={styles.panels}>
        {/* Input */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelLabel}>
              {mode === "encrypt" ? "Plaintext Input" : "Ciphertext Input"}
            </span>
            <span className={styles.charCount}>{input.length} chars</span>
          </div>
          <textarea
            className={styles.textarea}
            placeholder={
              mode === "encrypt"
                ? "Type or paste text to encrypt…"
                : "Type or paste text to decrypt…"
            }
            value={input}
            onChange={(e) => { setInput(e.target.value); setOutput(""); setError(""); }}
            rows={7}
          />
        </div>

        {/* Middle controls */}
        <div className={styles.middle}>
          <button className={styles.runBtn} onClick={run} disabled={!input.trim()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Run
          </button>
          <button className={styles.swapBtn} onClick={swap} title="Swap & flip mode" disabled={!output}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </button>
          <button className={styles.resetBtn} onClick={reset} title="Clear all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
            </svg>
          </button>
        </div>

        {/* Output */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelLabel}>
              {mode === "encrypt" ? "Ciphertext Output" : "Plaintext Output"}
            </span>
            {output && (
              <button className={styles.copyBtn} onClick={copy}>
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            )}
          </div>
          <div className={`${styles.output} ${output ? styles.outputFilled : ""} ${error ? styles.outputError : ""}`}>
            {error ? (
              <span className={styles.errorMsg}>⚠ {error}</span>
            ) : output ? (
              output
            ) : (
              <span className={styles.outputPlaceholder}>Result will appear here…</span>
            )}
          </div>
          {output && (
            <div className={styles.outputMeta}>
              <span>{output.length} chars</span>
              <span>{cipher === "caesar" || cipher === "vigenere" ? "Substitution" : cipher === "railfence" ? "Transposition" : "Digraph"}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
