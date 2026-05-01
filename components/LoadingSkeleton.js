"use client";
import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════
   CAR SVG — side-profile sports car silhouette
   ═══════════════════════════════════════════════ */
function CarSVG({ color, size = 34 }) {
  return (
    <svg
      width={size}
      height={size * 0.5}
      viewBox="0 0 42 20"
      fill="none"
      style={{ filter: `drop-shadow(0 0 8px ${color})` }}
    >
      {/* Body */}
      <path
        d="M3 15L3 11Q3 9 5 9L13 9L16 5L28 5L31 9L37 9Q39 9 39 11L39 15Z"
        fill={color}
        opacity={0.85}
      />
      {/* Windows */}
      <path
        d="M15 9L17.5 5.5L27 5.5L29.5 9Z"
        fill="rgba(255,255,255,0.2)"
      />
      {/* Front wheel */}
      <circle cx="12" cy="15" r="2.8" fill={color} />
      <circle cx="12" cy="15" r="1.3" fill="rgba(0,0,0,0.45)" />
      {/* Rear wheel */}
      <circle cx="31" cy="15" r="2.8" fill={color} />
      <circle cx="31" cy="15" r="1.3" fill="rgba(0,0,0,0.45)" />
      {/* Headlight glow */}
      <rect x="37" y="10" width="2" height="2.5" rx="0.5" fill="rgba(255,255,255,0.7)" />
      {/* Tail light */}
      <rect x="3" y="10" width="1.5" height="2" rx="0.5" fill="rgba(255,100,100,0.6)" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════
   MAIN LOADING / WELCOME SCREEN
   ═══════════════════════════════════════════════ */
function LoadingSkeleton() {
  /* Cars — 4 Google brand colors, evenly spaced on the circle */
  const cars = [
    { color: "#4285F4", delay: 0,    dur: 7 },
    { color: "#EA4335", delay: -1.75, dur: 7 },
    { color: "#34A853", delay: -3.5,  dur: 7 },
    { color: "#FBBC05", delay: -5.25, dur: 7 },
  ];

  /* Letter-by-letter reveal variants */
  const letterVar = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.6 + i * 0.04,
        type: "spring",
        stiffness: 110,
        damping: 14,
      },
    }),
  };

  const welcomeText = "Omkar welcomes you!";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#08080f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Google Sans','Inter',system-ui,sans-serif",
      }}
    >
      {/* ── Background gradient orbs (reuses login CSS) ── */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      {/* ═══════ ORBIT AREA ═══════ */}
      <div
        style={{
          position: "relative",
          width: 320,
          height: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Outer orbit track — dashed ring, pulsing */}
        <div
          className="loading-track"
          style={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            border: "1px dashed rgba(66,133,244,0.15)",
          }}
        />

        {/* Inner decorative ring — counter-rotates */}
        <div
          className="loading-ring-spin"
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: "1px solid rgba(66,133,244,0.06)",
            borderTopColor: "rgba(66,133,244,0.18)",
            borderRightColor: "rgba(52,168,83,0.14)",
          }}
        />

        {/* Ambient glow behind orbit */}
        <div
          style={{
            position: "absolute",
            width: 280,
            height: 280,
            borderRadius: "50%",
            boxShadow:
              "0 0 60px rgba(66,133,244,0.06), inset 0 0 60px rgba(66,133,244,0.03)",
            pointerEvents: "none",
          }}
        />

        {/* ── ORBITING CARS ── */}
        {cars.map((car, i) => (
          <div
            key={i}
            className="loading-car-orbit"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 0,
              height: 0,
              animationDuration: `${car.dur}s`,
              animationDelay: `${car.delay}s`,
            }}
          >
            {/* Car positioned at orbit radius */}
            <div
              style={{
                position: "absolute",
                transform: "translate(-50%, -50%) translateY(-140px)",
              }}
            >
              <CarSVG color={car.color} />
            </div>
          </div>
        ))}

        {/* ── CENTER LOGO ── */}
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 70,
            damping: 14,
            delay: 0.15,
          }}
          style={{ zIndex: 2 }}
        >
          <div className="login-logo-glow">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <rect x="10" y="6" width="28" height="38" rx="3" fill="#4285F4" opacity="0.2" />
              <rect x="10" y="6" width="28" height="38" rx="3" stroke="#4285F4" strokeWidth="2" fill="none" />
              <path d="M38 6L48 16H38V6Z" fill="#4285F4" opacity="0.5" />
              <line x1="16" y1="20" x2="32" y2="20" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="26" x2="32" y2="26" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="32" x2="26" y2="32" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* ═══════ WELCOME TEXT ═══════ */}
      <motion.h1
        initial="hidden"
        animate="visible"
        style={{
          fontSize: 30,
          fontWeight: 600,
          color: "#e8eaed",
          marginTop: 44,
          letterSpacing: "-0.02em",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {welcomeText.split("").map((char, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVar}
            style={{
              display: "inline-block",
              whiteSpace: char === " " ? "pre" : "normal",
            }}
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        style={{
          fontSize: 14,
          color: "#9aa0a6",
          marginTop: 12,
          letterSpacing: "0.01em",
        }}
      >
        Loading your documents...
      </motion.p>

      {/* ═══════ BOUNCING DOTS ═══════ */}
      <div style={{ display: "flex", gap: 8, marginTop: 36 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="loading-bounce-dot"
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: ["#4285F4", "#34A853", "#EA4335"][i],
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default LoadingSkeleton;
