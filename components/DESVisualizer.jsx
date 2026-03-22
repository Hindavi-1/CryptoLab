import React from 'react';
import styles from './DESVisualizer.module.css';

export default function DESVisualizer({ data }) {
  const { input, output, keyHex, ivHex, mode, format, action } = data;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>DES Transformation Process</h3>
      
      <div className={styles.metaGrid}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Action</span>
          <span className={styles.metaValue}>{action === "encrypt" ? "Encryption" : "Decryption"}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Block Mode</span>
          <span className={styles.metaValue}>{mode}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Key (64-bit Hex)</span>
          <span className={styles.metaValue}>{keyHex}</span>
        </div>
        {ivHex && mode !== 'ECB' && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>IV (64-bit Hex)</span>
            <span className={styles.metaValue}>{ivHex}</span>
          </div>
        )}
      </div>

      <div className={styles.feistelSection}>
        <h4 className={styles.sectionTitle}>Feistel Network Architecture</h4>
        <div className={styles.feistelDiagram}>
          <div className={styles.feistelBlock}>
            <div className={styles.blockHalf}>Left (L₀ - 32 bits)</div>
            <div className={styles.blockHalf}>Right (R₀ - 32 bits)</div>
          </div>
          <div className={styles.fRound}>
            <div className={styles.fRoundArrow}>↓</div>
            <div className={styles.fRoundText}>16 Rounds of Substitution and Permutation</div>
            <div className={styles.fRoundArrow}>↓</div>
          </div>
          <div className={styles.fMixer}>
            <div className={styles.mixerBox}>Expansion (32 → 48 bits)</div>
            <div className={styles.mixerOperator}>⊕ (XOR with 48-bit Subkey)</div>
            <div className={styles.mixerBox}>S-Boxes (48 → 32 bits)</div>
            <div className={styles.mixerBox}>P-Box Permutation</div>
          </div>
          <div className={styles.feistelBlock}>
             <div className={styles.blockHalf}>New Left (L₁₆ = R₁₅)</div>
             <div className={styles.blockHalf}>New Right (R₁₆ = L₁₅ ⊕ f(R₁₅, K₁₆))</div>
          </div>
        </div>
        <p className={styles.feistelDesc}>
          In <strong>{mode}</strong> mode, the text is divided into 64-bit blocks. Each block undergoes an Initial Permutation, followed by 16 identical Feistel rounds incorporating 48-bit subkeys derived from the main key. Finally, the halves are swapped and a Final Permutation produces the ciphertext.
          <br/><br/>
          {mode !== 'ECB' && <span><strong>Mode Details:</strong> Since <strong>{mode}</strong> mode is used, {mode === 'CBC' ? "each plaintext block is XORed with the previous ciphertext block (or IV) before encryption." : "the block cipher acts as a stream cipher using the IV initialization."}</span>}
        </p>
      </div>

    </div>
  );
}
