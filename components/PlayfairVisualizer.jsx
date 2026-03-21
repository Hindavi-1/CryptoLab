import styles from "./PlayfairVisualizer.module.css";

export default function PlayfairVisualizer({ stepsData, mode }) {
  if (!stepsData || !stepsData.square || stepsData.square.length === 0) return null;

  const { square, pairs, steps } = stepsData;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Playfair Transformation</h3>
        <p className={styles.subtitle}>
          {mode === "encrypt" ? "Encrypting" : "Decrypting"} {pairs.length} pairs
        </p>
      </div>

      <div className={styles.layout}>
        {/* Key Matrix */}
        <div className={styles.matrixSection}>
          <h4 className={styles.sectionTitle}>5×5 Key Matrix</h4>
          <div className={styles.grid}>
            {square.map((char, i) => (
              <div key={i} className={styles.cell}>{char}</div>
            ))}
          </div>
          <p className={styles.matrixNote}>Note: 'J' is merged with 'I'</p>
        </div>

        {/* Pairs list */}
        <div className={styles.pairsSection}>
          <h4 className={styles.sectionTitle}>Formed Pairs & Rules</h4>
          <div className={styles.stepsList}>
            {steps.map((step) => (
              <div key={step.index} className={styles.stepCard}>
                <div className={styles.stepRow}>
                  <div className={styles.pair}>
                    <span className={styles.char}>{step.input[0]}</span>
                    <span className={styles.char}>{step.input[1]}</span>
                  </div>
                  <div className={styles.arrow}>→</div>
                  <div className={`${styles.pair} ${styles.pairCipher}`}>
                    <span className={styles.char}>{step.output[0]}</span>
                    <span className={styles.char}>{step.output[1]}</span>
                  </div>
                </div>
                <div className={styles.ruleBox}>
                  <span className={`${styles.ruleBadge} ${styles[`rule${step.rule}`]}`}>
                    {step.rule} Rule
                  </span>
                  <span className={styles.formulaText}>{step.formula}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
