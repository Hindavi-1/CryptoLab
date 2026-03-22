import React from 'react';
import styles from './Asymmetric.module.css';

export default function DHVisualizer({ data }) {
  const { p, g, a, b, A, B, Sa, Sb } = data;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Diffie-Hellman Key Exchange</h3>
      
      <div className={styles.section}>
        <p className={styles.mathDesc}>Diffie-Hellman allows two parties (Alice and Bob) to establish a shared secret over an insecure channel by exchanging halft-derived public keys.</p>
        <div className={styles.paramGrid}>
          <div className={styles.paramBox}>
            <span className={styles.paramLabel}>Prime Modulus (p)</span>
            <span className={styles.paramValue}>{p}</span>
          </div>
          <div className={styles.paramBox}>
            <span className={styles.paramLabel}>Generator Base (g)</span>
            <span className={styles.paramValue}>{g}</span>
          </div>
        </div>
      </div>

      <div style={{display:"flex", gap:"16px", marginTop:"16px", flexWrap:"wrap"}}>
        <div className={styles.section} style={{flex:1}}>
          <h4 style={{color:"var(--accent)", margin:"0 0 12px 0"}}>Alice&apos;s Operations</h4>
          <div className={styles.paramBox} style={{marginBottom:"8px"}}>
            <span className={styles.paramLabel}>Private Secret (a)</span>
            <span className={styles.paramValue}>{a}</span>
          </div>
          <div className={styles.mathBox}>
            A = gᵃ mod p<br/><br/>
            {g}^{a} mod {p} = {A}
          </div>
          <br/>
          <p className={styles.mathDesc}>Alice sends <strong>A</strong> to Bob over public network.</p>
        </div>

        <div className={styles.section} style={{flex:1}}>
          <h4 style={{color:"var(--purple, #7c3aed)", margin:"0 0 12px 0"}}>Bob&apos;s Operations</h4>
          <div className={styles.paramBox} style={{marginBottom:"8px"}}>
            <span className={styles.paramLabel}>Private Secret (b)</span>
            <span className={styles.paramValue}>{b}</span>
          </div>
          <div className={styles.mathBox} style={{background:"var(--surface-3)", color:"var(--text)"}}>
            B = gᵇ mod p<br/><br/>
            {g}^{b} mod {p} = {B}
          </div>
          <br/>
          <p className={styles.mathDesc}>Bob sends <strong>B</strong> to Alice over public network.</p>
        </div>
      </div>

      <div className={styles.flowArrow}>↘ ↙</div>

      <div className={styles.section}>
        <h4 style={{textAlign:"center", color:"var(--text)", margin:"0 0 16px 0"}}>Deriving the Shared Secret (S)</h4>
        <div style={{display:"flex", gap:"16px", flexWrap:"wrap"}}>
            <div className={styles.mathBox} style={{flex:1}}>
              <strong>Alice computes:</strong><br/>
              S = Bᵃ mod p<br/>
              {B}^{a} mod {p} = {Sa}
            </div>
            <div className={styles.mathBox} style={{flex:1}}>
              <strong>Bob computes:</strong><br/>
              S = Aᵇ mod p<br/>
              {A}^{b} mod {p} = {Sb}
            </div>
        </div>
        <p style={{textAlign:"center", marginTop:"16px", fontSize:"1.1rem", color:"var(--green, #10b981)"}}>
          Both agree on the Shared Secret: <strong>{Sa}</strong>
        </p>
      </div>

    </div>
  );
}
