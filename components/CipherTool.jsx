"use client";
import { useState } from "react";
import {
  encryptCaesar, decryptCaesar, getCaesarSteps,
  encryptVigenere, decryptVigenere, getVigenereSteps,
  encryptPlayfair, decryptPlayfair, getPlayfairSteps,
  encryptRailFence, decryptRailFence,
  encryptAffine, decryptAffine, getAffineSteps,
  encryptHill, decryptHill, getHillSteps,
  encryptSubstitution, decryptSubstitution, getSubstitutionSteps,
  encryptDES, decryptDES, getDESSteps,
  encryptAES, decryptAES, getAESSteps,
  encryptRSA, decryptRSA, getRSASteps, generateRSAKeys,
  hashMD5, decryptMD5, getMD5Steps,
  hashSHA256, decryptSHA256, getSHA256Steps
} from "../lib/ciphers/index";
import PlayfairVisualizer from "./PlayfairVisualizer";
import HillKeyInput from "./HillKeyInput";
import HillVisualizer from "./HillVisualizer";
import VigenereVisualizer from "./VigenereVisualizer";
import styles from "./CipherTool.module.css";

const CIPHERS = [
  { value: "caesar", label: "Caesar Cipher", keyLabel: "Shift (0–25)", keyType: "number", keyPlaceholder: "3" },
  { value: "vigenere", label: "Vigenère Cipher", keyLabel: "Keyword", keyType: "text", keyPlaceholder: "KEY" },
  { value: "playfair", label: "Playfair Cipher", keyLabel: "Keyword", keyType: "text", keyPlaceholder: "KEYWORD" },
  { value: "railfence", label: "Rail Fence Cipher", keyLabel: "Number of Rails", keyType: "number", keyPlaceholder: "3" },
  { value: "affine", label: "Affine Cipher", keyLabel: "a, b (e.g. 5,8)", keyType: "text", keyPlaceholder: "5,8" },
  { value: "hill", label: "Hill Cipher", keyLabel: "a,b,c,d (2x2)", keyType: "text", keyPlaceholder: "3,3,2,5" },
  { value: "substitution", label: "Substitution", keyLabel: "26-char Alphabet", keyType: "text", keyPlaceholder: "QWERTYUIOPASDFGHJKLZXCVBNM" },
  { value: "des", label: "DES", keyLabel: "Passphrase", keyType: "text", keyPlaceholder: "SecretKey" },
  { value: "aes", label: "AES", keyLabel: "Passphrase", keyType: "text", keyPlaceholder: "SecretKey" },
  { value: "rsa", label: "RSA (Educational)", keyLabel: "e, n (Encrypt) or d, n (Decrypt)", keyType: "text", keyPlaceholder: "17,3233" },
  { value: "md5", label: "MD5", keyLabel: "None", keyType: "text", keyPlaceholder: "N/A", disabledKey: true },
  { value: "sha256", label: "SHA-256", keyLabel: "None", keyType: "text", keyPlaceholder: "N/A", disabledKey: true },
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
    case "affine": {
      const [a, b] = (key || "5,8").split(",").map(x => parseInt(x.trim()));
      return mode === "encrypt" ? encryptAffine(text, { a, b }) : decryptAffine(text, { a, b });
    }
    case "hill": {
      const vals = (key || "3,3,2,5").split(",").map(x => parseInt(x.trim()));
      const matrix = [[vals[0], vals[1]], [vals[2], vals[3]]];
      return mode === "encrypt" ? encryptHill(text, matrix) : decryptHill(text, matrix);
    }
    case "substitution": {
      const k = key || "QWERTYUIOPASDFGHJKLZXCVBNM";
      return mode === "encrypt" ? encryptSubstitution(text, k) : decryptSubstitution(text, k);
    }
    case "des": {
      const k = key || "SecretKey";
      return mode === "encrypt" ? encryptDES(text, k) : decryptDES(text, k);
    }
    case "aes": {
      const k = key || "SecretKey";
      return mode === "encrypt" ? encryptAES(text, k) : decryptAES(text, k);
    }
    case "rsa": {
      const [v1, v2] = (key || "17,3233").split(",").map(x => BigInt(x.trim()));
      if (mode === "encrypt") {
        return encryptRSA(text, { e: v1, n: v2 });
      } else {
        return decryptRSA(text, { d: v1, n: v2 });
      }
    }
    case "md5": {
      return mode === "encrypt" ? hashMD5(text) : decryptMD5(text);
    }
    case "sha256": {
      return mode === "encrypt" ? hashSHA256(text) : decryptSHA256(text);
    }
    default:
      return text;
  }
}

