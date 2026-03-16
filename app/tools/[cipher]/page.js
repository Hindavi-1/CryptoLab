"use client";
import { useState } from "react";
import Link from "next/link";
import { encryptCaesar, decryptCaesar } from "../../../lib/ciphers/caesar";
import { encryptVigenere, decryptVigenere } from "../../../lib/ciphers/vigenere";
import { encryptPlayfair, decryptPlayfair } from "../../../lib/ciphers/playfair";
import { encryptRailFence, decryptRailFence } from "../../../lib/ciphers/railfence";
import FrequencyAnalysis from "../../../components/FrequencyAnalysis";
import PlayfairKeyGrid from "../../../components/PlayfairKeyGrid";
import RailFenceVisualizer from "../../../components/RailFenceVisualizer";
import styles from "./tool.module.css";

const CIPHER_META = {
  caesar: {
    name: "Caesar Cipher",
    description: "A simple shift cipher — shift each letter forward or backward by N positions.",
    keyLabel: "Shift (0–25)",
    keyType: "number",
    keyDefault: "3",
    keyPlaceholder: "3",
  },
  vigenere: {
    name: "Vigenère Cipher",
    description: "A polyalphabetic cipher — each letter is shifted by the corresponding keyword letter.",
    keyLabel: "Keyword",
    keyType: "text",
    keyDefault: "KEY",
    keyPlaceholder: "SECRET",
  },
  playfair: {
    name: "Playfair Cipher",
    description: "Encrypts pairs of letters (digraphs) using a 5×5 key matrix built from a keyword.",
    keyLabel: "Keyword",
    keyType: "text",
    keyDefault: "KEYWORD",
    keyPlaceholder: "KEYWORD",
  },
  "rail-fence": {
    name: "Rail Fence Cipher",
    description: "A transposition cipher — writes text in a zigzag across N rails, then reads row by row.",
    keyLabel: "Number of Rails (2–6)",
    keyType: "number",
    keyDefault: "3",
    keyPlaceholder: "3",
  },
};

function runCipher(cipherName, mode, text, key) {
  switch (cipherName) {
    case "caesar": {
      const shift = Math.max(0, Math.min(25, parseInt(key) || 3));
      return mode === "encrypt" ? encryptCaesar(text, shift) : decryptCaesar(text, shift);
    }
    case "vigenere": {
      const k = key || "KEY";
      return mode === "encrypt" ? encryptVigenere(text, k) : decryptVigenere(text, k);
    }
    case "playfair": {
      const k = key || "KEYWORD";
      return mode === "encrypt" ? encryptPlayfair(text, k) : decryptPlayfair(text, k);
    }
    case "rail-fence": {
      const r = Math.max(2, Math.min(6, parseInt(key) || 3));
      return mode === "encrypt" ? encryptRailFence(text, r) : decryptRailFence(text, r);
    }
    default:
      return "Cipher not yet implemented in this tool.";
  }
}

