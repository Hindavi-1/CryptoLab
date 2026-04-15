"use client";
import { useSimulationPlayer } from "../lib/useSimulationPlayer";
import styles from "./ElgamalSimulation.module.css";

/* ── SVG Arrow ── */
function Arrow({ label, color }) {
  return (
    <div className={styles.arrow} style={{ color }}>
      <span className={styles.arrowLabel}>{label}</span>
      <svg width="52" height="14" viewBox="0 0 52 14" fill="none">
        <path d="M0 7H50M43 1L51 7L43 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ── Math Box ── */
function MathBox({ label, value, sub, color, glow, large }) {
  return (
    <div
      className={styles.mathBox}
      style={{
        borderColor: color ? color : undefined,
        boxShadow: glow && color ? `0 0 22px color-mix(in srgb, ${color} 25%, transparent)` : undefined,
      }}
    >
      <span className={styles.mathBoxLabel}>{label}</span>
      <span
        className={styles.mathBoxValue}
        style={{ color: color || "var(--text)", fontSize: large ? "2.6rem" : "1.5rem" }}
      >
        {value}
      </span>
      {sub && <span className={styles.mathBoxSub}>{sub}</span>}
    </div>
  );
}

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
          {notStarted ? "—" : `${currentStep + 1} / ${totalSteps}`}
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

/* ── Encrypt Simulation ── */
function EncryptView({ data, accentColor }) {
  const { p, g, y, k, c1, blocks } = data;
  const player = useSimulationPlayer(blocks.length);
  const { currentStep } = player;
  const notStarted = currentStep === -1;
  const activeIdx = notStarted ? -1 : Math.min(currentStep, blocks.length - 1);
  const current = activeIdx >= 0 ? blocks[activeIdx] : null;
  const completed = blocks.slice(0, activeIdx + 1);

  return (
    <div className={styles.subWrap}>
      {/* Key params header */}
      <div className={styles.paramGrid}>
        {[["p", p, "Prime modulus"], ["g", g, "Generator"], ["y", y, "Public key (gˣ mod p)"], ["k", k, "Ephemeral key"]].map(([name, val, desc]) => (
          <div key={name} className={styles.paramBox}>
            <span className={styles.paramName} style={{ color: accentColor }}>{name}</span>
            <span className={styles.paramVal}>{String(val)}</span>
            <span className={styles.paramDesc}>{desc}</span>
          </div>
        ))}
      </div>

      {/* c1 banner */}
      <div className={styles.c1Banner}>
        <span className={styles.c1Label}>Shared component</span>
        <span className={styles.c1Formula}>C₁ = g<sup>k</sup> mod p = {g}<sup>{k}</sup> mod {p}</span>
        <span className={styles.c1Value} style={{ color: accentColor }}>{c1}</span>
      </div>

      <PlayerBar player={player} totalSteps={blocks.length} accentColor={accentColor} />

      {/* Step animation */}
      <div className={styles.stepArea}>
        {current ? (
          <div className={styles.stepCard} key={activeIdx} style={{ animation: "elgamalPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <div className={styles.stepBadge} style={{ background: accentColor }}>
              Character {activeIdx + 1} / {blocks.length}
            </div>

            <div className={styles.mathFlow}>
              <MathBox label="Character" value={current.char} sub="plaintext" large />
              <Arrow label="ASCII" color={accentColor} />
              <MathBox label="m" value={current.m} sub="numeric value" />
              <Arrow label="m × yᵏ mod p" color={accentColor} />
              <MathBox label="C₂" value={current.c2} sub="ciphertext block" color={accentColor} glow />
            </div>

            <div className={styles.equationBox}>
              <code>
                C₂ = m × y<sup>k</sup> mod p = {current.m} × {y}<sup>{k}</sup> mod {p} = <strong style={{ color: accentColor }}>{current.c2}</strong>
              </code>
            </div>
          </div>
        ) : (
          <div className={styles.idleHint}>
            <span className={styles.idleIcon}>🔐</span>
            <span>Press ▶ Play to see each character encrypted step-by-step…</span>
          </div>
        )}
      </div>

      {/* Progress strip */}
      <div className={styles.progressStrip}>
        <div className={styles.stripTitle}>Encrypted blocks so far:</div>
        <div className={styles.stripRow}>
          {blocks.map((blk, i) => {
            const isPast = i < activeIdx;
            const isAct = i === activeIdx;
            return (
              <div key={i} className={`${styles.stripCell} ${isAct ? styles.cellActive : ""} ${isPast ? styles.cellDone : ""}`}
                style={{
                  borderColor: isAct ? accentColor : isPast ? "var(--green)" : "var(--border)",
                  background: isAct ? `color-mix(in srgb, ${accentColor} 14%, transparent)` : isPast ? "color-mix(in srgb, var(--green) 8%, transparent)" : "transparent",
                }}>
                <span className={styles.cellIn}>{blk.char}</span>
                {(isPast || isAct) && (
                  <span className={styles.cellOut} style={{ color: isPast ? "var(--green)" : accentColor }}>
                    {blk.c2.slice(0, 5)}{blk.c2.length > 5 ? "…" : ""}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {activeIdx >= 0 && (
          <div className={styles.accRow}>
            <span className={styles.accLabel}>Full ciphertext:</span>
            <span className={styles.accValue} style={{ color: accentColor }}>
              {c1} {completed.map(b => b.c2).join(",")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Decrypt Simulation ── */
function DecryptView({ data, accentColor }) {
  const { p, x, c1, s, sInv, blocks } = data;
  const player = useSimulationPlayer(blocks.length);
  const { currentStep } = player;
  const notStarted = currentStep === -1;
  const activeIdx = notStarted ? -1 : Math.min(currentStep, blocks.length - 1);
  const current = activeIdx >= 0 ? blocks[activeIdx] : null;
  const completed = blocks.slice(0, activeIdx + 1);
  const orangeColor = "var(--orange)";

  return (
    <div className={styles.subWrap}>
      <div className={styles.paramGrid}>
        {[["p", p, "Prime modulus"], ["x", x, "Private key"], ["C₁", c1, "Shared component"], ["s", s, "C₁ˣ mod p"], ["s⁻¹", sInv, "Modular inverse of s"]].map(([name, val, desc]) => (
          <div key={name} className={styles.paramBox}>
            <span className={styles.paramName} style={{ color: orangeColor }}>{name}</span>
            <span className={styles.paramVal}>{String(val)}</span>
            <span className={styles.paramDesc}>{desc}</span>
          </div>
        ))}
      </div>

      {/* Shared secret banner */}
      <div className={styles.c1Banner} style={{ borderColor: `${orangeColor}44`, background: `color-mix(in srgb, var(--orange) 6%, var(--card))` }}>
        <span className={styles.c1Label}>Shared secret recovery</span>
        <span className={styles.c1Formula}>s = C₁<sup>x</sup> mod p = {c1}<sup>{x}</sup> mod {p} = <strong style={{ color: orangeColor }}>{s}</strong></span>
        <span className={styles.c1Value} style={{ color: orangeColor }}>s⁻¹ = {sInv}</span>
      </div>

      <PlayerBar player={player} totalSteps={blocks.length} accentColor={orangeColor} />

      <div className={styles.stepArea}>
        {current ? (
          <div className={styles.stepCard} key={activeIdx} style={{ animation: "elgamalPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <div className={styles.stepBadge} style={{ background: orangeColor }}>
              Block {activeIdx + 1} / {blocks.length}
            </div>

            <div className={styles.mathFlow}>
              <MathBox label="C₂ block" value={current.c2.slice(0, 8) + (current.c2.length > 8 ? "…" : "")} sub="cipher block" />
              <Arrow label="C₂ × s⁻¹ mod p" color={orangeColor} />
              <MathBox label="m" value={current.m} sub="ASCII value" />
              <Arrow label="charCode" color={orangeColor} />
              <MathBox label="Character" value={current.char} sub="decrypted" color={orangeColor} glow large />
            </div>

            <div className={styles.equationBox}>
              <code>
                m = C₂ × s⁻¹ mod p = {current.c2} × {sInv} mod {p} = <strong style={{ color: orangeColor }}>{current.m}</strong> → '{current.char}'
              </code>
            </div>
          </div>
        ) : (
          <div className={styles.idleHint}>
            <span className={styles.idleIcon}>🔓</span>
            <span>Press ▶ Play to see each block decrypted step-by-step…</span>
          </div>
        )}
      </div>

      <div className={styles.progressStrip}>
        <div className={styles.stripTitle}>Decrypted characters so far:</div>
        <div className={styles.stripRow}>
          {blocks.map((blk, i) => {
            const isPast = i < activeIdx;
            const isAct = i === activeIdx;
            return (
              <div key={i} className={`${styles.stripCell} ${isAct ? styles.cellActive : ""} ${isPast ? styles.cellDone : ""}`}
                style={{
                  borderColor: isAct ? orangeColor : isPast ? "var(--green)" : "var(--border)",
                  background: isAct ? `color-mix(in srgb, var(--orange) 14%, transparent)` : isPast ? "color-mix(in srgb, var(--green) 8%, transparent)" : "transparent",
                }}>
                <span className={styles.cellIn} style={{ fontSize: "10px" }}>{blk.c2.slice(0,5)}…</span>
                {(isPast || isAct) && (
                  <span className={styles.cellOut} style={{ color: isPast ? "var(--green)" : orangeColor, fontSize: "18px" }}>
                    {blk.char}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        {activeIdx >= 0 && (
          <div className={styles.accRow}>
            <span className={styles.accLabel}>Plaintext so far:</span>
            <span className={styles.accValue} style={{ color: orangeColor }}>
              {completed.map(b => b.char).join("")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Export ── */
export default function ElgamalSimulation({ data, colorVar }) {
  const accentColor = colorVar || "var(--accent)";

  if (!data || data.error) {
    return (
      <div className={styles.wrap}>
        <div className={styles.errorBox}>⚠ {data?.error || "Invalid ElGamal data."}</div>
      </div>
    );
  }

  const isEncrypt = data.action === "encrypt";

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>⟨G⟩ ElGamal {isEncrypt ? "Encryption" : "Decryption"} Visualizer</span>
        <span className={styles.subtitle}>
          {isEncrypt
            ? "Each character → m → C₂ = m × yᵏ mod p  |  Shared: C₁ = gᵏ mod p"
            : "Each block → m = C₂ × s⁻¹ mod p  |  Shared secret: s = C₁ˣ mod p"}
        </span>
      </div>

      {isEncrypt
        ? <EncryptView data={data} accentColor={accentColor} />
        : <DecryptView data={data} accentColor={accentColor} />
      }
    </div>
  );
}
