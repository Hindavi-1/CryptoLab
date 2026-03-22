import React from 'react';
import styles from './Asymmetric.module.css';

export default function RSAVisualizer({ data }) {
  const { action, n, e, d, blocks } = data;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>RSA Transformation Process</h3>
      
      <div className={styles.section}>
        <p className={styles.mathDesc}><strong>{action.toUpperCase()}</strong>: In RSA, messages are encoded numerically and exponentiated modulus {n}.</p>
        <div className={styles.paramGrid}>
          <div className={styles.paramBox}>
            <span className={styles.paramLabel}>Modulus (N)</span>
            <span className={styles.paramValue}>{n}</span>
          </div>
          {action === "encrypt" ? (
             <div className={styles.paramBox}>
               <span className={styles.paramLabel}>Public Key (E)</span>
               <span className={styles.paramValue}>{e}</span>
             </div>
          ) : (
             <div className={styles.paramBox}>
               <span className={styles.paramLabel}>Private Key (D)</span>
               <span className={styles.paramValue}>{d}</span>
             </div>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.blockList}>
          {blocks.map((blk, i) => (
            <div key={i} className={styles.blockCard}>
              <span className={styles.blockChar}>{action === "encrypt" ? `'${blk.char}'` : `C`}</span>
              <span className={styles.blockMath}>
                {action === "encrypt" 
                  ? `${blk.m}^${e} mod ${n}` 
                  : `${blk.c}^${d} mod ${n}`}
              </span>
              <span className={styles.blockRes}>
                = {action === "encrypt" ? blk.c : `'${blk.char}' (${blk.m})`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
