import Link from "next/link";
import styles from "./Footer.module.css";

const links = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Simulation Lab", href: "/simulation" },
  { label: "Challenges", href: "/challenges" },
  { label: "Compare", href: "/compare" },
];

const ciphers = [
  { label: "Caesar Cipher", href: "/cipher/caesar" },
  { label: "Vigenère Cipher", href: "/cipher/vigenere" },
  { label: "Playfair Cipher", href: "/cipher/playfair" },
  { label: "Rail Fence", href: "/cipher/rail-fence" },
  { label: "AES", href: "/cipher/aes" },
  { label: "RSA", href: "/cipher/rsa" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>⬡</span>
              <span className={styles.logoText}>CryptoLab</span>
            </div>
            <p className={styles.tagline}>
              An open, interactive platform for learning cryptography —
              from Caesar ciphers to AES and RSA.
            </p>
            <div className={styles.badges}>
              <span className={styles.badge}>Open Source</span>
              <span className={styles.badge}>Educational</span>
              <span className={styles.badge}>Next.js 14</span>
            </div>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Navigation</h4>
            <ul className={styles.colList}>
              {links.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={styles.colLink}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Ciphers</h4>
            <ul className={styles.colList}>
              {ciphers.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={styles.colLink}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Resources</h4>
            <ul className={styles.colList}>
              {["Documentation", "API Reference", "GitHub", "Changelog"].map((r) => (
                <li key={r}>
                  <span className={styles.colLinkMuted}>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copy}>
            © {new Date().getFullYear()} CryptoLab. Built for education.
          </span>
          <span className={styles.mono}>v1.0.0 · MIT License</span>
        </div>
      </div>
    </footer>
  );
}
