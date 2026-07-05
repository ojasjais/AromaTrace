import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Leaf,
  LayoutDashboard,
  BadgeCheck,
  Users,
  Globe,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./ui/Button";

/* ─────────────────────────────────────────────
   Animated number counter
───────────────────────────────────────────── */
function AnimatedNumber({ target, suffix = "", duration = 1.8 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) motionVal.set(target);
  }, [inView, motionVal, target]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      setDisplay(
        Number.isInteger(target)
          ? Math.round(v).toLocaleString()
          : v.toFixed(1)
      );
    });
    return unsub;
  }, [spring, target]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Stat card
───────────────────────────────────────────── */
function StatCard({ icon: Icon, label, target, suffix, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className="hero-stat-card"
    >
      <span className="hero-stat-icon-wrap" aria-hidden="true">
        <Icon className="hero-stat-icon" />
      </span>
      <div>
        <p className="hero-stat-value">
          <AnimatedNumber target={target} suffix={suffix} />
        </p>
        <p className="hero-stat-label">{label}</p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Right-column Illustration
───────────────────────────────────────────── */
function HeroIllustration() {
  return (
    <div className="hero-illus-root" aria-hidden="true">
      {/* Outer glow ring */}
      <div className="hero-illus-ring" />

      {/* Glass card backdrop */}
      <div className="hero-illus-card">

        {/* ── Dashboard preview card (top) ── */}
        <div className="hero-dash-card">
          {/* Titlebar dots */}
          <div className="hero-dash-titlebar">
            <span className="hero-dash-dot" style={{ background: "#f87171" }} />
            <span className="hero-dash-dot" style={{ background: "#fbbf24" }} />
            <span className="hero-dash-dot" style={{ background: "#34d399" }} />
            <span className="hero-dash-url" />
          </div>

          {/* Dashboard skeleton rows */}
          <div className="hero-dash-body">
            <div className="hero-dash-header-row">
              <div className="hero-dash-skel hero-dash-skel-title" />
              <span className="hero-dash-badge">● Live</span>
            </div>
            <div className="hero-dash-metrics">
              {["Batches", "Liters", "Compliance"].map((lbl, i) => (
                <div key={lbl} className="hero-dash-metric-cell">
                  <div
                    className="hero-dash-skel"
                    style={{ width: "40%", height: "20px", marginBottom: "4px", animationDelay: `${i * 0.2}s` }}
                  />
                  <p className="hero-dash-metric-label">{lbl}</p>
                </div>
              ))}
            </div>

            {/* Fake sparkline */}
            <div className="hero-dash-sparkline-wrap">
              <svg viewBox="0 0 200 40" className="hero-dash-sparkline" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 35 C20 30 40 28 60 20 S100 10 120 15 S160 5 200 8"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M0 35 C20 30 40 28 60 20 S100 10 120 15 S160 5 200 8 L200 40 L0 40 Z"
                  fill="url(#sg)"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Bottle + Leaf illustration (bottom) ── */}
        <div className="hero-bottles-row">

          {/* Leaf cluster left */}
          <svg viewBox="0 0 60 80" className="hero-leaf hero-leaf-l" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 70 C10 50 5 20 30 5 C55 20 50 50 50 70" fill="#bbf7d0" opacity="0.7" />
            <path d="M30 5 L30 70" stroke="#6ee7b7" strokeWidth="1.5" fill="none" />
            {[15,25,35,45,55].map((y, i) => (
              <path key={i} d={`M30 ${y} C${i%2===0?'20':'40'} ${y-5} ${i%2===0?'15':'45'} ${y+3} 30 ${y+8}`}
                stroke="#6ee7b7" strokeWidth="0.8" fill="none" opacity="0.6" />
            ))}
          </svg>

          {/* Bottle 1 — tall dark */}
          <svg viewBox="0 0 44 100" className="hero-bottle hero-bottle-1" xmlns="http://www.w3.org/2000/svg">
            <rect x="16" y="0" width="12" height="10" rx="2" fill="#064e3b" />
            <rect x="13" y="10" width="18" height="6" rx="2" fill="#065f46" />
            <path d="M10 16 Q6 22 6 30 L6 86 Q6 94 22 94 Q38 94 38 86 L38 30 Q38 22 34 16 Z" fill="#047857" />
            <path d="M14 16 Q10 22 10 30 L10 86 Q10 92 22 92 L22 16 Z" fill="#059669" opacity="0.5" />
            <rect x="10" y="50" width="24" height="18" rx="3" fill="white" opacity="0.15" />
            <text x="22" y="62" textAnchor="middle" fontSize="4" fill="white" opacity="0.9" fontFamily="sans-serif">ROSE</text>
            <path d="M14 78 Q22 74 30 78" stroke="#34d399" strokeWidth="1" fill="none" opacity="0.6" />
          </svg>

          {/* Bottle 2 — round amber */}
          <svg viewBox="0 0 60 90" className="hero-bottle hero-bottle-2" xmlns="http://www.w3.org/2000/svg">
            <rect x="22" y="0" width="16" height="8" rx="3" fill="#78350f" />
            <rect x="18" y="8" width="24" height="5" rx="2" fill="#92400e" />
            <ellipse cx="30" cy="60" rx="22" ry="26" fill="#b45309" />
            <ellipse cx="30" cy="60" rx="22" ry="26" fill="url(#ambg)" />
            <defs>
              <radialGradient id="ambg" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect x="17" y="48" width="26" height="20" rx="4" fill="white" opacity="0.14" />
            <text x="30" y="61" textAnchor="middle" fontSize="4.5" fill="white" opacity="0.9" fontFamily="sans-serif">LAVEND.</text>
            <ellipse cx="22" cy="44" rx="5" ry="7" fill="white" opacity="0.12" />
          </svg>

          {/* Bottle 3 — dropper */}
          <svg viewBox="0 0 36 100" className="hero-bottle hero-bottle-3" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="18" cy="5" rx="4" ry="5" fill="#1e3a5f" />
            <rect x="15" y="5" width="6" height="14" rx="1" fill="#1e3a5f" />
            <rect x="12" y="19" width="12" height="4" rx="2" fill="#1e40af" />
            <path d="M9 23 Q5 28 5 36 L5 80 Q5 90 18 90 Q31 90 31 80 L31 36 Q31 28 27 23 Z" fill="#2563eb" />
            <path d="M11 23 Q8 28 8 36 L8 80 Q8 88 18 88 L18 23 Z" fill="#3b82f6" opacity="0.4" />
            <rect x="9" y="52" width="18" height="16" rx="3" fill="white" opacity="0.15" />
            <text x="18" y="63" textAnchor="middle" fontSize="3.5" fill="white" opacity="0.9" fontFamily="sans-serif">EUCAL.</text>
          </svg>

          {/* Leaf cluster right */}
          <svg viewBox="0 0 60 80" className="hero-leaf hero-leaf-r" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 70 C50 50 55 20 30 5 C5 20 10 50 10 70" fill="#a7f3d0" opacity="0.65" />
            <path d="M30 5 L30 70" stroke="#6ee7b7" strokeWidth="1.5" fill="none" />
            {[15,25,35,45,55].map((y, i) => (
              <path key={i} d={`M30 ${y} C${i%2!==0?'20':'40'} ${y-5} ${i%2!==0?'15':'45'} ${y+3} 30 ${y+8}`}
                stroke="#6ee7b7" strokeWidth="0.8" fill="none" opacity="0.6" />
            ))}
          </svg>
        </div>

        {/* ── Floating badge ── */}
        <motion.div
          className="hero-float-badge"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          <BadgeCheck className="hero-float-badge-icon" />
          <span>GC-MS Verified</span>
        </motion.div>

        {/* ── Floating quality pill ── */}
        <motion.div
          className="hero-float-pill"
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
        >
          <span className="hero-float-pill-dot" />
          <span>99.4% Purity Score</span>
        </motion.div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Hero component
───────────────────────────────────────────── */
function Hero() {
  const stats = [
    { icon: BadgeCheck, label: "Verified Batches",   target: 1280,  suffix: "+", delay: 0.55 },
    { icon: Users,      label: "Active Producers",   target: 240,   suffix: "+", delay: 0.65 },
    { icon: Globe,      label: "Countries Served",   target: 38,    suffix: "",  delay: 0.75 },
    { icon: Star,       label: "Quality Score",      target: 99.4,  suffix: "%", delay: 0.85 },
  ];

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 18 } },
  };

  return (
    <>
      {/* ── Hero section ── */}
      <section
        className="hero-root"
        aria-labelledby="hero-headline"
      >
        {/* Background blobs */}
        <div className="hero-blob hero-blob-1" aria-hidden="true" />
        <div className="hero-blob hero-blob-2" aria-hidden="true" />
        <div className="hero-blob hero-blob-3" aria-hidden="true" />

        {/* Grid texture overlay */}
        <div className="hero-grid-overlay" aria-hidden="true" />

        <div className="hero-inner">
          {/* ════════ LEFT COLUMN ════════ */}
          <motion.div
            className="hero-left"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            {/* Trust badge */}
            <motion.div variants={item}>
              <div className="hero-trust-badge" role="img" aria-label="Trust badge">
                <ShieldCheck className="hero-trust-icon" aria-hidden="true" />
                <span>Trusted by Essential Oil Producers</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 id="hero-headline" className="hero-headline" variants={item}>
              Track Oil Batches
              <br />
              <span className="hero-headline-accent">with Confidence</span>
            </motion.h1>

            {/* Supporting text */}
            <motion.p className="hero-subtext" variants={item}>
              Manage production batches, GC-MS lab certificates, and buyer
              dispatch records in one unified, auditable dashboard — built for
              producers and global buyers alike.
            </motion.p>

            {/* CTA buttons */}
            <motion.div className="hero-cta-row" variants={item}>
              <Link to="/batches" aria-label="Get started with AromaTrace">
                <Button variant="primary" size="lg" className="hero-btn-primary">
                  Get Started
                  <ArrowRight className="hero-btn-icon" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/dashboard" aria-label="View your dashboard">
                <Button variant="outline" size="lg" className="hero-btn-outline">
                  <LayoutDashboard className="hero-btn-icon" aria-hidden="true" />
                  View Dashboard
                </Button>
              </Link>
            </motion.div>

            {/* Trust chips */}
            <motion.div className="hero-trust-chips" variants={item} aria-label="Feature highlights">
              {[
                { icon: ShieldCheck, label: "GC-MS Lab Verified" },
                { icon: Leaf,        label: "100% Traceability"  },
                { icon: BadgeCheck,  label: "Immutable Audits"   },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="hero-chip">
                  <Icon className="hero-chip-icon" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* Stats grid */}
            <div className="hero-stats-grid" role="list" aria-label="Platform statistics">
              {stats.map((s) => (
                <div key={s.label} role="listitem">
                  <StatCard {...s} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* ════════ RIGHT COLUMN ════════ */}
          <motion.div
            className="hero-right"
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            <HeroIllustration />
          </motion.div>
        </div>
      </section>

      {/* ── Scoped styles ── */}
      <style>{`
        /* ── Root ── */
        .hero-root {
          position: relative;
          overflow: hidden;
          padding: 80px 0 72px;
          background: linear-gradient(160deg,
            #f0fdf4 0%,
            #ecfdf5 40%,
            #f8fafc 100%
          );
          transition: background 0.3s ease;
        }
        .dark .hero-root {
          background: linear-gradient(160deg,
            #020c09 0%,
            #031a12 40%,
            #0a0f14 100%
          );
        }
        @media (min-width: 768px) {
          .hero-root { padding: 100px 0 88px; }
        }

        /* ── Background blobs ── */
        .hero-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(72px);
          pointer-events: none;
          z-index: 0;
        }
        .hero-blob-1 {
          width: 520px; height: 520px;
          top: -120px; left: -80px;
          background: radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%);
        }
        .hero-blob-2 {
          width: 480px; height: 480px;
          top: 60px; right: -100px;
          background: radial-gradient(circle, rgba(20,184,166,0.14) 0%, transparent 70%);
        }
        .hero-blob-3 {
          width: 360px; height: 360px;
          bottom: -80px; left: 35%;
          background: radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%);
        }
        .dark .hero-blob-1 { background: radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%); }
        .dark .hero-blob-2 { background: radial-gradient(circle, rgba(20,184,166,0.09) 0%, transparent 70%); }
        .dark .hero-blob-3 { background: radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%); }

        /* ── Grid overlay ── */
        .hero-grid-overlay {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(16,185,129,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.045) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }
        .dark .hero-grid-overlay {
          background-image:
            linear-gradient(rgba(52,211,153,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52,211,153,0.04) 1px, transparent 1px);
        }

        /* ── Inner layout ── */
        .hero-inner {
          position: relative;
          z-index: 1;
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1.25rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }
        @media (min-width: 640px) { .hero-inner { padding: 0 1.5rem; } }
        @media (min-width: 1024px) {
          .hero-inner {
            padding: 0 2rem;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
          }
        }
        @media (min-width: 1280px) { .hero-inner { gap: 5rem; } }

        /* ── Left column ── */
        .hero-left {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* Trust badge */
        .hero-trust-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px 6px 10px;
          border-radius: 999px;
          background: rgba(16,185,129,0.10);
          border: 1px solid rgba(16,185,129,0.22);
          font-size: 0.72rem;
          font-weight: 700;
          color: #059669;
          letter-spacing: 0.02em;
          width: fit-content;
          margin-bottom: 1.25rem;
        }
        .dark .hero-trust-badge {
          background: rgba(52,211,153,0.10);
          border-color: rgba(52,211,153,0.22);
          color: #34d399;
        }
        .hero-trust-icon {
          width: 14px; height: 14px;
          flex-shrink: 0;
        }

        /* Headline */
        .hero-headline {
          font-size: clamp(2.1rem, 5vw, 3.5rem);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.035em;
          color: #0f172a;
          font-family: 'Inter', system-ui, sans-serif;
          margin-bottom: 1.25rem;
        }
        .dark .hero-headline { color: #f0fdf4; }
        .hero-headline-accent {
          display: inline-block;
          background: linear-gradient(110deg, #059669 0%, #10b981 45%, #34d399 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* Subtext */
        .hero-subtext {
          font-size: clamp(0.95rem, 2vw, 1.125rem);
          color: #475569;
          line-height: 1.7;
          max-width: 500px;
          margin-bottom: 2rem;
        }
        .dark .hero-subtext { color: #94a3b8; }

        /* CTA row */
        .hero-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .hero-cta-row a { text-decoration: none; }
        .hero-btn-icon { width: 16px; height: 16px; }
        .hero-btn-primary {
          box-shadow: 0 8px 24px -4px rgba(16,185,129,0.40) !important;
        }

        /* Trust chips */
        .hero-trust-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }
        .hero-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #374151;
          background: rgba(255,255,255,0.70);
          border: 1px solid rgba(16,185,129,0.15);
          backdrop-filter: blur(6px);
        }
        .dark .hero-chip {
          color: #d1fae5;
          background: rgba(16,185,129,0.08);
          border-color: rgba(52,211,153,0.18);
        }
        .hero-chip-icon {
          width: 12px; height: 12px;
          color: #10b981;
        }

        /* Stats grid */
        .hero-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        @media (min-width: 480px) { .hero-stats-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 1024px) { .hero-stats-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1280px) { .hero-stats-grid { grid-template-columns: repeat(4, 1fr); } }

        /* Stat card */
        .hero-stat-card {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 0.9rem;
          border-radius: 14px;
          background: rgba(255,255,255,0.65);
          border: 1px solid rgba(16,185,129,0.13);
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 12px rgba(16,185,129,0.07);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }
        .hero-stat-card:hover {
          box-shadow: 0 4px 20px rgba(16,185,129,0.15);
          transform: translateY(-2px);
        }
        .dark .hero-stat-card {
          background: rgba(16,30,26,0.60);
          border-color: rgba(52,211,153,0.14);
          box-shadow: 0 2px 12px rgba(0,0,0,0.25);
        }
        .hero-stat-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px; height: 30px;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(52,211,153,0.10));
          flex-shrink: 0;
        }
        .dark .hero-stat-icon-wrap {
          background: linear-gradient(135deg, rgba(16,185,129,0.18), rgba(52,211,153,0.10));
        }
        .hero-stat-icon {
          width: 14px; height: 14px;
          color: #10b981;
        }
        .dark .hero-stat-icon { color: #34d399; }
        .hero-stat-value {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          line-height: 1;
          font-family: 'Inter', system-ui, sans-serif;
        }
        .dark .hero-stat-value { color: #f0fdf4; }
        .hero-stat-label {
          font-size: 0.66rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-top: 2px;
        }
        .dark .hero-stat-label { color: #64748b; }

        /* ── Right column ── */
        .hero-right {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Illustration root ── */
        .hero-illus-root {
          position: relative;
          width: 100%;
          max-width: 480px;
        }
        .hero-illus-ring {
          position: absolute;
          inset: -20px;
          border-radius: 36px;
          background: radial-gradient(ellipse at 60% 40%,
            rgba(16,185,129,0.16) 0%,
            rgba(20,184,166,0.10) 50%,
            transparent 80%
          );
          filter: blur(24px);
          z-index: 0;
        }

        /* Glass card */
        .hero-illus-card {
          position: relative;
          z-index: 1;
          border-radius: 28px;
          background: rgba(255,255,255,0.62);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid rgba(16,185,129,0.18);
          box-shadow:
            0 4px 6px -1px rgba(0,0,0,0.06),
            0 24px 48px -8px rgba(16,185,129,0.14),
            inset 0 1px 0 rgba(255,255,255,0.8);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .dark .hero-illus-card {
          background: rgba(10,22,18,0.72);
          border-color: rgba(52,211,153,0.16);
          box-shadow:
            0 4px 6px -1px rgba(0,0,0,0.3),
            0 24px 48px -8px rgba(16,185,129,0.12),
            inset 0 1px 0 rgba(255,255,255,0.04);
        }

        /* Dashboard card */
        .hero-dash-card {
          border-radius: 18px;
          background: rgba(255,255,255,0.85);
          border: 1px solid rgba(226,232,240,0.80);
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        }
        .dark .hero-dash-card {
          background: rgba(15,23,36,0.90);
          border-color: rgba(51,65,85,0.60);
        }
        .hero-dash-titlebar {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          background: rgba(248,250,252,0.90);
          border-bottom: 1px solid rgba(226,232,240,0.60);
        }
        .dark .hero-dash-titlebar {
          background: rgba(15,23,36,1);
          border-bottom-color: rgba(51,65,85,0.50);
        }
        .hero-dash-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .hero-dash-url {
          flex: 1;
          height: 8px;
          border-radius: 999px;
          background: rgba(203,213,225,0.60);
          margin-left: 4px;
        }
        .dark .hero-dash-url { background: rgba(51,65,85,0.60); }
        .hero-dash-body { padding: 12px 14px; }
        .hero-dash-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .hero-dash-badge {
          font-size: 0.6rem;
          font-weight: 700;
          color: #10b981;
          background: rgba(16,185,129,0.12);
          border: 1px solid rgba(16,185,129,0.22);
          border-radius: 999px;
          padding: 2px 8px;
          letter-spacing: 0.03em;
        }
        .hero-dash-skel {
          border-radius: 6px;
          background: rgba(203,213,225,0.55);
          animation: hero-pulse 1.8s ease-in-out infinite;
        }
        .dark .hero-dash-skel { background: rgba(51,65,85,0.55); }
        .hero-dash-skel-title { width: 45%; height: 12px; }
        @keyframes hero-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        .hero-dash-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 12px;
        }
        .hero-dash-metric-cell {
          padding: 8px;
          border-radius: 10px;
          background: rgba(241,245,249,0.70);
          border: 1px solid rgba(226,232,240,0.50);
        }
        .dark .hero-dash-metric-cell {
          background: rgba(30,41,59,0.60);
          border-color: rgba(51,65,85,0.50);
        }
        .hero-dash-metric-label {
          font-size: 0.58rem;
          color: #94a3b8;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .hero-dash-sparkline-wrap {
          height: 44px;
          border-radius: 10px;
          overflow: hidden;
          background: rgba(241,245,249,0.50);
          border: 1px solid rgba(226,232,240,0.40);
        }
        .dark .hero-dash-sparkline-wrap {
          background: rgba(30,41,59,0.50);
          border-color: rgba(51,65,85,0.40);
        }
        .hero-dash-sparkline {
          width: 100%; height: 100%;
        }

        /* Bottles row */
        .hero-bottles-row {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem 0.25rem 0;
        }
        .hero-leaf {
          width: 48px;
          flex-shrink: 0;
          margin-bottom: 4px;
          filter: drop-shadow(0 4px 8px rgba(16,185,129,0.20));
        }
        .hero-leaf-l { transform: rotate(-8deg); }
        .hero-leaf-r { transform: rotate(8deg) scaleX(-1); }
        .hero-bottle { flex-shrink: 0; filter: drop-shadow(0 6px 14px rgba(0,0,0,0.18)); }
        .hero-bottle-1 { width: 52px; margin-bottom: 0; }
        .hero-bottle-2 { width: 66px; }
        .hero-bottle-3 { width: 44px; margin-bottom: 6px; }

        /* Floating badge */
        .hero-float-badge {
          position: absolute;
          top: -14px;
          right: 18px;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.90);
          border: 1px solid rgba(16,185,129,0.25);
          box-shadow: 0 4px 16px rgba(16,185,129,0.18);
          font-size: 0.7rem;
          font-weight: 700;
          color: #059669;
          backdrop-filter: blur(10px);
          white-space: nowrap;
        }
        .dark .hero-float-badge {
          background: rgba(10,22,18,0.88);
          color: #34d399;
          border-color: rgba(52,211,153,0.28);
        }
        .hero-float-badge-icon { width: 13px; height: 13px; }

        /* Floating pill */
        .hero-float-pill {
          position: absolute;
          bottom: 16px;
          left: -10px;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.88);
          border: 1px solid rgba(16,185,129,0.20);
          box-shadow: 0 4px 14px rgba(0,0,0,0.10);
          font-size: 0.68rem;
          font-weight: 700;
          color: #0f172a;
          backdrop-filter: blur(10px);
          white-space: nowrap;
        }
        .dark .hero-float-pill {
          background: rgba(10,22,18,0.88);
          color: #f0fdf4;
          border-color: rgba(52,211,153,0.22);
        }
        .hero-float-pill-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 6px rgba(16,185,129,0.70);
          flex-shrink: 0;
        }

        /* ── Focus rings for accessibility ── */
        .hero-cta-row a:focus-visible {
          outline: 2px solid #10b981;
          outline-offset: 3px;
          border-radius: 12px;
        }
      `}</style>
    </>
  );
}

export default Hero;