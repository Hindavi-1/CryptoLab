"use client";
import { useMemo } from "react";
import { useSimulationPlayer } from "../lib/useSimulationPlayer";
import styles from "./RailFenceSimulation.module.css";

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

export default function RailFenceSimulation({ stepsData, mode, colorVar }) {
  const accentColor = colorVar || "var(--green, #10b981)";
  
  // RailFence expects stepsData to be: { type: "railfence", text: "...", rails: 3 }
  const text = stepsData?.text || "";
  const r = Math.max(2, Math.min(parseInt(stepsData?.rails) || 3, 10));
  const n = text.length;
  
  // Build cell coordinates mapping
  const cellCoords = useMemo(() => {
    if (!text) return [];
    const coords = [];
    let rail = 0;
    let dir = 1;
    for (let c = 0; c < n; c++) {
      coords.push({ r: rail, c: c, char: text[c], diagIndex: c });
      if (rail === 0) dir = 1;
      else if (rail === r - 1) dir = -1;
      rail += dir;
    }
    
    // For decryption, we need to know the row-by-row order to place the characters
    // so we sort the diagonal coords by rail to find out what character goes where.
    if (mode === "decrypt") {
      const sorted = [...coords].sort((a, b) => {
        if (a.r !== b.r) return a.r - b.r;
        return a.c - b.c;
      });
      // Replace characters based on decrypted string mapping
      sorted.forEach((item, idx) => {
        item.char = text[idx];
        item.readIndex = idx;
      });
      
      // We want to step through decryption based on *reading order* (row by row)
      return sorted.sort((a,b) => a.readIndex - b.readIndex);
    }
    
    // For encryption, we step through diagonal order
    return coords;
  }, [text, r, mode]);

  const player = useSimulationPlayer(n);
  const { currentStep } = player;

  if (!text) return null;

  // Render grid structure
  const activeCells = cellCoords.slice(0, currentStep + 1);
  const grid = Array.from({ length: r }, () => new Array(n).fill(null));
  
  // Pre-fill path with empty placeholders so the grid doesn't collapse
  cellCoords.forEach(item => {
    grid[item.r][item.c] = { char: "", isActive: false, isPath: true };
  });

  // Fill active characters
  activeCells.forEach((item, idx) => {
    grid[item.r][item.c] = { 
      char: item.char, 
      isActive: idx === currentStep, 
      isPath: true,
      fadeIn: true
    };
  });

  const RAIL_COLORS = [
    "var(--accent)", "var(--purple)", "var(--green)", "var(--orange)",
    "#ec4899", "#14b8a6", "#f59e0b", "#6366f1"
  ];

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>⫝̸ Rail Fence Zigzag Animation</span>
        <span className={styles.subtitle}>
          {mode === "encrypt" 
            ? "Characters are placed diagonally across the rails, then read left-to-right, top-to-bottom."
            : "Ciphertext is placed back onto the diagonal path rail-by-rail, then read out diagonally."}
        </span>
      </div>

      <PlayerBar player={player} totalSteps={n} accentColor={accentColor} />

      <div className={styles.gridContainer}>
        <div className={styles.rfGrid}>
          {grid.map((row, ri) => (
            <div key={ri} className={styles.rfRow}>
              <div className={styles.rfRailLabel} style={{ color: RAIL_COLORS[ri % RAIL_COLORS.length] }}>
                Rail {ri + 1}
              </div>
              <div className={styles.rfCells}>
                {row.map((cellObj, ci) => {
                  if (!cellObj) return <div key={ci} className={styles.rfCellEmpty} />;
                  
                  return (
                    <div
                      key={ci}
                      className={`${styles.rfCell} ${cellObj.isActive ? styles.rfCellActive : ""} ${cellObj.char ? styles.rfCellFilled : ""}`}
                      style={{
                        borderColor: cellObj.char ? RAIL_COLORS[ri % RAIL_COLORS.length] : "var(--border)",
                        background: cellObj.isActive ? RAIL_COLORS[ri % RAIL_COLORS.length] : cellObj.char ? `${RAIL_COLORS[ri % RAIL_COLORS.length]}22` : "transparent",
                        color: cellObj.isActive ? "#fff" : cellObj.char ? RAIL_COLORS[ri % RAIL_COLORS.length] : "transparent",
                        animation: cellObj.fadeIn && cellObj.isActive ? "cellPopIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both" : "none"
                      }}
                    >
                      {cellObj.char || "·"}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {/* Output Readout Sequence */}
        {mode === "encrypt" && currentStep >= 0 && (
           <div className={styles.outputReadout}>
             <span className={styles.readoutLabel}>Reading Rail-by-Rail:</span>
             <div className={styles.readoutTokens}>
               {Array.from({ length: r }).map((_, ri) => {
                  const itemsOnRail = activeCells.filter(c => c.r === ri).sort((a,b) => a.c - b.c);
                  if (itemsOnRail.length === 0) return null;
                  return (
                    <span key={ri} className={styles.readoutChunk} style={{ color: RAIL_COLORS[ri % RAIL_COLORS.length], borderColor: `${RAIL_COLORS[ri % RAIL_COLORS.length]}55`, background: `${RAIL_COLORS[ri % RAIL_COLORS.length]}11` }}>
                      {itemsOnRail.map(c => c.char).join("")}
                    </span>
                  );
               })}
             </div>
           </div>
        )}
        
        {mode === "decrypt" && currentStep >= 0 && (
           <div className={styles.outputReadout}>
             <span className={styles.readoutLabel}>Reading Diagonally:</span>
             <div className={styles.readoutTokens}>
               <span className={styles.readoutChunk} style={{ color: accentColor, borderColor: `${accentColor}55`, background: `${accentColor}11`, letterSpacing: '4px', paddingLeft: '8px' }}>
                 {activeCells.sort((a,b) => a.c - b.c).map(c => c.char).join("")}
               </span>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
