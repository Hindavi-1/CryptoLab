import CipherCard from "../../components/CipherCard";
import styles from "./tools.module.css";

const ciphers = [
  {
    name: "Caesar Cipher",
    slug: "caesar",
    description:
      "Shift each letter by a fixed number of positions. The oldest known substitution cipher, used by Julius Caesar.",
    category: "Classical",
    tag: "Symmetric",
  },
  {
    name: "Vigenère Cipher",
    slug: "vigenere",
    description:
      "Polyalphabetic substitution using a repeating keyword. Much stronger than Caesar — resisted cryptanalysis for 300 years.",
    category: "Classical",
    tag: "Symmetric",
  },
  {
    name: "Playfair Cipher",
    slug: "playfair",
    description:
      "Encrypts pairs of letters using a 5×5 key square. First practical digraph substitution cipher from 1854.",
    category: "Classical",
    tag: "Symmetric",
  },
  {
    name: "Rail Fence Cipher",
    slug: "rail-fence",
    description:
      "A transposition cipher that writes plaintext in a zigzag pattern across multiple rails then reads row by row.",
    category: "Classical",
    tag: "Transposition",
  },
  {
    name: "DES",
    slug: "des",
    description:
      "Data Encryption Standard — a 56-bit Feistel block cipher once the federal standard. Now retired due to small key size.",
    category: "Modern",
    tag: "Block Cipher",
  },
  {
    name: "AES",
    slug: "aes",
    description:
      "Advanced Encryption Standard with 128/192/256-bit keys. The global standard for symmetric encryption since 2001.",
    category: "Modern",
    tag: "Block Cipher",
  },
  {
    name: "RSA",
    slug: "rsa",
    description:
      "Rivest–Shamir–Adleman — public-key cryptosystem based on the difficulty of factoring large prime numbers.",
    category: "Modern",
    tag: "Asymmetric",
  },
  {
    name: "Diffie-Hellman",
    slug: "diffie-hellman",
    description:
      "Key exchange protocol allowing two parties to establish a shared secret over an insecure channel without prior contact.",
    category: "Modern",
    tag: "Key Exchange",
  },
];

export default function ToolsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Cipher Tools</span>
          <h1 className={styles.title}>Encryption Toolkit</h1>
          <p className={styles.subtitle}>
            Hands-on tools for every major cipher. Encrypt, decrypt, and explore how each algorithm transforms your text.
          </p>
        </div>

        <div className={styles.filters}>
          {["All", "Classical", "Modern"].map((f) => (
            <button key={f} className={`${styles.filter} ${f === "All" ? styles.filterActive : ""}`}>
              {f}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {ciphers.map((c) => (
            <CipherCard key={c.slug} {...c} />
          ))}
        </div>
      </div>
    </div>
  );
}
