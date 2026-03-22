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
    origin: "Joan Daemen & Vincent Rijmen (Rijndael)",
    keySpace: "2^128, 2^192, or 2^256 keys",
    securityRating: 5,
    description: "The Advanced Encryption Standard (AES) is currently the global gold standard for symmetric encryption. Chosen by NIST to replace DES, AES is based on a Substitution-Permutation Network (SPN). It is fast, mathematically elegant, and highly resistant to both linear and differential cryptanalysis.",
    howItWorks: [
      "Block Size: Always operates on a fixed 128-bit block size (arranged as a 4x4 matrix of bytes called the 'State').",
      "Key Size & Rounds: Supports 128-bit (10 rounds), 192-bit (12 rounds), and 256-bit (14 rounds) keys.",
      "AddRoundKey (Initial): The initial 128-bit block is XORed with the first derived subkey.",
      "Round Operations: For each round except the last, the State undergoes four transformations: SubBytes, ShiftRows, MixColumns, and AddRoundKey.",
      "Final Round: The MixColumns step is intentionally omitted in the final round to make decryption perfectly symmetric to encryption.",
    ],
    encryptionSteps: [
      "Step 1 — SubBytes: A non-linear substitution step where each byte is replaced with another according to a lookup table (S-box).",
      "Step 2 — ShiftRows: A transposition step where the last three rows of the State are shifted cyclically a certain number of steps (Row 1 left by 1, Row 2 by 2, Row 3 by 3).",
      "Step 3 — MixColumns: A linear mixing operation operating on columns of the State matrix. It effectively multiplies each column by a fixed matrix in Galois Field (GF(2^8)).",
      "Step 4 — AddRoundKey: Each byte of the State is combined with a block of the round subkey using bitwise XOR.",
    ],
    decryptionSteps: [
      "Step 1 — Key Schedule: The subkeys are applied in reverse order.",
      "Step 2 — Inverse Operations: Each operation from encryption has an inverse: InvShiftRows, InvSubBytes, InvMixColumns, and AddRoundKey (XOR is its own inverse).",
      "Step 3 — Round Layout: The decryption rounds execute these inverse operations, stepping backward through the SPN to unravel the ciphertext into the exact original plaintext.",
    ],
    example: null,
    formula: "State = (SubBytes → ShiftRows → MixColumns → AddRoundKey) × Rounds",
    strengths: ["Unbreakable by modern computing (brute-force is computationally impossible).", "Highly efficient in software and widely hardware-accelerated (AES-NI).", "Variable key sizes permit future-proofing against theoretical breakthroughs."],
    weaknesses: ["Implementation errors (e.g. side-channel attacks on cache timing) are its primary threat vector, not mathematical flaws.", "Block modes like ECB are mathematically insecure without proper IV usage."],
    funFacts: ["The original cipher submitted to NIST was called 'Rijndael', a portmanteau of its creators' names (Rijmen and Daemen).", "AES-256 is the first and only publicly accessible cipher approved by the US National Security Agency (NSA) for Top Secret information."],
    toolCipher: "aes",
  },
  rsa: {
    name: "RSA",
    category: "Modern · Asymmetric",
    year: "1977",
    origin: "Ron Rivest, Adi Shamir, Leonard Adleman",
    keySpace: "Depends on modulus size (usually 2048-bit or 4096-bit)",
    securityRating: 5,
    description: "RSA is one of the first practical public-key cryptosystems and is widely used for secure data transmission. Its security relies on the mathematical difficulty of factoring large integers (the product of two large prime numbers).",
    howItWorks: [
      "Key Generation: Two distinct primes (p and q) are chosen and multiplied to produce the modulus (n).",
      "Euler's Totient: The totient function φ(n) is calculated as (p-1)(q-1).",
      "Public Exponent (e): An integer e is chosen such that 1 < e < φ(n) and gcd(e, φ(n)) = 1.",
      "Private Exponent (d): The modular multiplicative inverse of e (modulo φ(n)) is computed to serve as the private key.",
      "Encryption: The plaintext M is converted to an integer and ciphertext C is computed as C = M^e mod n.",
      "Decryption: The ciphertext is recovered via M = C^d mod n."
    ],
    encryptionSteps: [
      "Step 1: Translate the text into numerical blocks (M) such that 0 ≤ M < n.",
      "Step 2: Raise each block M to the power of the public exponent e.",
      "Step 3: Divide by the modulus n to find the remainder. C = M^e mod n."
    ],
    decryptionSteps: [
      "Step 1: Take the ciphertext blocks C.",
      "Step 2: Raise each block C to the power of the private exponent d.",
      "Step 3: Keep the remainder modulus n, evaluating M = C^d mod n.",
      "Step 4: Translate the numerical blocks M back into text."
    ],
    example: "Generating keys from primes p=61, q=53 enables math like M^17 mod 3233.",
    formula: "Encrypt: C = M^e mod n | Decrypt: M = C^d mod n",
    strengths: ["Provides both encryption and digital signatures.", "Underpins the security of TLS/SSL for secure web browsing."],
    weaknesses: ["Extremely slow compared to symmetric ciphers (usually used just to exchange symmetric keys).", "Vulnerable to future quantum computers running Shor's algorithm."],
    funFacts: ["The UK intelligence agency GCHQ actually developed an equivalent system in 1973 (Clifford Cocks) but kept it classified.", "'RSA' stands for the initials of the surnames of the inventors."],
    toolCipher: "rsa",
  },
  dh: {
    name: "Diffie-Hellman Key Exchange",
    category: "Modern · Asymmetric · Key Exchange",
    year: "1976",
    origin: "Whitfield Diffie & Martin Hellman",
    keySpace: "Depends on prime modulus size",
    securityRating: 5,
    description: "Diffie-Hellman (DH) is a mathematical method of securely exchanging cryptographic keys over a public channel. It was one of the first public-key protocols and allows two parties with no prior knowledge of each other to jointly establish a shared secret.",
    howItWorks: [
      "Public Parameters: Alice and Bob agree on a large prime modulus (p) and a generator base (g).",
      "Private Secrets: Alice picks a secret integer (a). Bob picks a secret integer (b).",
      "Public Computation: Alice computes A = g^a mod p. Bob computes B = g^b mod p.",
      "Exchange: They exchange their public computed values (A and B) over the insecure network.",
      "Shared Secret: Alice computes S = B^a mod p. Bob computes S = A^b mod p. Both equal g^(ab) mod p."
    ],
    encryptionSteps: [
      "Not applicable. DH is a key agreement protocol, not an encryption cipher. The shared secret generated is usually passed to a symmetric cipher like AES."
    ],
    decryptionSteps: [
      "Not applicable."
    ],
    example: "Using p=23, g=5. If Alice picks 4 and Bob picks 3, they both arrive at secret 18.",
    formula: "Alice = A^b mod p | Bob = B^a mod p | S = g^(ab) mod p",
    strengths: ["Pioneered the concept of public-key cryptography.", "Enables Perfect Forward Secrecy (PFS) when ephemeral keys are used."],
    weaknesses: ["Vulnerable to Man-in-the-Middle (MitM) attacks if the initial public keys are not authenticated (e.g., using digital signatures)."],
    funFacts: ["Ralph Merkle also significantly contributed to the invention, and Hellman has argued it should be called 'Diffie-Hellman-Merkle' key exchange."],
    toolCipher: "dh",
  },
  ecc: {
    name: "Elliptic Curve Cryptography (ECC)",
    category: "Modern · Asymmetric",
    year: "1985",
    origin: "Neal Koblitz & Victor S. Miller",
    keySpace: "Point scaling on algebraic curves",
    securityRating: 5,
    description: "Elliptic Curve Cryptography is an approach to public-key cryptography based on the algebraic structure of elliptic curves over finite fields. ECC can yield equivalent security to RSA with significantly smaller keys.",
    howItWorks: [
      "Curve Equation: Depends on examining points (x, y) that satisfy y^2 = x^3 + ax + b.",
      "Base Point: A generator point G on the curve is publicly agreed upon.",
      "Private Key: A randomly selected integer k.",
      "Public Key: A curve point derived by multiplying the base point by the private key: P = k * G.",
      "Key Exchange (ECDH): Alice computes S = k_A * P_B. Bob computes S = k_B * P_A. They arrive at the exact same geometric coordinate."
    ],
    encryptionSteps: [
      "Note: The visualizer demonstrates Elliptic Curve Diffie-Hellman (ECDH).",
      "Step 1: Alice generates her public point by adding the base point G to itself k_A times.",
      "Step 2: Bob generates his public point using his private scalar k_B.",
      "Step 3: The public coordinate points are exchanged spanning the insecure network.",
      "Step 4: Both parties scalar multiply the received public point by their own private scalar to derive the shared secret coordinate."
    ],
    decryptionSteps: [
      "Not applicable for purely ECDH exchange."
    ],
    example: "Finding G + G by drawing a tangent line, finding the intersection on the curve, and reflecting it over the x-axis.",
    formula: "y² = x³ + ax + b | Public Key = k * G",
    strengths: ["Provides equivalent security to RSA with drastically smaller key sizes (256-bit ECC ≈ 3072-bit RSA).", "Consumes far less computing power and battery life, dominating mobile and IoT devices."],
    weaknesses: ["More complex to implement securely, prone to subtle side-channel attacks on weak curves.", "Standard curves (like NIST P-256) have drawn suspicion regarding NSA influenced constants."],
    funFacts: ["Bitcoin uses an elliptic curve called secp256k1 for its digital signatures.", "The math behind ECC fundamentally involves 'drawing lines' through curves to find intersecting dots."],
    toolCipher: "ecc",
  },
  elgamal: {
    name: "ElGamal Encryption",
    category: "Modern · Asymmetric",
    year: "1985",
    origin: "Taher Elgamal",
    keySpace: "Depends on prime modulus size",
    securityRating: 5,
    description: "The ElGamal encryption system is an asymmetric key encryption algorithm based on the Diffie-Hellman key exchange. It integrates cryptographic randomization, ensuring the same plaintext encrypted twice produces completely different ciphertexts.",
    howItWorks: [
      "Key Generation: Choose prime p, generator g. Private key x is chosen. Public key y is computed as g^x mod p.",
      "Encryption: To encrypt message m, the sender picks a random ephemeral key k.",
      "Ciphertext Part 1: C1 is computed as the sender's public contribution: C1 = g^k mod p.",
      "Ciphertext Part 2: C2 masks the message using the shared secret: C2 = m * y^k mod p.",
      "Decryption: The receiver uses their private key x to compute the shared secret s = C1^x mod p.",
      "Recovery: The receiver multiplies C2 by the modular inverse of the secret: m = C2 * s⁻¹ mod p."
    ],
    encryptionSteps: [
      "Step 1: Obtain the receiver's Public Key (y, g, p).",
      "Step 2: Generate a random one-time-use scalar k.",
      "Step 3: Convert the plaintext into a mathematical integer m.",
      "Step 4: Compute C1 = g^k mod p.",
      "Step 5: Compute C2 = m * y^k mod p. Send the pair (C1, C2)."
    ],
    decryptionSteps: [
      "Step 1: Receive ciphertext pair (C1, C2).",
      "Step 2: Raise C1 to the private key x to find the masking factor s = C1^x mod p.",
      "Step 3: Find the modular inverse of s modulo p.",
      "Step 4: Multiply C2 by the inverse of s modulo p to strip the mask and reveal m."
    ],
    example: "Encrypting 'Hello' uses random variable `k`, producing totally different cipher variables `c1` and `c2` the next time.",
    formula: "C1 = g^k | C2 = m * y^k | M = C2 / (C1^x) mod p",
    strengths: ["Probabilistic encryption ensures semantic security; the ciphertext changes even if the message and key are the same.", "Closely tied to the discrete logarithm problem."],
    weaknesses: ["Ciphertext expansion: The ciphertext is twice as long as the plaintext.", "Slower than RSA for encryption due to two modular exponentiations."],
    funFacts: ["ElGamal's creator, Taher Elgamal, is often recognized as the 'father of SSL' due to his later work at Netscape.", "The Digital Signature Algorithm (DSA) is heavily based on variants of ElGamal."],
    toolCipher: "elgamal",
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
