"use client";
import { useEffect, useRef } from "react";
import { useSimulationPlayer } from "../lib/useSimulationPlayer";
import styles from "./VigenereSimulation.module.css";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/* ── Vigenère Table with animated intersection ── */
function MiniTable({ rowHighlight, colHighlight, accentColor }) {
  const activeRef = useRef(null);
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }
  }, [rowHighlight, colHighlight]);

  return (
    <div className={styles.tableWrap}>
      <table className={styles.vigTable}>
        <thead>
          <tr>
            <th className={styles.cornerCell}>K\P</th>
            {ALPHABET.split("").map((l, ci) => (
              <th
                key={l}
                className={`${styles.headerCell} ${ci === colHighlight ? styles.colHighlight : ""}`}
                style={ci === colHighlight ? { background: accentColor, color: "white" } : {}}
              >
                {l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ALPHABET.split("").map((rowLetter, ri) => (
            <tr key={rowLetter}>
              <th
                className={`${styles.rowHeader} ${ri === rowHighlight ? styles.rowHighlight : ""}`}
                style={ri === rowHighlight ? { background: "var(--purple, #7c3aed)", color: "white" } : {}}
              >
                {rowLetter}
              </th>
              {ALPHABET.split("").map((_, ci) => {
                const cellLetter = ALPHABET[(ri + ci) % 26];
                const isActive = ri === rowHighlight && ci === colHighlight;
                return (
                  <td
                    key={ci}
                    ref={isActive ? activeRef : null}
                    className={`${styles.cell} ${isActive
                      ? styles.cellActive
                      : ri === rowHighlight
                        ? styles.cellRowHl
                        : ci === colHighlight
                          ? styles.cellColHl
                          : ""
                      }`}
                    style={isActive ? {
                      background: `linear-gradient(135deg, ${accentColor}, var(--purple, #7c3aed))`,
                      color: "white",
                      fontWeight: 700,
                      animation: "cellActivePop 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
                    } : {}}
                  >
                    {cellLetter}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Player Controls (inline, colour-aware) ── */
function PlayerBar({ player, totalSteps, accentColor }) {
  const { isPlaying, isPaused, isDone, currentStep, speedMs, play, pause, resume, reset, stepForward, stepBack, setSpeed } = player;
  const notStarted = currentStep === -1;
  const pct = totalSteps > 0 ? Math.max(0, ((currentStep + 1) / totalSteps) * 100) : 0;

  const statusLabel = isPlaying ? "Playing" : isPaused ? "Paused" : isDone ? "Done ✓" : "Idle";
  const statusColor = isPlaying ? accentColor : isDone ? "var(--green)" : isPaused ? "var(--orange)" : "var(--text-subtle)";

  return (
    <div className={styles.playerOuter}>
      {/* Progress bar */}
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

      {/* Controls */}
      <div className={styles.playerBar}>
        <div className={styles.playerBtns}>
          {notStarted || isDone ? (
            <button className={`${styles.pBtn} ${styles.pBtnPrimary}`} style={{ background: accentColor, borderColor: accentColor }} onClick={play}>
              ▶ Play
            </button>
          ) : isPlaying ? (
            <button className={`${styles.pBtn} ${styles.pBtnPrimary}`} style={{ background: accentColor, borderColor: accentColor }} onClick={pause}>
              ⏸ Pause
            </button>
          ) : (
            <button className={`${styles.pBtn} ${styles.pBtnPrimary}`} style={{ background: accentColor, borderColor: accentColor }} onClick={resume}>
              ▶ Resume
            </button>
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

/* ── Main Component ── */
export default function VigenereSimulation({ stepsData, mode, colorVar }) {
  const accentColor = colorVar || "var(--purple, #7c3aed)";
  const alphaSteps = stepsData.filter((s) => s.type === "alpha");
  const player = useSimulationPlayer(alphaSteps.length);
  const { currentStep } = player;
  const notStarted = currentStep === -1;

  if (alphaSteps.length === 0) return null;

  const activeIdx = notStarted ? -1 : Math.min(currentStep, alphaSteps.length - 1);
  const current = activeIdx >= 0 ? alphaSteps[activeIdx] : null;

  const rowHighlight = current ? current.shift : null;
  const colHighlight = current ? current.inputCode : null;

  // Map alpha step indices back to full stepsData positions
  const alphaIndices = stepsData.reduce((acc, s, i) => {
    if (s.type === "alpha") acc.push(i);
    return acc;
  }, []);

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.title}>🔍 Vigenère Table Visualizer</span>
        <span className={styles.subtitle}>Watch each character look up its position in the 26×26 table</span>
      </div>

      {/* Player */}
      <PlayerBar player={player} totalSteps={alphaIndices.length} accentColor={accentColor} />

      {/* Layout Grid */}
      <div className={styles.contentGrid}>
        <div className={styles.leftCol}>
          {/* Alignment strip */}
          {["Plaintext", "Key", "Result"].map((label, rowIdx) => (
            <div className={styles.alignStrip} key={label}>
              <span className={styles.stripLabel}>{label}</span>
              <div className={styles.stripLetters}>
                {stepsData.map((s, i) => {
                  const alphaIdx = alphaIndices.indexOf(i);
                  const isActive = alphaIdx === activeIdx && s.type === "alpha";
                  const isDone = alphaIdx < activeIdx && s.type === "alpha";

                  const val = rowIdx === 0 ? s.input : rowIdx === 1 ? (s.type === "passthrough" ? "—" : s.keyLetter) : s.output;

                  const activeStyle = isActive ? {
                    transform: "scale(1.2)",
                    boxShadow: `0 0 12px ${accentColor}99`,
                    zIndex: 2,
                    animation: "spotlightPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
                  } : {};

                  const doneColor = rowIdx === 1
                    ? { color: "var(--accent)", background: "var(--accent-glow)", borderColor: "var(--accent)" }
                    : rowIdx === 2
                      ? { color: "var(--green)", background: "var(--green-bg, #14b8a622)", borderColor: "var(--green)" }
                      : {};

                  return (
                    <span
                      key={i}
                      className={`${styles.stripLetter}
                        ${rowIdx === 1 ? styles.stripKey : rowIdx === 2 ? styles.stripResult : ""}
                        ${s.type === "passthrough" ? styles.stripPass : ""}
                        ${isActive ? styles.stripActive : ""}
                      `}
                      style={{
                        ...(isDone && rowIdx > 0 ? doneColor : {}),
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
                  <span className={styles.detailLabel}>{mode === "encrypt" ? "Plaintext" : "Ciphertext"}</span>
                  <span className={styles.detailVal}>{current.input} <span style={{ color: "var(--text-subtle)", fontSize: 12 }}>({current.inputCode})</span></span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Key Letter</span>
                  <span className={styles.detailVal} style={{ color: accentColor }}>{current.keyLetter} <span style={{ color: "var(--text-subtle)", fontSize: 12 }}>({current.shift})</span></span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Formula</span>
                  <span className={styles.detailFormula}>{current.formula}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>{mode === "encrypt" ? "Ciphertext" : "Plaintext"}</span>
                  <span className={`${styles.detailVal} ${styles.detailResult}`}>{current.output} <span style={{ color: "var(--text-subtle)", fontSize: 12 }}>({current.outputCode})</span></span>
                </div>
              </div>

              <div className={styles.lookupHint}>
                <span className={styles.hintIcon}>📌</span>
                {mode === "encrypt"
                  ? `Row "${current.keyLetter}" (key) ∩ Column "${current.input}" (plain) = "${current.output}"`
                  : `Row "${current.keyLetter}" (key), find "${current.input}" → Column "${current.output}" (plain)`}
              </div>
            </div>
          ) : (
            <div className={styles.idleHint}>
              Press ▶ Play to animate each character lookup in the Vigenère table…
            </div>
          )}
        </div>

        <div className={styles.rightCol}>
          {/* Mini Vigenère table */}
          <MiniTable rowHighlight={rowHighlight} colHighlight={colHighlight} accentColor={accentColor} />
        </div>
      </div>
    </div>
  );
}
