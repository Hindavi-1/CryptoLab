"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./compare.module.css";

// ─── Data ─────────────────────────────────────────────────────────────
const CIPHER_METADATA = [
  { id: "caesar", name: "Caesar" },
  { id: "affine", name: "Affine" },
  { id: "substitution", name: "Substitution" },
  { id: "vigenere", name: "Vigenère" },
  { id: "playfair", name: "Playfair" },
  { id: "hill", name: "Hill" },
  { id: "columnar", name: "Columnar" },
  { id: "railfence", name: "Rail Fence" },
  { id: "des", name: "DES" },
  { id: "aes", name: "AES" },
  { id: "rsa", name: "RSA" },
  { id: "dh", name: "Diffie-Hellman" },
  { id: "elgamal", name: "ElGamal" },
  { id: "ecc", name: "ECC" },
  { id: "md5", name: "MD5" },
  { id: "sha256", name: "SHA-256" },
];

const ROW_PROPERTIES = [
  { id: "type", label: "Algorithm Type", highlightMatch: ["Block Cipher", "Asymmetric", "Hash Function", "Key Exchange"] },
  { id: "keyType", label: "Key Paradigm" },
  { id: "keySize", label: "Key Size", highlightMatch: ["128/192/256 bits", "2048-4096 bits", "256-521 bits", "2048+ bits"] },
  { id: "blockSize", label: "Block / Input Size" },
  { id: "speed", label: "Processing Speed", highlightMatch: ["Very fast", "Fast (Hardware)", "Fast"] },
  { id: "security", label: "Security Level", highlightMatch: ["✓ Strong"] },
  { id: "year", label: "Year Invented" },
  { id: "stillUsed", label: "Still Used?", highlightMatch: ["Yes"] },
];

