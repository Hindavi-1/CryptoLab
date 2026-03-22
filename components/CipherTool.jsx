"use client";
import { useState } from "react";
import {
  encryptCaesar, decryptCaesar, getCaesarSteps,
  encryptVigenere, decryptVigenere, getVigenereSteps,
  encryptPlayfair, decryptPlayfair, getPlayfairSteps,
  encryptRailFence, decryptRailFence,
  encryptColumnar, decryptColumnar, buildColumnarTrace, parseColumnarKey,
  encryptAffine, decryptAffine, getAffineSteps,
  encryptHill, decryptHill, getHillSteps,
  encryptSubstitution, decryptSubstitution, getSubstitutionSteps,
  encryptDES, decryptDES, getDESSteps,
  encryptAES, decryptAES, getAESSteps,
  encryptRSA, decryptRSA, getRSASteps, generateRSAKeys,
  getDHSteps,
  encryptElGamal, decryptElGamal, getElGamalSteps, generateElGamalKeys,
  getECCSteps,
  hashMD5, decryptMD5, getMD5Steps,
  hashSHA256, decryptSHA256, getSHA256Steps
} from "../lib/ciphers/index";
import RSAVisualizer from "./RSAVisualizer";
import DHVisualizer from "./DHVisualizer";
import ElGamalVisualizer from "./ElGamalVisualizer";
import ECCVisualizer from "./ECCVisualizer";
import PlayfairVisualizer from "./PlayfairVisualizer";
import HillKeyInput from "./HillKeyInput";
import HillVisualizer from "./HillVisualizer";
import VigenereVisualizer from "./VigenereVisualizer";
import ColumnarVisualizer from "./ColumnarVisualizer";
import DESVisualizer from "./DESVisualizer";
import AESVisualizer from "./AESVisualizer";
import styles from "./CipherTool.module.css";

const CIPHERS = [
  { value: "caesar", label: "Caesar Cipher", keyLabel: "Shift (0–25)", keyType: "number", keyPlaceholder: "3" },
  { value: "vigenere", label: "Vigenère Cipher", keyLabel: "Keyword", keyType: "text", keyPlaceholder: "KEY" },
  { value: "playfair", label: "Playfair Cipher", keyLabel: "Keyword", keyType: "text", keyPlaceholder: "KEYWORD" },
  { value: "railfence", label: "Rail Fence Cipher", keyLabel: "Number of Rails", keyType: "number", keyPlaceholder: "3" },
  {
    value: "columnar",
    label: "Columnar Transposition",
    keyLabel: "Keyword · optional |pad",
    keyType: "text",
    keyPlaceholder: "CIPHER, 3142, or A1B2|Z",
  },
  { value: "affine", label: "Affine Cipher", keyLabel: "a, b (e.g. 5,8)", keyType: "text", keyPlaceholder: "5,8" },
  { value: "hill", label: "Hill Cipher", keyLabel: "a,b,c,d (2x2)", keyType: "text", keyPlaceholder: "3,3,2,5" },
  { value: "substitution", label: "Substitution", keyLabel: "26-char Alphabet", keyType: "text", keyPlaceholder: "QWERTYUIOPASDFGHJKLZXCVBNM" },
  { value: "des", label: "DES", keyLabel: "Key (16-char Hex)", keyType: "text", keyPlaceholder: "0123456789ABCDEF" },
  { value: "aes", label: "AES", keyLabel: "Key (Hex)", keyType: "text", keyPlaceholder: "0123456789ABCDEF..." },
  { value: "rsa", label: "RSA", keyLabel: "RSA Options", keyType: "text", disabledKey: true },
  { value: "dh", label: "Diffie-Hellman", keyLabel: "DH Options", keyType: "text", disabledKey: true },
  { value: "elgamal", label: "ElGamal", keyLabel: "ElGamal Options", keyType: "text", disabledKey: true },
  { value: "ecc", label: "Elliptic Curve (ECC)", keyLabel: "ECC Options", keyType: "text", disabledKey: true },
  { value: "md5", label: "MD5", keyLabel: "None", keyType: "text", keyPlaceholder: "N/A", disabledKey: true },
  { value: "sha256", label: "SHA-256", keyLabel: "None", keyType: "text", keyPlaceholder: "N/A", disabledKey: true },
];

