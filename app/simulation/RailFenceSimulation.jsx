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
  const { phase1Coords, phase2Coords } = useMemo(() => {
    if (!text) return { phase1Coords: [], phase2Coords: [] };
    
    // 1. Calculate the zigzag positions (diagCoords)
    const diagCoords = [];
    let rail = 0;
    let dir = 1;
    for (let c = 0; c < n; c++) {
      diagCoords.push({ r: rail, c: c, diagIndex: c });
      if (rail === 0) dir = 1;
      else if (rail === r - 1) dir = -1;
      rail += dir;
    }
    
    if (mode === "encrypt") {
      // Writing: Diagonal (Zigzag)
      const p1 = diagCoords.map((coord, i) => ({ ...coord, char: text[i], stepIdx: i }));
      // Reading: Row-by-Row
      const p2 = [...p1].sort((a, b) => a.r - b.r || a.c - b.c).map((coord, i) => ({ ...coord, stepIdx: n + i }));
      return { phase1Coords: p1, phase2Coords: p2 };
    } else {
      // Decryption
      // Writing: Row-by-Row (but placed at zigzag positions)
      const sortedByRow = [...diagCoords].sort((a, b) => a.r - b.r || a.c - b.c);
      const p1 = sortedByRow.map((coord, i) => ({ ...coord, char: text[i], stepIdx: i }));
      // Reading: Diagonal (Zigzag)
      const p2 = [...p1].sort((a, b) => a.diagIndex - b.diagIndex).map((coord, i) => ({ ...coord, stepIdx: n + i }));
      return { phase1Coords: p1, phase2Coords: p2 };
    }
  }, [text, r, mode, n]);

  const player = useSimulationPlayer(n * 2);
  const { currentStep } = player;

  if (!text) return null;

  // Render grid structure
  const activeCellsP1 = phase1Coords.filter(c => c.stepIdx <= currentStep);
  const activeCellsP2 = phase2Coords.filter(c => c.stepIdx <= currentStep);
  const allActiveCells = [...activeCellsP1, ...activeCellsP2];
  
  const grid = Array.from({ length: r }, () => new Array(n).fill(null));
  
  // Pre-fill path with empty placeholders
  phase1Coords.forEach(item => {
    grid[item.r][item.c] = { char: "", isActive: false, isPath: true };
  });

  // Fill active characters from Phase 1
  activeCellsP1.forEach((item) => {
    grid[item.r][item.c] = { 
      char: item.char, 
      isActive: item.stepIdx === currentStep, 
      isPath: true,
      fadeIn: true
    };
  });

  // Highlight active character from Phase 2
  activeCellsP2.forEach((item) => {
    if (item.stepIdx === currentStep) {
      grid[item.r][item.c].isActive = true;
    }
  });

  const RAIL_COLORS = [
    "var(--accent)", "var(--purple)", "var(--green)", "var(--orange)",
    "#ec4899", "#14b8a6", "#f59e0b", "#6366f1"
  ];
  
  const READING_COLOR = mode === "encrypt" ? "#f59e0b" : "var(--accent)"; // Color for Phase 2 arrows

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>⫝̸ Rail Fence Zigzag Animation</span>
        <span className={styles.subtitle}>
          {mode === "encrypt" 
            ? (currentStep < n ? "Phase 1: Writing characters diagonally across rails." : "Phase 2: Reading characters row-by-row to form ciphertext.")
            : (currentStep < n ? "Phase 1: Placing ciphertext characters row-by-row onto the zigzag path." : "Phase 2: Reading plaintext diagonally along the zigzag path.")}
        </span>
      </div>

      <PlayerBar player={player} totalSteps={n * 2} accentColor={accentColor} />

      <div className={styles.gridContainer}>
        <div className={styles.rfGrid}>
          {/* SVG Overlay for Path Arrows */}
          <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
            <defs>
              <marker id="arrow-p1" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto" fill={accentColor}>
                <polygon points="0 0, 6 3, 0 6" />
              </marker>
              <marker id="arrow-p2" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto" fill={READING_COLOR}>
                <polygon points="0 0, 6 3, 0 6" />
              </marker>
              <marker id="arrow-dotted" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto" fill={accentColor} opacity="0.4">
                <polygon points="0 0, 6 3, 0 6" />
              </marker>
            </defs>
            
            {/* Phase 1 Arrows */}
            {phase1Coords.map((item, idx) => {
              if (idx === 0) return null;
              const prev = phase1Coords[idx - 1];
              const x1 = 97 + prev.c * 36;
              const y1 = 16 + prev.r * 40;
              const x2 = 97 + item.c * 36;
              const y2 = 16 + item.r * 40;
              
              const dx = x2 - x1;
              const dy = y2 - y1;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist === 0) return null;

              const isPassed = currentStep >= item.stepIdx;
              const isPhase2Active = currentStep >= n;
              
              if (!isPassed && !isPhase2Active) return null;

              const opacity = isPhase2Active ? 0.2 : 0.8;
              const strokeDasharray = isPhase2Active ? "3 3" : "none";
              const marker = isPhase2Active ? "url(#arrow-dotted)" : "url(#arrow-p1)";

              return (
                <line
                  key={`p1-${idx}`}
                  x1={x1 + (dx/dist)*16} y1={y1 + (dy/dist)*16}
                  x2={x2 - (dx/dist)*20} y2={y2 - (dy/dist)*20}
                  stroke={accentColor} strokeWidth="2" strokeOpacity={opacity}
                  strokeDasharray={strokeDasharray} markerEnd={marker}
                  style={{ transition: "all 0.4s ease" }}
                />
              );
            })}

            {/* Phase 2 Arrows */}
            {currentStep >= n && phase2Coords.map((item, idx) => {
              if (idx === 0) return null;
              const prev = phase2Coords[idx - 1];
              const x1 = 97 + prev.c * 36;
              const y1 = 16 + prev.r * 40;
              const x2 = 97 + item.c * 36;
              const y2 = 16 + item.r * 40;
              
              const dx = x2 - x1;
              const dy = y2 - y1;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist === 0) return null;

              const isPassed = currentStep >= item.stepIdx;
              if (!isPassed) return null;

              return (
                <line
                  key={`p2-${idx}`}
                  x1={x1 + (dx/dist)*16} y1={y1 + (dy/dist)*16}
                  x2={x2 - (dx/dist)*20} y2={y2 - (dy/dist)*20}
                  stroke={READING_COLOR} strokeWidth="2.5" strokeOpacity="0.9"
                  markerEnd="url(#arrow-p2)"
                  style={{ transition: "all 0.4s ease" }}
                />
              );
            })}
          </svg>

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
             <span className={styles.readoutLabel}>
               {currentStep < n ? "Building Rails..." : "Reading Ciphertext:"}
             </span>
             <div className={styles.readoutTokens}>
               {Array.from({ length: r }).map((_, ri) => {
                  const itemsOnRail = activeCellsP1.filter(c => c.r === ri).sort((a,b) => a.c - b.c);
                  if (itemsOnRail.length === 0) return null;
                  const isReadingThisRail = currentStep >= n && activeCellsP2.some(c => c.r === ri && c.stepIdx === currentStep);
                  return (
                    <span key={ri} className={styles.readoutChunk} style={{ 
                      color: RAIL_COLORS[ri % RAIL_COLORS.length], 
                      borderColor: isReadingThisRail ? RAIL_COLORS[ri % RAIL_COLORS.length] : `${RAIL_COLORS[ri % RAIL_COLORS.length]}55`, 
                      background: isReadingThisRail ? `${RAIL_COLORS[ri % RAIL_COLORS.length]}33` : `${RAIL_COLORS[ri % RAIL_COLORS.length]}11`,
                      transform: isReadingThisRail ? "scale(1.05)" : "scale(1)",
                      transition: "all 0.2s"
                    }}>
                      {itemsOnRail.map(c => c.char).join("")}
                    </span>
                  );
               })}
             </div>
           </div>
        )}
        
        {mode === "decrypt" && currentStep >= 0 && (
           <div className={styles.outputReadout}>
             <span className={styles.readoutLabel}>
               {currentStep < n ? "Filling Rails..." : "Resulting Plaintext:"}
             </span>
             <div className={styles.readoutTokens}>
               <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                 {Array.from({ length: n }).map((_, cIdx) => {
                   const cell = allActiveCells.find(c => c.c === cIdx);
                   const isReadingThis = currentStep >= n && activeCellsP2.some(c => c.c === cIdx && c.stepIdx === currentStep);
                   return (
                     <span key={cIdx} className={styles.rfCell} style={{ 
                       width: '28px', height: '28px', fontSize: '0.9rem',
                       borderColor: isReadingThis ? "var(--green)" : cell ? accentColor : "var(--border)",
                       background: isReadingThis ? "var(--green-bg)" : cell ? `${accentColor}22` : "transparent",
                       color: isReadingThis ? "var(--green)" : cell ? accentColor : "transparent",
                       borderStyle: cell ? "solid" : "dashed",
                       transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                       transform: isReadingThis ? "scale(1.2)" : cell ? "scale(1)" : "scale(0.95)",
                       zIndex: isReadingThis ? 5 : 1
                     }}>
                       {cell ? cell.char : ""}
                     </span>
                   );
                 })}
               </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