const CIPHER_DATA = {
  caesar: { 
    type: { text: "Substitution", desc: "Each character is systematically replaced by another." },
    keyType: { text: "Shift (0-25)", desc: "A single integer indicating how many places to shift the alphabet." },
    keySize: "~4.7 bits", blockSize: "1 char", speed: "Very fast", security: "⚠ Broken", year: "~58 BC", stillUsed: "No" 
  },
  affine: { 
    type: { text: "Substitution", desc: "Each character is mapped to its numeric equivalent, encrypted using a linear mathematical function, and converted back." },
    keyType: { text: "Linear (a, b)", desc: "Requires two integers 'a' (multiplier) and 'b' (shift)." },
    keySize: "~8.5 bits", blockSize: "1 char", speed: "Very fast", security: "⚠ Broken", year: "Ancient", stillUsed: "No" 
  },
  substitution: { 
    type: { text: "Substitution", desc: "Each character is systematically replaced by another." },
    keyType: { text: "Alphabet map", desc: "A completely jumbled 26-letter alphabet." },
    keySize: "~88.4 bits", blockSize: "1 char", speed: "Fast", security: "⚠ Broken", year: "Ancient", stillUsed: "No" 
  },
  vigenere: { 
    type: { text: "Polyalphabetic", desc: "Uses multiple substitution alphabets, cycling through them to encrypt." },
    keyType: { text: "Keyword", desc: "A string of characters used to determine the shift for each letter." },
    keySize: "Variable", blockSize: "1 char", speed: "Fast", security: "⚠ Weak", year: "1553", stillUsed: "No" 
  },
  playfair: { 
    type: { text: "Polyalphabetic", desc: "Encrypts pairs of letters (digraphs) instead of single letters." },
    keyType: { text: "5x5 Matrix", desc: "A 5x5 grid generated from a keyword used for mapping pairs." },
    keySize: "~84 bits", blockSize: "2 chars", speed: "Fast", security: "⚠ Weak", year: "1854", stillUsed: "No" 
  },
  hill: { 
    type: { text: "Polyalphabetic", desc: "Uses linear algebra to encrypt blocks of text." },
    keyType: { text: "NxN Matrix", desc: "An invertible matrix (key) used to multiply plaintext vectors." },
    keySize: "Variable", blockSize: "N chars", speed: "Moderate", security: "⚠ Weak", year: "1929", stillUsed: "No" 
  },
  columnar: { 
    type: { text: "Transposition", desc: "Rearranges the positions of characters without changing the characters themselves." },
    keyType: { text: "Keyword", desc: "Determines the order in which columns are read out." },
    keySize: "Variable", blockSize: "Key length", speed: "Fast", security: "⚠ Weak", year: "1800s", stillUsed: "No" 
  },
  railfence: { 
    type: { text: "Transposition", desc: "Writes plaintext in a zigzag pattern across multiple rails." },
    keyType: { text: "Number of rails", desc: "The depth of the zigzag pattern." },
    keySize: "Small integer", blockSize: "Arbitrary", speed: "Very fast", security: "⚠ Broken", year: "Ancient", stillUsed: "No" 
  },
  des: { 
    type: { text: "Block Cipher", desc: "Operates on fixed-size blocks of bits using a secret key and complex rounds." },
    keyType: { text: "Symmetric", desc: "The exact same key is used for both encryption and decryption." },
    keySize: "56 bits", blockSize: "64 bits", speed: "Moderate", security: "⚠ Deprecated", year: "1977", stillUsed: "No" 
  },
  aes: { 
    type: { text: "Block Cipher", desc: "Operates on fixed-size blocks of bits using a secret key and complex rounds." },
    keyType: { text: "Symmetric", desc: "The exact same key is used for both encryption and decryption." },
    keySize: "128/192/256 bits", blockSize: "128 bits", speed: "Fast (Hardware)", security: "✓ Strong", year: "2001", stillUsed: "Yes" 
  },
  rsa: { 
    type: { text: "Asymmetric", desc: "Uses mathematically linked key pairs (public for encrypting, private for decrypting)." },
    keyType: { text: "Public/Private", desc: "Two distinct but related keys." },
    keySize: "2048-4096 bits", blockSize: "Key-dependent", speed: "Slow", security: "✓ Strong", year: "1977", stillUsed: "Yes" 
  },
  dh: { 
    type: { text: "Key Exchange", desc: "A method to securely exchange cryptographic keys over a public channel." },
    keyType: { text: "Public/Private", desc: "Two distinct but related keys." },
    keySize: "2048+ bits", blockSize: "N/A", speed: "Slow", security: "✓ Strong", year: "1976", stillUsed: "Yes" 
  },
  elgamal: { 
    type: { text: "Asymmetric", desc: "Uses mathematically linked key pairs (public for encrypting, private for decrypting)." },
    keyType: { text: "Public/Private", desc: "Two distinct but related keys." },
    keySize: "2048+ bits", blockSize: "Key-dependent", speed: "Slow", security: "✓ Strong", year: "1985", stillUsed: "Yes" 
  },
  ecc: { 
    type: { text: "Asymmetric", desc: "Uses the algebraic structure of elliptic curves. Much smaller keys than RSA." },
    keyType: { text: "Curve Points", desc: "Keys are points on an elliptic curve." },
    keySize: "256-521 bits", blockSize: "Key-dependent", speed: "Moderate", security: "✓ Strong", year: "1985", stillUsed: "Yes" 
  },
  md5: { 
    type: { text: "Hash Function", desc: "One-way mapping of arbitrary data to a fixed-size digest." },
    keyType: { text: "None", desc: "Hash functions do not use keys (unless forming an HMAC)." },
    keySize: "None", blockSize: "Arbitrary", speed: "Very fast", security: "⚠ Broken", year: "1992", stillUsed: "No (For Crypto)" 
  },
  sha256: { 
    type: { text: "Hash Function", desc: "One-way mapping of arbitrary data to a fixed-size digest." },
    keyType: { text: "None", desc: "Hash functions do not use keys." },
    keySize: "None", blockSize: "Arbitrary", speed: "Fast", security: "✓ Strong", year: "2001", stillUsed: "Yes" 
  }
};

