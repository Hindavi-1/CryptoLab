"use client";
import { useSimulationPlayer } from "../lib/useSimulationPlayer";
import styles from "./AffineSimulation.module.css";

/* ── Player Controls ── */
function PlayerBar({ player, totalSteps, accentColor }) {
  const { isPlaying, isPaused, isDone, currentStep, speedMs, play, pause, resume, reset, stepForward, stepBack, setSpeed } = player;
  const notStarted = currentStep === -1;
  const pct = totalSteps > 0 ? Math.max(0, ((currentStep + 1) / totalSteps) * 100) : 0;
  
  const statusLabel = isPlaying ? "Playing" : isPaused ? "Paused" : isDone ? "Done ✓" : "Idle";
  const statusColor = isPlaying ? accentColor : isDone ? "var(--green)" : isPaused ? "var(--orange)" : "var(--text-subtle)";

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

export default function AffineSimulation({ stepsData, mode, colorVar }) {
  const accentColor = colorVar || "var(--accent)";
  const alphaSteps = stepsData.filter((s) => s.type !== "passthrough");
  
  const player = useSimulationPlayer(alphaSteps.length);
  const { currentStep } = player;
  const notStarted = currentStep === -1;

  if (alphaSteps.length === 0) return null;

  const activeIdx = notStarted ? -1 : Math.min(currentStep, alphaSteps.length - 1);
  const current = activeIdx >= 0 ? alphaSteps[activeIdx] : null;

  // Map alpha indices to full steps array to highlight correct char
  const alphaIndices = stepsData.reduce((acc, s, i) => {
    if (s.type !== "passthrough") acc.push(i);
    return acc;
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>ƒ(x) Affine Equation Visualizer</span>
        <span className={styles.subtitle}>Watch how each character is numerically transformed using the affine linear equation.</span>
      </div>

      <PlayerBar player={player} totalSteps={alphaSteps.length} accentColor={accentColor} />

      <div className={styles.contentGrid}>
        <div className={styles.leftCol}>
          {/* Alignment Strip */}
          {["Input", "Output"].map((label, rowIdx) => (
            <div className={styles.alignStrip} key={label}>
              <span className={styles.stripLabel}>{label}</span>
              <div className={styles.stripLetters}>
                {stepsData.map((s, i) => {
                  const alphaIdx = alphaIndices.indexOf(i);
                  const isActive = alphaIdx === activeIdx && s.type !== "passthrough";
                  const isDone = alphaIdx < activeIdx && s.type !== "passthrough";

                  const val = rowIdx === 0 ? s.input : s.output;
                  
                  const activeStyle = isActive ? {
                    transform: "scale(1.25)",
                    boxShadow: `0 0 12px ${accentColor}99`,
                    zIndex: 2,
                    animation: "spotlightPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
                  } : {};

                  const resultColor = rowIdx === 1
                      ? { color: "var(--green)", background: "color-mix(in srgb, var(--green) 15%, transparent)", borderColor: "var(--green)" }
                      : {};

                  return (
                    <span
                      key={i}
                      className={`${styles.stripLetter}
                        ${rowIdx === 1 ? styles.stripResult : ""}
                        ${s.type === "passthrough" ? styles.stripPass : ""}
                        ${isActive ? styles.stripActive : ""}
                      `}
                      style={{
                        ...(isDone && rowIdx > 0 ? resultColor : {}),
                        borderColor: isActive ? accentColor : "",
                        transition: "all 0.2s",
                        position: "relative",
                        ...activeStyle,
                      }}
                    >
                      {val}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Current step detail */}
          {current ? (
            <div className={styles.stepDetail} style={{ animation: "fadePop 0.3s ease both" }}>
              <div className={styles.detailBox}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>{mode === "encrypt" ? "Plaintext" : "Ciphertext"} Char</span>
                  <span className={styles.detailVal}>{current.input} <span className={styles.valSub}>(x = {current.input.toUpperCase().charCodeAt(0) - 65})</span></span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Affine Equation</span>
                  <span className={styles.detailFormula} style={{ '--f-color': accentColor }}>{current.formula}</span>
                </div>
                <div className={styles.detailRow} style={{ gridColumn: 'span 2' }}>
                  <span className={styles.detailLabel}>{mode === "encrypt" ? "Ciphertext" : "Plaintext"} Result</span>
                  <span className={styles.detailResult}>{current.output} <span className={styles.valSub}>(y = {current.output.toUpperCase().charCodeAt(0) - 65})</span></span>
                </div>
              </div>
              
              <div className={styles.equationHint}>
                <span className={styles.hintIcon}>ℹ</span>
                {mode === "encrypt" 
                  ? "C = (a × x + b) mod 26. We plug 'x' into the formula to get the numeric value 'y', which maps to the ciphertext letter."
                  : "P = a⁻¹ × (y - b) mod 26. We multiply the modulo inverse of 'a' by the shifted value to recover the plaintext letter."
                }
              </div>
            </div>
          ) : (
             <div className={styles.idleHint}>
               Press ▶ Play to step through the affine mathematical transformations…
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