// ─── Caesar step-by-step visualizer ─────────────────────────────────────────

const MAX_STEPS_VISIBLE = 30;

function StepByStep({ steps, mode, cipher }) {
  const [expanded, setExpanded] = useState(false);

  const activeSteps = steps.filter((s) => s.type !== "passthrough");
  const passthroughCount = steps.length - activeSteps.length;
  const visible = expanded ? steps : steps.slice(0, MAX_STEPS_VISIBLE);
  const hasMore = steps.length > MAX_STEPS_VISIBLE;

  if (steps.length === 0) return null;

  return (
    <div className={styles.stepsWrap}>
      <div className={styles.stepsHeader}>
        <span className={styles.stepsTitle}>
          Step-by-Step Transformation
        </span>
        <span className={styles.stepsSummary}>
          {activeSteps.length} step{activeSteps.length !== 1 ? "s" : ""} processed
          {passthroughCount > 0 && ` · ${passthroughCount} unchanged`}
        </span>
      </div>

      {/* Alphabet wheel legend only for Caesar for now */}
      {cipher === "caesar" && (
        <div className={styles.wheelLegend}>
          {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map((letter) => (
            <span key={letter} className={styles.wheelLetter}>{letter}</span>
          ))}
        </div>
      )}

      {/* Per-character cards */}
      <div className={styles.stepCards}>
        {visible.map((step) =>
          step.type === "passthrough" ? (
            <div key={step.index} className={`${styles.stepCard} ${styles.stepCardPass}`}>
              <span className={styles.stepChar}>{step.input === " " ? "·" : step.input}</span>
              <span className={styles.stepArrow}>→</span>
              <span className={styles.stepChar}>{step.output === " " ? "·" : step.output}</span>
              <span className={styles.stepNote}>unchanged</span>
            </div>
          ) : (
            <div key={step.index} className={`${styles.stepCard} ${styles.stepCardAlpha}`}>
              <div className={styles.stepCharRow}>
                <span className={styles.stepPlain}>{step.input}</span>
                <span className={styles.stepArrow}>→</span>
                <span className={styles.stepCipher}>{step.output}</span>
              </div>

              {cipher === "caesar" && step.inputCode !== undefined && (
                <div className={styles.stepShiftBar}>
                  <span className={styles.stepShiftLabel}>
                    [{step.inputCode}]
                  </span>
                  <span className={styles.stepShiftOp}>
                    {mode === "encrypt" ? `+${step.effectiveShift}` : `−${step.effectiveShift}`}
                  </span>
                  <span className={styles.stepShiftLabel}>
                    [{step.outputCode}]
                  </span>
                </div>
              )}

              <span className={styles.stepFormula}>{step.formula}</span>
            </div>
          )
        )}
      </div>

      {hasMore && (
        <button
          className={styles.stepsToggle}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded
            ? "Show less"
            : `Show all ${steps.length} steps`}
        </button>
      )}
    </div>
  );
}

// ─── Main CipherTool ─────────────────────────────────────────────────────────

