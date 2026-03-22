import React from 'react';
import styles from './AESVisualizer.module.css';

export default function AESVisualizer({ data }) {
  const { input, output, keyHex, ivHex, mode, keySize, format, action } = data;

  const roundsCount = keySize === 128 ? 10 : keySize === 192 ? 12 : 14;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>AES Transformation Process</h3>
      
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
          <span className={styles.metaLabel}>Key Size</span>
          <span className={styles.metaValue}>{keySize}-bit ({roundsCount} Rounds)</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>Key (Hex)</span>
          <span className={styles.metaValue} style={{ fontSize: '0.85rem' }}>{keyHex}</span>
        </div>
        {ivHex && mode !== 'ECB' && (
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>IV (128-bit Hex)</span>
            <span className={styles.metaValue} style={{ fontSize: '0.85rem' }}>{ivHex}</span>
          </div>
        )}
      </div>

      <div className={styles.spnSection}>
        <h4 className={styles.sectionTitle}>Substitution-Permutation Network (SPN)</h4>
        
        <div className={styles.spnDiagram}>
          <div className={styles.spnState}>128-bit Plaintext State Array (4x4 matrix)</div>
          
          <div className={styles.spnArrow}>↓</div>
          <div className={styles.spnOp}>AddRoundKey (Initial Key)</div>
          
          <div className={styles.spnArrow}>↓</div>
          <div className={styles.spnLoop}>
            <div className={styles.spnLoopBadge}>Rounds 1 to {roundsCount - 1}</div>
            <div className={styles.spnOpBox}>SubBytes <span>(Non-linear S-Box Substitution)</span></div>
            <div className={styles.spnOpBox}>ShiftRows <span>(Cyclic Row Shifts)</span></div>
            <div className={styles.spnOpBox}>MixColumns <span>(Matrix Multiplication in GF(2^8))</span></div>
            <div className={styles.spnOpBox}>AddRoundKey <span>(XOR with derived subkey)</span></div>
          </div>

          <div className={styles.spnArrow}>↓</div>
          <div className={styles.spnLoopFinal}>
            <div className={styles.spnLoopBadge}>Final Round ({roundsCount})</div>
            <div className={styles.spnOpBox}>SubBytes</div>
            <div className={styles.spnOpBox}>ShiftRows</div>
            <div className={styles.spnOpBox}>AddRoundKey <span>(MixColumns is skipped)</span></div>
          </div>
          
          <div className={styles.spnArrow}>↓</div>
          <div className={styles.spnState}>128-bit Ciphertext Block</div>
        </div>

        <p className={styles.spnDesc}>
          In <strong>{mode}</strong> mode, AES processes the message in fixed 128-bit blocks organized as a 4×4 column-major matrix of bytes (the state). The algorithm performs {roundsCount} rounds of transformation based on the {keySize}-bit key.
          {mode !== 'ECB' && <span><br/><br/><strong>Mode Details:</strong> Because <strong>{mode}</strong> mode was chosen, {mode === 'CBC' ? "each 128-bit plaintext block is XORed with the preceding ciphertext block (or IV for the first block) before entering the SPN sequence." : "the block cipher runs securely as a continuous stream over the given IV."}</span>}
        </p>
      </div>
    </div>
  );
}
