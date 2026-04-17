"use client";
import { useMemo } from "react";
import { useSimulationPlayer } from "../lib/useSimulationPlayer";
import styles from "./DiffieHellmanSimulation.module.css";

/* ── Player Controls ── */
function PlayerBar({ player, totalSteps, accentColor }) {
  const { isPlaying, isPaused, isDone, currentStep, speedMs, play, pause, resume, reset, stepForward, stepBack, setSpeed } = player;
  const notStarted = currentStep === -1;
  const pct = totalSteps > 0 ? Math.max(0, ((currentStep + 1) / totalSteps) * 100) : 0;

  const statusLabel = isPlaying ? "Animating..." : isPaused ? "Paused" : isDone ? "Extraction Complete ✓" : "Awaiting Execution";
  const statusColor = isPlaying ? accentColor : isDone ? "var(--green)" : isPaused ? "var(--orange)" : "var(--text-subtle)";

  return (
    <div className={styles.playerOuter}>
      <div className={styles.progressRow}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${pct}%`, backgroundColor: accentColor, color: accentColor }} />
        </div>
        <span className={styles.progressText} style={{ color: statusColor }}>
          {notStarted ? "—" : `${Math.max(0, currentStep + 1)} / ${totalSteps}`}
        </span>
        <span className={styles.statusBadge} style={{ color: statusColor }}>
          {isPlaying && <span className={styles.statusDot} style={{ background: statusColor, color: statusColor }} />}
          {statusLabel}
        </span>
      </div>

      <div className={styles.playerBar}>
        <div className={styles.playerBtns}>
          {notStarted || isDone ? (
            <button className={`${styles.pBtn} ${styles.pBtnPrimary}`} style={{ background: accentColor, color: "white", boxShadow: `0 4px 15px color-mix(in srgb, ${accentColor} 40%, transparent)` }} onClick={play}>▶ Play Sim</button>
          ) : isPlaying ? (
            <button className={`${styles.pBtn} ${styles.pBtnPrimary}`} style={{ background: accentColor, color: "white", boxShadow: `0 4px 15px color-mix(in srgb, ${accentColor} 40%, transparent)` }} onClick={pause}>⏸ Pause</button>
          ) : (
            <button className={`${styles.pBtn} ${styles.pBtnPrimary}`} style={{ background: accentColor, color: "white", boxShadow: `0 4px 15px color-mix(in srgb, ${accentColor} 40%, transparent)` }} onClick={resume}>▶ Resume</button>
          )}
          <button className={styles.pBtn} onClick={stepBack} disabled={notStarted || currentStep <= 0}>⏮ Step Back</button>
          <button className={styles.pBtn} onClick={() => notStarted ? play() : stepForward()} disabled={!notStarted && currentStep >= totalSteps - 1}>Step Fwd ⏭</button>
          <button className={styles.pBtn} onClick={reset} disabled={notStarted}>↺ Restart</button>
        </div>
        <div className={styles.speedGroup}>
          <span className={styles.speedLabel}>Time Dilate</span>
          <select className={styles.speedSel} value={speedMs} onChange={(e) => setSpeed(Number(e.target.value))}>
            <option value={4500}>0.25×</option>
            <option value={2000}>0.5×</option>
            <option value={1000}>1.0×</option>
            <option value={500}>2.0×</option>
            <option value={200}>4.0×</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default function DiffieHellmanSimulation({ data, colorVar }) {
  const accentColor = colorVar || "var(--purple)";
  const { p, g, a, b, A, B, Sa, Sb } = data;

  const totalSteps = 6;
  const player = useSimulationPlayer(totalSteps);
  const { currentStep } = player;

  const getPhaseDescription = () => {
    switch (currentStep) {
      case -1: return "Setup complete. Awaiting simulation execute order.";
      case 0: return "Global parameters Prime (p) and Generator (g) are established. Anyone eavesdropping can see these numbers.";
      case 1: return "Alice and Bob independently select their secret private keys. These numbers never leave their local machines.";
      case 2: return "Each party magically weaves their private key into the public generator using modular exponentiation to create a Public Key.";
      case 3: return "The public keys are transmitted across the insecure channel. The attacker sees A and B, but cannot reverse-engineer the private keys.";
      case 4: return "Both parties combine the received public key with their own private key mathematically.";
      case 5: return "Cryptographic magic! Both Alice and Bob have derived the identical shared secret. Secure communication can commence.";
      default: return "";
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h2 className={styles.title}>Diffie-Hellman Key Exchange</h2>
        <span className={styles.subtitle}>Visually simulating the derivation of a shared cryptographic secret over an untrusted channel.</span>
      </div>

      <PlayerBar player={player} totalSteps={totalSteps} accentColor={accentColor} />

      <div className={styles.simulationBody}>
        
        {/* Animated Packets traversing the overlay */}
        <div className={styles.exchangeOverlay}>
            <div className={`${styles.packet} ${currentStep === 3 ? styles.arrowAliceToBob : styles.hidden}`} style={{ '--packet-color': 'var(--orange)' }}>
              <span className={styles.packetKey}>PubA</span> = {A}
            </div>
            
            <div className={`${styles.packet} ${currentStep === 3 ? styles.arrowBobToAlice : styles.hidden}`} style={{ '--packet-color': '#3b82f6' }}>
              <span className={styles.packetKey}>PubB</span> = {B}
            </div>
        </div>

        <div className={styles.networkLayout}>
          
          {/* ALICE */}
          <div className={`${styles.actorBox} ${[1, 2, 4].includes(currentStep) ? styles.actorActiveAlice : ''}`} style={{ color: "var(--orange)" }}>
            <div className={styles.actorGlowTop} style={{ background: "var(--orange)", opacity: 0.8 }} />
            <div className={styles.actorHeader}>
              <div className={styles.avatarWrapper} style={{ borderColor: "var(--orange)" }}>
                <img src="/alice_avatar.png" alt="Alice" width={60} height={60} className={styles.avatar} />
              </div>
              <div>
                <div className={styles.actorName}>Alice</div>
                <div className={styles.actorRole}>Sender Client</div>
              </div>
            </div>

            <div className={styles.actorBody}>
              <div className={`${styles.privateKeyRow} ${currentStep >= 1 ? styles.fadeUp : styles.hidden}`}>
                <span className={styles.privateKeyLabel}><span className={styles.privateKeyIcon}>🔒</span> Private Key (a)</span>
                <span className={styles.privateKeyValue}>{a}</span>
              </div>
              
              <div className={`${styles.mathCard} ${currentStep >= 2 ? styles.fadeUp : styles.hidden}`}>
                <div className={styles.mathTitle}><span>Make Public Key</span> <span>(A)</span></div>
                <span className={styles.codeBlock} style={{ fontSize: "13px", color: "var(--text-subtle)" }}>A = gᵃ mod p</span>
                <span className={styles.codeBlock}>
                  {g}<sup>{a}</sup> mod {p} = <strong className={styles.mathResult} style={{ color: "var(--orange)" }}>{A}</strong>
                </span>
              </div>

              <div className={`${styles.mathCard} ${styles.secretCard} ${currentStep >= 4 ? styles.fadeUp : styles.hidden}`}>
                <div className={`${styles.mathTitle} ${styles.secretMathTitle}`}><span>Extract Secret</span> <span>(S)</span></div>
                <span className={styles.codeBlock} style={{ fontSize: "13px", color: "var(--text-subtle)" }}>S = Bᵃ mod p</span>
                <span className={styles.codeBlock}>
                  {B}<sup>{a}</sup> mod {p} = <strong className={`${styles.mathResult} ${currentStep >= 5 ? styles.successGlow : ""}`} style={{ color: "var(--green)" }}>{Sa}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* PUBLIC CHANNEL (Middle Column) */}
          <div className={styles.publicChannelCol}>
            <div className={styles.channelIcon}>🌐</div>
            <div className={styles.publicChannelTitle}>Untrusted Network</div>
            
            <div className={`${styles.publicParamsRow} ${currentStep >= 0 ? styles.activeParam : ""}`}>
              <div className={styles.paramTag}>
                <span>Prime Modulus (p)</span>
                <b>{p}</b>
              </div>
              <div className={styles.paramTag}>
                <span>Generator (g)</span>
                <b>{g}</b>
              </div>
            </div>

            <div className={styles.phaseAlertBox}>
              <div key={currentStep} className={styles.phaseAlert}>
                {getPhaseDescription()}
              </div>
            </div>
          </div>

          {/* BOB */}
          <div className={`${styles.actorBox} ${[1, 2, 4].includes(currentStep) ? styles.actorActiveBob : ''}`} style={{ color: "#3b82f6" }}>
            <div className={styles.actorGlowTop} style={{ background: "#3b82f6", opacity: 0.8 }} />
            <div className={styles.actorHeader}>
              <div className={styles.avatarWrapper} style={{ borderColor: "#3b82f6" }}>
                <img src="/bob_avatar.png" alt="Bob" width={60} height={60} className={styles.avatar} />
              </div>
              <div>
                <div className={styles.actorName}>Bob</div>
                <div className={styles.actorRole}>Receiver Client</div>
              </div>
            </div>

            <div className={styles.actorBody}>
              <div className={`${styles.privateKeyRow} ${currentStep >= 1 ? styles.fadeUp : styles.hidden}`}>
                <span className={styles.privateKeyLabel}><span className={styles.privateKeyIcon}>🔒</span> Private Key (b)</span>
                <span className={styles.privateKeyValue}>{b}</span>
              </div>
              
              <div className={`${styles.mathCard} ${currentStep >= 2 ? styles.fadeUp : styles.hidden}`}>
                <div className={styles.mathTitle}><span>Make Public Key</span> <span>(B)</span></div>
                <span className={styles.codeBlock} style={{ fontSize: "13px", color: "var(--text-subtle)" }}>B = gᵇ mod p</span>
                <span className={styles.codeBlock}>
                  {g}<sup>{b}</sup> mod {p} = <strong className={styles.mathResult} style={{ color: "#3b82f6" }}>{B}</strong>
                </span>
              </div>

              <div className={`${styles.mathCard} ${styles.secretCard} ${currentStep >= 4 ? styles.fadeUp : styles.hidden}`}>
                <div className={`${styles.mathTitle} ${styles.secretMathTitle}`}><span>Extract Secret</span> <span>(S)</span></div>
                <span className={styles.codeBlock} style={{ fontSize: "13px", color: "var(--text-subtle)" }}>S = Aᵇ mod p</span>
                <span className={styles.codeBlock}>
                  {A}<sup>{b}</sup> mod {p} = <strong className={`${styles.mathResult} ${currentStep >= 5 ? styles.successGlow : ""}`} style={{ color: "var(--green)" }}>{Sb}</strong>
                </span>
              </div>
            </div>
          </div>

        </div>

        {currentStep >= 5 && (
          <div className={styles.successBanner}>
            <div className={styles.successIconWrapper}>✓</div>
            <span>End-to-End Encrypted Tunnel Established with Secret <b>{Sa}</b></span>
          </div>
        )}

      </div>
    </div>
  );
}
