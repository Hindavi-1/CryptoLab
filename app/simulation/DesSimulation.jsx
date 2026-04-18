import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DesSimulation.module.css';

const STAGES = [
  { id: 'setup', name: 'Input Preparation', desc: 'Parsing plaintext and keys. Formatting into 64-bit blocks.' },
  { id: 'ip', name: 'Initial Permutation (IP)', desc: 'Rearranging the 64-bit block bits before main rounds.' },
  { id: 'feistel', name: 'Feistel Network', desc: 'Applying 16 rounds of substitution and permutation.' },
  { id: 'fp', name: 'Final Permutation (IP⁻¹)', desc: 'Applying the inverse of the initial permutation.' },
  { id: 'output', name: 'Output Generation', desc: 'Finalizing ciphertext block.' }
];

export default function DesSimulation({ data, colorVar }) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play logic
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (step < STAGES.length - 1) {
          setStep(s => s + 1);
        } else {
          setIsPlaying(false);
        }
      }, 2500); // 2.5s per stage
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  // Reset when data changes
  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [data]);

  if (!data) return null;

  const currentStage = STAGES[step];
  const { input, output, keyHex, ivHex, mode, action } = data;

  const handleNext = () => setStep(s => Math.min(s + 1, STAGES.length - 1));
  const handlePrev = () => setStep(s => Math.max(s - 1, 0));
  const togglePlay = () => setIsPlaying(p => !p);

  return (
    <div className={styles.container} style={{ '--v-color': colorVar }}>
      
      {/* Controls */}
      <div className={styles.controls}>
        <button className={styles.btn} onClick={handlePrev} disabled={step === 0}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          Prev
        </button>
        <button className={styles.btn} onClick={togglePlay}>
          {isPlaying ? (
            <><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause</>
          ) : (
            <><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 9-14 9V3z"/></svg> Play</>
          )}
        </button>
        <button className={styles.btn} onClick={handleNext} disabled={step === STAGES.length - 1}>
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <div style={{ flex: 1 }} />
        
        <div className={styles.stageInfo}>
          <span className={styles.stageName}>{currentStage.name}</span>
          <span className={styles.stageDesc}>{currentStage.desc}</span>
        </div>
      </div>

      {/* Overview Card */}
      <div className={styles.statusCard}>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>Mode / Action</span>
          <span className={styles.statusValue}>{mode} - {action.toUpperCase()}</span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>Key (Hex)</span>
          <span className={styles.statusValue}>{keyHex || "N/A"}</span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>IV (Hex)</span>
          <span className={styles.statusValue}>{ivHex || "N/A (ECB)"}</span>
        </div>
      </div>

      {/* Visualizer */}
      <div className={styles.visualizer}>
        <AnimatePresence mode="wait">
          {step === 0 && (
             <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={styles.blockRow}>
                <div className={styles.block}>
                  <span className={styles.blockLabel}>Input Data</span>
                  {input.substring(0, 16)}{input.length > 16 ? '...' : ''}
                </div>
                <svg width="40" height="24" viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h30M25 5l10 7-10 7"/></svg>
                <div className={styles.block} style={{ borderColor: 'var(--text-subtle)' }}>
                  <span className={styles.blockLabel}>64-bit Blocks</span>
                  0100101...
                </div>
             </motion.div>
          )}

          {step === 1 && (
             <motion.div key="ip" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={styles.blockRow} style={{ flexDirection: 'column', gap: 40 }}>
                <div className={styles.block}>
                  <span className={styles.blockLabel}>Pre-IP Block</span>
                  B1 B2 B3 B4 ... B64
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                   <svg width="200" height="60" className={styles.crossLines} style={{ position: 'relative' }}>
                      <path d="M20 0 C 80 30, 120 30, 180 60" className={`${styles.line} ${styles.lineActive}`} strokeDasharray="5,5" />
                      <path d="M180 0 C 120 30, 80 30, 20 60" className={`${styles.line} ${styles.lineActive}`} strokeDasharray="5,5" />
                      <path d="M100 0 L 100 60" className={`${styles.line} ${styles.lineActive}`} strokeDasharray="5,5" />
                   </svg>
                </div>
                <div className={styles.blockRow} style={{ gap: 16 }}>
                  <div className={styles.block} style={{ minWidth: 100 }}>
                    <span className={styles.blockLabel}>L0 (32-bit)</span>
                    L-Half
                  </div>
                  <div className={styles.block} style={{ minWidth: 100 }}>
                    <span className={styles.blockLabel}>R0 (32-bit)</span>
                    R-Half
                  </div>
                </div>
             </motion.div>
          )}

          {step === 2 && (
             <motion.div key="feistel" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={styles.feistelContainer}>
                <div className={styles.feistelHalf}>
                   <div className={styles.fBlock}>L(i-1)</div>
                   <div style={{ height: 40, width: 2, background: 'var(--border)' }}></div>
                   <div className={styles.xorNode}>⊕</div>
                   <div style={{ height: 40, width: 2, background: 'var(--border)' }}></div>
                   <div className={`${styles.fBlock} ${styles.fBlockActive}`}>L(i) = R(i-1)</div>
                </div>

                <div className={styles.fFunction}>
                   f
                </div>

                <div className={styles.feistelHalf}>
                   <div className={styles.fBlock}>R(i-1)</div>
                   <div style={{ height: 116, width: 2, background: 'var(--border)' }}></div>
                   <div className={`${styles.fBlock} ${styles.fBlockActive}`}>R(i)</div>
                </div>
             </motion.div>
          )}

          {step === 3 && (
             <motion.div key="fp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={styles.blockRow} style={{ flexDirection: 'column', gap: 40 }}>
                <div className={styles.blockRow} style={{ gap: 16 }}>
                  <div className={styles.block} style={{ minWidth: 100 }}>
                    <span className={styles.blockLabel}>R16 (32-bit)</span>
                    R-Half
                  </div>
                  <div className={styles.block} style={{ minWidth: 100 }}>
                    <span className={styles.blockLabel}>L16 (32-bit)</span>
                    L-Half
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                   <svg width="200" height="60" className={styles.crossLines} style={{ position: 'relative' }}>
                      <path d="M20 0 C 80 30, 120 30, 180 60" className={`${styles.line} ${styles.lineActive}`} strokeDasharray="5,5" />
                      <path d="M180 0 C 120 30, 80 30, 20 60" className={`${styles.line} ${styles.lineActive}`} strokeDasharray="5,5" />
                      <path d="M100 0 L 100 60" className={`${styles.line} ${styles.lineActive}`} strokeDasharray="5,5" />
                   </svg>
                </div>
                <div className={styles.block}>
                  <span className={styles.blockLabel}>Post-IP⁻¹ Block</span>
                  C1 C2 C3 C4 ... C64
                </div>
             </motion.div>
          )}

          {step === 4 && (
             <motion.div key="output" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={styles.blockRow}>
                <div className={styles.block} style={{ borderColor: 'var(--text-subtle)' }}>
                  <span className={styles.blockLabel}>64-bit Blocks</span>
                  Ciphertext Blocks
                </div>
                <svg width="40" height="24" viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h30M25 5l10 7-10 7"/></svg>
                <div className={`${styles.block} ${styles.fBlockActive}`} style={{ maxWidth: 300, wordBreak: 'break-all' }}>
                  <span className={styles.blockLabel}>Final Output</span>
                  {output}
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
