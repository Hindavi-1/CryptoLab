import React from 'react';
import styles from './Asymmetric.module.css';

export default function ElGamalVisualizer({ data }) {
  const { action, error, p, g, y, x, k, c1, s, sInv, blocks } = data;

  if (error) {
    return <div className={styles.container} style={{color:"red"}}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>ElGamal Transfer Protocol</h3>
      
      <div className={styles.section}>
        <p className={styles.mathDesc}><strong>{action.toUpperCase()}</strong>: ElGamal relies on the Diffie-Hellman algorithm to randomize encryption using an ephemeral key.</p>
        <div className={styles.paramGrid}>
          <div className={styles.paramBox}>
            <span className={styles.paramLabel}>Prime (p)</span>
            <span className={styles.paramValue}>{p}</span>
          </div>
          {action === "encrypt" ? (
             <>
               <div className={styles.paramBox}><span className={styles.paramLabel}>Generator (g)</span><span className={styles.paramValue}>{g}</span></div>
               <div className={styles.paramBox}><span className={styles.paramLabel}>Public Key (y)</span><span className={styles.paramValue}>{y}</span></div>
               <div className={styles.paramBox}><span className={styles.paramLabel}>Random Ephermal (k)</span><span className={styles.paramValue}>{k}</span></div>
             </>
          ) : (
             <>
               <div className={styles.paramBox}><span className={styles.paramLabel}>Private Key (x)</span><span className={styles.paramValue}>{x}</span></div>
               <div className={styles.paramBox}><span className={styles.paramLabel}>Cipher 1 (C1)</span><span className={styles.paramValue}>{c1}</span></div>
             </>
          )}
        </div>
      </div>

      <div className={styles.section}>
         <h4 style={{marginBottom:"12px"}}>1. Deriving Verification Scalar (s)</h4>
         {action === "encrypt" ? (
             <div className={styles.mathBox}>
                s = yᵏ mod p &nbsp;&nbsp;→&nbsp;&nbsp; {y}^{k} mod {p} <br/>
                C1 = gᵏ mod p &nbsp;&nbsp;→&nbsp;&nbsp; C1 = {c1}
             </div>
         ) : (
             <div className={styles.mathBox}>
                s = C1ˣ mod p &nbsp;&nbsp;→&nbsp;&nbsp; {c1}^{x} mod {p} = {s} <br/>
                s⁻¹ mod p = {sInv} 
             </div>
         )}
      </div>

      <div className={styles.section}>
        <h4 style={{marginBottom:"12px"}}>2. Computing Block Values</h4>
        <div className={styles.blockList}>
          {blocks.map((blk, i) => (
            <div key={i} className={styles.blockCard}>
              <span className={styles.blockChar}>{action === "encrypt" ? `'${blk.char}'` : `C2`}</span>
              <span className={styles.blockMath}>
                {action === "encrypt" 
                  ? `${blk.m} * s mod ${p}` 
                  : `${blk.c2} * s⁻¹ mod ${p}`}
              </span>
              <span className={styles.blockRes}>
                → {action === "encrypt" ? `C2 = ${blk.c2}` : `'${blk.char}' (${blk.m})`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
