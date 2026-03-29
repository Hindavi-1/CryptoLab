"use client";
import { useEffect, useRef } from "react";
import { useSimulationPlayer } from "../lib/useSimulationPlayer";
import styles from "./PlayfairSimulation.module.css";

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
        <span className={styles.pInfo} style={{ color: statusColor }}>
          {notStarted ? "—" : `Pair ${Math.max(0, currentStep + 1)} of ${totalSteps}`}
        </span>
        <span className={styles.statusBadge} style={{ color: statusColor, borderColor: `${statusColor}55`, background: `${statusColor}15` }}>
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

      {/* Progress dots */}
      <div className={styles.pairDots}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <span
            key={i}
            className={`${styles.pDot} ${i < currentStep + 1 ? styles.pDotDone : ""} ${i === currentStep ? styles.pDotActive : ""}`}
            style={i <= currentStep ? { background: accentColor } : {}}
            title={`Pair ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── 5×5 Matrix with highlighted cells ── */
function KeyMatrix({ square, highlightA, highlightB, highlightOutA, highlightOutB, accentColor, rule }) {
  const ruleColor = rule === "Row" ? "var(--green)" : rule === "Col" ? "var(--purple, #7c3aed)" : "var(--orange)";

  return (
    <div className={styles.matrixWrap}>
      <div className={styles.matrixHeader}>
        <span className={styles.matrixTitle}>5×5 Key Matrix</span>
        {rule && (
          <span className={styles.ruleBadge} style={{ background: `${ruleColor}22`, color: ruleColor, borderColor: `${ruleColor}55` }}>
            {rule === "Row" ? "↔ Row Rule" : rule === "Col" ? "↕ Column Rule" : "⬛ Rectangle Rule"}
          </span>
        )}
      </div>

      <div className={styles.matrixGrid}>
        {square.map((char, i) => {
          const posA = highlightA === i;
          const posB = highlightB === i;
          const posOutA = highlightOutA === i;
          const posOutB = highlightOutB === i;
          const isInput = posA || posB;
          const isOutput = posOutA || posOutB;

          return (
            <div
              key={i}
              className={`${styles.mCell}
                ${isInput ? styles.mCellInput : ""}
                ${isOutput ? styles.mCellOutput : ""}
              `}
              style={{
                background: isInput ? `${accentColor}33`
                  : isOutput ? "var(--green-bg, #14b8a622)"
                    : "",
                borderColor: isInput ? accentColor
                  : isOutput ? "var(--green)"
                    : "",
                color: isInput ? accentColor
                  : isOutput ? "var(--green)"
                    : "",
                boxShadow: isInput ? `0 0 12px ${accentColor}66`
                  : isOutput ? "0 0 10px var(--green-glow, #14b8a655)"
                    : "",
                animation: (isInput || isOutput) ? "mCellPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both" : "none",
              }}
            >
              {char}
              {(posA || posB) && <span className={styles.mCellBadge} style={{ background: accentColor }}>in</span>}
              {(posOutA || posOutB) && <span className={styles.mCellBadge} style={{ background: "var(--green)" }}>out</span>}
            </div>
          );
        })}
      </div>
      <p className={styles.matrixNote}>ℹ J is merged with I</p>

      {/* SVG connector lines */}
      {rule && highlightA != null && highlightOutA != null && (
        <MatrixConnector
          square={square}
          inA={highlightA} inB={highlightB}
          outA={highlightOutA} outB={highlightOutB}
          rule={rule}
          color={ruleColor}
        />
      )}
    </div>
  );
}

/* ── SVG connector lines over the matrix grid ── */
function MatrixConnector({ inA, inB, outA, outB, rule, color }) {
  const cellSize = 44;
  const gap = 4;
  const step = cellSize + gap;

  const cx = (idx) => (idx % 5) * step + cellSize / 2;
  const cy = (idx) => Math.floor(idx / 5) * step + cellSize / 2;

  const points = [
    [cx(inA), cy(inA)],
    [cx(outA), cy(outA)],
    [cx(inB), cy(inB)],
    [cx(outB), cy(outB)],
  ];

  const totalW = 5 * step;
  const totalH = 5 * step;

  return (
    <svg
      className={styles.connectorSvg}
      viewBox={`0 0 ${totalW} ${totalH}`}
      style={{ width: totalW, height: totalH }}
      aria-hidden
    >
      {/* Input → Output A */}
      <line
        x1={cx(inA)} y1={cy(inA)} x2={cx(outA)} y2={cy(outA)}
        stroke={color} strokeWidth="2" strokeDasharray="6 3" strokeOpacity="0.6"
        style={{ animation: "lineGrowSvg 0.5s ease both" }}
      />
      {/* Input → Output B */}
      <line
        x1={cx(inB)} y1={cy(inB)} x2={cx(outB)} y2={cy(outB)}
        stroke={color} strokeWidth="2" strokeDasharray="6 3" strokeOpacity="0.6"
        style={{ animation: "lineGrowSvg 0.5s 0.1s ease both" }}
      />
    </svg>
  );
}

/* ── Main Component ── */
export default function PlayfairSimulation({ stepsData, mode, colorVar }) {
  const accentColor = colorVar || "var(--orange)";
  if (!stepsData || !stepsData.square || stepsData.square.length === 0) return null;

  const { square, steps } = stepsData;
  const player = useSimulationPlayer(steps.length);
  const { currentStep } = player;

  const notStarted = currentStep === -1;
  const activeStep = notStarted ? null : steps[Math.min(currentStep, steps.length - 1)];

  // Get matrix positions for input/output chars
  const findPos = (char) => square.indexOf(char === "J" ? "I" : char);

  let hlInA = null, hlInB = null, hlOutA = null, hlOutB = null;
  if (activeStep) {
    hlInA = findPos(activeStep.input[0]);
    hlInB = findPos(activeStep.input[1]);
    hlOutA = findPos(activeStep.output[0]);
    hlOutB = findPos(activeStep.output[1]);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Playfair Transformation</h3>
        <p className={styles.subtitle}>
          {mode === "encrypt" ? "Encrypting" : "Decrypting"} {steps.length} digraph pair{steps.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Player Controls */}
      <PlayerBar player={player} totalSteps={steps.length} accentColor={accentColor} />

      <div className={styles.layout}>
        {/* Interactive Key Matrix */}
        <KeyMatrix
          square={square}
          highlightA={hlInA}
          highlightB={hlInB}
          highlightOutA={hlOutA}
          highlightOutB={hlOutB}
          accentColor={accentColor}
          rule={activeStep?.rule || null}
        />

        {/* Right panel: pairs + active detail */}
        <div className={styles.rightPanel}>
          {/* Pairs list */}
          <div className={styles.pairsSection}>
            <h4 className={styles.sectionTitle}>Digraph Pairs</h4>
            <div className={styles.pairsList}>
              {steps.map((step, i) => {
                const isActive = i === currentStep;
                const isDone = i < currentStep;
                return (
                  <div
                    key={step.index}
                    className={`${styles.pairRow} ${isActive ? styles.pairRowActive : ""} ${isDone ? styles.pairRowDone : ""}`}
                    style={{
                      borderColor: isActive ? accentColor : isDone ? `${accentColor}44` : "",
                      background: isActive ? `${accentColor}12` : "",
                      animation: isActive ? "pairHighlight 0.3s ease both" : isDone ? "none" : "none",
                    }}
                  >
                    <span className={styles.pairIdx}>{i + 1}</span>
                    <div className={styles.pairChars}>
                      <span className={styles.pairIn} style={{ color: isActive ? accentColor : "" }}>{step.input}</span>
                      <span className={styles.pairArrow}>→</span>
                      <span className={styles.pairOut} style={{ color: isActive || isDone ? "var(--green)" : "" }}>{step.output}</span>
                    </div>
                    <span
                      className={styles.pairRule}
                      style={{
                        color: step.rule === "Row" ? "var(--green)" : step.rule === "Col" ? "var(--purple, #7c3aed)" : "var(--orange)",
                        opacity: isActive ? 1 : 0.5,
                      }}
                    >
                      {step.rule === "Row" ? "↔" : step.rule === "Col" ? "↕" : "⬛"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active step detail */}
          {activeStep ? (
            <div className={styles.stepDetail} style={{ animation: "fadePop 0.3s ease both" }}>
              <div className={styles.detailHeader}>Step {currentStep + 1} Detail</div>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.dLabel}>Input Pair</span>
                  <span className={styles.dVal} style={{ color: accentColor }}>{activeStep.input}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.dLabel}>Output Pair</span>
                  <span className={styles.dVal} style={{ color: "var(--green)" }}>{activeStep.output}</span>
                </div>
                <div className={styles.detailItem} style={{ gridColumn: "1 / -1" }}>
                  <span className={styles.dLabel}>Rule Applied</span>
                  <span className={styles.dFormula}>{activeStep.formula}</span>
                </div>
              </div>
              <div className={styles.ruleFull}>
                <span className={styles.ruleIcon}>
                  {activeStep.rule === "Row" ? "↔" : activeStep.rule === "Col" ? "↕" : "⬛"}
                </span>
                <span>
                  {activeStep.rule === "Row"
                    ? `Same row — shift right${mode === "encrypt" ? "" : " left"} by 1`
                    : activeStep.rule === "Col"
                      ? `Same column — shift down${mode === "encrypt" ? "" : " up"} by 1`
                      : `Rectangle — swap to opposite corners`
                  }
                </span>
              </div>
            </div>
          ) : (
            <div className={styles.idleHint}>
              Press ▶ Play to animate each pair's transformation on the 5×5 matrix…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
