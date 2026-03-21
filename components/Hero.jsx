"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Hero.module.css";

const PLAINTEXT  = "HELLO";
const CIPHERTEXT = "KHOOR";

function useEncryptionAnimation() {
  const [display, setDisplay] = useState(PLAINTEXT);
  const [phase, setPhase] = useState("plain");
  const frameRef = useRef(null);

  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let step = 0;
    const totalSteps = 20;
    let timeout;

    function scramble() {
      if (step < totalSteps) {
        setDisplay(
          PLAINTEXT.split("").map((_, i) => {
            const progress = step / totalSteps;
            const charProgress = Math.max(0, (progress * 1.5) - (i * 0.08));
            if (charProgress >= 1) return CIPHERTEXT[i];
            if (charProgress > 0) return chars[Math.floor(Math.random() * 26)];
            return PLAINTEXT[i];
          }).join("")
        );
        step++;
        frameRef.current = setTimeout(scramble, 60);
      } else {
        setDisplay(CIPHERTEXT);
        setPhase("cipher");
        timeout = setTimeout(() => { step = 0; setPhase("decoding"); decode(); }, 2200);
      }
    }

    function decode() {
      if (step < totalSteps) {
        setDisplay(
          CIPHERTEXT.split("").map((_, i) => {
            const progress = step / totalSteps;
            const charProgress = Math.max(0, (progress * 1.5) - (i * 0.08));
            if (charProgress >= 1) return PLAINTEXT[i];
            if (charProgress > 0) return chars[Math.floor(Math.random() * 26)];
            return CIPHERTEXT[i];
          }).join("")
        );
        step++;
        frameRef.current = setTimeout(decode, 60);
      } else {
        setDisplay(PLAINTEXT);
        setPhase("plain");
        timeout = setTimeout(() => { step = 0; setPhase("scrambling"); scramble(); }, 2200);
      }
    }

    const initial = setTimeout(() => { setPhase("scrambling"); scramble(); }, 1800);
    return () => { clearTimeout(frameRef.current); clearTimeout(timeout); clearTimeout(initial); };
  }, []);

  return { display, phase };
}

// Floating orb positions (static to avoid hydration mismatch)
const ORBS = [
  { size: 420, top: "5%",  left: "-8%",  color: "var(--accent-glow)",    delay: 0 },
  { size: 320, top: "55%", right: "-6%", color: "var(--green-glow)",     delay: 1.2 },
  { size: 240, top: "30%", left: "40%",  color: "var(--purple-glow)",    delay: 0.6 },
  { size: 180, top: "75%", left: "15%",  color: "var(--orange-glow)",    delay: 1.8 },
];

const FEATURES = [
  { icon: "⟳", label: "Encrypt & Decrypt" },
  { icon: "◈", label: "Step-by-Step Trace" },
  { icon: "⊞", label: "12+ Algorithms" },
  { icon: "◎", label: "Visual Simulation" },
];

export default function Hero() {
  const { display, phase } = useEncryptionAnimation();

  return (
    <section className={styles.hero}>
      {/* Background layers */}
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.grid} />
        {ORBS.map((orb, i) => (
          <div
            key={i}
            className={styles.orb}
            style={{
              width: orb.size,
              height: orb.size,
              top: orb.top,
              left: orb.left,
              right: orb.right,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              animationDelay: `${orb.delay}s`,
            }}
          />
        ))}
      </div>

      <div className={styles.content}>
        {/* ── Left ── */}
        <div className={styles.left}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Open Source · Interactive · Educational
          </div>

          <h1 className={styles.title}>
            Interactive
            <br />
            <span className={styles.titleAccent}>Cryptography</span>
            <br />
            Lab
          </h1>

          <p className={styles.subtitle}>
            Learn, visualize, and experiment with classical and modern
            encryption algorithms through hands-on interactive tools.
          </p>

          {/* Feature chips */}
          <div className={styles.features}>
            {FEATURES.map(({ icon, label }) => (
              <span key={label} className={styles.featureChip}>
                <span className={styles.featureIcon}>{icon}</span>
                {label}
              </span>
            ))}
          </div>

          <div className={styles.actions}>
            <Link href="/tools" className={styles.btnPrimary}>
              Explore Ciphers
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href="/simulation" className={styles.btnSecondary}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Try Simulation
            </Link>
          </div>
        </div>

        {/* ── Right ── */}
        <div className={styles.right}>
          {/* Main cipher demo card */}
          <div className={styles.encBox}>
            {/* Top glow bar */}
            <div className={styles.encBoxBar} />

            <div className={styles.encLabel}>
              {phase === "cipher" || phase === "decoding" ? "Ciphertext" : "Plaintext"}
            </div>

            <div className={`${styles.encText} ${phase === "cipher" ? styles.cipher : ""} ${phase === "scrambling" || phase === "decoding" ? styles.scrambling : ""}`}>
              {display.split("").map((char, i) => (
                <span key={i} className={styles.encChar}>{char}</span>
              ))}
            </div>

            {/* Shift wheel visualization */}
            <div className={styles.shiftWheel}>
              {["H→K", "E→H", "L→O", "L→O", "O→R"].map((pair, i) => (
                <span
                  key={i}
                  className={`${styles.shiftPair} ${phase === "cipher" ? styles.shiftPairActive : ""}`}
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  {pair}
                </span>
              ))}
            </div>

            <div className={styles.encInfo}>
              Caesar Cipher · Shift +3
            </div>

            <div className={styles.encSteps}>
              <span className={`${styles.step} ${phase === "plain"      ? styles.stepActive : ""}`}>Plaintext</span>
              <span className={`${styles.step} ${phase === "scrambling" ? styles.stepActive : ""}`}>Encrypting…</span>
              <span className={`${styles.step} ${phase === "cipher"     ? styles.stepActive : ""}`}>Ciphertext</span>
              <span className={`${styles.step} ${phase === "decoding"   ? styles.stepActive : ""}`}>Decrypting…</span>
            </div>
          </div>

          {/* Stats row */}
          <div className={styles.statsRow}>
            {[
              { n: "12+", label: "Algorithms", icon: "◈" },
              { n: "5",   label: "Categories", icon: "⊞" },
              { n: "∞",   label: "Experiments", icon: "◎" },
            ].map(({ n, label, icon }) => (
              <div key={label} className={styles.stat}>
                <span className={styles.statIcon}>{icon}</span>
                <span className={styles.statN}>{n}</span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll nudge */}
      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollLine} />
        <span className={styles.scrollText}>scroll</span>
      </div>
    </section>
  );
}
