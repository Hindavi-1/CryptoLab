import Link from "next/link";
import Flowchart from "../../../components/Flowchart";
import styles from "./cipher.module.css";

const CIPHER_DATA = {
  caesar: {
    name: "Caesar Cipher",
    category: "Classical · Symmetric · Substitution",
    year: "~58 BC",
    origin: "Rome, Julius Caesar",
    keySpace: "25 possible keys",
    securityRating: 1,
    description: "The Caesar cipher is one of the oldest and simplest known encryption techniques. Named after Julius Caesar, it works by replacing each letter with one a fixed number of positions down the alphabet.",
    howItWorks: [
      "Choose a shift value n between 0 and 25",
      "For each letter in the plaintext, move it n positions forward in the alphabet",
      "Wrap around: letters past Z cycle back to A (modular arithmetic)",
      "Non-alphabetic characters pass through unchanged",
      "To decrypt, shift by 26 − n (the inverse shift)",
    ],
    example: {
      plain: "HELLO",
      key: "Shift 3",
      cipher: "KHOOR",
      breakdown: [
        { p: "H", c: "K", note: "H+3" },
        { p: "E", c: "H", note: "E+3" },
        { p: "L", c: "O", note: "L+3" },
        { p: "L", c: "O", note: "L+3" },
        { p: "O", c: "R", note: "O+3" },
      ],
    },
    formula: "C = (P + n) mod 26   |   P = (C − n + 26) mod 26",
    strengths: ["Simple to implement", "Fast encryption/decryption", "Great for learning"],
    weaknesses: ["Only 25 keys", "Weak against frequency analysis", "No modern security"],
    funFacts: ["Shift 13 is ROT13", "Used for military dispatches"],
    toolCipher: "caesar",
  },
  vigenere: {
    name: "Vigenère Cipher",
    category: "Classical · Symmetric · Polyalphabetic",
    year: "1553",
    origin: "Giovan Battista Bellaso",
    keySpace: "26^n keys",
    securityRating: 2,
    description: "The Vigenère cipher uses a keyword to determine multiple shift values, making it far stronger than the Caesar cipher.",
    howItWorks: [
      "Choose a keyword",
      "Repeat keyword over plaintext",
      "Each key letter determines a shift (A=0, B=1...)",
      "Add plaintext letter and key letter values (mod 26)",
    ],
    example: {
      plain: "HELLO",
      key: "KEY",
      cipher: "RIJVS",
      breakdown: [
        { p: "H(7)", c: "R(17)", note: "+K(10)" },
        { p: "E(4)", c: "I(8)", note: "+E(4)" },
      ],
    },
    formula: "C_i = (P_i + K_{i mod m}) mod 26",
    strengths: ["Resists simple frequency analysis", "Same letter encrypts differently"],
    weaknesses: ["Vulnerable to Kasiski examination", "Still insecure today"],
    funFacts: ["Known as 'le chiffre indéchiffrable'"],
    toolCipher: "vigenere",
  },
  playfair: {
    name: "Playfair Cipher",
    category: "Classical · Symmetric · Digraph",
    year: "1854",
    origin: "Charles Wheatstone",
    keySpace: "25! arrangements",
    securityRating: 2,
    description: "The Playfair cipher encrypts pairs of letters (digraphs) using a 5x5 matrix. It was the first practical digraph substitution cipher, making it far more resistant to traditional single-letter frequency analysis.",
    howItWorks: [
      "Matrix Generation: Create a 5x5 grid starting with the keyword (no duplicates). Fill remaining spaces with the alphabet ('I'/'J' are merged).",
      "Plaintext Parsing: Split text into pairs. If a pair contains matching letters, insert a bogus character (like 'X'). If length is odd, pad the end with 'X'.",
      "ENCRYPTION - Rule 1 (Row): If both letters are in the same row, shift them 1 space Right (wrap around).",
      "ENCRYPTION - Rule 2 (Column): If both letters are in the same column, shift them 1 space Down (wrap around).",
      "ENCRYPTION - Rule 3 (Rectangle): Otherwise, swap each letter with the one in its own row but the other's column.",
      "DECRYPTION: Reverse the Row and Col shifts (shift Left and Up, respectively). The Rectangle rule remains exactly the same."
    ],
    example: {
      plain: "HIDE",
      key: "SECRET",
      cipher: "KNDC",
      breakdown: [
        { p: "HI", c: "KN", note: "Rectangle Rule" },
        { p: "DE", c: "DC", note: "Row Shift Right" },
      ]
    },
    formula: "Row → Right/Left | Col → Down/Up | Rect → Opp. Corners",
    strengths: ["Destroys single-letter frequencies", "No direct letter mapping"],
    weaknesses: ["Vulnerable to digraph frequency analysis"],
    funFacts: ["Used by JFK in WWII", "Named after Lord Playfair who promoted it"],
    toolCipher: "playfair",
  },
  railfence: {
    name: "Rail Fence Cipher",
    category: "Classical · Transposition",
    year: "Ancient",
    origin: "Unknown",
    keySpace: "n-1 rails",
    securityRating: 1,
    description: "A transposition cipher that writes text in a zigzag pattern and reads it off row by row.",
    howItWorks: [
      "Write text in a zigzag across N rails",
      "Read each rail left to right",
    ],
    example: null,
    formula: "Zigzag pattern",
    strengths: ["Simple to do by hand"],
    weaknesses: ["Preserves letter frequencies", "Very small key space"],
    funFacts: ["Common in early telegraphy"],
    toolCipher: "railfence",
  },
  affine: {
    name: "Affine Cipher",
    category: "Classical · Symmetric · Substitution",
    year: "Ancient",
    origin: "Unknown",
    keySpace: "12 * 26 = 312 keys",
    securityRating: 1,
    description: "A monoalphabetic substitution cipher where each letter is mapped to its numeric equivalent, encrypted using a linear function.",
    howItWorks: [
      "Convert letter to number (0-25)",
      "Apply (a*x + b) mod 26",
      "Convert back to letter",
    ],
    example: null,
    formula: "E(x) = (ax + b) mod 26",
    strengths: ["Mathematical foundation"],
    weaknesses: ["Vulnerable to frequency analysis", "Small key space"],
    funFacts: ["A generalization of the Caesar cipher"],
    toolCipher: "affine",
  },
  hill: {
    name: "Hill Cipher",
    category: "Classical · Symmetric · Polygraphic",
    year: "1929",
    origin: "Lester S. Hill",
    keySpace: "Large (matrix-based)",
    securityRating: 3,
    description: "A polygraphic substitution cipher based on linear algebra. It uses matrix multiplication to encrypt blocks of text mathematically, completely masking single-letter frequencies via strong diffusion.",
    howItWorks: [
      "Convert letters to a numeric vector",
      "Multiply by the n×n Key Matrix",
      "Take Modulo 26 to get the Ciphertext",
    ],
    encryptionSteps: [
      "1. Alphabet Mapping: Parse the alphabet into standard indexing (A=0, B=1 ... Z=25).",
      "2. Block Padding: Split the plaintext into column vectors of size n (identical dimension to the Key Matrix). Pad with 'X' if the final block vector is geometrically unstable.",
      "3. Matrix Math: Compute the dot product between the n×n Key Matrix and each n×1 Plaintext Vector.",
      "4. Modulo Resolution: Apply Modulo 26 math to the resulting vector coefficients, translating the values back seamlessly into Ciphertext characters."
    ],
    decryptionSteps: [
      "1. Determinant Arithmetic: Calculate the strict algebraic determinant of the original Key Matrix |K|.",
      "2. Modular Inverse Matrix: Determine the Multiplicative Inverse of the determinant modulo 26. (Note: the original determinant strictly MUST be coprime to 26 for inversion to exist!)",
      "3. Adjugate Extraction: Calculate the Adjugate Matrix (the structural transpose of the cofactor matrix).",
      "4. Synthesize Inverse Key (K⁻¹): Multiply the Adjugate Matrix by the Modular Inverse scalar value and resolve via Modulo 26 to formalize the geometric Inverse Key Matrix.",
      "5. Decrypt Blocks: Dot multiply the finalized Inverse Key Matrix by the parsed Ciphertext vectors to completely retrieve the original Plaintext!"
    ],
    example: {
      plain: "ACT",
      key: "6,24,1, 13,16,10, 20,17,15",
      cipher: "POH",
      breakdown: [
        { p: "A(0)", c: "P(15)", note: "Vector Math" },
        { p: "C(2)", c: "O(14)", note: "Modulo 26" },
        { p: "T(19)", c: "H(7)", note: "Matrix Det: 25" },
      ]
    },
    formula: "Encrypt: C = K×P mod 26 | Decrypt: P = K⁻¹×C mod 26",
    strengths: ["Strong diffusion across all letters in block", "Resists most frequency analysis"],
    weaknesses: ["Easily broken by Known-Plaintext Attacks using Gauss-Jordan elimination"],
    funFacts: ["First practical application of deeply mathematical continuous polygraphic encoding.", "Operates strictly in Z₂₆ linear arithmetic space."],
    toolCipher: "hill",
  },
  substitution: {
    name: "Simple Substitution",
    category: "Classical · Symmetric · Substitution",
    year: "Ancient",
    origin: "Unknown",
    keySpace: "26! keys",
    securityRating: 1,
    description: "Each letter of the alphabet is replaced with another letter according to a fixed mapping.",
    howItWorks: [
      "Create a random alphabet mapping",
      "Replace each letter in the plaintext",
    ],
    example: null,
    formula: "Mapping: A -> Q, B -> W, etc.",
    strengths: ["Huge key space (26!)"],
    weaknesses: ["Easily broken by frequency analysis"],
    funFacts: ["Used in newspaper cryptograms"],
    toolCipher: "substitution",
  },
  des: {
    name: "DES",
    category: "Modern · Symmetric · Block",
    year: "1977",
    origin: "IBM / NIST",
    keySpace: "2^56 keys",
    securityRating: 2,
    description: "Data Encryption Standard, a 56-bit Feistel block cipher. Historically significant but now retired.",
    howItWorks: [
      "Split block into halves",
      "16 Feistel rounds",
      "Permutations and S-box substitutions",
    ],
    example: null,
    formula: "Feistel network",
    strengths: ["Standardized global use", "Well-studied"],
    weaknesses: ["Key size is too small for modern hardware"],
    funFacts: ["Broken by 'Deep Crack' in 22 hours"],
    toolCipher: "des",
  },
  aes: {
    name: "AES",
    category: "Modern · Symmetric · Block",
    year: "2001",
    origin: "Daemen & Rijmen",
    keySpace: "2^128, 2^192, 2^256",
    securityRating: 5,
    description: "Advanced Encryption Standard, the global gold standard for symmetric encryption.",
    howItWorks: [
      "Substitution (SubBytes)",
      "Permutation (ShiftRows, MixColumns)",
      "AddRoundKey",
    ],
    example: null,
    formula: "SPN (Substitution-Permutation Network)",
    strengths: ["Extremely secure", "Efficient in hardware"],
    weaknesses: ["Implementation side-channels"],
    funFacts: ["Standardized by NIST to replace DES"],
    toolCipher: "aes",
  },
  rsa: {
    name: "RSA",
    category: "Modern · Asymmetric",
    year: "1977",
    origin: "Rivest, Shamir, Adleman",
    keySpace: "Factoring-based",
    securityRating: 5,
    description: "The first widely used public-key system, based on the difficulty of factoring large primes.",
    howItWorks: [
      "Generate two large primes",
      "Compute n and phi",
      "Choose e and calculate d",
    ],
    example: null,
    formula: "C = M^e mod n",
    strengths: ["No pre-shared secret needed", "Enables digital signatures"],
    weaknesses: ["Slower than symmetric", "Quantum vulnerable"],
    funFacts: ["Briefly classified as a munition"],
    toolCipher: "rsa",
  },
  md5: {
    name: "MD5",
    category: "Hash · Keyless",
    year: "1991",
    origin: "Ronald Rivest",
    keySpace: "N/A (128-bit hash)",
    securityRating: 1,
    description: "A widely used hash function that produces a 128-bit digest. Now broken for security uses.",
    howItWorks: [
      "Padding and appending length",
      "Process in 512-bit blocks",
      "Iterative mixing and XORing",
    ],
    example: null,
    formula: "H(M)",
    strengths: ["Fast to compute"],
    weaknesses: ["Collision attacks are trivial"],
    funFacts: ["Still used for file checksums"],
    toolCipher: "md5",
  },
  sha256: {
    name: "SHA-256",
    category: "Hash · Keyless",
    year: "2001",
    origin: "NSA",
    keySpace: "N/A (256-bit hash)",
    securityRating: 5,
    description: "A secure hash algorithm producing a 256-bit digest. Widely used in security protocols.",
    howItWorks: [
      "Padding and parsing",
      "Initial hash values",
      "64 rounds of logical operations",
    ],
    example: null,
    formula: "H(M)",
    strengths: ["Collision resistant", "Standard in blockchain"],
    weaknesses: ["Length extension attack (without HMAC)"],
    funFacts: ["Core part of Bitcoin mining"],
    toolCipher: "sha256",
  },
};

