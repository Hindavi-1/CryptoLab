import styles from "./HillVisualizer.module.css";

export default function HillVisualizer({ stepsData, mode }) {
  if (!stepsData || stepsData.error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <p className={styles.errorText}>
           {stepsData?.error || "Invalid Matrix configuration."}
        </p>
      </div>
    );
  }

  const { steps, originalKey, operatingKey, determinant, determinantInverse, matrixSize } = stepsData;

  const renderMatrix = (matrix) => (
    <div className={styles.inlineMatrix} style={{ gridTemplateColumns: `repeat(${matrixSize}, 1fr)`}}>
      {matrix.flat().map((val, i) => (
         <div key={i} className={styles.matrixVal}>{val}</div>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Hill Cipher Linear Algebra</h3>
        <p className={styles.subtitle}>
          {mode === "encrypt" ? "Encrypting" : "Decrypting"} character blocks of size <strong style={{color:"var(--text)"}}>{matrixSize}</strong>
        </p>
      </div>

      <div className={styles.layout}>
        {/* Math Context Panel */}
        <div className={styles.sidePanel}>
          <h4 className={styles.sectionTitle}>Key Mathematics</h4>
          
          <div className={styles.mathBlock}>
            <span className={styles.mathLabel}>Original Key Matrix (K):</span>
            {renderMatrix(originalKey)}
          </div>

          <div className={styles.mathBlock}>
            <span className={styles.mathLabel}>Determinant |K|:</span>
            <span className={styles.mathHighlight}>{determinant} mod 26</span>
          </div>

          {mode === "decrypt" && (
            <>
              <div className={styles.mathBlock}>
                <span className={styles.mathLabel}>|K|⁻¹ mod 26:</span>
                <span className={styles.mathHighlight}>{determinantInverse}</span>
              </div>
              <div className={styles.mathBlock}>
                <span className={styles.mathLabel}>Inverse Matrix (K⁻¹):</span>
                {renderMatrix(operatingKey)}
              </div>
            </>
          )}

          <div className={styles.formulaNote}>
            Formula: C = {mode === "encrypt" ? "K" : "K⁻¹"} × P (mod 26)
          </div>
        </div>

        {/* Vector Operations */}
        <div className={styles.stepsPanel}>
          <h4 className={styles.sectionTitle}>Vector Transformations</h4>
          <div className={styles.stepsList}>
            {steps.map((step, idx) => (
              <div key={idx} className={styles.stepCard}>
                
                {/* Character Mapping */}
                <div className={styles.vectorMapping}>
                  <div className={styles.vectorCharGroup}>
                    {step.inputChars.map((ch, i) => <span key={i} className={styles.charBox}>{ch}</span>)}
                  </div>
                  <div className={styles.arrowIcon}>→</div>
                  <div className={styles.vectorCharGroup}>
                    {step.outputChars.map((ch, i) => <span key={i} className={`${styles.charBox} ${styles.charBoxCipher}`}>{ch}</span>)}
                  </div>
                </div>

                <div className={styles.divider}></div>

                {/* Vector Math */}
                <div className={styles.vectorMathArea}>
                    
                    {renderMatrix(operatingKey)}

                    <div className={styles.mathSign}>×</div>

                    <div className={styles.columnVector}>
                      {step.inputVec.map((v, i) => <div key={i} className={styles.vecItem}>{v}</div>)}
                    </div>

                    <div className={styles.mathSign}>=</div>

                    <div className={styles.columnVector}>
                      {step.outputVec.map((v, i) => <div key={i} className={`${styles.vecItem} ${styles.vecItemCipher}`}>{v}</div>)}
                    </div>
                </div>

                {/* Sub formulas */}
                <div className={styles.subFormulas}>
                  {step.formulas.map((f, i) => (
                      <div key={i} className={styles.subLine}>Row {i+1}: ({f}) mod 26 = <span className={styles.resultBadge}>{step.outputVec[i]}</span></div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
