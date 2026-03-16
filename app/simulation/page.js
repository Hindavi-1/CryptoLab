import SimulationPanel from "../../components/SimulationPanel";
import styles from "./simulation.module.css";

export default function SimulationPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Step-by-step</span>
          <h1 className={styles.title}>Simulation Lab</h1>
          <p className={styles.subtitle}>
            Watch encryption and decryption unfold step by step. See exactly how each cipher transforms your input.
          </p>
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>
            <SimulationPanel />
          </div>

          <aside className={styles.aside}>
            <div className={styles.asideCard}>
              <h3 className={styles.asideTitle}>About This Lab</h3>
              <p className={styles.asideText}>
                The simulation shows each internal step of the cipher algorithm, making it easy to understand
                how letters are transformed.
              </p>
            </div>

            <div className={styles.asideCard}>
              <h3 className={styles.asideTitle}>Tips</h3>
              <ul className={styles.tipsList}>
                <li>Try encrypting then decrypting the result to verify</li>
                <li>For Caesar, shift 13 is the famous ROT13</li>
                <li>Vigenère keyword must contain only letters</li>
                <li>Spaces and punctuation are preserved</li>
              </ul>
            </div>

            <div className={styles.asideCard}>
              <h3 className={styles.asideTitle}>Available Ciphers</h3>
              <div className={styles.cipherList}>
                {["Caesar Cipher", "Vigenère Cipher"].map((c) => (
                  <div key={c} className={styles.cipherItem}>
                    <span className={styles.cipherDot} />
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
