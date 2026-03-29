"use client";
import { useMemo } from "react";
import { useSimulationPlayer } from "../lib/useSimulationPlayer";
import styles from "./ColumnarSimulation.module.css";

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

export default function ColumnarSimulation({ trace, mode, colorVar }) {
  const accentColor = colorVar || "var(--purple, #7c3aed)";
  const { keyword, ranks, readOrder, grid, paddedPlain, nRows, nCols, ciphertext, plaintext } = trace;
  
  const N = nRows * nCols;
  const player = useSimulationPlayer(N * 2);
  const { currentStep } = player;

  // Pre-calculate cell writing and reading order mapping based on mode
  const cellSteps = useMemo(() => {
    const coords = [];
    if (mode === "encrypt") {
      // Phase 1 Writing: Row by row
      for (let r = 0; r < nRows; r++) {
        for (let c = 0; c < nCols; c++) {
          coords.push({ r, c, phase: 1 });
        }
      }
      // Phase 2 Reading: Column by column (in readOrder)
      for (const col of readOrder) {
        for (let r = 0; r < nRows; r++) {
          coords.push({ r, c: col, phase: 2 });
        }
      }
    } else {
      // Phase 1 Writing: Column by column (in readOrder)
      for (const col of readOrder) {
        for (let r = 0; r < nRows; r++) {
          coords.push({ r, c: col, phase: 1 });
        }
      }
      // Phase 2 Reading: Row by row
      for (let r = 0; r < nRows; r++) {
        for (let c = 0; c < nCols; c++) {
          coords.push({ r, c, phase: 2 });
        }
      }
    }
    return coords;
  }, [mode, nRows, nCols, readOrder]);

  const activeUntilPhase1 = cellSteps.slice(0, Math.min(currentStep + 1, N));
  const activeUntilPhase2 = currentStep >= N ? cellSteps.slice(N, currentStep + 1) : [];
  
  const isPhase1 = currentStep < N;
  const isPhase2 = currentStep >= N;
  
  const currentCell = currentStep >= 0 && currentStep < N * 2 ? cellSteps[currentStep] : null;

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>▤ Columnar Transposition Animation</span>
        <span className={styles.subtitle}>
          {mode === "encrypt" 
            ? "Phase 1: Write row-by-row. Phase 2: Read column-by-column in rank order."
            : "Phase 1: Write column-by-column in rank order. Phase 2: Read row-by-row."}
        </span>
      </div>

      <PlayerBar player={player} totalSteps={N * 2} accentColor={accentColor} />

      <div className={styles.statusRow}>
        <div key={isPhase1 ? 'writing' : 'reading'} 
             className={`${styles.phaseBadge} ${isPhase1 ? styles.phaseWriting : styles.phaseReading}`}
             style={{ '--phase-color': isPhase1 ? accentColor : "var(--orange)" }}>
          <span className={styles.phaseIcon}>{isPhase1 ? "✎" : "🔍"}</span>
          <span className={styles.phaseText}>
            {mode === "encrypt" 
              ? (isPhase1 ? "Writing Plaintext into Grid" : "Extracting Columns to Ciphertext")
              : (isPhase1 ? "Filling Columns with Ciphertext" : "Extracting Rows to Plaintext")}
          </span>
        </div>
      </div>

      <div className={styles.gridContainer}>
        {/* Table representation */}
        <div className={styles.tableWrapper}>
          <table className={styles.colTable}>
            <thead>
              <tr>
                {keyword.split('').map((char, c) => {
                  const isActiveCol = isPhase2 && currentCell && currentCell.c === c;
                  return (
                    <th key={c} className={`${styles.colHeader} ${isActiveCol ? styles.colHeaderActive : ""}`}
                        style={isActiveCol ? { background: accentColor, color: '#fff', borderColor: accentColor } : {}}>
                      <div className={styles.keyChar}>{char}</div>
                      <div className={styles.keyRank}>{ranks[c]}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {grid.map((rowArr, r) => (
                <tr key={r}>
                  {rowArr.map((char, c) => {
                    const writtenOnce = activeUntilPhase1.some(step => step.r === r && step.c === c);
                    const readOnce = activeUntilPhase2.some(step => step.r === r && step.c === c);
                    const isActive = currentCell && currentCell.r === r && currentCell.c === c;
                    
                    const showChar = writtenOnce; 
                    const isFaded = isPhase2 && !readOnce;

                    return (
                      <td key={c} 
                          className={`${styles.cell} ${isActive ? styles.cellActive : ""} ${isFaded ? styles.cellFaded : ""}`}
                          style={isActive ? { 
                            background: `linear-gradient(135deg, ${accentColor}, var(--purple))`,
                            color: '#fff',
                            transform: 'scale(1.15)',
                            zIndex: 2,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                          } : readOnce ? {
                            color: "var(--orange)",
                            background: "color-mix(in srgb, var(--orange) 10%, transparent)",
                            borderColor: "color-mix(in srgb, var(--orange) 30%, transparent)"
                          } : writtenOnce ? {
                            color: accentColor,
                          } : {}}>
                        {showChar ? char : ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Output Readout Sequence */}
        {currentStep >= N && (
           <div className={styles.outputReadout}>
             <span className={styles.readoutLabel}>
               {mode === "encrypt" ? "Building Ciphertext:" : "Building Plaintext:"}
             </span>
             <div className={styles.readoutTokens}>
                 {activeUntilPhase2.map((step, idx) => (
                   <span key={idx} className={styles.readoutChar} 
                         style={{ 
                           color: 'var(--orange)', 
                           borderColor: step === currentCell ? 'var(--orange)' : 'var(--border)',
                           background: step === currentCell ? 'color-mix(in srgb, var(--orange) 10%, transparent)' : 'transparent',
                           transform: step === currentCell ? 'scale(1.15)' : 'scale(1)'
                         }}>
                     {grid[step.r][step.c]}
                   </span>
                 ))}
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
