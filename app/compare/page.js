import styles from "./compare.module.css";

const comparisons = [
  { property: "Key Type", caesar: "Single shift (0–25)", vigenere: "Keyword string", des: "56-bit key", aes: "128/192/256-bit", rsa: "Public/private pair" },
  { property: "Key Size", caesar: "~4.7 bits", vigenere: "Variable", des: "56 bits", aes: "128–256 bits", rsa: "2048–4096 bits" },
  { property: "Type", caesar: "Substitution", vigenere: "Polyalphabetic", des: "Block cipher", aes: "Block cipher", rsa: "Asymmetric" },
  { property: "Block Size", caesar: "1 char", vigenere: "1 char", des: "64 bits", aes: "128 bits", rsa: "Key-dependent" },
  { property: "Speed", caesar: "Very fast", vigenere: "Fast", des: "Moderate", aes: "Fast (hardware)", rsa: "Slow" },
  { property: "Security", caesar: "⚠ Broken", vigenere: "⚠ Weak", des: "⚠ Deprecated", aes: "✓ Strong", rsa: "✓ Strong" },
  { property: "Year Invented", caesar: "~58 BC", vigenere: "1553", des: "1977", aes: "2001", rsa: "1977" },
  { property: "Still Used?", caesar: "No", vigenere: "No", des: "No", aes: "Yes", rsa: "Yes" },
];

const headers = ["", "Caesar", "Vigenère", "DES", "AES", "RSA"];
const keys = ["property", "caesar", "vigenere", "des", "aes", "rsa"];

export default function ComparePage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Side by Side</span>
          <h1 className={styles.title}>Algorithm Comparison</h1>
          <p className={styles.subtitle}>
            Compare cryptographic algorithms across key properties — strength, speed, key size, and modern applicability.
          </p>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h} className={`${styles.th} ${h === "" ? styles.thFirst : ""}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row, i) => (
                <tr key={i} className={styles.tr}>
                  {keys.map((k) => (
                    <td
                      key={k}
                      className={`${styles.td} ${k === "property" ? styles.tdProp : ""} ${
                        typeof row[k] === "string" && row[k].includes("✓") ? styles.tdGood : ""
                      } ${
                        typeof row[k] === "string" && row[k].includes("⚠") ? styles.tdWarn : ""
                      }`}
                    >
                      {row[k]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendGood}`} />
            Secure / Recommended
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendWarn}`} />
            Weak / Deprecated
          </div>
        </div>
      </div>
    </div>
  );
}
