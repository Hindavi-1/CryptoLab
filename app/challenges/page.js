import styles from "./challenges.module.css";

const challenges = [
  {
    id: 1,
    title: "Decode the Message",
    description: "A Caesar cipher with an unknown shift hides a secret message. Can you crack it?",
    cipher: "Caesar",
    difficulty: "Easy",
    points: 100,
    hint: "Try all 26 possible shifts",
  },
  {
    id: 2,
    title: "The Keyword Hunt",
    description: "Intercept a Vigenère-encrypted message and find the hidden keyword.",
    cipher: "Vigenère",
    difficulty: "Medium",
    points: 250,
    hint: "Kasiski examination may help",
  },
  {
    id: 3,
    title: "Rail Fence Maze",
    description: "A transposed message scrambled across 4 rails. Reconstruct the original.",
    cipher: "Rail Fence",
    difficulty: "Medium",
    points: 300,
    hint: "Count the characters in each rail",
  },
  {
    id: 4,
    title: "Playfair Puzzle",
    description: "Decrypt a Playfair-encoded message with the given 5×5 key matrix.",
    cipher: "Playfair",
    difficulty: "Hard",
    points: 500,
    hint: "Remember the digraph rules",
  },
  {
    id: 5,
    title: "The RSA Challenge",
    description: "Factor a small public key and recover the private key to decrypt the message.",
    cipher: "RSA",
    difficulty: "Expert",
    points: 1000,
    hint: "Small primes are vulnerable",
  },
];

const difficultyColors = {
  Easy: "green",
  Medium: "yellow",
  Hard: "orange",
  Expert: "red",
};

export default function ChallengesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Test Your Skills</span>
          <h1 className={styles.title}>Cryptography Challenges</h1>
          <p className={styles.subtitle}>
            Put your knowledge to the test. Crack ciphers, decode messages, and earn points as you level up.
          </p>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statN}>5</span>
              <span className={styles.statLabel}>Challenges</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statN}>2150</span>
              <span className={styles.statLabel}>Total Points</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statN}>4</span>
              <span className={styles.statLabel}>Difficulties</span>
            </div>
          </div>
        </div>

        <div className={styles.list}>
          {challenges.map((c, i) => (
            <div key={c.id} className={styles.card}>
              <div className={styles.cardLeft}>
                <span className={styles.cardNum}>#{String(i + 1).padStart(2, "0")}</span>
                <div className={styles.cardBody}>
                  <div className={styles.cardMeta}>
                    <span className={`${styles.diff} ${styles[`diff_${difficultyColors[c.difficulty]}`]}`}>
                      {c.difficulty}
                    </span>
                    <span className={styles.cipherTag}>{c.cipher}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{c.title}</h3>
                  <p className={styles.cardDesc}>{c.description}</p>
                  <p className={styles.cardHint}>
                    <span className={styles.hintLabel}>Hint:</span> {c.hint}
                  </p>
                </div>
              </div>
              <div className={styles.cardRight}>
                <div className={styles.points}>
                  <span className={styles.pointsN}>{c.points}</span>
                  <span className={styles.pointsLabel}>pts</span>
                </div>
                <button className={styles.startBtn}>Start →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
