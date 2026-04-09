"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  encryptCaesar, decryptCaesar, getCaesarSteps,
  encryptVigenere, decryptVigenere, getVigenereSteps,
  encryptPlayfair, decryptPlayfair, getPlayfairSteps,
  encryptRailFence, decryptRailFence,
  encryptColumnar, decryptColumnar, buildColumnarTrace,
  encryptAffine, decryptAffine, getAffineSteps,
  encryptHill, decryptHill, getHillSteps,
  encryptSubstitution, decryptSubstitution, getSubstitutionSteps
} from "../../../lib/ciphers/index";
import CaesarSimulation from "../CaesarSimulation";
import VigenereSimulation from "../VigenereSimulation";
import PlayfairSimulation from "../PlayfairSimulation";
import RailFenceSimulation from "../RailFenceSimulation";
import ColumnarSimulation from "../ColumnarSimulation";
import AffineSimulation from "../AffineSimulation";
import SubstitutionSimulation from "../SubstitutionSimulation";
import EccSimulation from "../EccSimulation";
import styles from "./simulationPage.module.css";

// ─── Cipher metadata ────────────────────────────────────────────────────────
const CIPHER_META = {
  caesar: {
    name: "Caesar Cipher",
    tagline: "The oldest shift cipher",
    icon: "Ⅲ",
    color: "accent",
    category: "Classical · Monoalphabetic",
    formula: "C = (P + n) mod 26",
    defaultText: "HELLO WORLD",
    defaultKey: "3",
    keyLabel: "Shift (0 – 25)",
    keyType: "number",
    keyPlaceholder: "3",
    description: "Each letter shifts forward by n positions in the alphabet. One of history's simplest ciphers.",
  },
  vigenere: {
    name: "Vigenère Cipher",
    tagline: "The indecipherable polyalphabetic cipher",
    icon: "V",
    color: "purple",
    category: "Classical · Polyalphabetic",
    formula: "C = (P + K) mod 26",
    defaultText: "HELLO WORLD",
    defaultKey: "KEY",
    keyLabel: "Keyword",
    keyType: "text",
    keyPlaceholder: "KEY",
    description: "Uses a repeating keyword to apply different Caesar shifts to each letter, defeating simple frequency analysis.",
  },
  railfence: {
    name: "Rail Fence Cipher",
    tagline: "Zigzag transposition",
    icon: "⫝̸",
    color: "green",
    category: "Classical · Transposition",
    formula: "Zigzag across N rails",
    defaultText: "HELLO WORLD",
    defaultKey: "3",
    keyLabel: "Number of Rails",
    keyType: "number",
    keyPlaceholder: "3",
    description: "Writes text in a zigzag diagonal pattern across multiple rails, then reads each rail left-to-right to form the ciphertext.",
  },
  playfair: {
    name: "Playfair Cipher",
    tagline: "Digraph substitution on a 5×5 grid",
    icon: "⊞",
    color: "orange",
    category: "Classical · Digraph",
    formula: "Row / Col / Rectangle rules",
    defaultText: "HIDE GOLD",
    defaultKey: "PLAYFAIR",
    keyLabel: "Keyword",
    keyType: "text",
    keyPlaceholder: "KEYWORD",
    description: "Encrypts pairs of letters using a 5×5 key matrix. Three geometric rules — row, column, and rectangle — govern the substitution.",
  },
  columnar: {
    name: "Columnar Transposition",
    tagline: "Rearrange columns by keyword rank",
    icon: "▤",
    color: "purple",
    category: "Classical · Transposition",
    formula: "Read grid columns in key order",
    defaultText: "HELLO WORLD",
    defaultKey: "KEYWORD",
    keyLabel: "Keyword",
    keyType: "text",
    keyPlaceholder: "KEYWORD",
    description: "Writes plaintext in rows under a keyword, then reads out columns in alphabetical order of the keyword characters.",
  },
  affine: {
    name: "Affine Cipher",
    tagline: "Linear equation substitution",
    icon: "ƒ(x)",
    color: "accent",
    category: "Classical · Monoalphabetic",
    formula: "C = (a × P + b) mod 26",
    defaultText: "HELLO WORLD",
    defaultKey: "5,8",
    keyLabel: "Key (a, b)",
    keyType: "text",
    keyPlaceholder: "e.g. 5,8",
    description: "Each letter is mapped to its numeric equivalent, multiplied by 'a', shifted by 'b', and converted back to a letter.",
  },
  hill: {
    name: "Hill Cipher",
    tagline: "Matrix-based polygraphic substitution",
    icon: "▦",
    color: "orange",
    category: "Classical · Polygraphic",
    formula: "C = K × P mod 26",
    defaultText: "HELLO WORLD",
    defaultKey: "9,4,5,7",
    keyLabel: "Key Matrix (comma separated)",
    keyType: "text",
    keyPlaceholder: "e.g. 9,4,5,7",
    description: "Encrypts blocks of letters using linear algebra. The key is an invertible square matrix modulo 26.",
  },
  substitution: {
    name: "Substitution Cipher",
    tagline: "Arbitrary alphabet mapping",
    icon: "⇄",
    color: "green",
    category: "Classical · Monoalphabetic",
    formula: "Permutation of alphabet",
    defaultText: "HELLO WORLD",
    defaultKey: "ZYXWVUTSRQPONMLKJIHGFEDCBA",
    keyLabel: "26-Letter Alphabet",
    keyType: "text",
    keyPlaceholder: "A-Z jumbled",
    description: "Replaces each letter with another according to a fixed, jumbled 26-letter alphabet.",
  },
  ecc: {
    name: "Elliptic Curve Cryptography",
    tagline: "Asymmetric public key exchange over finite fields",
    icon: "∿",
    color: "purple",
    category: "Asymmetric · Key Exchange",
    formula: "y² ≡ x³ + ax + b (mod p)",
    defaultText: "Data isn't encrypted directly here; this generates a Shared Secret instead. Press Encrypt!",
    defaultKey: "23,1,1,3,10,6,15",
    keyLabel: "p, a, b, Gx, Gy, privA, privB",
    keyType: "text",
    keyPlaceholder: "23, 1, 1, 3, 10, 6, 15",
    description: "Generates public keys using point multiplication on an elliptic curve, then combines them to derive an identical shared cryptographic secret without transmitting it.",
  },
};

