"use client";
import { useState } from "react";
import CipherCard from "../../components/CipherCard";
import styles from "./tools.module.css";

const ciphers = [
  { name: "Caesar Cipher",      slug: "caesar",       description: "Shift each letter by a fixed number of positions. The oldest known substitution cipher, used by Julius Caesar.", category: "Classical", tag: "Symmetric"    },
  { name: "Vigenère Cipher",    slug: "vigenere",     description: "Polyalphabetic substitution using a repeating keyword. Much stronger than Caesar.",                             category: "Classical", tag: "Symmetric"    },
  { name: "Playfair Cipher",    slug: "playfair",     description: "Encrypts pairs of letters using a 5×5 key square. First practical digraph substitution cipher.",                category: "Classical", tag: "Symmetric"    },
  { name: "Rail Fence Cipher",  slug: "railfence",    description: "A transposition cipher that writes plaintext in a zigzag pattern across multiple rails.",                        category: "Classical", tag: "Transposition" },
  { name: "Columnar Transposition", slug: "columnar",  description: "Keyed transposition: fill rows under a keyword (letters and/or digits), then read columns in sorted key order.", category: "Classical", tag: "Transposition" },
  { name: "Affine Cipher",      slug: "affine",       description: "A substitution cipher using a linear mathematical function to map each letter.",                                 category: "Classical", tag: "Symmetric"    },
  { name: "Hill Cipher",        slug: "hill",         description: "A polygraphic substitution cipher based on linear algebra, using matrix multiplication.",                        category: "Classical", tag: "Symmetric"    },
  { name: "Simple Substitution",slug: "substitution", description: "A cipher where each letter of the alphabet is replaced with another fixed letter.",                             category: "Classical", tag: "Symmetric"    },
  { name: "DES",                slug: "des",          description: "Data Encryption Standard — a 56-bit Feistel block cipher. Now retired but historically vital.",                  category: "Modern",   tag: "Block Cipher" },
  { name: "AES",                slug: "aes",          description: "Advanced Encryption Standard with 128/192/256-bit keys. The current global standard.",                          category: "Modern",   tag: "Block Cipher" },
  { name: "RSA",                slug: "rsa",          description: "Rivest–Shamir–Adleman — public-key system based on the difficulty of factoring primes.",                         category: "Modern",   tag: "Asymmetric"   },
  { name: "Diffie-Hellman",     slug: "dh",           description: "Key exchange protocol establishing a shared secret over an insecure channel.",                                    category: "Modern",   tag: "Asymmetric"   },
  { name: "ElGamal",            slug: "elgamal",      description: "Public-key cryptosystem utilizing randomized ephemeral keys to ensure semantic security.",                            category: "Modern",   tag: "Asymmetric"   },
  { name: "Elliptic Curve",     slug: "ecc",          description: "Advanced public-key cryptography leveraging algebraic structures of elliptic curves over finite fields.",             category: "Modern",   tag: "Asymmetric"   },
  { name: "MD5",                slug: "md5",          description: "Message Digest 5 produces a 128-bit hash. Widely used for integrity, now considered weak.",                      category: "Hash",     tag: "Keyless"      },
  { name: "SHA-256",            slug: "sha256",       description: "Secure Hash Algorithm producing a 256-bit hash. Used in blockchain and security certs.",                         category: "Hash",     tag: "Keyless"      },
];

const FILTERS = ["All", "Classical", "Modern", "Hash"];

const FILTER_COUNTS = Object.fromEntries(
  FILTERS.map((f) => [f, f === "All" ? ciphers.length : ciphers.filter((c) => c.category === f).length])
);

export default function ToolsPage() {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const q = query.toLowerCase().trim();
  const filtered = ciphers.filter((c) => {
    const matchCat = active === "All" || c.category === active;
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.eyebrow}>Cipher Tools</span>
            <h1 className={styles.title}>Encryption Toolkit</h1>
            <p className={styles.subtitle}>
              Hands-on tools for every major cipher. Encrypt, decrypt, and explore how each algorithm transforms your text.
            </p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.hStat}>
              <span className={styles.hStatN}>{ciphers.length}</span>
              <span className={styles.hStatLabel}>Total Ciphers</span>
            </div>
            <div className={styles.hStat}>
              <span className={styles.hStatN}>3</span>
              <span className={styles.hStatLabel}>Categories</span>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className={styles.searchBar}>
          <div className={styles.searchInputWrap}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              id="tool-search"
              className={styles.searchInput}
              type="text"
              placeholder="Search tools by name, type or keyword…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            {query && (
              <button className={styles.searchClear} onClick={() => setQuery("")} aria-label="Clear search">✕</button>
            )}
          </div>
        </div>

        {/* Filter bar */}
        <div className={styles.filterBar}>
          <div className={styles.filters}>
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`${styles.filter} ${active === f ? styles.filterActive : ""}`}
                onClick={() => setActive(f)}
              >
                {f}
                <span className={`${styles.filterCount} ${active === f ? styles.filterCountActive : ""}`}>
                  {FILTER_COUNTS[f]}
                </span>
              </button>
            ))}
          </div>
          <span className={styles.filterResult}>
            {filtered.length} algorithm{filtered.length !== 1 ? "s" : ""}{q && ` for “${query}”`}
          </span>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {filtered.map((c) => (
            <CipherCard key={c.slug} {...c} />
          ))}
        </div>
      </div>
    </div>
  );
}
