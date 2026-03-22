import styles from "./Flowchart.module.css";

export default function Flowchart({ cipher }) {
  const cipherLower = cipher.toLowerCase();
  
  const isSubstitution = ['caesar', 'vigenere', 'affine', 'substitution'].includes(cipherLower);
  const isTransposition = ['railfence', 'columnar'].includes(cipherLower);
  const isPolygraphic = ['playfair', 'hill'].includes(cipherLower);
  const isBlock = ['des', 'aes'].includes(cipherLower);
  const isAsymmetric = ['rsa', 'dh', 'ecc', 'elgamal'].includes(cipherLower);
  const isHash = ['md5', 'sha256'].includes(cipherLower);

  let content = null;

  if (cipherLower === 'dh') {
    content = (
      <div className={styles.flowCol} style={{gap: "16px"}}>
        <div style={{display:"flex", gap:"16px", justifyContent:"center"}}>
           <div className={styles.node} style={{background: "var(--surface-3)", flex:1}}>Alice ({`Secret a`})</div>
           <div className={styles.node} style={{background: "var(--surface-3)", flex:1}}>Bob ({`Secret b`})</div>
        </div>
        <div className={styles.flowRow}>
           <div className={styles.process}><strong>A = gᵃ mod p</strong></div>
           <div className={styles.process}><strong>B = gᵇ mod p</strong></div>
        </div>
        <div className={styles.flowRow}>
           <div className={`${styles.arrow} ${styles.arrowDown}`}>↘</div>
           <div className={`${styles.arrow} ${styles.arrowDown}`}>↙</div>
        </div>
        <div className={styles.flowRow}>
           <div className={styles.process} style={{borderColor: "var(--accent)"}}><strong>Alice gets B</strong></div>
           <div className={styles.process} style={{borderColor: "var(--purple)"}}><strong>Bob gets A</strong></div>
        </div>
        <div className={styles.flowRow}>
           <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
           <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
        </div>
        <div className={styles.flowRow}>
           <div className={styles.process}><strong>S = Bᵃ mod p</strong></div>
           <div className={styles.process}><strong>S = Aᵇ mod p</strong></div>
        </div>
        <div className={styles.node} style={{background: "var(--green)"}}>Shared Secret (S)</div>
      </div>
    );
  } else if (cipherLower === 'ecc') {
    content = (
      <div className={styles.flowCol} style={{gap: "16px"}}>
        <div style={{display:"flex", gap:"16px", justifyContent:"center"}}>
           <div className={styles.node} style={{background: "var(--surface-3)", flex:1}}>Alice ({`Scalar kA`})</div>
           <div className={styles.node} style={{background: "var(--surface-3)", flex:1}}>Bob ({`Scalar kB`})</div>
        </div>
        <div className={styles.flowRow}>
           <div className={styles.process}><strong>PubA = kA * G</strong></div>
           <div className={styles.process}><strong>PubB = kB * G</strong></div>
        </div>
        <div className={styles.flowRow}>
           <div className={`${styles.arrow} ${styles.arrowDown}`}>↘</div>
           <div className={`${styles.arrow} ${styles.arrowDown}`}>↙</div>
        </div>
        <div className={styles.flowRow}>
           <div className={styles.process}><strong>SharedA = kA * PubB</strong></div>
           <div className={styles.process}><strong>SharedB = kB * PubA</strong></div>
        </div>
        <div className={styles.node} style={{background: "var(--green)"}}>Shared Geometric Coordinate</div>
      </div>
    );
  } else if (cipherLower === 'elgamal') {
    content = (
       <div className={styles.flowCol} style={{ gap: "24px" }}>
          <div className={styles.flowCol}>
            <div style={{ textAlign: "center", marginBottom: "8px", fontWeight:"bold", color:"var(--accent)" }}>Encryption Graph</div>
            <div className={styles.flowRow}>
              <div className={styles.node} style={{flex:1}}>Plaintext m</div>
              <div className={`${styles.node} ${styles.nodeKey}`} style={{flex:1}}>Receiver Public (y)</div>
            </div>
            <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
            <div className={styles.process} style={{background: "var(--surface-3)"}}>
              <div className={styles.processContent}>
                <strong className={styles.processTitle}>Randomize with k</strong>
                <div className={styles.processDetail}>C1 = gᵏ mod p<br/>C2 = m * yᵏ mod p</div>
              </div>
            </div>
            <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
            <div className={styles.node}>Ciphertext (C1, C2)</div>
          </div>
          
          <div className={styles.flowCol}>
            <div style={{ textAlign: "center", marginBottom: "8px", fontWeight:"bold", color:"var(--green)" }}>Decryption Graph</div>
            <div className={styles.flowRow}>
               <div className={styles.node} style={{flex:1}}>Ciphertext (C1, C2)</div>
               <div className={`${styles.node} ${styles.nodeKey}`} style={{flex:1}}>Receiver Private (x)</div>
            </div>
            <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
            <div className={styles.process} style={{background: "var(--surface-3)"}}>
              <div className={styles.processContent}>
                <strong className={styles.processTitle}>Recover via Modular Math</strong>
                <div className={styles.processDetail}>s = C1ˣ mod p<br/>m = C2 * s⁻¹ mod p</div>
              </div>
            </div>
            <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
            <div className={styles.node}>Plaintext m</div>
          </div>
        </div>
    );
  } else if (cipherLower === 'rsa') {
    content = (
       <div className={styles.flowCol}>
          <div className={styles.flowRow}>
            <div className={styles.node} style={{flex:1}}>Plaintext M</div>
            <div className={`${styles.node} ${styles.nodeKey}`} style={{flex:1}}>Public Key (e, n)</div>
          </div>
          <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
          <div className={styles.process} style={{background: "var(--surface-3)"}}>
            <div className={styles.processContent}>
              <strong className={styles.processTitle}>Modular Exponentiation</strong>
              <div className={styles.processDetail}>C = Mᵉ mod n</div>
            </div>
          </div>
          <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
          <div className={styles.node}>Ciphertext C</div>
        </div>
    );
  } else if (isSubstitution || isTransposition || isPolygraphic) {
    let modeText = isSubstitution ? "Substitution Engine" : isTransposition ? "Transposition / Permutation" : "Polygraphic Matrix Math";
    content = (
      <div className={styles.flowCol}>
        <div className={styles.flowRow}>
          <div className={styles.node}>Plaintext</div>
          <div className={`${styles.node} ${styles.nodeKey}`}>Key / Parameters</div>
        </div>
        <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
        <div className={styles.process}>
          <div className={styles.processContent}>
            <strong className={styles.processTitle}>{modeText}</strong>
            <div className={styles.processDetail}>{cipher.toUpperCase()} Algorithm</div>
          </div>
        </div>
        <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
        <div className={styles.node}>Ciphertext</div>
      </div>
    );
  } else if (isBlock) {
    if (cipherLower === 'des') {
      content = (
        <div className={styles.flowCol}>
          <div className={styles.flowRow}>
            <div className={styles.node} style={{flex:1}}>64-bit Plaintext Block</div>
            <div className={`${styles.node} ${styles.nodeKey}`} style={{flex:1}}>64-bit Key (56 usable)</div>
          </div>
          <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
          <div className={styles.process} style={{background: 'var(--surface-3)', border: '1px dashed var(--border)'}}>
            <div className={styles.processContent}>
              <strong className={styles.processTitle}>Initial Permutation (IP)</strong>
            </div>
          </div>
          <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
          <div className={styles.process}>
            <div className={styles.processContent}>
              <strong className={styles.processTitle}>16 Feistel Rounds</strong>
              <div className={styles.processDetail}>L(i) = R(i-1) <br/> R(i) = L(i-1) ⊕ f(R(i-1), K(i))</div>
            </div>
          </div>
          <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
          <div className={styles.process} style={{background: 'var(--surface-3)', border: '1px dashed var(--border)'}}>
            <div className={styles.processContent}>
              <strong className={styles.processTitle}>Final Permutation (IP⁻¹)</strong>
            </div>
          </div>
          <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
          <div className={styles.node}>64-bit Ciphertext Block</div>
        </div>
      );
    } else {
      let roundsText = cipherLower === 'aes' ? "10/12/14 Rounds of SPN" : `${cipher.toUpperCase()} Rounds`;
      let detail = cipherLower === 'aes' ? "SubBytes, ShiftRows, MixColumns, AddRoundKey" : "Substitution / Permutation";
      content = (
        <div className={styles.flowCol}>
          <div className={styles.flowRow}>
            <div className={styles.node} style={{flex:1}}>128-bit Plaintext State</div>
            <div className={`${styles.node} ${styles.nodeKey}`} style={{flex:1}}>Key (128/192/256 bits)</div>
          </div>
          <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
          <div className={styles.process} style={{background: 'var(--surface-3)', border: '1px dashed var(--border)'}}>
            <div className={styles.processContent}>
              <strong className={styles.processTitle}>Initial Round Key Addition</strong>
              <div className={styles.processDetail}>AddRoundKey</div>
            </div>
          </div>
          <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
          <div className={styles.process}>
            <div className={styles.processContent}>
              <strong className={styles.processTitle}>{roundsText}</strong>
              <div className={styles.processDetail}>{detail}</div>
            </div>
          </div>
          <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
          <div className={styles.process} style={{background: 'var(--surface-3)', border: '1px dashed var(--border)'}}>
            <div className={styles.processContent}>
              <strong className={styles.processTitle}>Final Round</strong>
              <div className={styles.processDetail}>SubBytes, ShiftRows, AddRoundKey (No MixColumns)</div>
            </div>
          </div>
          <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
          <div className={styles.node}>128-bit Ciphertext State</div>
        </div>
      );
    }
  } else if (isAsymmetric) {
    content = (
      <div className={styles.flowCol}>
        <div className={styles.flowRow}>
          <div className={styles.node}>Plaintext Message (M)</div>
          <div className={`${styles.node} ${styles.nodeKey}`}>Public Key (e, n)</div>
        </div>
        <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
        <div className={styles.process}>
          <div className={styles.processContent}>
            <strong className={styles.processTitle}>RSA Encryption</strong>
            <div className={styles.processDetail}>C = M^e mod n</div>
          </div>
        </div>
        <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
        <div className={styles.node}>Ciphertext (C)</div>
      </div>
    );
  } else if (isHash) {
    content = (
      <div className={styles.flowCol}>
        <div className={styles.node}>Arbitrary Length Message</div>
        <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
        <div className={styles.process}>
          <div className={styles.processContent}>
            <strong className={styles.processTitle}>{cipher.toUpperCase()} Compression</strong>
            <div className={styles.processDetail}>Padding & Logical Rounds</div>
          </div>
        </div>
        <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
        <div className={styles.node}>Fixed-Length Hash Digest</div>
      </div>
    );
  } else {
    content = (
      <div className={styles.flowCol}>
        <div className={styles.node}>Input Data</div>
        <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
        <div className={styles.process}>
          <div className={styles.processContent}>
            <strong className={styles.processTitle}>{cipher.toUpperCase()} Algorithm</strong>
          </div>
        </div>
        <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
        <div className={styles.node}>Output Data</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h4 className={styles.title}>Algorithm Data Flow</h4>
      {content}
    </div>
  );
}