const SECURITY_LABELS = ["", "Broken", "Weak", "Historical", "Moderate", "Strong"];
const SECURITY_COLORS = ["", "red", "orange", "yellow", "blue", "green"];

export default function CipherPage({ params }) {
  const data = CIPHER_DATA[params.name];

  if (!data) {
    return (
      <div className={styles.notFound}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>404</span>
          <h1 className={styles.nfTitle}>Cipher not found</h1>
          <p className={styles.nfDesc}>
            No theory page exists yet for <strong>{params.name}</strong>.
          </p>
          <Link href="/tools" className={styles.backBtn}>← Back to Tools</Link>
        </div>
      </div>
    );
  }

  const secColor = SECURITY_COLORS[data.securityRating];
  const secLabel = SECURITY_LABELS[data.securityRating];

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/" className={styles.breadLink}>Home</Link>
          <span className={styles.breadSep}>/</span>
          <Link href="/tools" className={styles.breadLink}>Tools</Link>
          <span className={styles.breadSep}>/</span>
          <span className={styles.breadCurrent}>{data.name}</span>
        </nav>

        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroMeta}>
            <span className={styles.category}>{data.category}</span>
            <span className={`${styles.secBadge} ${styles[`sec_${secColor}`]}`}>
              Security: {secLabel}
              <span className={styles.secDots}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`${styles.secDot} ${i < data.securityRating ? styles.secDotFilled : ""} ${styles[`secDot_${secColor}`]}`}
                  />
                ))}
              </span>
            </span>
          </div>
          <h1 className={styles.title}>{data.name}</h1>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Year</span>
              <span className={styles.statValue}>{data.year}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Origin</span>
              <span className={styles.statValue}>{data.origin}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Key Space</span>
              <span className={styles.statValue}>{data.keySpace}</span>
            </div>
          </div>
          <p className={styles.description}>{data.description}</p>
        </div>

        <div className={styles.layout}>
          <div className={styles.main}>

            {/* How it works */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>How It Works</h2>
              <ol className={styles.stepList}>
                {data.howItWorks.map((step, i) => (
                  <li key={i} className={styles.stepItem}>
                    <span className={styles.stepNum}>{i + 1}</span>
                    <span className={styles.stepText}>{step}</span>
                  </li>
                ))}
              </ol>
              <Flowchart cipher={data.toolCipher} />
            </section>

            {/* Detailed Encryption Steps */}
            {data.encryptionSteps && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Encryption Process</h2>
                <ol className={styles.stepList}>
                  {data.encryptionSteps.map((step, i) => (
                    <li key={i} className={styles.stepItem}>
                      <span className={styles.stepNum}>{i + 1}</span>
                      <span className={styles.stepText}>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Detailed Decryption Steps */}
            {data.decryptionSteps && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Decryption Process</h2>
                <ol className={styles.stepList}>
                  {data.decryptionSteps.map((step, i) => (
                    <li key={i} className={styles.stepItem}>
                      <span className={styles.stepNum}>{i + 1}</span>
                      <span className={styles.stepText}>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Interactive Tool CTA */}
            <section className={styles.section}>
              <div className={styles.toolCtaCard}>
                <div className={styles.toolCtaContent}>
                  <h2 className={styles.sectionTitle} style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: '8px' }}>Interactive Toolkit</h2>
                  <p className={styles.toolCtaDesc}>
                    Want to encrypt your own messages and see the <strong>{data.name}</strong> algorithm in action? We've built an advanced interactive lab specifically for this setup.
                  </p>
                </div>
                <Link href={`/tools/${data.toolCipher}`} className={styles.toolCtaBtn}>
                  <span className={styles.toolCtaIcon}>⚡</span>
                  Open Interactive Tool
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '8px' }}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </section>

            {/* Formula */}
            {data.formula && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Formula</h2>
                <div className={styles.formulaBox}>
                  <code className={styles.formula}>{data.formula}</code>
                </div>
              </section>
            )}

            {/* Example breakdown */}
            {data.example && data.example.breakdown && data.example.breakdown.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Step-by-Step Example</h2>
                <div className={styles.exampleWrap}>
                  <div className={styles.exampleHeader}>
                    <span className={styles.exampleMeta}>
                      Plaintext: <strong>{data.example.plain}</strong>
                    </span>
                    <span className={styles.exampleMeta}>
                      Key: <strong>{data.example.key}</strong>
                    </span>
                    <span className={`${styles.exampleMeta} ${styles.exampleMetaGreen}`}>
                      Ciphertext: <strong>{data.example.cipher}</strong>
                    </span>
                  </div>
                  <div className={styles.breakdown}>
                    {data.example.breakdown.map((item, i) => (
                      <div key={i} className={styles.breakdownItem}>
                        <span className={styles.bdPlain}>{item.p}</span>
                        <span className={styles.bdArrow}>→</span>
                        <span className={styles.bdCipher}>{item.c}</span>
                        <span className={styles.bdNote}>{item.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className={styles.aside}>
            <div className={styles.asideCard}>
              <h3 className={styles.asideTitle}>✓ Strengths</h3>
              <ul className={styles.prosList}>
                {data.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className={`${styles.asideCard} ${styles.asideCardWarn}`}>
              <h3 className={`${styles.asideTitle} ${styles.asideTitleWarn}`}>⚠ Weaknesses</h3>
              <ul className={styles.consList}>
                {data.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>

            <div className={styles.asideCard}>
              <h3 className={styles.asideTitle}>Quick Links</h3>
              <div className={styles.quickLinks}>
                <Link href={`/simulation?cipher=${params.name}`} className={styles.quickLink}>
                  ▶ Simulation Lab
                </Link>
                <Link href="/compare" className={styles.quickLink}>
                  ⇄ Compare Algorithms
                </Link>
                <Link href="/challenges" className={styles.quickLink}>
                  🏆 Challenges
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
