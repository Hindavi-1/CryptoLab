"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./Hero.module.css";

const PLAINTEXT = "HELLO";
const CIPHERTEXT = "KHOOR";

function useEncryptionAnimation() {
  const [display, setDisplay] = useState(PLAINTEXT);
  const [phase, setPhase] = useState("plain"); // plain | scrambling | cipher | decoding
  const frameRef = useRef(null);

  useEffect(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let step = 0;
    let totalSteps = 20;
    let timeout;

    function scramble() {
      if (step < totalSteps) {
        setDisplay(
          PLAINTEXT.split("")
            .map((_, i) => {
              const progress = step / totalSteps;
              const charProgress = Math.max(0, (progress * 1.5) - (i * 0.08));
              if (charProgress >= 1) return CIPHERTEXT[i];
              if (charProgress > 0) return chars[Math.floor(Math.random() * 26)];
              return PLAINTEXT[i];
            })
            .join("")
        );
        step++;
        frameRef.current = setTimeout(scramble, 60);
      } else {
        setDisplay(CIPHERTEXT);
        setPhase("cipher");
        timeout = setTimeout(() => {
          step = 0;
          setPhase("decoding");
          decode();
        }, 2000);
      }
    }

    function decode() {
      if (step < totalSteps) {
        setDisplay(
          CIPHERTEXT.split("")
            .map((_, i) => {
              const progress = step / totalSteps;
              const charProgress = Math.max(0, (progress * 1.5) - (i * 0.08));
              if (charProgress >= 1) return PLAINTEXT[i];
              if (charProgress > 0) return chars[Math.floor(Math.random() * 26)];
              return CIPHERTEXT[i];
            })
            .join("")
        );
        step++;
        frameRef.current = setTimeout(decode, 60);
      } else {
        setDisplay(PLAINTEXT);
        setPhase("plain");
        timeout = setTimeout(() => {
          step = 0;
          setPhase("scrambling");
          scramble();
        }, 2000);
      }
    }

    const initial = setTimeout(() => {
      setPhase("scrambling");
      scramble();
    }, 1500);

    return () => {
      clearTimeout(frameRef.current);
      clearTimeout(timeout);
      clearTimeout(initial);
    };
  }, []);

  return { display, phase };
}

export default function Hero() {
  const { display, phase } = useEncryptionAnimation();

  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <div className={styles.grid} />
        <div className={styles.glow1} />
        <div className={styles.glow2} />
      </div>

      <div className={styles.content}>
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

          <div className={styles.actions}>
            <Link href="/tools" className={styles.btnPrimary}>
              Explore Ciphers
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href="/simulation" className={styles.btnSecondary}>
              Try Simulation
            </Link>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.encBox}>
            <div className={styles.encLabel}>
              {phase === "cipher" || phase === "decoding" ? "Ciphertext" : "Plaintext"}
            </div>
            <div className={`${styles.encText} ${phase === "cipher" ? styles.cipher : ""}`}>
              {display.split("").map((char, i) => (
                <span key={i} className={styles.encChar}>{char}</span>
              ))}
            </div>
            <div className={styles.encInfo}>
              Caesar Cipher · Shift +3
            </div>
            <div className={styles.encSteps}>
              <span className={`${styles.step} ${phase === "plain" ? styles.stepActive : ""}`}>H→H</span>
              <span className={`${styles.step} ${phase === "scrambling" ? styles.stepActive : ""}`}>Encrypting…</span>
              <span className={`${styles.step} ${phase === "cipher" ? styles.stepActive : ""}`}>K→K</span>
              <span className={`${styles.step} ${phase === "decoding" ? styles.stepActive : ""}`}>Decrypting…</span>
            </div>
          </div>

          <div className={styles.statsRow}>
            {[
              { n: "12+", label: "Algorithms" },
              { n: "5", label: "Categories" },
              { n: "∞", label: "Experiments" },
            ].map(({ n, label }) => (
              <div key={label} className={styles.stat}>
                <span className={styles.statN}>{n}</span>
                <span className={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
