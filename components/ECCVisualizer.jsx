import React from 'react';
import styles from './Asymmetric.module.css';

export default function ECCVisualizer({ data }) {
  const { p, a, b, G, kA, kB, PubA, PubB, SharedA, SharedB } = data;

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Elliptic Curve Diffie-Hellman (ECDH)</h3>
      
      <div className={styles.section}>
        <p className={styles.mathDesc}>ECDH uses Elliptic Curve Cryptography to establish a shared secret. It relies on the algebraic structure of elliptic curves over finite fields.</p>
        <div className={styles.paramGrid}>
          <div className={styles.paramBox}>
            <span className={styles.paramLabel}>Curve Prime (p)</span>
            <span className={styles.paramValue}>{p}</span>
          </div>
          <div className={styles.paramBox}>
            <span className={styles.paramLabel}>Equation</span>
            <span className={styles.paramValue}>y² = x³ + {a}x + {b} mod {p}</span>
          </div>
          <div className={styles.paramBox}>
            <span className={styles.paramLabel}>Base Point (G)</span>
            <span className={styles.paramValue}>({G.x}, {G.y})</span>
          </div>
        </div>
      </div>

      <div style={{display:"flex", gap:"16px", marginTop:"16px", flexWrap:"wrap"}}>
        <div className={styles.section} style={{flex:1}}>
          <h4 style={{color:"var(--accent)", margin:"0 0 12px 0"}}>Alice&apos;s Operations</h4>
          <div className={styles.paramBox} style={{marginBottom:"8px"}}>
            <span className={styles.paramLabel}>Private Scalar (kA)</span>
            <span className={styles.paramValue}>{kA}</span>
          </div>
          <div className={styles.mathBox}>
            PubA = kA * G<br/><br/>
            {PubA ? `(${PubA.x}, ${PubA.y})` : "Point at Infinity"}
          </div>
          <br/>
          <p className={styles.mathDesc}>Alice sends <strong>PubA</strong> to Bob.</p>
        </div>

        <div className={styles.section} style={{flex:1}}>
          <h4 style={{color:"var(--purple, #7c3aed)", margin:"0 0 12px 0"}}>Bob&apos;s Operations</h4>
          <div className={styles.paramBox} style={{marginBottom:"8px"}}>
            <span className={styles.paramLabel}>Private Scalar (kB)</span>
            <span className={styles.paramValue}>{kB}</span>
          </div>
          <div className={styles.mathBox} style={{background:"var(--surface-3)", color:"var(--text)"}}>
            PubB = kB * G<br/><br/>
            {PubB ? `(${PubB.x}, ${PubB.y})` : "Point at Infinity"}
          </div>
          <br/>
          <p className={styles.mathDesc}>Bob sends <strong>PubB</strong> to Alice.</p>
        </div>
      </div>

      <div className={styles.flowArrow}>↘ ↙</div>

      <div className={styles.section}>
        <h4 style={{textAlign:"center", color:"var(--text)", margin:"0 0 16px 0"}}>Deriving the Shared Secret Point (S)</h4>
        <div style={{display:"flex", gap:"16px", flexWrap:"wrap"}}>
            <div className={styles.mathBox} style={{flex:1}}>
              <strong>Alice computes:</strong><br/>
              SA = kA * PubB<br/>
              {SharedA ? `(${SharedA.x}, ${SharedA.y})` : "Point at Infinity"}
            </div>
            <div className={styles.mathBox} style={{flex:1}}>
              <strong>Bob computes:</strong><br/>
              SB = kB * PubA<br/>
              {SharedB ? `(${SharedB.x}, ${SharedB.y})` : "Point at Infinity"}
            </div>
        </div>
        <p style={{textAlign:"center", marginTop:"16px", fontSize:"1.1rem", color:"var(--green, #10b981)"}}>
          Both agree on Shared Coordinate (Secret X): <strong>{SharedA ? SharedA.x : "N/A"}</strong>
        </p>
      </div>

    </div>
  );
}
