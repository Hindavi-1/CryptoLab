"use client";
import { useSimulationPlayer } from "../lib/useSimulationPlayer";
import styles from "./HillSimulation.module.css";

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

export default function HillSimulation({ stepsData, mode, colorVar }) {
  const accentColor = colorVar || "var(--orange)";
  const { matrixSize, operatingKey, steps } = stepsData;
  
  const player = useSimulationPlayer(steps.length);
  const { currentStep } = player;
  const notStarted = currentStep === -1;

  if (steps.length === 0) return null;

  const activeIdx = notStarted ? -1 : Math.min(currentStep, steps.length - 1);
  const current = activeIdx >= 0 ? steps[activeIdx] : null;

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>▦ Hill Matrix Multiplication</span>
        <span className={styles.subtitle}>
          Visualizing the matrix multiplication applied to blocks of {matrixSize} characters.
        </span>
      </div>

      <PlayerBar player={player} totalSteps={steps.length} accentColor={accentColor} />

      <div className={styles.mainGrid}>
        
        {/* Full Text Row visualizer */}
        <div className={styles.textTrack}>
          <div className={styles.trackLabel}>Blocks of size {matrixSize}:</div>
          <div className={styles.blocks}>
            {steps.map((block, i) => {
              const isActive = i === activeIdx;
              const isPast = i <= activeIdx;
              return (
                <div key={i} className={`${styles.charBlock} ${isActive ? styles.blockActive : isPast ? styles.blockPast : ""}`}
                     style={{
                       borderColor: isActive ? accentColor : isPast ? "var(--green)" : "var(--border)",
                       background: isActive ? `color-mix(in srgb, ${accentColor} 15%, transparent)` : isPast ? "color-mix(in srgb, var(--green) 10%, transparent)" : "transparent"
                     }}>
                  <div className={styles.blockRowIn}>
                    {block.inputChars.join("")}
                  </div>
                  {isPast && (
                    <div className={styles.blockRowOut} style={{ color: "var(--green)" }}>
                      ↓<br/>{block.outputChars.join("")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Matrix Math visualizer */}
        <div className={styles.mathZone}>
          {current ? (
            <div className={styles.equationGrid} style={{ animation: "fadeUp 0.3s ease both" }}>
              {/* Key Matrix */}
              <div className={styles.matrixContainer}>
                <div className={styles.matrixBracket} />
                <div className={styles.matrixBox} style={{ gridTemplateColumns: `repeat(${matrixSize}, 1fr)` }}>
                  {operatingKey.flatMap((row, r) => row.map((val, c) => (
                    <span key={`k-${r}-${c}`} className={styles.matrixCell} style={{ color: accentColor }}>{val}</span>
                  )))}
                </div>
                <div className={styles.matrixBracketRight} />
              </div>

              <span className={styles.mathOp}>×</span>

              {/* Input Vector */}
              <div className={styles.matrixContainer}>
                <div className={styles.matrixBracket} />
                <div className={styles.matrixBox} style={{ gridTemplateColumns: `1fr` }}>
                  {current.inputVec.map((val, r) => (
                    <span key={`v-${r}`} className={styles.matrixCell}>
                      {val} <span className={styles.matrixChar}>({current.inputChars[r]})</span>
                    </span>
                  ))}
                </div>
                <div className={styles.matrixBracketRight} />
              </div>

              <span className={styles.mathOp}>=</span>

              {/* Formula & Modulo Result Vector */}
              <div className={styles.matrixContainer}>
                <div className={styles.matrixBracket} />
                <div className={styles.matrixBox} style={{ gridTemplateColumns: `1fr` }}>
                  {current.outputVec.map((val, r) => (
                    <span key={`res-${r}`} className={styles.resultCell}>
                      <span className={styles.resultFormula}>{current.formulas[r]}</span>
                      <span className={styles.resultMod}>mod 26 = <strong style={{ color: "var(--green)" }}>{val}</strong></span>
                      <span className={styles.resultChar} style={{ color: "var(--green)" }}>({current.outputChars[r]})</span>
                    </span>
                  ))}
                </div>
                <div className={styles.matrixBracketRight} />
              </div>

            </div>
          ) : (
            <div className={styles.idleHint}>
               Press ▶ Play to step through the block multiplications…
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
