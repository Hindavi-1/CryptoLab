"use client";
import { useEffect, useRef } from "react";
import { useSimulationPlayer } from "../lib/useSimulationPlayer";
import styles from "./CaesarSimulation.module.css";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/* ── Player Controls ── */
function PlayerBar({ player, totalSteps, accentColor }) {
  const { isPlaying, isPaused, isDone, currentStep, speedMs, play, pause, resume, reset, stepForward, stepBack, setSpeed } = player;
  const notStarted = currentStep === -1;
  const pct = totalSteps > 0 ? Math.max(0, ((currentStep + 1) / totalSteps) * 100) : 0;
  
  const statusLabel = isPlaying ? "Playing" : isPaused ? "Paused" : isDone ? "Done ✓" : "Idle";
  const statusColor = isPlaying ? accentColor : isDone ? "var(--green, #14b8a6)" : isPaused ? "var(--orange, #f59e0b)" : "var(--text-subtle)";

  return (
    <div className={styles.playerOuter}>
      <div className={styles.progressRow}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${pct}%`, backgroundColor: accentColor }} />
        </div>
        <span className={styles.progressText} style={{ color: statusColor }}>
          {notStarted ? "—" : `${Math.max(0, currentStep + 1)} / ${totalSteps}`}
        </span>
        <span className={styles.statusBadge} style={{ color: statusColor, borderColor: `${statusColor}55`, background: `${statusColor}18` }}>
          {isPlaying && <span className={styles.statusDot} style={{ background: accentColor }} />}
          {statusLabel}
        </span>
      </div>

      <div className={styles.playerBar}>
        <div className={styles.playerBtns}>
          {notStarted || isDone ? (
            <button className={`${styles.pBtn} ${styles.pBtnPrimary}`} style={{ background: accentColor, borderColor: accentColor }} onClick={play}>▶ Play</button>
          ) : isPlaying ? (
            <button className={`${styles.pBtn} ${styles.pBtnPrimary}`} style={{ background: accentColor, borderColor: accentColor }} onClick={pause}>⏸ Pause</button>
          ) : (
            <button className={`${styles.pBtn} ${styles.pBtnPrimary}`} style={{ background: accentColor, borderColor: accentColor }} onClick={resume}>▶ Resume</button>
          )}
          <button className={styles.pBtn} onClick={stepBack} disabled={notStarted || currentStep <= 0}>⏮ Back</button>
          <button className={styles.pBtn} onClick={() => notStarted ? play() : stepForward()} disabled={!notStarted && currentStep >= totalSteps - 1}>Step ⏭</button>
          <button className={styles.pBtn} onClick={reset} disabled={notStarted}>↺ Restart</button>
        </div>
        <div className={styles.speedGroup}>
          <span className={styles.speedLabel}>Speed</span>
          <select className={styles.speedSel} value={speedMs} onChange={(e) => setSpeed(Number(e.target.value))}>
            <option value={3600}>0.25×</option>
            <option value={1600}>0.5×</option>
            <option value={900}>1×</option>
            <option value={450}>2×</option>
            <option value={200}>4×</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default function CaesarSimulation({ stepsData, mode, colorVar }) {
  const accentColor = colorVar || "var(--accent, #3b82f6)";
  
  // We only step through alphabetic characters, passthroughs are ignored in steps
  const alphaSteps = stepsData.filter(s => s.type !== "passthrough");
  const player = useSimulationPlayer(alphaSteps.length);
  const { currentStep } = player;
  const notStarted = currentStep === -1;
  
  if (!stepsData || stepsData.length === 0) return null;

  const activeIdx = notStarted ? -1 : Math.min(currentStep, alphaSteps.length - 1);
  const current = activeIdx >= 0 ? alphaSteps[activeIdx] : null;

  // Map alpha step indices to original string positions
  const alphaIndices = stepsData.reduce((acc, s, i) => {
    if (s.type !== "passthrough") acc.push(i);
    return acc;
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>🔍 Caesar Shift Visualizer</span>
        <span className={styles.subtitle}>Watch each character shift along the alphabet</span>
      </div>

      <PlayerBar player={player} totalSteps={alphaSteps.length} accentColor={accentColor} />

      {/* Alignment strip */}
      <div className={styles.stripSection}>
        {["Plaintext", "Ciphertext"].map((label, rowIdx) => {
          const isEncrypt = mode === "encrypt";
          // If we are encrypting: Plaintext is input, Ciphertext is output
          // If we are decrypting: Ciphertext is input, Plaintext is output
          // We want the literal top row to be Plaintext and bottom Ciphertext always
          const isTopInput = isEncrypt; 
          
          return (
            <div className={styles.alignStrip} key={label}>
              <span className={styles.stripLabel}>{label}</span>
              <div className={styles.stripLetters}>
                {stepsData.map((s, i) => {
                  const alphaIdx = alphaIndices.indexOf(i);
                  const isActive = alphaIdx === activeIdx && s.type !== "passthrough";
                  const isDone = alphaIdx < activeIdx && s.type !== "passthrough";

                  let val = " ";
                  if (s.type === "passthrough") {
                    val = s.input;
                  } else {
                    if (rowIdx === 0) val = isEncrypt ? s.input : s.output;
                    if (rowIdx === 1) val = isEncrypt ? s.output : s.input;
                  }

                  const activeStyle = isActive ? {
                    transform: "scale(1.2)",
                    boxShadow: `0 0 12px ${accentColor}99`,
                    zIndex: 2,
                    borderColor: accentColor,
                    animation: "spotlightPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
                  } : {};

                  const doneColor = { color: accentColor, background: `${accentColor}11`, borderColor: `${accentColor}55` };

                  return (
                    <span
                      key={i}
                      className={`${styles.stripLetter} 
                        ${s.type === "passthrough" ? styles.stripPass : ""} 
                        ${isActive ? styles.stripActive : ""}
                      `}
                      style={{
                        ...(isDone ? doneColor : {}),
                        transition: "all 0.2s",
                        position: "relative",
                        ...activeStyle,
                      }}
                    >
                      {val === " " ? "·" : val}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.mainVis}>
        {/* Animated shift detail */}
        {current ? (
          <div className={styles.interactiveBox} style={{ animation: "fadePop 0.3s ease both" }}>
            <div className={styles.formulaLine}>
              <span className={styles.badge} style={{ background: accentColor }}>Step {activeIdx + 1}</span>
              <span className={styles.formulaText}>{current.formula}</span>
            </div>
            <div className={styles.shiftDiagram}>
              <div className={styles.shiftCharBox}>
                <span className={styles.shiftCharLabel}>Input</span>
                <span className={styles.shiftChar}>{current.input}</span>
                <span className={styles.shiftCharCode}>[{current.inputCode}]</span>
              </div>
              <div className={styles.shiftArrowBox}>
                <span className={styles.shiftArrow} style={{ color: accentColor }}>→</span>
                <span className={styles.shiftOp}>
                  {mode === "encrypt" ? `+${current.effectiveShift || current.shift}` : `-${current.effectiveShift || current.shift}`}
                </span>
              </div>
              <div className={styles.shiftCharBox}>
                <span className={styles.shiftCharLabel}>Output</span>
                <span className={styles.shiftChar} style={{ color: accentColor }}>{current.output}</span>
                <span className={styles.shiftCharCode}>[{current.outputCode}]</span>
              </div>
            </div>

            {/* Alphabet Timeline */}
            <div className={styles.alphaTimeline}>
               <div className={styles.timelineTrack} />
               {ALPHABET.split("").map((l, i) => {
                 const isInput = i === current.inputCode;
                 const isOutput = i === current.outputCode;
                 const isActive = isInput || isOutput;
                 
                 return (
                   <div key={l} className={`${styles.timelineItem} ${isActive ? styles.timelineActive : ""}`}>
                     <span className={styles.timelineLetter} style={{ 
                       color: isOutput ? accentColor : isInput ? "var(--foreground)" : "",
                       fontWeight: isActive ? "bold" : "normal",
                       transform: isActive ? "scale(1.2)" : "none"
                     }}>
                       {l}
                     </span>
                     <span className={styles.timelineIdx} style={{ 
                       background: isOutput ? accentColor : isInput ? "var(--text-subtle)" : "",
                       color: isOutput || isInput ? "white" : ""
                     }}>{i}</span>
                   </div>
                 );
               })}
               
               {/* Arrow Line Connecting Input and Output Code */}
               <div className={styles.arrowConnection} style={{ 
                 left: `calc(${(current.inputCode / 25) * 100}%)`, 
                 width: `calc(${(Math.abs(current.outputCode - current.inputCode) / 25) * 100}%)`,
                 transformOrigin: current.outputCode > current.inputCode ? 'left center' : 'right center',
                 background: accentColor,
               }}>
                 <div className={styles.arrowHead} style={{
                   [current.outputCode > current.inputCode ? 'right' : 'left']: -4,
                   borderLeftColor: current.outputCode > current.inputCode ? accentColor : 'transparent',
                   borderRightColor: current.outputCode < current.inputCode ? accentColor : 'transparent',
                 }} />
               </div>
            </div>
          </div>
        ) : (
          <div className={styles.idleHint}>
            Press ▶ Play to begin the step-by-step cipher animation...
          </div>
        )}
      </div>
    </div>
  );
}
