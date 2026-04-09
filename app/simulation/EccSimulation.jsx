
"use client";
import { useMemo } from "react";
import { useSimulationPlayer } from "../lib/useSimulationPlayer";
import styles from "./EccSimulation.module.css";

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

export default function EccSimulation({ data, colorVar }) {
  const accentColor = colorVar || "var(--purple)";
  const { p, a, b, G, kA, kB, PubA, PubB, SharedA, SharedB } = data;

  // Total steps: 5
  // 0: Alice computes PubA
  // 1: Bob computes PubB
  // 2: Exchange
  // 3: Alice computes Shared Secret
  // 4: Bob computes Shared Secret
  const totalSteps = 5;
  const player = useSimulationPlayer(totalSteps);
  const { currentStep } = player;

  // Compute points on elliptic curve over Finite Field for small parameters
  const validPoints = useMemo(() => {
    const points = [];
    if (BigInt(p) > 200n) return points; // Don't crash browser for large p

    const pN = BigInt(p);
    const aN = BigInt(a);
    const bN = BigInt(b);

    for (let x = 0n; x < pN; x++) {
      let rhs = (x * x * x + aN * x + bN) % pN;
      if (rhs < 0n) rhs += pN;

      for (let y = 0n; y < pN; y++) {
        let lhs = (y * y) % pN;
        if (lhs === rhs) {
          points.push({ x: Number(x), y: Number(y) });
        }
      }
    }
    return points;
  }, [p, a, b]);

  // Graph styling configuration
  const showGraph = validPoints.length > 0;
  const graphSize = 340;
  const padding = 20;
  const pInt = parseInt(p, 10);
  const scale = showGraph ? (graphSize - 2 * padding) / pInt : 1;

  const getP = (pt) => ({
    cx: padding + parseInt(pt.x) * scale,
    cy: graphSize - padding - parseInt(pt.y) * scale // Y goes up
  });

  const getPhaseDescription = () => {
    switch (currentStep) {
      case -1: return "Base Point G is established.";
      case 0: return `Alice generates her Public Key mathematically: PubA = ${kA} × G`;
      case 1: return `Bob generates his Public Key mathematically: PubB = ${kB} × G`;
      case 2: return "Alice and Bob intuitively exchange their Public Keys over a public channel.";
      case 3: return `Alice combines her private key (${kA}) with Bob's Public Key to get the Shared Secret.`;
      case 4: return `Bob combines his private key (${kB}) with Alice's Public Key. They reach the same magical point!`;
      default: return "";
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>∿ Elliptic Curve Key Exchange</span>
        <span className={styles.subtitle}>y² ≡ x³ + {a}x + {b} (mod {p})</span>
      </div>

      <PlayerBar player={player} totalSteps={totalSteps} accentColor={accentColor} />

      <div className={styles.simulationBody}>
        {/* Graph rendering area */}
        <div className={styles.graphPanel}>
          {showGraph ? (
            <div className={styles.svgWrapper}>
              <svg width={graphSize} height={graphSize} className={styles.eccGraph}>
                <defs>
                  <pattern id="grid" width={scale} height={scale} patternUnits="userSpaceOnUse">
                    <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="var(--border)" strokeWidth="0.5" />
                  </pattern>
                </defs>

                {/* Grid and Axes */}
                <rect width={graphSize} height={graphSize} fill="url(#grid)" />
                <line x1={padding} y1={padding} x2={padding} y2={graphSize - padding} stroke="var(--text-subtle)" strokeWidth="2" />
                <line x1={padding} y1={graphSize - padding} x2={graphSize - padding} y2={graphSize - padding} stroke="var(--text-subtle)" strokeWidth="2" />

                {/* All available valid points on curve */}
                {validPoints.map((pt, i) => {
                  const { cx, cy } = getP(pt);
                  return <circle key={i} cx={cx} cy={cy} r="3" fill="var(--border)" />;
                })}

                {/* Highlight: Base Point G */}
                {G && (
                  <g className={styles.animatedPoint}>
                    <circle {...getP(G)} r="6" fill="var(--accent)" stroke="var(--bg)" strokeWidth="2" />
                    <text x={getP(G).cx + 8} y={getP(G).cy - 8} fill="var(--accent)" fontSize="12" fontWeight="bold">G</text>
                  </g>
                )}

                {/* Highlight: PubA */}
                {PubA && currentStep >= 0 && (
                  <g className={styles.animatedPoint} style={{ animationDelay: '0.2s' }}>
                    <circle {...getP(PubA)} r="7" fill="var(--orange)" />
                    <text x={getP(PubA).cx + 10} y={getP(PubA).cy + 4} fill="var(--orange)" fontSize="12" fontWeight="bold">PubA</text>
                  </g>
                )}

                {/* Highlight: PubB */}
                {PubB && currentStep >= 1 && (
                  <g className={styles.animatedPoint} style={{ animationDelay: '0.2s' }}>
                    <circle {...getP(PubB)} r="7" fill="#3b82f6" />
                    <text x={getP(PubB).cx - 35} y={getP(PubB).cy + 4} fill="#3b82f6" fontSize="12" fontWeight="bold">PubB</text>
                  </g>
                )}

                {/* Highlight: Shared Secret */}
                {SharedA && currentStep >= 3 && (
                  <g className={styles.animatedPoint} style={{ animationDelay: '0.2s' }}>
                    <circle {...getP(SharedA)} r="9" fill="var(--green)" stroke="var(--bg)" strokeWidth="3" />
                    <circle {...getP(SharedA)} r="14" fill="none" stroke="var(--green)" strokeWidth="2" className={styles.pulseCircle} />
                    <text x={getP(SharedA).cx - 20} y={getP(SharedA).cy - 16} fill="var(--green)" fontSize="14" fontWeight="bold">Secret</text>
                  </g>
                )}
              </svg>
            </div>
          ) : (
            <div className={styles.graphMissing}>
              <span className={styles.gmIcon}>📈🚫</span>
              <p>The finite field size (p={p}) is too large to render accurately on this 2D grid. The mathematical process will still be simulated below.</p>
            </div>
          )}
        </div>

        {/* Narrative execution panel */}
        <div className={styles.narrativePanel}>
          <div className={styles.phaseAlert}>
            {getPhaseDescription()}
          </div>

          <div className={styles.actorGrid}>
            <div className={`${styles.actorBox} ${currentStep === 0 || currentStep === 3 ? styles.actorActive : ''}`}>
              <div className={styles.actorTitle} style={{ color: "var(--orange)" }}>Alice</div>
              <div className={styles.actorDetail}>Private Key (kA): <b>{kA}</b></div>
              <div className={styles.actorDetail}>
                PubA = kA × G<br />
                <span className={`${styles.coordinateChip} ${currentStep >= 0 ? styles.fadeUp : styles.hidden}`}>
                  = ({PubA.x}, {PubA.y})
                </span>
              </div>
            </div>

            <div className={`${styles.actorBox} ${currentStep === 1 || currentStep === 4 ? styles.actorActive : ''}`}>
              <div className={styles.actorTitle} style={{ color: "#3b82f6" }}>Bob</div>
              <div className={styles.actorDetail}>Private Key (kB): <b>{kB}</b></div>
              <div className={styles.actorDetail}>
                PubB = kB × G<br />
                <span className={`${styles.coordinateChip} ${currentStep >= 1 ? styles.fadeUp : styles.hidden}`}>
                  = ({PubB.x}, {PubB.y})
                </span>
              </div>
            </div>
          </div>

          <div className={styles.exchangeZone}>
            <div className={`${styles.exchangeArrow} ${currentStep >= 2 ? styles.exchangeVisible : styles.hidden}`}>
              <span>Send PubA ➔</span>
              <span>{`(${PubA.x}, ${PubA.y})`}</span>
            </div>
            <div className={`${styles.exchangeArrow} ${styles.exchangeReverse} ${currentStep >= 2 ? styles.exchangeVisible : styles.hidden}`}>
              <span>{`(${PubB.x}, ${PubB.y})`}</span>
              <span> ⟵ Send PubB</span>
            </div>
          </div>

          <div className={styles.secretGrid}>
            <div className={styles.secretBox}>
              <div className={styles.secretTitle}>Alice's Computed Secret</div>
              <div className={styles.secretFormula}>kA × PubB</div>
              <div className={`${styles.secretResult} ${currentStep >= 3 ? styles.resultPopped : styles.hidden}`}>
                ({SharedA.x}, {SharedA.y})
              </div>
            </div>
            <div className={styles.secretBox}>
              <div className={styles.secretTitle}>Bob's Computed Secret</div>
              <div className={styles.secretFormula}>kB × PubA</div>
              <div className={`${styles.secretResult} ${currentStep >= 4 ? styles.resultPopped : styles.hidden}`}>
                ({SharedB.x}, {SharedB.y})
              </div>
            </div>
          </div>

          {currentStep >= 4 && (
            <div className={styles.successBanner}>
              <span className={styles.successIcon}>✓</span>
              Keys matched! Shared communication is now safely encrypted.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
