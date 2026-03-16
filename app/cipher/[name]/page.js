import Link from "next/link";
import CipherTool from "../../../components/CipherTool";
import styles from "./cipher.module.css";

const CIPHER_DATA = {
  caesar: {
    name: "Caesar Cipher",
    category: "Classical · Symmetric · Substitution",
    year: "~58 BC",
    origin: "Rome, Julius Caesar",
    keySpace: "25 possible keys",
    securityRating: 1,
    description:
      "The Caesar cipher is one of the oldest and simplest known encryption techniques. Named after Julius Caesar, who used it with a shift of 3 to protect his military correspondence, it works by replacing each letter with one a fixed number of positions down the alphabet.",
    howItWorks: [
      "Choose a shift value n between 0 and 25",
      "For each letter in the plaintext, move it n positions forward in the alphabet",
      "Wrap around: letters past Z cycle back to A (modular arithmetic)",
      "Non-alphabetic characters (spaces, punctuation, digits) pass through unchanged",
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
    strengths: [
      "Extremely simple to implement and understand",
      "Very fast encryption and decryption",
      "Good introductory cipher for learning cryptography",
    ],
    weaknesses: [
      "Only 25 non-trivial keys — brute-forceable by hand",
      "Completely broken by frequency analysis",
      "Letter frequencies of plaintext are fully preserved",
      "Provides zero security in any modern context",
    ],
    funFacts: [
      "Shift 13 is called ROT13 and is its own inverse — encrypt twice to get the original",
      "Caesar reportedly used shift 3 for military dispatches",
      "Augustus Caesar used shift 1 according to Suetonius",
    ],
    toolCipher: "caesar",
  },
  vigenere: {
    name: "Vigenère Cipher",
    category: "Classical · Symmetric · Polyalphabetic",
    year: "1553",
    origin: "Published by Giovan Battista Bellaso; attributed to Blaise de Vigenère",
    keySpace: "26^n keys for keyword length n",
    securityRating: 2,
    description:
      "The Vigenère cipher extends the Caesar cipher by using a keyword instead of a single shift. Each letter of the keyword determines the shift for the corresponding plaintext letter. For 300 years it was considered unbreakable — dubbed 'le chiffre indéchiffrable' — until Charles Babbage and Friedrich Kasiski independently broke it in the 19th century.",
    howItWorks: [
      "Choose a keyword (e.g. KEY)",
      "Repeat the keyword over the plaintext: K E Y K E Y K E Y …",
      "Each keyword letter determines a Caesar shift: A=0, B=1, … Z=25",
      "Add the plaintext letter's position and the key letter's value (mod 26)",
      "To decrypt, subtract the key values instead of adding",
    ],
    example: {
      plain: "HELLO",
      key: "KEY",
      cipher: "RIJVS",
      breakdown: [
        { p: "H(7)", c: "R(17)", note: "+K(10)" },
        { p: "E(4)", c: "I(8)", note: "+E(4)" },
        { p: "L(11)", c: "J(9)", note: "+Y(24) mod 26" },
        { p: "L(11)", c: "V(21)", note: "+K(10)" },
        { p: "O(14)", c: "S(18)", note: "+E(4)" },
      ],
    },
    formula: "C_i = (P_i + K_{i mod m}) mod 26   |   P_i = (C_i − K_{i mod m} + 26) mod 26",
    strengths: [
      "Multiple shift values resist simple letter-frequency analysis",
      "Same plaintext letter encrypts to different ciphertext letters",
      "Keyword length and content both affect security",
      "Far stronger than Caesar cipher",
    ],
    weaknesses: [
      "Kasiski examination can determine keyword length",
      "Once key length is known, reduces to multiple independent Caesar ciphers",
      "Index of Coincidence (IC) analysis reveals key length",
      "Still completely insecure by modern standards",
    ],
    funFacts: [
      "The Confederacy used a variant during the US Civil War",
      "The one-time pad is a Vigenère cipher with a truly random key as long as the message",
      "A random, non-repeating key makes it theoretically unbreakable",
    ],
    toolCipher: "vigenere",
  },
  playfair: {
    name: "Playfair Cipher",
    category: "Classical · Symmetric · Digraph Substitution",
    year: "1854",
    origin: "Charles Wheatstone; popularised by Lord Playfair",
    keySpace: "25! / arrangements of key square",
    securityRating: 2,
    description:
      "The Playfair cipher was the first practical digraph substitution cipher — encrypting pairs of letters rather than individual ones. This makes simple frequency analysis much harder, since 625 letter pairs exist instead of 26 single letters. It was used by the British military in World War I and II.",
    howItWorks: [
      "Build a 5×5 key square from a keyword (J is merged with I)",
      "Split the plaintext into pairs (digraphs); insert X between repeated letters in a pair",
      "For each pair, apply one of three rules based on their positions in the grid",
      "Same row: replace each letter with the one to its right (wrapping)",
      "Same column: replace each letter with the one below it (wrapping)",
      "Rectangle: swap each letter to the corner of the rectangle they form",
    ],
    example: {
      plain: "HELLO",
      key: "KEYWORD",
      cipher: "See tool below",
      breakdown: [],
    },
    formula: "Digraph rules: row shift / column shift / rectangle swap",
    strengths: [
      "Encrypts pairs — 625 digraph frequencies vs 26 letter frequencies",
      "Significantly harder to break than monoalphabetic ciphers",
      "No direct letter-to-letter mapping visible",
    ],
    weaknesses: [
      "Still vulnerable to digraph frequency analysis",
      "The 5×5 grid structure is detectable",
      "Padding with X can be spotted; letter J is always rendered as I",
      "Broken by modern techniques easily",
    ],
    funFacts: [
      "John F. Kennedy used Playfair to send a rescue message after PT-109 was sunk",
      "The encoded message was carved into a coconut shell",
      "It was the primary cipher of the British Army in WWI",
    ],
    toolCipher: "caesar",
  },
  "rail-fence": {
    name: "Rail Fence Cipher",
    category: "Classical · Transposition · Zigzag",
    year: "Ancient (modern form ~1800s)",
    origin: "Unknown; widely used in early telegraphy",
    keySpace: "n−1 meaningful rail counts for message length n",
    securityRating: 1,
    description:
      "The Rail Fence cipher is a form of transposition cipher — it doesn't substitute letters but rearranges them. The plaintext is written in a zigzag pattern across a number of 'rails', then read off row by row to produce the ciphertext. The letter frequencies are unchanged, making it weak against analysis.",
    howItWorks: [
      "Choose a number of rails (e.g. 3)",
      "Write the plaintext diagonally downward across the rails, bouncing up when the bottom rail is reached",
      "Continue the zigzag pattern until the full message is written",
      "Read each rail from left to right, concatenating them to form the ciphertext",
      "To decrypt, reconstruct the zigzag pattern to find which positions each rail covers",
    ],
    example: {
      plain: "WEAREDISCOVERED",
      key: "3 rails",
      cipher: "WECRLTEERDSOAIVD",
      breakdown: [],
    },
    formula: "Zigzag period = 2(r − 1) for r rails",
    strengths: [
      "Simple to explain and implement manually",
      "No key material to remember beyond rail count",
      "Letter frequencies preserved — useful for puzzles",
    ],
    weaknesses: [
      "Letter frequencies are completely unchanged — frequency analysis trivially applies",
      "Very small key space (typically 2–20 rails for reasonable messages)",
      "Structure of the zigzag is detectable",
      "Provides essentially no cryptographic security",
    ],
    funFacts: [
      "Commonly used in cryptography education as a first transposition cipher",
      "Often appears in CTF (Capture The Flag) competitions",
      "The zigzag pattern can be visualized row-by-row easily on graph paper",
    ],
    toolCipher: "caesar",
  },
  aes: {
    name: "AES — Advanced Encryption Standard",
    category: "Modern · Symmetric · Block Cipher",
    year: "2001",
    origin: "NIST standardization; designed by Joan Daemen & Vincent Rijmen as Rijndael",
    keySpace: "2^128, 2^192, or 2^256 keys",
    securityRating: 5,
    description:
      "AES is the most widely used symmetric encryption algorithm in the world. Adopted by the US government in 2001, it replaced DES and has become the global standard for protecting sensitive data. AES operates on 128-bit blocks and supports key sizes of 128, 192, or 256 bits. Despite decades of analysis, no practical attack has been found.",
    howItWorks: [
      "Arrange the 128-bit block as a 4×4 matrix of bytes (the state)",
      "Run 10, 12, or 14 rounds depending on key size (128/192/256 bits)",
      "Each round: SubBytes (S-box substitution), ShiftRows, MixColumns, AddRoundKey",
      "SubBytes applies a non-linear substitution to each byte via a lookup table",
      "ShiftRows cyclically shifts the rows of the state matrix",
      "MixColumns multiplies columns by a fixed polynomial in GF(2^8)",
      "AddRoundKey XORs the state with the round key derived from key schedule",
    ],
    example: null,
    formula: "State = AddRoundKey(MixColumns(ShiftRows(SubBytes(State)))) × rounds",
    strengths: [
      "128-bit key = 2^128 possible keys — computationally infeasible to brute force",
      "Efficient in both hardware and software",
      "No known practical attack after 20+ years of cryptanalysis",
      "Standardized globally — used in TLS, WPA2, file encryption, VPNs",
    ],
    weaknesses: [
      "Mode of operation matters — ECB mode is insecure; use GCM, CBC, or CTR",
      "Implementation vulnerabilities (side-channel attacks) are a concern",
      "Key management is the main practical vulnerability",
    ],
    funFacts: [
      "Used in HTTPS, WPA2 Wi-Fi, BitLocker, Signal, WhatsApp, and countless others",
      "Breaking 128-bit AES would require more energy than exists in the known universe",
      "AES-256 is approved for TOP SECRET classification by the NSA",
    ],
    toolCipher: "caesar",
  },
  des: {
    name: "DES — Data Encryption Standard",
    category: "Modern · Symmetric · Block Cipher (Retired)",
    year: "1977",
    origin: "IBM; standardized by NIST (then NBS)",
    keySpace: "2^56 = ~72 quadrillion keys",
    securityRating: 2,
    description:
      "DES was the first widely adopted symmetric encryption standard, used by banks and governments from 1977 until its retirement. It uses a 56-bit key and a 16-round Feistel network on 64-bit blocks. In 1998, the EFF's Deep Crack machine broke DES in under 23 hours, ending its use in security-critical applications.",
    howItWorks: [
      "Split the 64-bit block into left (L) and right (R) halves",
      "Run 16 Feistel rounds: L_new = R_old, R_new = L_old XOR f(R_old, subkey)",
      "The round function f: expand R to 48 bits, XOR with subkey, apply 8 S-boxes, permute",
      "S-boxes provide the non-linearity critical for security",
      "Derive 16 48-bit subkeys from the 56-bit key via the key schedule",
      "Apply final permutation after all 16 rounds",
    ],
    example: null,
    formula: "Feistel: L_i = R_{i-1}, R_i = L_{i-1} ⊕ F(R_{i-1}, K_i)",
    strengths: [
      "First publicly documented, government-standardized cipher",
      "Well-studied Feistel structure influenced many later designs",
      "3DES (Triple DES) extended its life for legacy systems",
    ],
    weaknesses: [
      "56-bit key is dangerously small — brute-forceable in hours with modern hardware",
      "Deprecated by NIST in 2005; banned for new uses",
      "Key size was deliberately limited by NSA influence (alleged)",
    ],
    funFacts: [
      "The EFF built 'Deep Crack' for $250,000 in 1998 to crack DES in 22 hours",
      "DES is still studied as the canonical Feistel cipher in cryptography courses",
      "Triple-DES (3DES) was only retired from US federal use in 2023",
    ],
    toolCipher: "caesar",
  },
  rsa: {
    name: "RSA",
    category: "Modern · Asymmetric · Public-Key Cryptosystem",
    year: "1977",
    origin: "Ron Rivest, Adi Shamir, Leonard Adleman — MIT",
    keySpace: "Security scales with key size (2048–4096 bits recommended)",
    securityRating: 5,
    description:
      "RSA was the first widely used public-key cryptosystem, enabling secure communication without a pre-shared secret. It's based on the mathematical difficulty of factoring the product of two large prime numbers. RSA is used for key exchange, digital signatures, and secure email — wherever asymmetric encryption is needed.",
    howItWorks: [
      "Choose two large primes p and q (typically 1024+ bits each)",
      "Compute n = p × q (the modulus) and φ(n) = (p−1)(q−1)",
      "Choose public exponent e (typically 65537) coprime to φ(n)",
      "Compute private exponent d such that e × d ≡ 1 (mod φ(n))",
      "Public key: (e, n) — share this openly",
      "Private key: (d, n) — keep this secret",
      "Encrypt: C = M^e mod n   |   Decrypt: M = C^d mod n",
    ],
    example: null,
    formula: "Encrypt: C = M^e mod n   |   Decrypt: M = C^d mod n",
    strengths: [
      "No need for a pre-shared secret — public key can be distributed openly",
      "Enables digital signatures for authentication",
      "Security based on integer factorization (computationally hard for large n)",
      "Foundation of modern PKI (SSL/TLS, HTTPS, S/MIME)",
    ],
    weaknesses: [
      "Much slower than symmetric ciphers — not used for bulk data encryption",
      "Vulnerable to quantum attacks (Shor's algorithm) — post-quantum alternatives exist",
      "Small key sizes (< 2048 bits) are vulnerable",
      "Padding scheme matters — textbook RSA without OAEP is insecure",
    ],
    funFacts: [
      "Clifford Cocks at GCHQ discovered an equivalent algorithm in 1973 — kept classified",
      "RSA was briefly classified as a munition by the US government in the 1990s",
      "The RSA-2048 challenge remains unbroken; factoring it would win $200,000",
    ],
    toolCipher: "caesar",
  },
  "diffie-hellman": {
    name: "Diffie-Hellman Key Exchange",
    category: "Modern · Asymmetric · Key Exchange Protocol",
    year: "1976",
    origin: "Whitfield Diffie and Martin Hellman — Stanford",
    keySpace: "Security depends on discrete logarithm hardness",
    securityRating: 5,
    description:
      "Diffie-Hellman was the first published public-key protocol, solving the fundamental problem of how two parties can establish a shared secret over an insecure channel without ever meeting beforehand. It doesn't encrypt data directly but establishes a shared key that can be used with a symmetric cipher. It was revolutionary — the concept of public-key cryptography.",
    howItWorks: [
      "Alice and Bob agree publicly on a large prime p and a generator g",
      "Alice picks private key a, computes A = g^a mod p, sends A to Bob",
      "Bob picks private key b, computes B = g^b mod p, sends B to Alice",
      "Alice computes shared secret: S = B^a mod p = g^(ab) mod p",
      "Bob computes shared secret: S = A^b mod p = g^(ab) mod p",
      "Both arrive at the same S — an eavesdropper cannot compute it without solving the discrete log problem",
    ],
    example: null,
    formula: "Shared secret: S = g^(ab) mod p  (both parties compute independently)",
    strengths: [
      "Solves the key distribution problem — no pre-shared secret needed",
      "Provides forward secrecy when used in ephemeral mode (ECDHE)",
      "Foundation of every TLS/SSL handshake on the internet",
    ],
    weaknesses: [
      "Vulnerable to man-in-the-middle attacks without authentication",
      "Small group parameters are insecure (Logjam attack)",
      "Quantum computers (Shor's algorithm) would break it",
    ],
    funFacts: [
      "Diffie and Hellman won the Turing Award in 2015 for this discovery",
      "Every HTTPS connection you make uses Diffie-Hellman or its elliptic curve variant (ECDH)",
      "Ralph Merkle independently developed the 'Merkle puzzle' concept around the same time",
    ],
    toolCipher: "caesar",
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

            {/* Fun facts */}
            {data.funFacts && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Historical Notes</h2>
                <div className={styles.factsList}>
                  {data.funFacts.map((fact, i) => (
                    <div key={i} className={styles.fact}>
                      <span className={styles.factIcon}>◆</span>
                      <p className={styles.factText}>{fact}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Interactive Tool */}
            {(params.name === "caesar" || params.name === "vigenere") && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Try It Yourself</h2>
                <CipherTool initialCipher={data.toolCipher} />
              </section>
            )}

            {(params.name !== "caesar" && params.name !== "vigenere") && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Try It Yourself</h2>
                <div className={styles.toolRedirect}>
                  <p>A dedicated interactive tool is available for this cipher.</p>
                  <Link href={`/tools/${params.name}`} className={styles.toolBtn}>
                    Open Interactive Tool →
                  </Link>
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
                <Link href={`/tools/${params.name}`} className={styles.quickLink}>
                  🔧 Interactive Tool
                </Link>
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
