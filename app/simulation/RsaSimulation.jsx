"use client";
import { useState, useMemo } from "react";
import { useSimulationPlayer } from "../lib/useSimulationPlayer";
import styles from "./RsaSimulation.module.css";

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

/* ── Key Info Card ── */
function KeyCard({ label, color, fields }) {
  return (
    <div className={styles.keyCard} style={{ borderColor: `${color}44`, background: `color-mix(in srgb, ${color} 6%, var(--card))` }}>
      <div className={styles.keyCardLabel} style={{ color }}>{label}</div>
      {fields.map(([k, v]) => (
        <div key={k} className={styles.keyField}>
          <span className={styles.keyName}>{k}</span>
          <span className={styles.keyVal}>{v?.toString() ?? "—"}</span>
        </div>
      ))}
    </div>
  );
}

export default function RsaSimulation({ data, colorVar }) {
  const accentColor = colorVar || "var(--accent)";
  const { n, e, d, blocks, action } = data;
  const isEncrypt = action === "encrypt";

  const player = useSimulationPlayer(blocks.length);
  const { currentStep } = player;
  const notStarted = currentStep === -1;
  const activeIdx = notStarted ? -1 : Math.min(currentStep, blocks.length - 1);
  const current = activeIdx >= 0 ? blocks[activeIdx] : null;

  if (!blocks || blocks.length === 0) return null;

  // Build ASCII-value grid for all completed steps
  const completedBlocks = blocks.slice(0, activeIdx + 1);

  return (
    <div className={styles.wrap}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.title}>🔐 RSA {isEncrypt ? "Encryption" : "Decryption"} Visualizer</span>
        <span className={styles.subtitle}>
          {isEncrypt
            ? `Each character → ASCII (m) → c = mᵉ mod n`
            : `Each block (c) → m = cᵈ mod n → ASCII → character`}
        </span>
      </div>

      {/* Keys Panel */}
      <div className={styles.keysRow}>
        <KeyCard
          label="🔓 Public Key"
          color={accentColor}
          fields={[["n (modulus)", n], ["e (exponent)", e]]}
        />
        {d && (
          <KeyCard
            label="🔒 Private Key"
            color="var(--orange)"
            fields={[["n (modulus)", n], ["d (exponent)", d]]}
          />
        )}
        <div className={styles.formulaCard}>
          <div className={styles.formulaCardTitle}>Formula</div>
          <code className={styles.formulaCode}>
            {isEncrypt ? "c ≡ mᵉ (mod n)" : "m ≡ cᵈ (mod n)"}
          </code>
          <div className={styles.formulaNote}>
            {isEncrypt
              ? "Each character's ASCII value is raised to the power e, mod n."
              : "Each cipherblock is raised to the power d, mod n, to restore ASCII."}
          </div>
        </div>
      </div>

      <PlayerBar player={player} totalSteps={blocks.length} accentColor={accentColor} />

      {/* Main animation area */}
      <div className={styles.mainArea}>

        {/* Active step detail */}
        <div className={styles.stepDetail}>
          {current ? (
            <div className={styles.stepCard} style={{ animation: "rsaPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both" }}>
              <div className={styles.stepBadge} style={{ background: accentColor }}>
                Step {activeIdx + 1} / {blocks.length}
              </div>

              {isEncrypt ? (
                <>
                  <div className={styles.mathFlow}>
                    <div className={styles.mathBox}>
                      <span className={styles.mathBoxLabel}>Character</span>
                      <span className={styles.mathBoxValue} style={{ fontSize: "2.8rem" }}>{current.char}</span>
                      <span className={styles.mathBoxSub}>Input</span>
                    </div>

                    <div className={styles.mathArrow} style={{ color: accentColor }}>
                      <span className={styles.mathArrowLabel}>ASCII</span>
                      <svg width="60" height="12" viewBox="0 0 60 12" fill="none">
                        <path d="M0 6H58M52 1L59 6L52 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    <div className={styles.mathBox}>
                      <span className={styles.mathBoxLabel}>m (plaintext)</span>
                      <span className={styles.mathBoxValue}>{current.m}</span>
                      <span className={styles.mathBoxSub}>numeric value</span>
                    </div>

                    <div className={styles.mathArrow} style={{ color: accentColor }}>
                      <span className={styles.mathArrowLabel}>mᵉ mod n</span>
                      <svg width="60" height="12" viewBox="0 0 60 12" fill="none">
                        <path d="M0 6H58M52 1L59 6L52 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    <div className={styles.mathBox} style={{ borderColor: accentColor, boxShadow: `0 0 20px color-mix(in srgb, ${accentColor} 20%, transparent)` }}>
                      <span className={styles.mathBoxLabel}>c (ciphertext)</span>
                      <span className={styles.mathBoxValue} style={{ color: accentColor, fontSize: "1.4rem" }}>{current.c}</span>
                      <span className={styles.mathBoxSub}>encrypted block</span>
                    </div>
                  </div>
                  <div className={styles.equationLine}>
                    <code style={{ color: "var(--text-subtle)" }}>
                      {current.m}<sup>{e}</sup> mod {n} = <strong style={{ color: accentColor }}>{current.c}</strong>
                    </code>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.mathFlow}>
                    <div className={styles.mathBox}>
                      <span className={styles.mathBoxLabel}>c (cipherblock)</span>
                      <span className={styles.mathBoxValue} style={{ fontSize: "1.2rem" }}>{current.c}</span>
                      <span className={styles.mathBoxSub}>encrypted input</span>
                    </div>

                    <div className={styles.mathArrow} style={{ color: "var(--orange)" }}>
                      <span className={styles.mathArrowLabel}>cᵈ mod n</span>
                      <svg width="60" height="12" viewBox="0 0 60 12" fill="none">
                        <path d="M0 6H58M52 1L59 6L52 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    <div className={styles.mathBox}>
                      <span className={styles.mathBoxLabel}>m (ASCII)</span>
                      <span className={styles.mathBoxValue}>{current.m}</span>
                      <span className={styles.mathBoxSub}>numeric value</span>
                    </div>

                    <div className={styles.mathArrow} style={{ color: "var(--orange)" }}>
                      <span className={styles.mathArrowLabel}>charCode</span>
                      <svg width="60" height="12" viewBox="0 0 60 12" fill="none">
                        <path d="M0 6H58M52 1L59 6L52 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    <div className={styles.mathBox} style={{ borderColor: "var(--orange)", boxShadow: "0 0 20px color-mix(in srgb, var(--orange) 20%, transparent)" }}>
                      <span className={styles.mathBoxLabel}>Character</span>
                      <span className={styles.mathBoxValue} style={{ color: "var(--orange)", fontSize: "2.8rem" }}>{current.char}</span>
                      <span className={styles.mathBoxSub}>decoded output</span>
                    </div>
                  </div>
                  <div className={styles.equationLine}>
                    <code style={{ color: "var(--text-subtle)" }}>
                      {current.c}<sup>{d}</sup> mod {n} = <strong style={{ color: "var(--orange)" }}>{current.m}</strong> → '{current.char}'
                    </code>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className={styles.idleHint}>
              <span className={styles.idleIcon}>🔐</span>
              <span>Press ▶ Play to step through each character transformation…</span>
            </div>
          )}
        </div>

        {/* Character progress strip */}
        <div className={styles.progressStrip}>
          <div className={styles.stripTitle}>
            {isEncrypt ? "Encrypted blocks so far:" : "Decrypted characters so far:"}
          </div>
          <div className={styles.stripRow}>
            {blocks.map((blk, i) => {
              const isPast = i < activeIdx;
              const isAct = i === activeIdx;
              return (
                <div key={i}
                  className={`${styles.stripCell} ${isAct ? styles.stripCellActive : ""} ${isPast ? styles.stripCellDone : ""}`}
                  style={{
                    borderColor: isAct ? accentColor : isPast ? "var(--green)" : "var(--border)",
                    background: isAct
                      ? `color-mix(in srgb, ${accentColor} 15%, transparent)`
                      : isPast ? "color-mix(in srgb, var(--green) 8%, transparent)" : "transparent",
                  }}
                >
                  <span className={styles.stripCharIn}>{isEncrypt ? blk.char : blk.c.slice(0, 6) + (blk.c.length > 6 ? "…" : "")}</span>
                  {(isPast || isAct) && (
                    <span className={styles.stripCharOut} style={{ color: isPast ? "var(--green)" : accentColor }}>
                      {isEncrypt ? blk.c.slice(0, 6) + (blk.c.length > 6 ? "…" : "") : blk.char}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Accumulated output */}
          {activeIdx >= 0 && (
            <div className={styles.accOutput}>
              <span className={styles.accLabel}>{isEncrypt ? "Ciphertext so far:" : "Plaintext so far:"}</span>
              <span className={styles.accValue} style={{ color: isEncrypt ? accentColor : "var(--orange)" }}>
                {isEncrypt
                  ? completedBlocks.map(b => b.c).join(" ")
                  : completedBlocks.map(b => b.char).join("")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
