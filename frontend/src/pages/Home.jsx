import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getBatches } from "../api/batches";
import showToast from "../components/ui/Toast";
import Modal from "../components/ui/Modal";
import Loader from "../components/ui/Loader";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Hero from "../components/Hero";
import Card from "../components/Card";
import {
  Database,
  Layers,
  FileCheck,
  Users,
  ChevronRight,
  Plus,
  Search,
  FlaskConical,
  Globe,
  TrendingUp
} from "lucide-react";

/* ─── Animated counter hook ─── */
function useAnimatedCounter(target, isFloat, duration = 1600) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(isFloat ? parseFloat((eased * target).toFixed(1)) : Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, isFloat, duration]);

  return { ref, value };
}

/* ─── KPI Card ─── */
function KpiCard({ Icon, gradient, iconColor, iconBg, borderHover, glowHover, target, suffix, isFloat, label, sublabel, bars, barColor }) {
  const { ref, value } = useAnimatedCounter(target, isFloat);
  const maxBar = Math.max(...bars);

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.8 } } }}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      ref={ref}
      className={[
        "group relative flex flex-col p-6 rounded-2xl border border-white/8 transition-all duration-300 cursor-default",
        `bg-gradient-to-br ${gradient}`,
        "backdrop-blur-sm",
        "shadow-lg hover:shadow-2xl",
        borderHover,
        glowHover,
      ].join(" ")}
    >
      {/* Corner glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: "inset 0 0 40px rgba(16,185,129,0.08)" }} />

      {/* Icon + value row */}
      <div className="flex items-start justify-between mb-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
        </div>
        {/* Trend chip */}
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
          ↑ Live
        </span>
      </div>

      {/* Animated number */}
      <p className="text-4xl font-extrabold tracking-tight text-white leading-none mb-1">
        {isFloat ? value.toFixed(1) : value.toLocaleString()}{suffix}
      </p>
      <p className="text-sm font-bold text-white/90 mb-1">{label}</p>
      <p className="text-xs text-white/45 leading-snug mb-5">{sublabel}</p>

      {/* Mini bar sparkline */}
      <div className="mt-auto flex items-end gap-1 h-8" aria-hidden="true">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm ${barColor} opacity-60 group-hover:opacity-90 transition-all duration-500`}
            style={{
              height: `${(h / maxBar) * 100}%`,
              transitionDelay: `${i * 40}ms`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function Home() {
  const [open, setOpen] = useState(false);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyerName, setBuyerName] = useState("");

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const data = await getBatches();
      setBatches(data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load batches");
    } finally {
      setLoading(false);
    }
  };

  // Modern entry animations variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.8 } }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Platform Value Propositions Grid — 6 premium cards */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900/60 dark:to-slate-950 border-t border-b border-slate-200/60 dark:border-slate-800/60">

        {/* Decorative background blobs */}
        <div className="absolute top-0 left-1/4 -z-0 h-80 w-80 rounded-full bg-emerald-400/10 dark:bg-emerald-500/6 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -z-0 h-72 w-72 rounded-full bg-teal-400/10 dark:bg-teal-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20 dark:border-emerald-500/20 mb-5 shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Platform Capabilities
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
            >
              Enterprise-Grade{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                Supply Chain Integrity
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-4 text-base text-slate-500 dark:text-slate-400 leading-relaxed"
            >
              From harvest to buyer dispatch — verify purity, trace certificates, and automate compliance with high-fidelity telemetry at every step.
            </motion.p>
          </div>

          {/* 6-card grid */}
          <motion.div
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Database,
                color: "emerald",
                title: "Immutable Batch Ledger",
                desc: "Log batches with verified weight, source coordinates, and botanical specs. Every record is cryptographically sealed against tampering.",
              },
              {
                icon: FlaskConical,
                color: "teal",
                title: "GC-MS Laboratory Audits",
                desc: "Upload gas chromatography-mass spectrometry certificates and link tests directly to distillation records for maximum transparency.",
              },
              {
                icon: Layers,
                color: "emerald",
                title: "Multi-Tier Dispatches",
                desc: "Map complex batch splits, blends, and shipping lanes. Give buyers instant visibility into the exact origin of their active compounds.",
              },
              {
                icon: Globe,
                color: "teal",
                title: "Global Traceability",
                desc: "Track batches across 38+ countries with GPS-stamped origin coordinates. Full chain-of-custody from field to final destination.",
              },
              {
                icon: FileCheck,
                color: "emerald",
                title: "Compliance Reporting",
                desc: "Auto-generate ISO, IFRA, and organic certification reports. One-click export to PDF ready for buyer and regulatory review.",
              },
              {
                icon: TrendingUp,
                color: "teal",
                title: "Live Analytics Dashboard",
                desc: "Real-time yield trends, quality score charts, and dispatch velocity — all in a unified dashboard with role-based access control.",
              },
            ].map(({ icon: Icon, color, title, desc }, idx) => (
              <motion.div
                key={title}
                variants={fadeInVariants}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className={[
                  "group relative flex flex-col p-6 rounded-2xl border transition-all duration-300",
                  "bg-white dark:bg-slate-900/70",
                  "shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/10",
                  color === "emerald"
                    ? "border-slate-200/70 dark:border-slate-800/80 hover:border-emerald-300/60 dark:hover:border-emerald-700/50"
                    : "border-slate-200/70 dark:border-slate-800/80 hover:border-teal-300/60 dark:hover:border-teal-700/50",
                ].join(" ")}
              >
                {/* Top accent line on hover */}
                <div className={[
                  "absolute inset-x-0 top-0 h-0.5 rounded-t-2xl transition-all duration-300 opacity-0 group-hover:opacity-100",
                  color === "emerald"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : "bg-gradient-to-r from-teal-500 to-emerald-400",
                ].join(" ")} />

                {/* Icon badge */}
                <div className={[
                  "flex h-12 w-12 items-center justify-center rounded-xl mb-5 transition-all duration-300",
                  "group-hover:scale-110 group-hover:shadow-lg",
                  color === "emerald"
                    ? "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 group-hover:bg-emerald-500/15 group-hover:shadow-emerald-500/20"
                    : "bg-teal-500/10 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400 group-hover:bg-teal-500/15 group-hover:shadow-teal-500/20",
                ].join(" ")}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>

                {/* Card number */}
                <span className="absolute top-5 right-5 text-xs font-bold text-slate-300 dark:text-slate-700 group-hover:text-emerald-400/60 dark:group-hover:text-emerald-600/60 transition-colors duration-300 select-none">
                  {String(idx + 1).padStart(2, "0")}
                </span>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  {title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-grow">
                  {desc}
                </p>

                {/* Learn more link */}
                <div className={[
                  "mt-5 flex items-center gap-1 text-xs font-semibold transition-all duration-200",
                  "opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0",
                  color === "emerald"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-teal-600 dark:text-teal-400",
                ].join(" ")}>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  Learn more
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. Dynamic Interactive Sandbox / Demo Center */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col lg:flex-row items-stretch gap-10">

            {/* Interactive Form Panel */}
            <div className="flex-1 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Live Demo Workspace
                  </span>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">
                  Interact with the Trace Ledger
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                  Test the live state machine. Log a brand new batch into the registry, configure buyer parameters, and trigger verification audits.
                </p>

                {/* Input components */}
                <div className="space-y-5">
                  <Input
                    label="Buyer Name"
                    placeholder="Enter buyer name"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                  />

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => showToast("Batch Added Successfully!")}
                      className="flex items-center justify-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Batch
                    </Button>
                    <Button
                      variant="outline"
                      size="md"
                      onClick={() => setOpen(true)}
                    >
                      Inspect Demo Batch
                    </Button>
                  </div>
                </div>
              </div>

              {/* Decorative Guide */}
              <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold">i</div>
                  <p>All test runs use temporary session signatures. No local databases will be modified.</p>
                </div>
              </div>
            </div>

            {/* Dynamic Results Display (Batches List) */}
            <div className="flex-1 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/20 p-8 shadow-sm flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4 mb-6">
                <h4 className="text-sm font-semibold tracking-tight uppercase text-slate-500 dark:text-slate-400">
                  DISTILLATION REGISTRY RECORDS ({batches.length})
                </h4>
                <span className="text-xs text-slate-400">Synchronized</span>
              </div>

              {/* Load state or dynamic render */}
              {loading ? (
                <Loader />
              ) : batches.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                  <Database className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-3" />
                  <p className="text-xs font-semibold text-slate-400">No active batches registered</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                  {batches.map((batch) => (
                    <Card
                      key={batch.id}
                      title={batch.name}
                      description={`Quantity: ${batch.quantity} | Status: ${batch.status}`}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Modal Component rendering */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Batch Details"
      >
        <div className="space-y-4">
          <div className="p-3.5 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 rounded-xl flex items-center gap-3">
            <FlaskConical className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Rosemary Oil Batch</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wide">GC-MS Verified Purity</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-2.5 border border-slate-100 dark:border-slate-800/80">
              <p className="text-[10px] uppercase font-bold text-slate-400">Extraction Date</p>
              <p className="font-semibold mt-0.5">July 3, 2026</p>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-2.5 border border-slate-100 dark:border-slate-800/80">
              <p className="text-[10px] uppercase font-bold text-slate-400">Origin coordinates</p>
              <p className="font-semibold mt-0.5">37.7749° N, 122.4194° W</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            This premium Rosemary Oil (distilled under batch standard RM-409) has passed standard chromatography screening, confirming 99.4% alpha-pinene purity ratios.
          </p>
        </div>
      </Modal>

      {/* 4. Statistics KPI Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 dark:from-slate-950 dark:via-emerald-950/80 dark:to-slate-950">

        {/* Background decorative blobs */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-emerald-600/8 blur-3xl pointer-events-none" />

        {/* Subtle grid texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(52,211,153,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              By the Numbers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Powering{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Global Oil Traceability
              </span>
            </h2>
          </motion.div>

          {/* KPI cards grid */}
          <motion.div
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {[
              {
                icon: Database,
                gradient: "from-emerald-500/20 to-teal-500/10",
                iconColor: "text-emerald-400",
                iconBg: "bg-emerald-500/15",
                borderHover: "hover:border-emerald-500/40",
                glowHover: "hover:shadow-emerald-500/20",
                target: 1280,
                suffix: "+",
                isFloat: false,
                label: "Verified Batches",
                sublabel: "Cryptographically sealed batch records",
                bars: [40, 55, 48, 70, 62, 80, 75],
                barColor: "bg-emerald-400",
              },
              {
                icon: Users,
                gradient: "from-teal-500/20 to-emerald-500/10",
                iconColor: "text-teal-300",
                iconBg: "bg-teal-500/15",
                borderHover: "hover:border-teal-500/40",
                glowHover: "hover:shadow-teal-500/20",
                target: 240,
                suffix: "+",
                isFloat: false,
                label: "Active Producers",
                sublabel: "Independent growers on platform",
                bars: [30, 42, 38, 55, 50, 65, 60],
                barColor: "bg-teal-400",
              },
              {
                icon: Globe,
                gradient: "from-emerald-600/15 to-teal-600/10",
                iconColor: "text-emerald-300",
                iconBg: "bg-emerald-600/15",
                borderHover: "hover:border-emerald-400/40",
                glowHover: "hover:shadow-emerald-400/20",
                target: 38,
                suffix: "",
                isFloat: false,
                label: "Countries Served",
                sublabel: "Global supply chain coverage",
                bars: [20, 22, 25, 28, 30, 35, 38],
                barColor: "bg-emerald-300",
              },
              {
                icon: TrendingUp,
                gradient: "from-teal-400/20 to-emerald-400/10",
                iconColor: "text-teal-300",
                iconBg: "bg-teal-400/15",
                borderHover: "hover:border-teal-400/40",
                glowHover: "hover:shadow-teal-400/20",
                target: 99.4,
                suffix: "%",
                isFloat: true,
                label: "Quality Score",
                sublabel: "Average GC-MS purity rating",
                bars: [85, 88, 90, 92, 95, 97, 99],
                barColor: "bg-teal-300",
              },
            ].map(({ icon: Icon, gradient, iconColor, iconBg, borderHover, glowHover, target, suffix, isFloat, label, sublabel, bars, barColor }) => (
              <KpiCard
                key={label}
                Icon={Icon}
                gradient={gradient}
                iconColor={iconColor}
                iconBg={iconBg}
                borderHover={borderHover}
                glowHover={glowHover}
                target={target}
                suffix={suffix}
                isFloat={isFloat}
                label={label}
                sublabel={sublabel}
                bars={bars}
                barColor={barColor}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. Customer Testimonials */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-900/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Trusted by Distillers and Global Buyers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
              <p className="text-sm italic leading-relaxed text-slate-600 dark:text-slate-300">
                "Implementing AromaTrace reduced our buyer verification latency from three weeks to seconds. The ability to present GC-MS data on request has secured multiple key accounts."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold text-sm">MB</div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Marcus Vance</h4>
                  <p className="text-[10px] text-slate-400">Founder, High-Desert Botanicals</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
              <p className="text-sm italic leading-relaxed text-slate-600 dark:text-slate-300">
                "Our customers expect absolute botanical purity. AromaTrace provides an unbreakable chain of custody verification, matching exact distillations with batch shipment numbers."
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold text-sm">SL</div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white">Sophia Laurent</h4>
                  <p className="text-[10px] text-slate-400">Head of Sourcing, Laurent Perfumeries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. High Converting CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-900 to-teal-800 text-white dark:from-emerald-950 dark:to-teal-950 border-t border-emerald-500/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent"></div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-extrabold sm:text-4xl tracking-tight">
            Ready to secure your oil supply chain?
          </h2>
          <p className="mt-4 text-emerald-200 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Create a free trial account, trace up to three initial batches, and connect with verified buyers today. No credit card required.
          </p>
          <div className="mt-8 flex justify-center">
            <Button variant="secondary" size="lg" className="bg-white hover:bg-slate-100 text-emerald-900 hover:text-emerald-950 font-bold">
              Start Distillation Log
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;