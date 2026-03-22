import styles from "./Flowchart.module.css";

export default function Flowchart({ cipher }) {
  const cipherLower = cipher.toLowerCase();
  
  const isSubstitution = ['caesar', 'vigenere', 'affine', 'substitution'].includes(cipherLower);
  const isTransposition = ['railfence', 'columnar'].includes(cipherLower);
  const isPolygraphic = ['playfair', 'hill'].includes(cipherLower);
  const isBlock = ['des', 'aes'].includes(cipherLower);
  const isAsymmetric = ['rsa'].includes(cipherLower);
  const isHash = ['md5', 'sha256'].includes(cipherLower);

  let content = null;

  if (isSubstitution || isTransposition || isPolygraphic) {
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
      let detail = "SubBytes, ShiftRows, MixColumns, AddRoundKey";
      content = (
        <div className={styles.flowCol}>
          <div className={styles.flowRow}>
            <div className={styles.node}>Plaintext Block</div>
            <div className={`${styles.node} ${styles.nodeKey}`}>Symmetric Key</div>
          </div>
          <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
          <div className={styles.process}>
            <div className={styles.processContent}>
              <strong className={styles.processTitle}>{cipher.toUpperCase()} Rounds</strong>
              <div className={styles.processDetail}>{detail}</div>
            </div>
          </div>
          <div className={`${styles.arrow} ${styles.arrowDown}`}>↓</div>
          <div className={styles.node}>Ciphertext Block</div>
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