export default function ComparePage() {
  const [selected, setSelected] = useState(["caesar", "vigenere", "des", "aes", "rsa"]);
  const [highlightRow, setHighlightRow] = useState(null);

  const toggleCipher = (id) => {
    if (selected.includes(id)) {
      if (selected.length > 2) {
        setSelected(selected.filter((x) => x !== id));
      }
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleRowClick = (propId) => {
    setHighlightRow(highlightRow === propId ? null : propId);
  };

  // Filter out ciphers to display in table based on original order
  const displayCiphers = CIPHER_METADATA.filter((c) => selected.includes(c.id));

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Side by Side</span>
          <h1 className={styles.title}>Algorithm Comparison</h1>
          <p className={styles.subtitle}>
            Select algorithms below to compare them across key properties. Click a property row to highlight the top performers in that category.
          </p>
        </div>

        {/* ── Selector Pills ── */}
        <div className={styles.selector}>
          {CIPHER_METADATA.map((c) => {
            const isSelected = selected.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCipher(c.id)}
                className={`${styles.pill} ${isSelected ? styles.pillActive : ""}`}
                disabled={isSelected && selected.length <= 2}
              >
                {isSelected && (
                  <motion.span
                    layoutId="pill-glow"
                    className={styles.pillGlow}
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className={styles.pillText}>{c.name}</span>
                {isSelected && <span className={styles.pillIcon}>✕</span>}
              </button>
            );
          })}
        </div>

        {/* ── Comparison Table ── */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={`${styles.th} ${styles.thSticky}`}>Property</th>
                <AnimatePresence mode="popLayout">
                  {displayCiphers.map((c) => (
                    <motion.th
                      key={c.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className={styles.th}
                    >
                      {c.name}
                    </motion.th>
                  ))}
                </AnimatePresence>
              </tr>
            </thead>
            <tbody>
              {ROW_PROPERTIES.map((prop) => {
                const isRowHighlighted = highlightRow === prop.id;
                return (
                  <tr
                    key={prop.id}
                    className={`${styles.tr} ${isRowHighlighted ? styles.trHighlight : ""}`}
                    onClick={() => handleRowClick(prop.id)}
                    title="Click to highlight top performers"
                  >
                    <td className={`${styles.td} ${styles.tdSticky} ${styles.tdProp}`}>
                      {prop.label}
                      <span className={styles.rowHint}>Click to highlight</span>
                    </td>
                    <AnimatePresence mode="popLayout">
                      {displayCiphers.map((c) => {
                        const val = CIPHER_DATA[c.id][prop.id];
                        
                        let textVal = "";
                        let tooltipText = "";

                        if (typeof val === "object" && val !== null) {
                          textVal = val.text;
                          tooltipText = val.desc;
                        } else {
                          textVal = val;
                        }

                        const isGood = typeof textVal === "string" && textVal.includes("✓");
                        const isWarn = typeof textVal === "string" && textVal.includes("⚠");
                        
                        // Check if this cell matches the highlight criteria for the row
                        const isBest = prop.highlightMatch && prop.highlightMatch.some(m => textVal.includes(m));
                        const showGlow = isRowHighlighted && isBest;
                        const showDim = isRowHighlighted && !isBest;

                        return (
                          <motion.td
                            key={c.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`
                              ${styles.td}
                              ${isGood ? styles.tdGood : ""}
                              ${isWarn ? styles.tdWarn : ""}
                              ${showGlow ? styles.tdGlow : ""}
                              ${showDim ? styles.tdDim : ""}
                            `}
                          >
                            <span 
                              className={tooltipText ? styles.hasTooltip : ""} 
                              title={tooltipText || undefined}
                            >
                              {textVal}
                            </span>
                          </motion.td>
                        );
                      })}
                    </AnimatePresence>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendGood}`} />
            Secure / Recommended
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendWarn}`} />
            Weak / Deprecated / Broken
          </div>
        </div>
      </div>
    </div>
  );
}
