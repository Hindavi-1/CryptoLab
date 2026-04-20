"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import styles from "./challenge.module.css";

// The original plaintext we want them to find
const PLAINTEXT = "THE SECRET KEY IS ALICE";
const SHIFT_USED = 5; // The encryption shift used (so decryption is 21)

// Helper to shift text
function shiftText(text, shift) {
  return text
    .split("")
    .map((char) => {
      if (char.match(/[A-Z]/)) {
        const code = char.charCodeAt(0);
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      }
      return char;
    })
    .join("");
}

// The initial ciphertext presented to the user
const CIPHERTEXT = shiftText(PLAINTEXT, SHIFT_USED);

export default function ChallengeOne() {
  const [sliderVal, setSliderVal] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorAnimation, setErrorAnimation] = useState(false);

  // Derived visible text based on slider (brute force tool)
  // Sliding by `x` applies an additional shift to the ciphertext.
  const visibleText = shiftText(CIPHERTEXT, sliderVal);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (answer.trim().toUpperCase() === PLAINTEXT) {
      setIsSuccess(true);
    } else {
      // Trigger shake animation
      setErrorAnimation(true);
      setTimeout(() => setErrorAnimation(false), 500);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.navBar}>
          <Link href="/challenges" className={styles.backBtn}>
            ← Back to Challenges
          </Link>
          <div className={styles.pointsBadge}>100 pts</div>
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.eyebrow}>Challenge #01</span>
            <h1 className={styles.title}>Decode the Message</h1>
            <p className={styles.desc}>
              We intercepted a message encrypted using a Caesar Cipher, but we don't know the shift key. 
              Use the brute-force slider to shift the letters until the message makes sense, then submit the cracked plaintext below.
            </p>
          </div>

          <div className={styles.workspace}>
            {/* ── Brute Force Tool ── */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Intercepted Ciphertext</h2>
              <div className={styles.cipherBox}>
                {visibleText}
              </div>

              <div className={styles.toolControls}>
                <div className={styles.sliderHeader}>
                  <label>Shift Offset Tool</label>
                  <span className={styles.sliderValue}>+{sliderVal}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={sliderVal}
                  onChange={(e) => setSliderVal(parseInt(e.target.value))}
                  className={styles.slider}
                />
                <p className={styles.hint}>
                  Tip: Drag the slider to shift the letters. Look for common English words!
                </p>
              </div>
            </div>

            {/* ── Submission Area ── */}
            <div className={styles.submitCard}>
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={styles.form}
                    onSubmit={handleSubmit}
                  >
                    <label className={styles.label}>Decrypted Message</label>
                    <motion.div
                      animate={errorAnimation ? { x: [-10, 10, -10, 10, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type the cracked message..."
                        className={styles.input}
                        autoComplete="off"
                      />
                    </motion.div>
                    <button type="submit" className={styles.submitBtn}>
                      Check Answer
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={styles.successState}
                  >
                    <div className={styles.successIcon}>✓</div>
                    <h2 className={styles.successTitle}>Challenge Completed!</h2>
                    <p className={styles.successText}>
                      Excellent work! You successfully cracked the Caesar cipher.
                      The original shift was <strong>{SHIFT_USED}</strong>.
                    </p>
                    <Link href="/challenges" className={styles.submitBtn}>
                      Return to Challenges
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