export default function CipherToolPage({ params }) {
  const name = params.cipher;
  const meta = CIPHER_META[name];

  const [mode, setMode] = useState("encrypt");
  const [input, setInput] = useState("");
  const [key, setKey] = useState(meta?.keyDefault || "");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [showFreq, setShowFreq] = useState(false);

  if (!meta) {
    return (
      <div className={styles.notFound}>
        <div className={styles.container}>
          <h1 className={styles.nfTitle}>Tool not yet available</h1>
          <p className={styles.nfDesc}>The <strong>{name}</strong> tool is coming soon.</p>
          <Link href="/tools" className={styles.backBtn}>← Back to Tools</Link>
        </div>
      </div>
    );
  }

  const handleRun = () => {
    if (!input.trim()) return;
    try {
      const result = runCipher(name, mode, input, key);
      setOutput(result);
    } catch (e) {
      setOutput("Error: " + e.message);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setInput(output);
    setOutput("");
    setMode((m) => (m === "encrypt" ? "decrypt" : "encrypt"));
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/tools" className={styles.breadLink}>Tools</Link>
          <span className={styles.breadSep}>/</span>
          <span className={styles.breadCurrent}>{meta.name}</span>
        </nav>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>{meta.name}</h1>
            <p className={styles.desc}>{meta.description}</p>
          </div>
          <div className={styles.headerRight}>
            <Link href={`/cipher/${name}`} className={styles.theoryBtn}>
              View Theory →
            </Link>
            <Link href={`/simulation?cipher=${name}`} className={styles.simBtn}>
              Simulation →
            </Link>
          </div>
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>
            {/* Config bar */}
            <div className={styles.configBar}>
              <div className={styles.modeSwitch}>
                {["encrypt", "decrypt"].map((m) => (
                  <button
                    key={m}
                    className={`${styles.modeBtn} ${mode === m ? styles.modeBtnActive : ""}`}
                    onClick={() => { setMode(m); setOutput(""); }}
                  >
                    {m === "encrypt" ? "🔐" : "🔓"} {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>

              <div className={styles.keyField}>
                <label className={styles.keyLabel}>{meta.keyLabel}</label>
                <input
                  className={styles.keyInput}
                  type={meta.keyType}
                  min={meta.keyType === "number" ? "2" : undefined}
                  max={meta.keyType === "number" ? (name === "caesar" ? "25" : "6") : undefined}
                  value={key}
                  placeholder={meta.keyPlaceholder}
                  onChange={(e) => { setKey(e.target.value); setOutput(""); }}
                />
              </div>

              <div className={styles.configActions}>
                <button className={styles.clearBtn} onClick={handleClear}>Clear</button>
                <button className={styles.swapBtn} onClick={handleSwap} title="Swap & flip mode">
                  ⇅ Swap
                </button>
              </div>
            </div>

            {/* IO panels */}
            <div className={styles.io}>
              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <span className={styles.panelLabel}>
                    {mode === "encrypt" ? "Plaintext Input" : "Ciphertext Input"}
                  </span>
                  <span className={styles.charCount}>{input.length} chars</span>
                </div>
                <textarea
                  className={styles.textarea}
                  rows={8}
                  placeholder={mode === "encrypt" ? "Type or paste text to encrypt…" : "Paste ciphertext to decrypt…"}
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setOutput(""); }}
                  spellCheck={false}
                />
              </div>

              <div className={styles.ioMiddle}>
                <button
                  className={styles.runBtn}
                  onClick={handleRun}
                  disabled={!input.trim()}
                >
                  {mode === "encrypt" ? "Encrypt →" : "← Decrypt"}
                </button>
              </div>

              <div className={styles.panel}>
                <div className={styles.panelHead}>
                  <span className={styles.panelLabel}>
                    {mode === "encrypt" ? "Ciphertext Output" : "Plaintext Output"}
                  </span>
                  {output && (
                    <button className={styles.copyBtn} onClick={handleCopy}>
                      {copied ? "✓ Copied!" : "Copy"}
                    </button>
                  )}
                </div>
                <div className={`${styles.outputBox} ${output ? styles.outputFilled : ""}`}>
                  {output || <span className={styles.outputPlaceholder}>Output will appear here…</span>}
                </div>
              </div>
            </div>

            {/* Frequency analysis toggle */}
            <div className={styles.freqSection}>
              <button
                className={styles.freqToggle}
                onClick={() => setShowFreq((v) => !v)}
              >
                {showFreq ? "▾" : "▸"} Frequency Analysis
              </button>
              {showFreq && (
                <div className={styles.freqPanels}>
                  <div>
                    <p className={styles.freqLabel}>Input</p>
                    <FrequencyAnalysis text={input} />
                  </div>
                  {output && (
                    <div>
                      <p className={styles.freqLabel}>Output</p>
                      <FrequencyAnalysis text={output} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar with cipher-specific extras */}
          <aside className={styles.aside}>
            {name === "playfair" && (
              <div className={styles.asideCard}>
                <PlayfairKeyGrid keyword={key} />
              </div>
            )}
            {name === "rail-fence" && (
              <div className={styles.asideCard}>
                <RailFenceVisualizer text={input} rails={parseInt(key) || 3} />
              </div>
            )}
            {name === "caesar" && (
              <div className={styles.asideCard}>
                <h4 className={styles.asideTitle}>Shift Table</h4>
                <div className={styles.shiftTable}>
                  {Array.from({ length: 26 }, (_, i) => {
                    const plain = String.fromCharCode(65 + i);
                    const shift = Math.max(0, Math.min(25, parseInt(key) || 3));
                    const cipher = String.fromCharCode(((i + shift) % 26) + 65);
                    return (
                      <div key={i} className={styles.shiftRow}>
                        <span className={styles.shiftPlain}>{plain}</span>
                        <span className={styles.shiftArrow}>→</span>
                        <span className={styles.shiftCipher}>{cipher}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {name === "vigenere" && (
              <div className={styles.asideCard}>
                <h4 className={styles.asideTitle}>Key Preview</h4>
                <div className={styles.keyPreview}>
                  {(key || "KEY").toUpperCase().replace(/[^A-Z]/g, "").split("").map((c, i) => (
                    <div key={i} className={styles.keyChar}>
                      <span className={styles.keyCharLetter}>{c}</span>
                      <span className={styles.keyCharShift}>{c.charCodeAt(0) - 65}</span>
                    </div>
                  ))}
                </div>
                <p className={styles.keyNote}>Each letter = shift amount (A=0, B=1, … Z=25)</p>
              </div>
            )}

            <div className={styles.asideCard}>
              <h4 className={styles.asideTitle}>Quick Tips</h4>
              <ul className={styles.tipsList}>
                {name === "caesar" && <>
                  <li>Shift 13 = ROT13, a special case</li>
                  <li>Shift 0 or 26 = no change</li>
                  <li>Decrypting = encrypting with 26-N</li>
                </>}
                {name === "vigenere" && <>
                  <li>Keyword repeats to match text length</li>
                  <li>Longer keyword = stronger cipher</li>
                  <li>Numbers and symbols pass through unchanged</li>
                </>}
                {name === "playfair" && <>
                  <li>J is treated as I in the key square</li>
                  <li>Repeated letter pairs get an X inserted</li>
                  <li>Input must contain letters only</li>
                </>}
                {name === "rail-fence" && <>
                  <li>More rails = less obvious pattern</li>
                  <li>2 rails is the simplest case</li>
                  <li>All characters including spaces are placed</li>
                </>}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
