import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Leaf, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Batches", path: "/batches" },
    { name: "Login", path: "/login" },
  ];

  return (
    <>
      {/* Navbar */}
      <nav
        aria-label="Main navigation"
        className={`navbar-root${scrolled ? " navbar-scrolled" : ""}`}
      >
        {/* Inner glow line at top */}
        <div className="navbar-top-line" aria-hidden="true" />

        <div className="navbar-container">
          {/* ── Logo ── */}
          <Link to="/" className="navbar-logo" aria-label="AromaTrace home">
            <span className="navbar-logo-icon-wrap" aria-hidden="true">
              <Leaf className="navbar-logo-icon" />
              {/* Animated halo */}
              <span className="navbar-logo-halo" />
            </span>
            <span className="navbar-logo-text">
              Aroma<span className="navbar-logo-accent">Trace</span>
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="navbar-desktop" role="navigation" aria-label="Desktop navigation">
            <ul className="navbar-links" role="list">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.path} className="navbar-link-item">
                    <Link
                      to={link.path}
                      aria-current={isActive ? "page" : undefined}
                      className={`navbar-link${isActive ? " navbar-link-active" : ""}`}
                    >
                      {link.name}
                      {isActive && (
                        <motion.span
                          layoutId="activeNavPill"
                          className="navbar-link-pill"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Divider */}
            <span className="navbar-divider" aria-hidden="true" />

            {/* Dark mode toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setDarkMode(!darkMode)}
              className="navbar-theme-btn"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {darkMode ? (
                  <motion.span
                    key="sun"
                    initial={{ opacity: 0, rotate: -60, scale: 0.7 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 60, scale: 0.7 }}
                    transition={{ duration: 0.22 }}
                    style={{ display: "flex" }}
                  >
                    <Sun className="navbar-theme-icon sun" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ opacity: 0, rotate: 60, scale: 0.7 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -60, scale: 0.7 }}
                    transition={{ duration: 0.22 }}
                    style={{ display: "flex" }}
                  >
                    <Moon className="navbar-theme-icon moon" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* ── Mobile controls ── */}
          <div className="navbar-mobile-controls" ref={mobileMenuRef}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="navbar-theme-btn"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode
                ? <Sun className="navbar-theme-icon sun" />
                : <Moon className="navbar-theme-icon moon" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="navbar-hamburger"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={{ opacity: 0, rotate: -45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.18 }}
                    style={{ display: "flex" }}
                  >
                    <X className="h-5 w-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ opacity: 0, rotate: 45 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -45 }}
                    transition={{ duration: 0.18 }}
                    style={{ display: "flex" }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── Mobile menu panel ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              role="navigation"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="navbar-mobile-panel"
            >
              <ul className="navbar-mobile-links" role="list">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        aria-current={isActive ? "page" : undefined}
                        className={`navbar-mobile-link${isActive ? " navbar-mobile-link-active" : ""}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {isActive && (
                          <span className="navbar-mobile-dot" aria-hidden="true" />
                        )}
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Scoped styles */}
      <style>{`
        /* ── Root ── */
        .navbar-root {
          position: sticky;
          top: 0;
          z-index: 40;
          width: 100%;
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(18px) saturate(180%);
          -webkit-backdrop-filter: blur(18px) saturate(180%);
          border-bottom: 1px solid rgba(16,185,129,0.10);
          box-shadow: 0 1px 0 0 rgba(16,185,129,0.06);
          transition: box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease;
        }
        .dark .navbar-root {
          background: rgba(10,20,18,0.78);
          border-bottom-color: rgba(16,185,129,0.12);
          box-shadow: 0 1px 0 0 rgba(16,185,129,0.08);
        }
        .navbar-root.navbar-scrolled {
          background: rgba(255,255,255,0.88);
          box-shadow:
            0 4px 24px -4px rgba(16,185,129,0.12),
            0 1px 0 0 rgba(16,185,129,0.10);
        }
        .dark .navbar-root.navbar-scrolled {
          background: rgba(8,16,14,0.92);
          box-shadow:
            0 4px 24px -4px rgba(16,185,129,0.18),
            0 1px 0 0 rgba(16,185,129,0.14);
        }

        /* ── Top accent line ── */
        .navbar-top-line {
          height: 2px;
          width: 100%;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(16,185,129,0.55) 30%,
            rgba(52,211,153,0.80) 50%,
            rgba(16,185,129,0.55) 70%,
            transparent 100%
          );
          opacity: 0.85;
        }

        /* ── Container ── */
        .navbar-container {
          max-width: 80rem;
          margin: 0 auto;
          padding: 0 1.25rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        @media (min-width: 640px) { .navbar-container { padding: 0 1.5rem; } }
        @media (min-width: 1024px) { .navbar-container { padding: 0 2rem; } }

        /* ── Logo ── */
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          flex-shrink: 0;
        }
        .navbar-logo-icon-wrap {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(52,211,153,0.20) 100%);
          border: 1px solid rgba(16,185,129,0.22);
          transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), box-shadow 0.25s ease;
        }
        .navbar-logo:hover .navbar-logo-icon-wrap {
          transform: scale(1.1) rotate(-6deg);
          box-shadow: 0 0 14px rgba(16,185,129,0.30);
        }
        .dark .navbar-logo-icon-wrap {
          background: linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(52,211,153,0.14) 100%);
          border-color: rgba(52,211,153,0.25);
        }
        .navbar-logo-icon {
          width: 18px;
          height: 18px;
          color: #10b981;
          position: relative;
          z-index: 1;
        }
        .dark .navbar-logo-icon { color: #34d399; }
        .navbar-logo-halo {
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          background: radial-gradient(circle at 60% 40%, rgba(52,211,153,0.35) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .navbar-logo:hover .navbar-logo-halo { opacity: 1; }

        .navbar-logo-text {
          font-size: 1.125rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #0f172a;
          font-family: 'Inter', system-ui, sans-serif;
          transition: color 0.2s;
        }
        .dark .navbar-logo-text { color: #f0fdf4; }
        .navbar-logo-accent {
          background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* ── Desktop nav ── */
        .navbar-desktop {
          display: none;
          align-items: center;
          gap: 0.5rem;
        }
        @media (min-width: 768px) { .navbar-desktop { display: flex; } }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .navbar-link-item { position: relative; }

        .navbar-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 0.38rem 0.85rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #475569;
          text-decoration: none;
          letter-spacing: 0.01em;
          transition: color 0.2s ease, background 0.2s ease;
          z-index: 1;
        }
        .dark .navbar-link { color: #94a3b8; }

        .navbar-link:hover {
          color: #10b981;
          background: rgba(16,185,129,0.07);
        }
        .dark .navbar-link:hover {
          color: #34d399;
          background: rgba(52,211,153,0.08);
        }

        .navbar-link-active {
          color: #059669 !important;
          font-weight: 600;
        }
        .dark .navbar-link-active { color: #34d399 !important; }

        .navbar-link-pill {
          position: absolute;
          inset: 0;
          border-radius: 8px;
          background: linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(52,211,153,0.08) 100%);
          border: 1px solid rgba(16,185,129,0.18);
          z-index: -1;
        }
        .dark .navbar-link-pill {
          background: linear-gradient(135deg, rgba(52,211,153,0.10) 0%, rgba(16,185,129,0.07) 100%);
          border-color: rgba(52,211,153,0.20);
        }

        /* ── Divider ── */
        .navbar-divider {
          width: 1px;
          height: 24px;
          background: linear-gradient(180deg, transparent, rgba(16,185,129,0.22), transparent);
          margin: 0 0.5rem;
          flex-shrink: 0;
        }

        /* ── Theme button ── */
        .navbar-theme-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 9px;
          border: 1px solid rgba(16,185,129,0.15);
          background: rgba(241,245,249,0.70);
          color: #64748b;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.18s ease;
          flex-shrink: 0;
        }
        .navbar-theme-btn:hover {
          background: rgba(16,185,129,0.08);
          border-color: rgba(16,185,129,0.28);
          box-shadow: 0 0 10px rgba(16,185,129,0.15);
          color: #10b981;
        }
        .dark .navbar-theme-btn {
          background: rgba(15,23,42,0.60);
          border-color: rgba(52,211,153,0.15);
          color: #94a3b8;
        }
        .dark .navbar-theme-btn:hover {
          background: rgba(52,211,153,0.10);
          border-color: rgba(52,211,153,0.30);
          color: #34d399;
        }

        .navbar-theme-icon { width: 16px; height: 16px; }
        .navbar-theme-icon.sun { color: #f59e0b; }
        .navbar-theme-icon.moon { color: #7c3aed; }
        .dark .navbar-theme-icon.sun { color: #fbbf24; }
        .dark .navbar-theme-icon.moon { color: #a78bfa; }

        /* ── Hamburger ── */
        .navbar-hamburger {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 9px;
          border: 1px solid rgba(16,185,129,0.15);
          background: rgba(241,245,249,0.70);
          color: #475569;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .navbar-hamburger:hover {
          background: rgba(16,185,129,0.08);
          border-color: rgba(16,185,129,0.28);
          color: #10b981;
        }
        .dark .navbar-hamburger {
          background: rgba(15,23,42,0.60);
          border-color: rgba(52,211,153,0.15);
          color: #94a3b8;
        }
        .dark .navbar-hamburger:hover {
          background: rgba(52,211,153,0.10);
          border-color: rgba(52,211,153,0.30);
          color: #34d399;
        }

        /* ── Mobile controls ── */
        .navbar-mobile-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        @media (min-width: 768px) { .navbar-mobile-controls { display: none; } }

        /* ── Mobile panel ── */
        .navbar-mobile-panel {
          overflow: hidden;
          border-top: 1px solid rgba(16,185,129,0.10);
          background: rgba(255,255,255,0.90);
          backdrop-filter: blur(18px) saturate(160%);
          -webkit-backdrop-filter: blur(18px) saturate(160%);
          padding: 0.5rem 1.25rem 0.75rem;
        }
        .dark .navbar-mobile-panel {
          background: rgba(8,16,14,0.94);
          border-top-color: rgba(52,211,153,0.12);
        }
        @media (min-width: 640px) { .navbar-mobile-panel { padding: 0.5rem 1.5rem 0.75rem; } }

        .navbar-mobile-links {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .navbar-mobile-link {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.6rem 0.9rem;
          border-radius: 10px;
          font-size: 0.9375rem;
          font-weight: 500;
          color: #475569;
          text-decoration: none;
          transition: background 0.18s ease, color 0.18s ease;
        }
        .navbar-mobile-link:hover {
          background: rgba(16,185,129,0.07);
          color: #10b981;
        }
        .dark .navbar-mobile-link { color: #94a3b8; }
        .dark .navbar-mobile-link:hover {
          background: rgba(52,211,153,0.08);
          color: #34d399;
        }

        .navbar-mobile-link-active {
          background: linear-gradient(135deg, rgba(16,185,129,0.10) 0%, rgba(52,211,153,0.06) 100%);
          color: #059669 !important;
          font-weight: 600;
          border: 1px solid rgba(16,185,129,0.14);
        }
        .dark .navbar-mobile-link-active {
          background: linear-gradient(135deg, rgba(52,211,153,0.10) 0%, rgba(16,185,129,0.06) 100%);
          color: #34d399 !important;
          border-color: rgba(52,211,153,0.18);
        }

        .navbar-mobile-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #34d399);
          flex-shrink: 0;
          box-shadow: 0 0 6px rgba(16,185,129,0.55);
        }

        /* ── Focus ring for accessibility ── */
        .navbar-link:focus-visible,
        .navbar-mobile-link:focus-visible,
        .navbar-theme-btn:focus-visible,
        .navbar-hamburger:focus-visible,
        .navbar-logo:focus-visible {
          outline: 2px solid #10b981;
          outline-offset: 2px;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
}

export default Navbar;