function runCipher(cipher, mode, text, key, opts = {}) {
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
    case "columnar": {
      const { keyword, pad } = parseColumnarKey(key);
      return mode === "encrypt" ? encryptColumnar(text, keyword, pad) : decryptColumnar(text, keyword, pad);
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
      const k = key || "0123456789ABCDEF";
      return mode === "encrypt"
        ? encryptDES(text, k, { mode: opts.desMode, ivHex: opts.desIV, outputFormat: opts.desFormat })
        : decryptDES(text, k, { mode: opts.desMode, ivHex: opts.desIV, inputFormat: opts.desFormat });
    }
    case "aes": {
      const k = key || "0".repeat(opts.aesKeySize / 4);
      return mode === "encrypt"
        ? encryptAES(text, k, { mode: opts.aesMode, ivHex: opts.aesIV, outputFormat: opts.aesFormat, keySize: opts.aesKeySize })
        : decryptAES(text, k, { mode: opts.aesMode, ivHex: opts.aesIV, inputFormat: opts.aesFormat, keySize: opts.aesKeySize });
    }
    case "rsa": {
      if (mode === "encrypt") {
        return encryptRSA(text, { e: BigInt(opts.rsaE || "17"), n: BigInt(opts.rsaN || "3233") });
      } else {
        return decryptRSA(text, { d: BigInt(opts.rsaD || "2753"), n: BigInt(opts.rsaN || "3233") });
      }
    }
    case "dh": {
      return "Diffie-Hellman is a key exchange protocol. See the visualizer below for the mathematical breakdown of the shared secret.";
    }
    case "elgamal": {
      if (mode === "encrypt") {
        return encryptElGamal(text, { p: BigInt(opts.elgP || "467"), g: BigInt(opts.elgG || "2"), y: BigInt(opts.elgY || "200") }, opts.elgK || "153");
      } else {
        return decryptElGamal(text, { x: BigInt(opts.elgX || "105"), p: BigInt(opts.elgP || "467") });
      }
    }
    case "ecc": {
      return "Elliptic Curve logic shown is for Key Exchange (ECDH). See the visualizer below for the mathematical derivation of points.";
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
  const [desMode, setDesMode] = useState("ECB");
  const [desIV, setDesIV] = useState("");
  const [desFormat, setDesFormat] = useState("base64");
  const [aesMode, setAesMode] = useState("ECB");
  const [aesIV, setAesIV] = useState("");
  const [aesFormat, setAesFormat] = useState("base64");
  const [aesKeySize, setAesKeySize] = useState(128);

  // RSA
  const [rsaP, setRsaP] = useState("61");
  const [rsaQ, setRsaQ] = useState("53");
  const [rsaE, setRsaE] = useState("17");
  const [rsaN, setRsaN] = useState("3233");
  const [rsaD, setRsaD] = useState("2753");

  // DH
  const [dhP, setDhP] = useState("23");
  const [dhG, setDhG] = useState("5");
  const [dhA, setDhA] = useState("4");
  const [dhB, setDhB] = useState("3");

  // ElGamal
  const [elgP, setElgP] = useState("467");
  const [elgG, setElgG] = useState("2");
  const [elgX, setElgX] = useState("105");
  const [elgY, setElgY] = useState("200"); // g^x mod p
  const [elgK, setElgK] = useState("153");

  // ECC
  const [eccP, setEccP] = useState("17");
  const [eccA, setEccA] = useState("2");
  const [eccB, setEccB] = useState("2");
  const [eccGx, setEccGx] = useState("5");
  const [eccGy, setEccGy] = useState("1");
  const [eccPrivA, setEccPrivA] = useState("3");
  const [eccPrivB, setEccPrivB] = useState("10");

  const [output, setOutput] = useState("");
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const meta = CIPHERS.find((c) => c.value === cipher) || CIPHERS[0];

  const run = () => {
    if (!input.trim() && !["dh", "ecc"].includes(cipher)) return;
    setError("");
    try {
      const result = runCipher(cipher, mode, input, key, {
        desMode, desIV, desFormat,
        aesMode, aesIV, aesFormat, aesKeySize,
        rsaE, rsaN, rsaD, elgP, elgG, elgY, elgK, elgX
      });
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
          newSteps = getDESSteps(input, key || "0123456789ABCDEF", mode, { blockMode: desMode, ivHex: desIV, format: desFormat });
          break;
        case "aes":
          newSteps = getAESSteps(input, key || "0".repeat(aesKeySize / 4), mode, { blockMode: aesMode, ivHex: aesIV, format: aesFormat, keySize: aesKeySize });
          break;
        case "rsa": {
          const rsaKey = mode === "encrypt"
            ? { e: BigInt(rsaE || "17"), n: BigInt(rsaN || "3233") }
            : { d: BigInt(rsaD || "2753"), n: BigInt(rsaN || "3233") };
          newSteps = getRSASteps(input, rsaKey, mode);
          break;
        }
        case "dh":
          newSteps = getDHSteps(dhP || "23", dhG || "5", dhA || "4", dhB || "3");
          break;
        case "elgamal": {
          const elgKey = mode === "encrypt"
            ? { p: BigInt(elgP || "467"), g: BigInt(elgG || "2"), y: BigInt(elgY || "200"), k: BigInt(elgK || "153") }
            : { p: BigInt(elgP || "467"), x: BigInt(elgX || "105") };
          newSteps = getElGamalSteps(input, elgKey, mode);
          break;
        }
        case "ecc":
          newSteps = getECCSteps(eccP || "17", eccA || "2", eccB || "2", eccGx || "5", eccGy || "1", eccPrivA || "3", eccPrivB || "10");
          break;
        case "md5":
          newSteps = mode === "encrypt" ? getMD5Steps(input) : [];
          break;
        case "sha256":
          newSteps = mode === "encrypt" ? getSHA256Steps(input) : [];
          break;
        case "columnar": {
          const { keyword, pad } = parseColumnarKey(key);
          newSteps = [{ type: "columnar_data", data: buildColumnarTrace(input, keyword, pad, mode) }];
          break;
        }
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
          {cipher === "columnar" && (
            <p className={styles.keyHint}>
              Keyword: letters <strong>A–Z</strong> and/or digits <strong>0–9</strong> (digits sort before letters when ordering columns). Message: letters <strong>A–Z</strong> only in the grid. Append{" "}
              <strong>|</strong> and one letter to change padding (default <strong>X</strong>), e.g.{" "}
              <code>MONKEY|Q</code> or <code>314159|Z</code>.
            </p>
          )}
        </div>

        {cipher === "aes" && (
          <>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Key Size</label>
              <select className={styles.select} value={aesKeySize} onChange={(e) => { setAesKeySize(parseInt(e.target.value)); setOutput(""); setSteps([]); setError(""); }}>
                <option value={128}>128-bit (32 hex chars)</option>
                <option value={192}>192-bit (48 hex chars)</option>
                <option value={256}>256-bit (64 hex chars)</option>
              </select>
            </div>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Block Mode</label>
              <select className={styles.select} value={aesMode} onChange={(e) => { setAesMode(e.target.value); setOutput(""); setSteps([]); setError(""); }}>
                <option value="ECB">ECB</option>
                <option value="CBC">CBC</option>
                <option value="CFB">CFB</option>
                <option value="OFB">OFB</option>
                <option value="CTR">CTR</option>
              </select>
            </div>
            {aesMode !== "ECB" && (
              <div className={styles.controlGroup}>
                <label className={styles.label}>IV (32-char Hex)</label>
                <input className={styles.input} type="text" placeholder="e.g. 0123..." value={aesIV} onChange={(e) => setAesIV(e.target.value)} />
              </div>
            )}
            <div className={styles.controlGroup}>
              <label className={styles.label}>Output Format</label>
              <select className={styles.select} value={aesFormat} onChange={(e) => { setAesFormat(e.target.value); setOutput(""); setSteps([]); setError(""); }}>
                <option value="base64">Base64</option>
                <option value="hex">Hexadecimal</option>
              </select>
            </div>
          </>
        )}

        {cipher === "rsa" && (
          <div className={styles.paramSection}>
            <div className={styles.paramSectionTitle}>RSA Key Configurations</div>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Prime P</label>
              <input className={styles.input} type="text" value={rsaP} onChange={(e) => setRsaP(e.target.value)} />
            </div>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Prime Q</label>
              <input className={styles.input} type="text" value={rsaQ} onChange={(e) => setRsaQ(e.target.value)} />
            </div>
            {mode === "encrypt" ? (
              <>
                <div className={styles.controlGroup}>
                  <label className={styles.label}>Modulus N</label>
                  <input className={styles.input} type="text" value={rsaN} onChange={(e) => setRsaN(e.target.value)} />
                </div>
                <div className={styles.controlGroup}>
                  <label className={styles.label}>Public E</label>
                  <input className={styles.input} type="text" value={rsaE} onChange={(e) => setRsaE(e.target.value)} />
                </div>
              </>
            ) : (
              <>
                <div className={styles.controlGroup}>
                  <label className={styles.label}>Modulus N</label>
                  <input className={styles.input} type="text" value={rsaN} onChange={(e) => setRsaN(e.target.value)} />
                </div>
                <div className={styles.controlGroup}>
                  <label className={styles.label}>Private D</label>
                  <input className={styles.input} type="text" value={rsaD} onChange={(e) => setRsaD(e.target.value)} />
                </div>
              </>
            )}
            <div className={styles.controlGroup} style={{ flex: 1, minWidth: "100%", flexDirection: "row", justifyContent: "flex-end" }}>
               <button className={styles.runBtn} style={{ width: "auto", padding: "8px 16px", marginTop: "8px" }} onClick={() => {
                 try { const keys = generateRSAKeys(rsaP, rsaQ, rsaE); setRsaN(keys.publicKey.n.toString()); setRsaD(keys.privateKey.d.toString()); alert("Generated N and D from P and Q"); } catch(e) { alert(e.message); }
               }}>Generate Keys from P & Q</button>
            </div>
          </div>
        )}

        {cipher === "dh" && (
          <div className={styles.paramSection}>
            <div className={styles.paramSectionTitle}>Diffie-Hellman Parameters</div>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Shared Prime (p)</label>
              <input className={styles.input} type="text" value={dhP} onChange={(e) => setDhP(e.target.value)} />
            </div>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Shared Base (g)</label>
              <input className={styles.input} type="text" value={dhG} onChange={(e) => setDhG(e.target.value)} />
            </div>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Alice&apos;s Secret (A)</label>
              <input className={styles.input} type="text" value={dhA} onChange={(e) => setDhA(e.target.value)} />
            </div>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Bob&apos;s Secret (B)</label>
              <input className={styles.input} type="text" value={dhB} onChange={(e) => setDhB(e.target.value)} />
            </div>
            <div className={styles.controlGroup} style={{ flex: 1, minWidth: "100%", flexDirection: "row", justifyContent: "flex-end" }}>
              <button className={styles.runBtn} style={{ width: "auto", padding: "8px 16px", marginTop: "8px" }} onClick={run}>
                Compute Key Exchange
              </button>
            </div>
          </div>
        )}

        {cipher === "elgamal" && (
          <div className={styles.paramSection}>
             <div className={styles.paramSectionTitle}>ElGamal Configurations</div>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Prime (p)</label>
              <input className={styles.input} type="text" value={elgP} onChange={(e) => setElgP(e.target.value)} />
            </div>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Generator (g)</label>
              <input className={styles.input} type="text" value={elgG} onChange={(e) => setElgG(e.target.value)} />
            </div>
            {mode === "encrypt" ? (
              <>
                <div className={styles.controlGroup}>
                  <label className={styles.label}>Public Key (y)</label>
                  <input className={styles.input} type="text" value={elgY} onChange={(e) => setElgY(e.target.value)} />
                </div>
                <div className={styles.controlGroup}>
                  <label className={styles.label}>Random Scalar (k)</label>
                  <input className={styles.input} type="text" value={elgK} onChange={(e) => setElgK(e.target.value)} />
                </div>
              </>
            ) : (
              <div className={styles.controlGroup}>
                <label className={styles.label}>Private Key (x)</label>
                <input className={styles.input} type="text" value={elgX} onChange={(e) => setElgX(e.target.value)} />
              </div>
            )}
             <div className={styles.controlGroup} style={{ flex: 1, minWidth: "100%", flexDirection: "row", justifyContent: "flex-end" }}>
               <button className={styles.runBtn} style={{ width: "auto", padding: "8px 16px", marginTop: "8px" }} onClick={() => {
                try { const keys = generateElGamalKeys(elgP, elgG, elgX); setElgY(keys.publicKey.y.toString()); alert("Generated Public Key Y"); } catch(e) { alert(e.message); }
              }}>Calculate Y = gˣ mod p</button>
            </div>
          </div>
        )}

        {cipher === "ecc" && (
          <div className={styles.paramSection}>
            <div className={styles.paramSectionTitle}>Elliptic Curve ECDH Parameters</div>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Prime (p)</label>
              <input className={styles.input} type="text" value={eccP} onChange={(e) => setEccP(e.target.value)} />
            </div>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Curve a</label>
              <input className={styles.input} type="text" value={eccA} onChange={(e) => setEccA(e.target.value)} />
            </div>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Curve b</label>
              <input className={styles.input} type="text" value={eccB} onChange={(e) => setEccB(e.target.value)} />
            </div>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Base Point G</label>
              <div style={{display:"flex", gap:"4px"}}>
                <input className={styles.input} type="text" value={eccGx} onChange={(e) => setEccGx(e.target.value)} placeholder="x" />
                <input className={styles.input} type="text" value={eccGy} onChange={(e) => setEccGy(e.target.value)} placeholder="y" />
              </div>
            </div>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Alice Sec (kA)</label>
              <input className={styles.input} type="text" value={eccPrivA} onChange={(e) => setEccPrivA(e.target.value)} />
            </div>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Bob Sec (kB)</label>
              <input className={styles.input} type="text" value={eccPrivB} onChange={(e) => setEccPrivB(e.target.value)} />
            </div>
          </div>
        )}

        {cipher === "des" && (
          <>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Block Mode</label>
              <select className={styles.select} value={desMode} onChange={(e) => { setDesMode(e.target.value); setOutput(""); setSteps([]); setError(""); }}>
                <option value="ECB">ECB</option>
                <option value="CBC">CBC</option>
                <option value="CFB">CFB</option>
                <option value="OFB">OFB</option>
                <option value="CTR">CTR</option>
              </select>
            </div>
            {desMode !== "ECB" && (
              <div className={styles.controlGroup}>
                <label className={styles.label}>IV (16-char Hex)</label>
                <input className={styles.input} type="text" placeholder="e.g. 0123456789ABCDEF" value={desIV} onChange={(e) => setDesIV(e.target.value)} />
              </div>
            )}
            <div className={styles.controlGroup}>
              <label className={styles.label}>Output Format</label>
              <select className={styles.select} value={desFormat} onChange={(e) => { setDesFormat(e.target.value); setOutput(""); setSteps([]); setError(""); }}>
                <option value="base64">Base64</option>
                <option value="hex">Hexadecimal</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* I/O panels */}
      {!["dh"].includes(cipher) && (
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
                  : ["railfence", "columnar"].includes(cipher)
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
      )}

      {/* Step-by-step panel */}
      {steps.length > 0 && cipher === "playfair" ? (
        <PlayfairVisualizer stepsData={steps[0].data} mode={mode} />
      ) : steps.length > 0 && cipher === "hill" ? (
        <HillVisualizer stepsData={steps[0].data} mode={mode} />
      ) : steps.length > 0 && cipher === "vigenere" ? (
        <VigenereVisualizer stepsData={steps[0].data} mode={mode} />
      ) : steps.length > 0 && cipher === "columnar" ? (
        <ColumnarVisualizer data={steps[0].data} />
      ) : steps.length > 0 && cipher === "des" ? (
        <DESVisualizer data={steps[0].data} />
      ) : steps.length > 0 && cipher === "aes" ? (
        <AESVisualizer data={steps[0].data} />
      ) : steps.length > 0 && cipher === "rsa" ? (
        <RSAVisualizer data={steps[0].data} />
      ) : steps.length > 0 && cipher === "dh" ? (
        <DHVisualizer data={steps[0].data} />
      ) : steps.length > 0 && cipher === "elgamal" ? (
        <ElGamalVisualizer data={steps[0].data} />
      ) : steps.length > 0 && cipher === "ecc" ? (
        <ECCVisualizer data={steps[0].data} />
      ) : steps.length > 0 && (
        <StepByStep steps={steps} mode={mode} cipher={cipher} />
      )}
    </div>
  );
}
