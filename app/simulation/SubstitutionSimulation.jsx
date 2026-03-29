"use client";
import { useMemo } from "react";
import { useSimulationPlayer } from "../lib/useSimulationPlayer";
import styles from "./SubstitutionSimulation.module.css";

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

export default function SubstitutionSimulation({ stepsData, mode, colorVar }) {
  const accentColor = colorVar || "var(--green)";
  const alphaSteps = stepsData.filter((s) => s.type !== "passthrough");
  
  const player = useSimulationPlayer(alphaSteps.length);
  const { currentStep } = player;
  const notStarted = currentStep === -1;

  // Build the alphabet mapping for the legend based on the steps data
  // Since we only have steps, we reconstruct the full alphabet from the provided key steps (if they cover it all)
  // Wait, stepsData only covers the input text. We cannot reconstruct the *entire* key from just the text.
  // Actually, we can just highlight the mapping occurring right now without showing the full 26-letter key
  // if the full key wasn't passed.
  
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
        <span className={styles.title}>⇄ Simple Substitution Animation</span>
        <span className={styles.subtitle}>Watch each letter map to its counterpart in the cipher alphabet.</span>
      </div>

      <PlayerBar player={player} totalSteps={alphaSteps.length} accentColor={accentColor} />

      <div className={styles.contentGrid}>
        
        {/* Mapping Animation Zone */}
        {current ? (
          <div className={styles.mappingZone}>
             <div className={styles.mapCharBox} style={{ animation: "slideDownIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both" }}>
                <span className={styles.mapLabel}>{mode === "encrypt" ? "Plaintext" : "Ciphertext"}</span>
                <span className={styles.mapCharIn}>{current.input}</span>
             </div>

             <div className={styles.mapArrowBox} style={{ animation: "fadePop 0.3s ease 0.1s both" }}>
                <span className={styles.mapArrow} style={{ color: accentColor }}>↓</span>
                <span className={styles.mapRule}>maps to</span>
             </div>

             <div className={styles.mapCharBox} style={{ animation: "slideUpIn 0.3s cubic-bezier(0.34,1.56,0.64,1) 0.15s both" }}>
                <span className={styles.mapLabel}>{mode === "encrypt" ? "Ciphertext" : "Plaintext"}</span>
                <span className={styles.mapCharOut} style={{ color: "var(--green)" }}>{current.output}</span>
             </div>
          </div>
        ) : (
          <div className={styles.idleHint}>
            Press ▶ Play to step through the substitutions…
          </div>
        )}

        {/* Text Strip */}
        <div className={styles.textTrack}>
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
                    transform: "scale(1.2)",
                    boxShadow: `0 0 12px ${accentColor}99`,
                    zIndex: 2,
                  } : {};

                  const resultColor = rowIdx === 1
                      ? { color: "var(--green)", background: "color-mix(in srgb, var(--green) 15%, transparent)", borderColor: "var(--green)" }
                      : {};

                  return (
                    <span
                      key={i}
                      className={`${styles.stripLetter}
                        ${rowIdx === 1 && (isDone || isActive) ? styles.stripResult : ""}
                        ${s.type === "passthrough" ? styles.stripPass : ""}
                        ${isActive ? styles.stripActive : ""}
                      `}
                      style={{
                        ...(isDone && rowIdx > 0 ? resultColor : {}),
                        borderColor: isActive ? accentColor : "",
                        transition: "all 0.2s",
                        ...activeStyle,
                        opacity: rowIdx === 1 && !isDone && !isActive && s.type !== "passthrough" ? 0 : 1
                      }}
                    >
                      {val}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