export default function CipherTool({ initialCipher = "caesar" }) {
  const [cipher, setCipher] = useState(initialCipher);
  const [mode, setMode] = useState("encrypt");
  const [input, setInput] = useState("");
  const [key, setKey] = useState("");
  const [output, setOutput] = useState("");
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const meta = CIPHERS.find((c) => c.value === cipher) || CIPHERS[0];

  const run = () => {
    if (!input.trim()) return;
    setError("");
    try {
      const result = runCipher(cipher, mode, input, key);
      setOutput(result);

      let newSteps = [];
      switch (cipher) {
        case "vigenere": {
          const vk = key || "KEY";
          newSteps = [{ type: "vigenere_data", data: getVigenereSteps(input.toUpperCase(), vk, mode) }];
          break;
        }
        case "playfair":
          newSteps = [{ type: "playfair_data", data: getPlayfairSteps(input, key || "KEYWORD", mode) }];
          break;
        case "caesar":
          newSteps = getCaesarSteps(input, parseInt(key) || 3, mode);
          break;
        case "affine": {
          const [a, b] = (key || "5,8").split(",").map(x => parseInt(x.trim()));
          newSteps = getAffineSteps(input, { a, b }, mode);
          break;
        }
        case "hill": {
          newSteps = [{ type: "hill_data", data: getHillSteps(input, key || "9,4,5,7", mode) }];
          break;
        }
        case "substitution":
          newSteps = getSubstitutionSteps(input, key || "QWERTYUIOPASDFGHJKLZXCVBNM", mode);
          break;
        case "des":
          newSteps = getDESSteps(input, key || "SecretKey", mode);
          break;
        case "aes":
          newSteps = getAESSteps(input, key || "SecretKey", mode);
          break;
        case "rsa": {
          const [v1, v2] = (key || "17,3233").split(",").map(x => BigInt(x.trim()));
          const rsaKey = mode === "encrypt" ? { e: v1, n: v2 } : { d: v1, n: v2 };
          newSteps = getRSASteps(input, rsaKey, mode);
          break;
        }
        case "md5":
          newSteps = mode === "encrypt" ? getMD5Steps(input) : [];
          break;
        case "sha256":
          newSteps = mode === "encrypt" ? getSHA256Steps(input) : [];
          break;
        default:
          newSteps = [];
      }
      setSteps(newSteps);
    } catch (e) {
      setError(e.message || "An error occurred.");
      setOutput("");
      setSteps([]);
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
    setSteps([]);
    setError("");
    setMode((m) => (m === "encrypt" ? "decrypt" : "encrypt"));
  };

  const reset = () => {
    setInput("");
    setKey("");
    setOutput("");
    setSteps([]);
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
            onChange={(e) => { setCipher(e.target.value); setOutput(""); setSteps([]); setError(""); }}
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
                onClick={() => { setMode(m); setOutput(""); setSteps([]); setError(""); }}
              >
                {m === "encrypt" ? "🔒 Encrypt" : "🔓 Decrypt"}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>{meta.keyLabel}</label>
          {cipher === "hill" ? (
            <HillKeyInput keyStr={key} onChange={setKey} />
          ) : (
            <input
              className={styles.input}
              type={meta.keyType}
              min="0"
              max={meta.keyType === "number" ? "25" : undefined}
              placeholder={meta.keyPlaceholder}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              disabled={meta.disabledKey}
            />
          )}
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
            onChange={(e) => { setInput(e.target.value); setOutput(""); setSteps([]); setError(""); }}
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
              <span>
                {["caesar", "vigenere", "affine", "substitution"].includes(cipher)
                  ? "Substitution"
                  : ["railfence"].includes(cipher)
                    ? "Transposition"
                    : ["playfair", "hill"].includes(cipher)
                      ? "Polygraphic"
                      : ["des", "aes"].includes(cipher)
                        ? "Block Cipher"
                        : ["rsa"].includes(cipher)
                          ? "Asymmetric"
                          : "Hash Function"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Step-by-step panel */}
      {steps.length > 0 && cipher === "playfair" ? (
        <PlayfairVisualizer stepsData={steps[0].data} mode={mode} />
      ) : steps.length > 0 && cipher === "hill" ? (
        <HillVisualizer stepsData={steps[0].data} mode={mode} />
      ) : steps.length > 0 && cipher === "vigenere" ? (
        <VigenereVisualizer stepsData={steps[0].data} mode={mode} />
      ) : steps.length > 0 && (
        <StepByStep steps={steps} mode={mode} cipher={cipher} />
      )}
    </div>
  );
}