// ─── Main Simulation Page ───────────────────────────────────────────────────
export default function SimulationPage({ params }) {
  const slug = params.slug;
  const meta = CIPHER_META[slug];

  const [mode, setMode]     = useState("encrypt");
  const [input, setInput]   = useState(meta?.defaultText || "HELLO");
  const [key, setKey]       = useState(meta?.defaultKey || "3");
  const [output, setOutput] = useState("");
  const [steps, setSteps]   = useState(null);
  const [error, setError]   = useState("");
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const run = useCallback(() => {
    if (!input.trim()) return;
    setError("");
    setIsRunning(true);

    try {
      let result = "";
      let newSteps = null;

      switch (slug) {
        case "caesar": {
          const shift = parseInt(key) || 3;
          result = mode === "encrypt" ? encryptCaesar(input, shift) : decryptCaesar(input, shift);
          newSteps = getCaesarSteps(input, shift, mode);
          break;
        }
        case "vigenere": {
          const k = (key || "KEY").toUpperCase().replace(/[^A-Z]/g, "") || "KEY";
          result = mode === "encrypt" ? encryptVigenere(input, k) : decryptVigenere(input, k);
          newSteps = { type: "vigenere", data: getVigenereSteps(input.toUpperCase(), k, mode) };
          break;
        }
        case "railfence": {
          const r = parseInt(key) || 3;
          result = mode === "encrypt" ? encryptRailFence(input, r) : decryptRailFence(input, r);
          newSteps = { type: "railfence", text: input.toUpperCase(), rails: r };
          break;
        }
        case "playfair": {
          const k = (key || "KEYWORD").toUpperCase().replace(/[^A-Z]/g, "") || "KEYWORD";
          result = mode === "encrypt" ? encryptPlayfair(input, k) : decryptPlayfair(input, k);
          newSteps = { type: "playfair", data: getPlayfairSteps(input, k, mode) };
          break;
        }
        case "columnar": {
          const k = (key || "KEYWORD").toUpperCase().replace(/[^A-Z]/g, "") || "KEYWORD";
          result = mode === "encrypt" ? encryptColumnar(input, k) : decryptColumnar(input, k);
          newSteps = { type: "columnar", data: buildColumnarTrace(input, k, "X", mode) };
          break;
        }
        case "affine": {
          const parts = key.split(",");
          const a = parseInt(parts[0]) || 5;
          const b = parseInt(parts[1]) || (key.includes(",") ? 0 : 8);
          const affineKey = { a, b };
          result = mode === "encrypt" ? encryptAffine(input, affineKey) : decryptAffine(input, affineKey);
          newSteps = { type: "affine", data: getAffineSteps(input, affineKey, mode) };
          break;
        }
        case "hill": {
          result = mode === "encrypt" ? encryptHill(input, key) : decryptHill(input, key);
          newSteps = { type: "hill", data: getHillSteps(input, key, mode) };
          if (newSteps.data.error) {
             throw new Error(newSteps.data.error);
          }
          break;
        }
        case "substitution": {
          const k = (key || "ZYXWVUTSRQPONMLKJIHGFEDCBA").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 26);
          if (k.length < 26) throw new Error("Key must be 26 unique letters.");
          result = mode === "encrypt" ? encryptSubstitution(input, k) : decryptSubstitution(input, k);
          newSteps = { type: "substitution", data: getSubstitutionSteps(input, k, mode) };
          break;
        }
        case "ecc": {
          const parts = key.split(",").map((s) => s.trim());
          const pStr = parts[0] || "23";
          const aStr = parts[1] || "1";
          const bStr = parts[2] || "1";
          const Gx = parts[3] || "3";
          const Gy = parts[4] || "10";
          const privA = parts[5] || "6";
          const privB = parts[6] || "15";
          
          const { getECCSteps } = require("../../../lib/ciphers/ecc");
          const eccTrace = getECCSteps(pStr, aStr, bStr, Gx, Gy, privA, privB);
          
          newSteps = eccTrace[0];
          result = `A's Shared Info: (${newSteps.data.SharedA?.x}, ${newSteps.data.SharedA?.y})\nB's Shared Info: (${newSteps.data.SharedB?.x}, ${newSteps.data.SharedB?.y})`;
          break;
        }
        default:
          result = input;
      }

      setOutput(result);
      setSteps(newSteps);
    } catch (e) {
      setError(e.message || "An error occurred.");
      setOutput("");
      setSteps(null);
    } finally {
      setIsRunning(false);
    }
  }, [slug, input, key, mode]);

  // Auto-run on input/key/mode change
  useEffect(() => {
    if (input.trim()) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, key, mode, slug]);

  const copy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swap = () => {
    setInput(output);
    setOutput("");
    setSteps(null);
    setError("");
    setMode((m) => (m === "encrypt" ? "decrypt" : "encrypt"));
  };

  const reset = () => {
    setInput(meta?.defaultText || "");
    setKey(meta?.defaultKey || "");
    setOutput("");
    setSteps(null);
    setError("");
    setMode("encrypt");
  };

  if (!meta) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundInner}>
          <span className={styles.nfCode}>404</span>
          <h1 className={styles.nfTitle}>Simulation not found</h1>
          <p className={styles.nfDesc}>
            No simulation page exists for <strong>{slug}</strong> yet.
          </p>
          <Link href="/simulation" className={styles.nfBack}>← Back to Simulation Hub</Link>
        </div>
      </div>
    );
  }

  const colorVar = {
    accent: "var(--accent)",
    purple: "var(--purple)",
    green: "var(--green)",
    orange: "var(--orange)",
  }[meta.color] || "var(--accent)";

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* ── Breadcrumb ─────────────────────────────── */}
        <nav className={styles.breadcrumb}>
          <Link href="/" className={styles.breadLink}>Home</Link>
          <span className={styles.breadSep}>/</span>
          <Link href="/simulation" className={styles.breadLink}>Simulations</Link>
          <span className={styles.breadSep}>/</span>
          <span className={styles.breadCurrent}>{meta.name}</span>
        </nav>

        {/* ── Hero ────────────────────────────────────── */}
        <div className={styles.hero} style={{ "--sim-color": colorVar }}>
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>
              <span className={styles.badgePulse} />
              Interactive Simulation
            </div>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroIcon} style={{ background: `${colorVar}22`, border: `1px solid ${colorVar}44`, color: colorVar }}>
                {meta.icon}
              </span>
              {meta.name}
            </h1>
            <p className={styles.heroTagline}>{meta.tagline}</p>
            <p className={styles.heroDesc}>{meta.description}</p>
            <div className={styles.heroPills}>
              <span className={styles.pill}>{meta.category}</span>
              <span className={`${styles.pill} ${styles.pillFormula}`}>{meta.formula}</span>
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.statsGrid}>
              <div className={styles.statBox} style={{ "--c": colorVar }}>
                <span className={styles.statIcon}>⌨</span>
                <span className={styles.statVal}>{input.replace(/\s+/g, "").length}</span>
                <span className={styles.statLabel}>Input chars</span>
              </div>
              <div className={styles.statBox} style={{ "--c": colorVar }}>
                <span className={styles.statIcon}>🔑</span>
                <span className={styles.statVal}>{key || "—"}</span>
                <span className={styles.statLabel}>Key</span>
              </div>
              <div className={styles.statBox} style={{ "--c": colorVar }}>
                <span className={styles.statIcon}>✦</span>
                <span className={styles.statVal}>{output.replace(/\s+/g, "").length || "—"}</span>
                <span className={styles.statLabel}>Output chars</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Controls ─────────────────────────────────── */}
        <div className={styles.labCard}>
          <div className={styles.labHeader}>
            <span className={styles.labTitle}>Encryption Lab</span>
            <div className={styles.modeSwitch}>
              {["encrypt", "decrypt"].map((m) => (
                <button
                  key={m}
                  className={`${styles.modeBtn} ${mode === m ? styles.modeBtnActive : ""}`}
                  style={mode === m ? { "--m-color": colorVar } : {}}
                  onClick={() => { setMode(m); setOutput(""); setSteps(null); setError(""); }}
                >
                  {m === "encrypt" ? "🔒 Encrypt" : "🔓 Decrypt"}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.inputRow}>
            {/* Plaintext */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                {mode === "encrypt" ? "Plaintext" : "Ciphertext"}
                <span className={styles.charCount}>{input.length} chars</span>
              </label>
              <textarea
                className={styles.textarea}
                rows={4}
                placeholder={mode === "encrypt" ? "Enter text to encrypt…" : "Enter text to decrypt…"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            {/* Key */}
            {slug === "ecc" ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--card-secondary)', borderRadius: '12px', padding: '16px', border: '1px dashed var(--border)', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className={styles.inputLabel} style={{ marginBottom: 0 }}>ECC Parameters</span>
                  <button className={`${styles.actionBtn} ${styles.resetBtn}`} onClick={reset} title="Reset keys">↺ Reset</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {["p (Prime)", "a (Curve)", "b (Curve)", "Gx (Base X)", "Gy (Base Y)", "privA (Alice)", "privB (Bob)"].map((labelWithDesc, idx) => {
                    const label = labelWithDesc.split(" ")[0]; // "p", "a", etc.
                    const desc = labelWithDesc.split(" ")[1]; // "(Prime)"
                    const parts = key.split(",");
                    const val = parts[idx] !== undefined ? parts[idx].trim() : "";
                    return (
                      <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label className={styles.inputLabel} style={{ fontSize: '10px', textTransform: 'none', color: 'var(--text-subtle)' }}>
                          <b style={{ color: 'var(--text)', fontSize: '12px', marginRight: '4px' }}>{label}</b> {desc}
                        </label>
                        <input
                          className={styles.keyInput}
                          type="number"
                          style={{ minWidth: 0, padding: '8px 10px', height: 'auto', background: 'var(--card)' }}
                          value={val}
                          onChange={(e) => {
                            const newParts = [...parts];
                            for (let i = 0; i < 7; i++) newParts[i] = newParts[i] !== undefined ? newParts[i].trim() : "";
                            newParts[idx] = e.target.value;
                            setKey(newParts.join(","));
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className={styles.keyBlock}>
                <label className={styles.inputLabel}>{meta.keyLabel}</label>
                <input
                  className={styles.keyInput}
                  type={meta.keyType}
                  min={meta.keyType === "number" ? "2" : undefined}
                  max={meta.keyType === "number" ? "25" : undefined}
                  placeholder={meta.keyPlaceholder}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                />
                <div className={styles.keyActions}>
                  <button
                    className={`${styles.actionBtn} ${styles.swapBtn}`}
                    onClick={swap}
                    disabled={!output}
                    title="Swap input/output and flip mode"
                  >
                    ⇄ Swap
                  </button>
                  <button className={`${styles.actionBtn} ${styles.resetBtn}`} onClick={reset} title="Reset all">
                    ↺ Reset
                  </button>
                </div>
              </div>
            )}

            {/* Output */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                {mode === "encrypt" ? "Ciphertext" : "Plaintext"}
                {output && (
                  <button className={styles.copyBtn} onClick={copy}>
                    {copied ? "✓ Copied!" : "Copy"}
                  </button>
                )}
              </label>
              <div className={`${styles.outputBox} ${output ? styles.outputFilled : ""} ${error ? styles.outputError : ""}`}
                style={output ? { "--out-color": colorVar } : {}}
              >
                {error ? (
                  <span className={styles.errorMsg}>⚠ {error}</span>
                ) : output ? (
                  <span className={styles.outputText}>{output}</span>
                ) : (
                  <span className={styles.outputPlaceholder}>Result will appear here…</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Visualizer ──────────────────────────────── */}
        {steps && (
          <div className={styles.vizSection}>
            <div className={styles.vizSectionHeader}>
              <h2 className={styles.vizSectionTitle} style={{ "--v-color": colorVar }}>
                Step-by-Step Visualization
              </h2>
              <span className={styles.vizSectionSub}>See exactly how each character is transformed</span>
            </div>

            {/* Caesar */}
            {slug === "caesar" && Array.isArray(steps) && (
              <CaesarSimulation stepsData={steps} mode={mode} colorVar={colorVar} />
            )}

            {/* Vigenere */}
            {slug === "vigenere" && steps?.type === "vigenere" && (
              <VigenereSimulation stepsData={steps.data} mode={mode} colorVar={colorVar} />
            )}

            {/* Rail Fence */}
            {slug === "railfence" && steps?.type === "railfence" && (
              <RailFenceSimulation stepsData={steps} mode={mode} colorVar={colorVar} />
            )}

            {/* Playfair */}
            {slug === "playfair" && steps?.type === "playfair" && (
              <PlayfairSimulation stepsData={steps.data} mode={mode} colorVar={colorVar} />
            )}

            {/* Columnar */}
            {slug === "columnar" && steps?.type === "columnar" && (
              <ColumnarSimulation trace={steps.data} mode={mode} colorVar={colorVar} />
            )}

            {/* Affine */}
            {slug === "affine" && steps?.type === "affine" && (
              <AffineSimulation stepsData={steps.data} mode={mode} colorVar={colorVar} />
            )}

            {/* Hill */}
            {slug === "hill" && steps?.type === "hill" && (
              <HillSimulation stepsData={steps.data} mode={mode} colorVar={colorVar} />
            )}

            {/* Substitution */}
            {slug === "substitution" && steps?.type === "substitution" && (
              <SubstitutionSimulation stepsData={steps.data} mode={mode} colorVar={colorVar} />
            )}

            {/* ECC */}
            {slug === "ecc" && steps?.type === "ecc_data" && (
              <EccSimulation data={steps.data} colorVar={colorVar} />
            )}
          </div>
        )}

        {/* ── Theory Panel ─────────────────────────────── */}
        <div className={styles.theoryRow}>
          <div className={styles.infoCard} style={{ "--ic": colorVar }}>
            <div className={styles.infoCardBar} />
            <h3 className={styles.infoCardTitle}>About {meta.name}</h3>
            <p className={styles.infoCardDesc}>{meta.description}</p>
            <div className={styles.formulaChip}>
              <span className={styles.formulaLabel}>Formula</span>
              <code className={styles.formulaCode}>{meta.formula}</code>
            </div>
          </div>

          <div className={styles.quickNav}>
            <h3 className={styles.quickNavTitle}>Explore Further</h3>
            <Link href={`/cipher/${slug}`} className={styles.quickNavLink}>
              📖 Theory Page
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href={`/tools/${slug}`} className={styles.quickNavLink}>
              ⚡ Interactive Tool
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/simulation" className={styles.quickNavLink}>
              ◈ All Simulations
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link href="/compare" className={styles.quickNavLink}>
              ⇄ Compare Algorithms
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
