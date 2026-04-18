import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AesSimulation.module.css';

const STAGES = [
  { id: 'setup', name: 'Input Preparation', desc: 'Parsing plaintext and keys. Formatting into 128-bit state matrices.' },
  { id: 'addroundkey_init', name: 'Initial AddRoundKey', desc: 'XOR the initial 128-bit state with the first key schedule word.' },
  { id: 'main_rounds', name: 'Main SPN Rounds', desc: 'Repeated SubBytes, ShiftRows, MixColumns, AddRoundKey loops.' },
  { id: 'final_round', name: 'Final Round', desc: 'SubBytes, ShiftRows, and AddRoundKey (MixColumns is omitted).' },
  { id: 'output', name: 'Output Generation', desc: 'Finalizing ciphertext block.' }
];

export default function AesSimulation({ data, colorVar }) {
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
  const { input, output, keyHex, ivHex, mode, keySize, action } = data;
  const numRounds = keySize === 128 ? 10 : keySize === 192 ? 12 : 14;

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
          <span className={styles.statusLabel}>Key ({keySize}-bit)</span>
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
                <div className={styles.matrixGrid}>
                  <span className={styles.blockLabel} style={{top: -24}}>128-bit State (4x4)</span>
                  {Array.from({length: 16}).map((_, i) => (
                    <div key={i} className={styles.matrixCell}>{(Math.random() * 255 | 0).toString(16).padStart(2, '0')}</div>
                  ))}
                </div>
             </motion.div>
          )}

          {step === 1 && (
             <motion.div key="addroundkey_init" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={styles.spnContainer}>
                <div className={`${styles.spnBox} ${styles.spnBoxActive}`}>
                  <span className={styles.spnBoxTitle}>AddRoundKey (Initial)</span>
                  <span className={styles.spnBoxDesc}>State = State ⊕ RoundKey[0]</span>
                  <div className={styles.matrixGrid} style={{marginTop: 12}}>
                    {Array.from({length: 16}).map((_, i) => (
                      <div key={i} className={styles.matrixCell} style={{background: 'var(--card-secondary)'}}>⊕</div>
                    ))}
                  </div>
                </div>
             </motion.div>
          )}

          {step === 2 && (
             <motion.div key="main_rounds" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={styles.spnContainer}>
                <div className={styles.spnBox} style={{borderColor: 'var(--text-subtle)', background: 'transparent'}}>
                  <span className={styles.spnBoxTitle}>Rounds 1 to {numRounds - 1}</span>
                </div>
                <div className={styles.arrowDown}><div className={styles.arrowLine}></div><div className={styles.arrowHead}></div></div>
                <div className={`${styles.spnBox} ${styles.spnBoxActive}`}>
                  <span className={styles.spnBoxTitle}>SubBytes</span>
                  <span className={styles.spnBoxDesc}>Non-linear substitution using S-Box</span>
                </div>
                <div className={styles.arrowDown}><div className={styles.arrowLine}></div><div className={styles.arrowHead}></div></div>
                <div className={`${styles.spnBox} ${styles.spnBoxActive}`}>
                  <span className={styles.spnBoxTitle}>ShiftRows</span>
                  <span className={styles.spnBoxDesc}>Cyclic shift of state rows</span>
                </div>
                <div className={styles.arrowDown}><div className={styles.arrowLine}></div><div className={styles.arrowHead}></div></div>
                <div className={`${styles.spnBox} ${styles.spnBoxActive}`}>
                  <span className={styles.spnBoxTitle}>MixColumns</span>
                  <span className={styles.spnBoxDesc}>Matrix multiplication in GF(2^8)</span>
                </div>
                <div className={styles.arrowDown}><div className={styles.arrowLine}></div><div className={styles.arrowHead}></div></div>
                <div className={`${styles.spnBox} ${styles.spnBoxActive}`}>
                  <span className={styles.spnBoxTitle}>AddRoundKey</span>
                  <span className={styles.spnBoxDesc}>XOR with RoundKey[i]</span>
                </div>
             </motion.div>
          )}

          {step === 3 && (
             <motion.div key="final_round" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={styles.spnContainer}>
                <div className={styles.spnBox} style={{borderColor: 'var(--text-subtle)', background: 'transparent'}}>
                  <span className={styles.spnBoxTitle}>Final Round ({numRounds})</span>
                </div>
                <div className={styles.arrowDown}><div className={styles.arrowLine}></div><div className={styles.arrowHead}></div></div>
                <div className={`${styles.spnBox} ${styles.spnBoxActive}`}>
                  <span className={styles.spnBoxTitle}>SubBytes</span>
                </div>
                <div className={styles.arrowDown}><div className={styles.arrowLine}></div><div className={styles.arrowHead}></div></div>
                <div className={`${styles.spnBox} ${styles.spnBoxActive}`}>
                  <span className={styles.spnBoxTitle}>ShiftRows</span>
                </div>
                <div className={styles.arrowDown}><div className={styles.arrowLine}></div><div className={styles.arrowHead}></div></div>
                <div className={`${styles.spnBox} ${styles.spnBoxActive}`}>
                  <span className={styles.spnBoxTitle}>AddRoundKey</span>
                  <span className={styles.spnBoxDesc}>MixColumns is omitted in the final round</span>
                </div>
             </motion.div>
          )}

          {step === 4 && (
             <motion.div key="output" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={styles.blockRow}>
                <div className={styles.matrixGrid}>
                  <span className={styles.blockLabel} style={{top: -24}}>Final State (4x4)</span>
                  {Array.from({length: 16}).map((_, i) => (
                    <div key={i} className={styles.matrixCell}>{(Math.random() * 255 | 0).toString(16).padStart(2, '0')}</div>
                  ))}
                </div>
                <svg width="40" height="24" viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h30M25 5l10 7-10 7"/></svg>
                <div className={`${styles.block} ${styles.spnBoxActive}`} style={{ maxWidth: 300, wordBreak: 'break-all' }}>
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
