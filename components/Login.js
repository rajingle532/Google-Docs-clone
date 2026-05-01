"use client";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ── Staggered entrance animation ── */
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.4 },
    },
  };
  const item = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 90, damping: 16 },
    },
  };

  /* ── Particle data (memoised so it doesn't regenerate) ── */
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        dur: 6 + Math.random() * 8,
        size: 2 + Math.random() * 3,
      })),
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Sign In
        const res = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (res.error) {
          setError("Invalid email or password");
        }
      } else {
        // Sign Up
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        
        if (!res.ok) {
          setError(data.message || "Failed to create account");
        } else {
          // Auto login after signup
          await signIn("credentials", { email, password, redirect: false });
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    height: 48,
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "0 16px",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxShadow: "inset 0 2px 4px rgba(0,0,0,0.4)",
    transition: "all 0.2s ease",
    marginBottom: 16,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#08080f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Google Sans','Inter',system-ui,sans-serif",
      }}
    >
      {/* ═══════════ AMBIENT BACKGROUND ═══════════ */}

      {/* Gradient orbs — animated via CSS class */}
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />

      {/* Subtle grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(66,133,244,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(66,133,244,0.025) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          pointerEvents: "none",
        }}
      />

      {/* Rising particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="login-particle"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
          }}
        />
      ))}

      {/* ═══════════ FLOATING DOCUMENT PAGES ═══════════ */}

      {/* Left doc — blue tint */}
      <motion.div
        className="login-floating-doc"
        animate={{ y: [-18, 18, -18], rotateZ: [-3, 3, -3], rotateY: [-5, 5, -5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: "7%",
          top: "18%",
          width: 120,
          height: 160,
          background: "linear-gradient(135deg, rgba(66,133,244,0.07), rgba(66,133,244,0.02))",
          border: "1px solid rgba(66,133,244,0.12)",
          borderRadius: 8,
          transformPerspective: 1000,
          zIndex: 1,
        }}
      >
        <DocLines color="66,133,244" />
      </motion.div>

      {/* Right doc — green tint */}
      <motion.div
        className="login-floating-doc"
        animate={{ y: [14, -14, 14], rotateZ: [2, -2, 2], rotateX: [-3, 3, -3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          right: "9%",
          bottom: "22%",
          width: 100,
          height: 130,
          background: "linear-gradient(135deg, rgba(52,168,83,0.06), rgba(52,168,83,0.02))",
          border: "1px solid rgba(52,168,83,0.1)",
          borderRadius: 8,
          transformPerspective: 1000,
          zIndex: 1,
        }}
      >
        <DocLines color="52,168,83" />
      </motion.div>

      {/* Top-right doc — yellow tint */}
      <motion.div
        className="login-floating-doc"
        animate={{ y: [-10, 22, -10], rotateZ: [-1, 4, -1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          right: "20%",
          top: "12%",
          width: 80,
          height: 108,
          background: "linear-gradient(135deg, rgba(251,188,5,0.06), rgba(251,188,5,0.02))",
          border: "1px solid rgba(251,188,5,0.1)",
          borderRadius: 6,
          transformPerspective: 1000,
          zIndex: 1,
        }}
      >
        <DocLines color="251,188,5" />
      </motion.div>

      {/* Bottom-left doc — red tint */}
      <motion.div
        className="login-floating-doc"
        animate={{ y: [12, -16, 12], rotateZ: [1, -3, 1], rotateY: [3, -3, 3] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: "18%",
          bottom: "12%",
          width: 90,
          height: 120,
          background: "linear-gradient(135deg, rgba(234,67,53,0.05), rgba(234,67,53,0.015))",
          border: "1px solid rgba(234,67,53,0.08)",
          borderRadius: 7,
          transformPerspective: 1000,
          zIndex: 1,
        }}
      >
        <DocLines color="234,67,53" />
      </motion.div>

      {/* ═══════════ MAIN LOGIN/SIGNUP CARD ═══════════ */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        whileHover={{ rotateX: 2, rotateY: -2, scale: 1.01 }}
        style={{
          width: "100%",
          maxWidth: 440,
          background: "linear-gradient(145deg, rgba(26,26,36,0.8), rgba(16,16,24,0.9))",
          backdropFilter: "blur(40px) saturate(1.4)",
          WebkitBackdropFilter: "blur(40px) saturate(1.4)",
          borderRadius: 24,
          padding: "48px 48px",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 0 80px rgba(66,133,244,0.06), 0 24px 64px rgba(0,0,0,0.55), inset 0 2px 4px rgba(255,255,255,0.05)",
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transformPerspective: 1200,
        }}
      >
        {/* Accent glow line at top edge */}
        <div
          style={{
            position: "absolute",
            top: -1,
            left: "50%",
            transform: "translateX(-50%)",
            width: "55%",
            height: 2,
            background:
              "linear-gradient(90deg, transparent, #4285F4, #34A853, transparent)",
            borderRadius: "0 0 4px 4px",
            opacity: 0.55,
          }}
        />

        {/* ─── Logo ─── */}
        <motion.div
          variants={item}
          className="login-logo-glow"
          style={{ marginBottom: 20 }}
          whileHover={{ scale: 1.1, rotateZ: 5 }}
        >
          <svg width="48" height="48" viewBox="0 0 56 56" fill="none">
            <rect x="10" y="6" width="28" height="38" rx="3" fill="#4285F4" opacity="0.2" />
            <rect x="10" y="6" width="28" height="38" rx="3" stroke="#4285F4" strokeWidth="2" fill="none" />
            <path d="M38 6L48 16H38V6Z" fill="#4285F4" opacity="0.5" />
            <line x1="16" y1="20" x2="32" y2="20" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="26" x2="32" y2="26" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
            <line x1="16" y1="32" x2="26" y2="32" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>

        {/* ─── Title ─── */}
        <motion.h1
          variants={item}
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#e8eaed",
            textAlign: "center",
            marginBottom: 8,
            letterSpacing: "-0.02em",
          }}
        >
          {isLogin ? "Welcome Back" : "Create Account"}
        </motion.h1>

        {/* ─── Tagline ─── */}
        <motion.p
          variants={item}
          style={{
            fontSize: 14,
            color: "#9aa0a6",
            textAlign: "center",
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          {isLogin ? "Sign in to access your documents" : "Join the next generation of Google Docs"}
        </motion.p>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              width: "100%",
              padding: "10px",
              background: "rgba(234, 67, 53, 0.1)",
              border: "1px solid rgba(234, 67, 53, 0.3)",
              color: "#fca5a5",
              borderRadius: 8,
              fontSize: 13,
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            {error}
          </motion.div>
        )}

        <motion.form variants={item} onSubmit={handleSubmit} style={{ width: "100%" }}>
          {!isLogin && (
            <motion.input
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 48 }}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "rgba(66,133,244,0.5)"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
          )}
          
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = "rgba(66,133,244,0.5)"}
            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = "rgba(66,133,244,0.5)"}
            onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
          />

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              height: 48,
              background: "linear-gradient(135deg, #4b5563 0%, #1f2937 100%)",
              color: "#fff",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1)",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              marginTop: 8,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </motion.button>
        </motion.form>

        {/* ─── Divider ─── */}
        <motion.div
          variants={item}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            width: "100%",
            margin: "24px 0",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          <span style={{ fontSize: 12, color: "#5f6368", fontWeight: 500 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
        </motion.div>

        {/* ─── Google Sign-in Button ─── */}
        <motion.button
          variants={item}
          onClick={() => signIn("google")}
          whileHover={{ scale: 1.025, y: -2 }}
          whileTap={{ scale: 0.975 }}
          style={{
            width: "100%",
            height: 48,
            background: "linear-gradient(135deg, #4285F4, #2b62d9)",
            color: "#fff",
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 500,
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            cursor: "pointer",
            transition: "box-shadow 0.3s ease",
            boxShadow: "0 4px 20px rgba(66,133,244,0.35), inset 0 2px 4px rgba(255,255,255,0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Google G icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 20 20"
            fill="none"
            style={{ position: "relative", zIndex: 1 }}
          >
            <circle cx="10" cy="10" r="10" fill="white" />
            <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.77h5.4a4.6 4.6 0 01-2 3.02v2.5h3.24c1.9-1.75 3-4.33 3-7.29z" fill="#4285F4" />
            <path d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.75-5.59-4.12H1.07v2.58A10 10 0 0010 20z" fill="#34A853" />
            <path d="M4.41 11.91A5.95 5.95 0 014.1 10c0-.67.11-1.31.31-1.91V5.51H1.07A10 10 0 000 10c0 1.62.39 3.14 1.07 4.49l3.34-2.58z" fill="#FBBC05" />
            <path d="M10 3.98c1.47 0 2.78.5 3.82 1.5l2.86-2.86C14.96.99 12.7 0 10 0A10 10 0 001.07 5.51l3.34 2.58C5.2 5.73 7.4 3.98 10 3.98z" fill="#EA4335" />
          </svg>
          <span style={{ position: "relative", zIndex: 1 }}>
            Continue with Google
          </span>
        </motion.button>

        {/* ─── Toggle State ─── */}
        <motion.p
          variants={item}
          style={{
            fontSize: 13,
            color: "#9aa0a6",
            textAlign: "center",
            marginTop: 24,
          }}
        >
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            style={{
              color: "#8ab4f8",
              fontWeight: 500,
              cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#aecbfa")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#8ab4f8")}
          >
            {isLogin ? "Create one" : "Sign in"}
          </span>
        </motion.p>
      </motion.div>
    </div>
  );
}

/* ── Helper: simulated text lines inside a floating doc ── */
function DocLines({ color }) {
  return (
    <div
      style={{
        padding: "22px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 7,
      }}
    >
      <div style={{ height: 3, background: `rgba(${color},0.22)`, borderRadius: 2, width: "80%" }} />
      <div style={{ height: 3, background: `rgba(${color},0.14)`, borderRadius: 2, width: "60%" }} />
      <div style={{ height: 3, background: `rgba(${color},0.1)`, borderRadius: 2, width: "72%" }} />
      <div style={{ height: 3, background: `rgba(${color},0.07)`, borderRadius: 2, width: "50%" }} />
    </div>
  );
}

export default Login;
