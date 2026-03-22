import Link from "next/link";
import Flowchart from "../../../components/Flowchart";
import VigenereTable from "../../../components/VigenereTable";
import ColumnarTheoryInteractive from "../../../components/ColumnarTheoryInteractive";
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
    origin: "Giovan Battista Bellaso (attributed to Blaise de Vigenère)",
    keySpace: "26ⁿ keys (n = keyword length)",
    securityRating: 2,
    description: "The Vigenère cipher is a method of encrypting alphabetic text using a series of interwoven Caesar ciphers based on the letters of a keyword. Regarded as 'le chiffre indéchiffrable' (the indecipherable cipher) for over 300 years, it uses a repeating keyword to apply a different Caesar shift to each plaintext letter, making single-letter frequency analysis ineffective against it.",
    howItWorks: [
      "Choose a keyword (e.g., KEY). Repeat it over the plaintext letter-by-letter.",
      "Convert each keyword letter to its shift value: A=0, B=1, C=2, ..., Z=25.",
      "For each plaintext letter, apply the Caesar shift determined by the aligned keyword letter.",
      "Use modular arithmetic (mod 26) so shifts wrap around the alphabet.",
      "Non-alphabetic characters (spaces, punctuation) are passed through unchanged.",
      "To decrypt, reverse the shift for each letter using the same keyword alignment.",
    ],
    encryptionSteps: [
      "Step 1 — Write the keyword: Write the keyword repeatedly beneath the plaintext, aligning one key letter per plaintext letter.",
      "Step 2 — Convert to numbers: Assign A=0 through Z=25 for both the plaintext letter (P) and the aligned keyword letter (K).",
      "Step 3 — Apply the formula: Ciphertext letter C = (P + K) mod 26.",
      "Step 4 — Convert back: Convert the resulting number back to a letter (0→A, 1→B, ..., 25→Z).",
      "Step 5 — Repeat: Continue through all plaintext letters, cycling the keyword as needed.",
      "Step 6 — Table lookup (alternate): Alternatively, look up Row K (key letter) and Column P (plaintext letter) in the Vigenère Table — the intersecting cell is the ciphertext letter.",
    ],
    decryptionSteps: [
      "Step 1 — Align the keyword: Write the keyword repeatedly beneath the ciphertext, aligning one key letter per ciphertext letter.",
      "Step 2 — Convert to numbers: Assign A=0 through Z=25 for both the ciphertext letter (C) and the aligned keyword letter (K).",
      "Step 3 — Apply the inverse formula: Plaintext letter P = (C − K + 26) mod 26.",
      "Step 4 — Convert back: Convert the resulting number back to a letter.",
      "Step 5 — Table lookup (alternate): In the Vigenère Table, find Row K (key letter). Scan that row for the ciphertext letter C. The column header at that position is the plaintext letter P.",
      "Step 6 — Repeat: Continue through all ciphertext letters, cycling the keyword as needed.",
    ],
    example: {
      plain: "ATTACK",
      key: "KEY",
      cipher: "KXRKGI",
      breakdown: [
        { p: "A(0)",  c: "K(10)", note: "+K(10)" },
        { p: "T(19)", c: "X(23)", note: "+E(4)" },
        { p: "T(19)", c: "R(17)", note: "+Y(24) mod 26" },
        { p: "A(0)",  c: "K(10)", note: "+K(10)" },
        { p: "C(2)",  c: "G(6)",  note: "+E(4)" },
        { p: "K(10)", c: "I(8)",  note: "+Y(24) mod 26" },
      ],
    },
    formula: "Encrypt: C = (P + K) mod 26   |   Decrypt: P = (C − K + 26) mod 26",
    strengths: [
      "Resists simple letter-frequency analysis",
      "Same plaintext letter encrypts differently with different key letters",
      "Much larger key space than Caesar (26ⁿ vs 25)",
      "Simple to implement manually using a Vigenère table",
    ],
    weaknesses: [
      "Vulnerable to Kasiski examination (finding repeated key patterns)",
      "Index of Coincidence analysis can reveal the key length",
      "Short or repeated keywords dramatically weaken security",
      "Completely broken by modern cryptanalysis — not suitable for real security",
    ],
    funFacts: [
      "Misattributed to Blaise de Vigenère for centuries — actually invented by Giovan Battista Bellaso in 1553.",
      "Called 'le chiffre indéchiffrable' (the unbreakable cipher) until Charles Babbage cracked it in the 1800s.",
      "The one-time pad — the theoretically unbreakable cipher — is a direct extension of Vigenère where the key is as long as the message and never repeated.",
      "Used by Confederate forces during the US Civil War.",
    ],
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
  columnar: {
    name: "Columnar Transposition",
    category: "Classical · Transposition",
    year: "19th c.",
    origin: "Military field ciphers",
    keySpace: "n! orderings per length-n keyword (with duplicate handling)",
    securityRating: 2,
    description:
      "A keyed transposition cipher: plaintext is written in rows under a keyword, then ciphertext is produced by reading each column from top to bottom in alphabetical order of the key letters (when two letters match, the left column is read before the right). The same key reverses the process. Incomplete rectangles are padded with a chosen letter so every column has the same height.",
    howItWorks: [
      "Normalize the keyword to letters A–Z and/or digits 0–9; its length is the number of columns.",
      "Assign each column a rank: digits sort in numeric order (0–9), then letters A–Z; ties (same digit or letter) are broken by position (left before right).",
      "Write only letters A–Z from the plaintext into the grid row by row, left to right.",
      "If the last row is short, fill remaining cells with a padding letter (commonly X).",
      "Encryption: read columns in rank order 1, 2, … — for each column, read top to bottom and append to the ciphertext.",
      "Decryption: split the ciphertext into column-length chunks according to rank order, write each chunk down its column, then read the grid row by row and strip trailing padding.",
    ],
    encryptionSteps: [
      "Prepare plaintext: keep A–Z, uppercase; drop spaces and punctuation for the matrix (same as many textbook definitions).",
      "Choose a padding character (default X) for empty cells in the last row.",
      "Lay out the keyword as column headers and compute each column’s read rank.",
      "Fill the rectangle row-wise with plaintext, then padding if needed.",
      "Concatenate column contents in ascending rank order to form ciphertext.",
    ],
    decryptionSteps: [
      "Confirm ciphertext length is a multiple of the keyword length (after letter normalization).",
      "Compute the same column ranks as encryption.",
      "Partition ciphertext into segments: segment i is the letters for the column that has rank i+1.",
      "Place each segment down its column from top to bottom.",
      "Read the grid left-to-right, top-to-bottom, then remove trailing padding characters.",
    ],
    example: {
      plain: "HELLO",
      key: "BAC (pad X)",
      cipher: "EOHLXL",
      breakdown: [
        { p: "Col A (rank 1)", c: "EO", note: "letters under 2nd key letter" },
        { p: "Col B (rank 2)", c: "HL", note: "under 1st key letter" },
        { p: "Col C (rank 3)", c: "LX", note: "under 3rd key letter" },
      ],
    },
    formula: "Read order = sort columns by (digit 0–9, then letter A–Z, then index); C = concat columns in that order",
    strengths: [
      "Preserves letter frequencies but breaks adjacency structure",
      "Larger keys increase permutations; double columnar was used operationally",
    ],
    weaknesses: [
      "Vulnerable to anagramming and known-plaintext when used alone",
      "Single application is solvable with patience; not suitable for modern secrecy",
    ],
    funFacts: [
      "Often taught with the Allied attack on the ADFGVX system in WWI, which layered substitution with columnar transposition.",
      "Reading columns in ‘alphabetic key order’ is the most common classroom definition; always fix tie-breaking for duplicate letters.",
    ],
    toolCipher: "columnar",
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
    keySpace: "2^56 keys (effectively 56 bits from 64-bit key)",
    securityRating: 2,
    description: "Data Encryption Standard (DES) is a symmetric-key block cipher based on a Feistel network. Although historically critical in global tech, its 56-bit key length is now considered insecure against brute-force attacks. The cipher processes data in 64-bit blocks.",
    howItWorks: [
      "Padding: Data is padded to be a multiple of the 64-bit block size.",
      "Initial Permutation (IP): The 64-bit block undergoes a predetermined permutation.",
      "Feistel Rounds: The block is split into Left and Right 32-bit halves. For 16 rounds, a round function f(Right, Subkey) is XORed with Left, and the halves are swapped.",
      "Round Function: Includes expansion of Right (32->48 bits), XORing with the round subkey, passing through 8 non-linear S-Boxes (48->32 bits), and a P-Box permutation.",
      "Final Permutation (IP⁻¹): The two halves are swapped one last time and the inverse of the Initial Permutation is applied.",
      "Block Modes: Can operate in several modes (ECB, CBC, CFB, OFB) which describe how successive blocks are chained together, often requiring an Initialization Vector (IV)."
    ],
    encryptionSteps: [
      "Step 1 — Parse Key: A 64-bit external key is provided. 8 bits are discarded (parity), leaving a 56-bit key map.",
      "Step 2 — Generate Subkeys: 16 unique 48-bit subkeys are generated using Key Parity Drop, Left Shifts, and Key Compression PC-2.",
      "Step 3 — Padding & IP: The plaintext block gets an Initial Permutation.",
      "Step 4 — 16 Rounds: For Round 1 to 16, L₁ = R₀ and R₁ = L₀ ⊕ f(R₀, K₁).",
      "Step 5 — S-Box Function: Inside f(), 6-bit chunks are mathematically transformed into 4-bit chunks by looking up non-linear tables called S-Boxes. This provides the 'confusion'.",
      "Step 6 — Final Permutation: The halves swap and IP⁻¹ creates the ciphertext block.",
    ],
    decryptionSteps: [
      "Step 1 — Key Schedule Reversal: Decryption uses the exact same algorithm, but the 16 subkeys (K₁ to K₁₆) are applied in reverse order (K₁₆ to K₁).",
      "Step 2 — Mode Initialization: If using chained modes like CBC, the ciphertext block is XORed with the trailing block/IV naturally.",
      "Step 3 — IP -> 16 Rounds -> IP⁻¹: Run the standard core engine exactly as encryption.",
      "Step 4 — Unpad: Standard PKCS#7 or zero padding is removed from the resulting byte array to form the original text.",
    ],
    example: null,
    formula: "Lₙ = Rₙ₋₁ | Rₙ = Lₙ₋₁ ⊕ f(Rₙ₋₁, Kₙ)",
    strengths: ["Pioneered the wide analysis of S-Boxes", "Excellent hardware efficiency", "Cryptographically sound structure (led to 3DES)"],
    weaknesses: ["Key space of 2⁵⁶ is vulnerable to brute force", "Subject to theoretical differential and linear cryptanalysis attacks", "Retired for AES"],
    funFacts: ["The NSA subtly altered the original IBM S-Boxes to resist 'differential cryptanalysis'—a technique the public didn't even know existed yet!", "The Electronic Frontier Foundation built 'Deep Crack', a custom $250,000 machine that brute-forced DES in 56 hours in 1998."],
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

          

            {/* Interactive Vigenère Table (only for vigenere cipher) */}

            {params.name === "vigenere" && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Vigenère Table (Tabula Recta)</h2>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '4px' }}>
                  The Vigenère table (also called <em>Tabula Recta</em>) is a 26×26 grid of all Caesar alphabets.
                  To encrypt: find the <strong style={{color:'var(--purple,#7c3aed)'}}>row of the key letter</strong> and the{" "}
                  <strong style={{color:'var(--accent)'}}>column of the plaintext letter</strong> — the intersection gives
                  the <strong style={{color:'var(--green)'}}>ciphertext letter</strong>.
                  To decrypt: find the key-letter row, scan for the ciphertext letter, then read the column header.
                </p>
                <VigenereTable />
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
            {/* Interactive Columnar Theory */}
            {/* {params.name === "columnar" && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Interactive column builder</h2>
                <ColumnarTheoryInteractive />
              </section>
            )} */}
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

            {data.funFacts && (
              <div className={styles.asideCard}>
                <h3 className={styles.asideTitle}>💡 Fun Facts</h3>
                <ul className={styles.prosList}>
                  {data.funFacts.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

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
