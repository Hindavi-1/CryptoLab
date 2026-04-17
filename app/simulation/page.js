"use client";
import { useState } from "react";
import SimulationCard from "../../components/SimulationCard";
import styles from "./simulation.module.css";
import { cryptoTree } from "../../data/cryptoTree";

// Flatten cryptoTree to get a list of ciphers for the simulation hub
const getSimulations = () => {
  const sims = [];
  cryptoTree.children.forEach(category => {
    category.children.forEach(sub => {
      if (sub.type === "cipher") {
        sims.push({
          name: sub.label,
          slug: sub.slug,
          description: sub.description,
          category: category.label.split(" ")[0], // Primary Category (Classical, Symmetric, Asymmetric, Hash)
          tag: sub.label, 
          // We will assign a better tag based on layout. 
          // Wait, cryptoTree actually groups by "Substitution", "Transposition", etc.
          // Let's accurately parse it.
        });
      } else if (sub.children) {
        sub.children.forEach(group => {
          if (group.type === "cipher") {
             sims.push({ name: group.label, slug: group.slug, description: group.description, category: category.label.includes("Symmetric") || category.label === "Symmetric Key" ? "Classical" : category.label, tag: sub.label });
          } else if (group.children) {
            group.children.forEach(cipher => {
              if (cipher.type === "cipher") {
                 let majorCat = category.label;
                 if (majorCat === "Symmetric Key") {
                    // For our simplified category tabs, we might map to Classical, Modern.
                    // But wait, user requested Classical, Symmetric, Asymmetric.
                    // Let's use custom static array to guarantee correct formatting similar to tools/page.js
                 }
              }
            });
          }
        });
      }
    });
  });
  return sims;
};

// Let's hardcode the clean list like in tools/page.js for better UX presentation as requested.
const SIMULATIONS = [
  { name: "Caesar Cipher",      slug: "caesar",       description: "Watch a classical Caesar shift substitution step by step. See each letter offset by the key value.", category: "Classical", tag: "Substitution" },
  { name: "Vigenère Cipher",    slug: "vigenere",     description: "Simulate polyalphabetic substitution. Visualize how the keyword repeats and shifts each plaintext letter.", category: "Classical", tag: "Polyalphabetic" },
  { name: "Playfair Cipher",    slug: "playfair",     description: "Explore digraph substitution. Watch how a 5x5 grid is generated and pair-encryption rules are applied.", category: "Classical", tag: "Digraph" },
  { name: "Rail Fence Cipher",  slug: "railfence",    description: "Visualize a classical transposition cipher. See how plaintext arranges across rails and reads row by row.", category: "Classical", tag: "Transposition" },
  { name: "Columnar Transposition", slug: "columnar", description: "Step through keyed transposition. Watch letters fill columns and read out based on keyword sequence.", category: "Classical", tag: "Transposition" },
  { name: "Affine Cipher",      slug: "affine",       description: "Learn modular arithmetic substitution. See the mathematical function E(x)=(ax+b) mod 26 applied step-by-step.", category: "Classical", tag: "Mathematical" },
  { name: "Hill Cipher",        slug: "hill",         description: "Simulate polygraphic substitution with matrix algebra. Visualize vector multiplication over mod 26.", category: "Classical", tag: "Matrix" },
  { name: "Simple Substitution",slug: "substitution", description: "Watch a 1-to-1 letter mapping unfold. See the generated alphabet and how plaintext matches to it.", category: "Classical", tag: "Substitution" },
  { name: "DES",                slug: "des",          description: "Explore the internals of the Data Encryption Standard. Visualize initial permutations and Feistel rounds.", category: "Symmetric",   tag: "Block Cipher" },
  { name: "AES",                slug: "aes",          description: "Step inside the Advanced Encryption Standard. Watch SubBytes, ShiftRows, MixColumns, and AddRoundKey.", category: "Symmetric",   tag: "Block Cipher" },
  { name: "RSA",                slug: "rsa",          description: "See asymmetric cryptography in action. Step through key generation, encryption, and decryption using large primes.", category: "Asymmetric", tag: "Public Key" },
  { name: "Diffie-Hellman",     slug: "diffie-hellman",description: "Simulate public key exchange. Watch two parties establish a shared secret over an untrusted channel.", category: "Asymmetric", tag: "Key Exchange" },
  { name: "ElGamal",            slug: "elgamal",      description: "Explore randomized asymmetric encryption based on Diffie-Hellman key exchange and discrete logarithms.", category: "Asymmetric", tag: "Public Key" },
  { name: "Elliptic Curve",     slug: "ecc",          description: "Visualize elliptic curve points. See scalar multiplication and how ECC achieves security with small keys.", category: "Asymmetric", tag: "Modern" },
];

const FILTERS = ["All", "Classical", "Symmetric", "Asymmetric"];

const FILTER_COUNTS = Object.fromEntries(
  FILTERS.map((f) => [f, f === "All" ? SIMULATIONS.length : SIMULATIONS.filter((c) => c.category === f).length])
);

export default function SimulationHub() {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const q = query.toLowerCase().trim();
  const filtered = SIMULATIONS.filter((c) => {
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
            <span className={styles.eyebrow}>Simulation Hub</span>
            <h1 className={styles.title}>Interactive Cryptography</h1>
            <p className={styles.subtitle}>
              Watch algorithms unfold step by step. Visually understand how ciphers transform data 
              from classical techniques to modern public-key cryptography.
            </p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.hStat}>
              <span className={styles.hStatN}>{SIMULATIONS.length}</span>
              <span className={styles.hStatLabel}>Simulations</span>
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
              id="sim-search"
              className={styles.searchInput}
              type="text"
              placeholder="Search simulations by name, type or keyword…"
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
            {filtered.length} simulation{filtered.length !== 1 ? "s" : ""}{q && ` for “${query}”`}
          </span>
        </div>

        {/* Grid */}
        <div className={styles.grid}>
          {filtered.map((sim) => (
            <SimulationCard key={sim.slug} {...sim} />
          ))}
        </div>
      </div>
    </div>
  );
}
