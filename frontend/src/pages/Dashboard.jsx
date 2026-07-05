import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getBatches } from "../api/batches";
import showToast from "../components/ui/Toast";
import Modal from "../components/ui/Modal";
import Loader from "../components/ui/Loader";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
  LayoutDashboard,
  FlaskConical,
  Bell,
  Search,
  Plus,
  Activity,
  FileText,
  CheckCircle2,
  Clock,
  TrendingUp,
  Leaf,
  Download,
  RefreshCw,
  TrendingDown,
  ArrowRight,
  Sparkles,
  Clipboard,
  ShieldCheck,
  PackageCheck,
  Droplet,
  Award,
  Users,
  Compass,
  Zap,
  BarChart2,
  CheckCheck,
} from "lucide-react";

/* ── Animation variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } },
};

/* ── Animated counter ── */
function useCounter(target, isFloat = false, duration = 1400) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (now) => {
          const p = Math.min((now - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(isFloat ? parseFloat((eased * target).toFixed(1)) : Math.round(eased * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, isFloat, duration]);
  return { ref, val };
}

/* ── KPI card ── */
function KpiCard({ icon: Icon, label, sublabel, target, suffix, isFloat, accentFrom, accentTo, iconBg, iconColor, trend, variants }) {
  const { ref, val } = useCounter(target, isFloat);
  return (
    <motion.div
      ref={ref}
      variants={variants}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/10 overflow-hidden transition-all duration-300"
    >
      {/* Top gradient accent line */}
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${accentFrom} ${accentTo} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Background glow blob */}
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${accentFrom} ${accentTo} opacity-[0.07] blur-2xl group-hover:opacity-[0.14] transition-opacity duration-500`} />

      <div className="flex items-start justify-between mb-4 relative">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
          <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
        </div>
        {trend != null && (
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold rounded-full px-2.5 py-0.5 ${trend >= 0 ? "text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 dark:text-emerald-400" : "text-rose-500 bg-rose-500/10 border border-rose-500/20"}`}>
            {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div className="relative">
        <p className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-none mb-1">
          {isFloat ? val.toFixed(1) : val.toLocaleString()}{suffix}
        </p>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wide font-semibold">{sublabel}</p>
      </div>
    </motion.div>
  );
}

/* ── Activity dot colour ── */
const activityDot = {
  purity:   { bg: "bg-amber-400",   ring: "ring-amber-400/30",   icon: ShieldCheck },
  distill:  { bg: "bg-emerald-500", ring: "ring-emerald-500/30", icon: Droplet     },
  dispatch: { bg: "bg-blue-500",    ring: "ring-blue-500/30",    icon: PackageCheck},
  system:   { bg: "bg-slate-400",   ring: "ring-slate-400/30",   icon: Compass     },
};

/* ═══════════════════════════════════════════
   Dashboard component
═══════════════════════════════════════════ */
function Dashboard() {
  /* ── All original state ── */
  const [batches, setBatches]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [searchQuery, setSearchQuery]       = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedBatch, setSelectedBatch]   = useState(null);
  const [quickAddModal, setQuickAddModal]   = useState(false);
  const [newBatchForm, setNewBatchForm]     = useState({ name: "", quantity: "", status: "Active" });

  const [notifications, setNotifications] = useState([
    { id: 1, text: "GC-MS Purity test passed (99.4%) for Rosemary RM-409", type: "success", time: "10m ago" },
    { id: 2, text: "New Lavender LV-112 batch added to trace registry",      type: "info",    time: "1h ago"  },
    { id: 3, text: "Batch EU-882 dispatch cleared for Laurent Perfumeries",   type: "dispatch",time: "3h ago"  },
  ]);

  /* ── Original API / logic ── */
  useEffect(() => { fetchBatches(); }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const data = await getBatches();
      setBatches(data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const totalVolume    = batches.reduce((s, b) => s + (Number(b.quantity) || 0), 0);
  const activeCount    = batches.filter(b => b.status.toLowerCase().includes("active") || b.status.toLowerCase().includes("process")).length;
  const pendingCount   = batches.filter(b => b.status.toLowerCase().includes("test")  || b.status.toLowerCase().includes("pend")).length;
  const dispatchCount  = batches.filter(b => b.status.toLowerCase().includes("dispatch") || b.status.toLowerCase().includes("complet") || b.status.toLowerCase().includes("success")).length;
  const certifiedCount = batches.length - pendingCount;

  const filteredBatches = batches.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (statusVal) => {
    const v = statusVal.toLowerCase();
    if (v.includes("test") || v.includes("pend"))
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
    if (v.includes("dispatch") || v.includes("complet") || v.includes("success") || v.includes("active"))
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
    return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20";
  };

  const triggerSimulation = (actionName) => {
    if      (actionName === "refresh")   { fetchBatches(); showToast("Distillery Registry Synced!"); }
    else if (actionName === "export")    { showToast("Liters database exported successfully!"); }
    else if (actionName === "audit")     { showToast("Distillery compliance trail: 100% Purity Cleared"); }
    else if (actionName === "lab-check") { showToast("GC-MS Analysis validation completed."); }
  };

  const handleCreateBatch = (e) => {
    e.preventDefault();
    if (!newBatchForm.name || !newBatchForm.quantity) { showToast("Please fill out all fields"); return; }
    setBatches([{ id: Date.now(), name: newBatchForm.name, quantity: Number(newBatchForm.quantity), status: newBatchForm.status, createdAt: new Date().toISOString() }, ...batches]);
    setQuickAddModal(false);
    setNewBatchForm({ name: "", quantity: "", status: "Active" });
    showToast("Batch Logged Successfully!");
  };

  /* ── Donut ── */
  const totalForChart = activeCount + pendingCount + dispatchCount || 1;
  const activePct   = Math.round((activeCount  / totalForChart) * 100);
  const pendingPct  = Math.round((pendingCount / totalForChart) * 100);
  const dispatchPct = Math.round((dispatchCount/ totalForChart) * 100);
  const chartRadius = 15.91549430918954;

  /* ── Activity ── */
  const activityLogs = [
    { label: "Purity Released",           text: "Rosemary Batch RM-409 passed GC-MS chromatogram test. 99.4% pinene detected.",     time: "10m ago", type: "purity"   },
    { label: "Steam Distillation Logged", text: "Organic Lavender distillation yield registered into inventory.",                   time: "1h ago",  type: "distill"  },
    { label: "Buyer Dispatch Sealed",     text: "Rosemary yield batch dispatched to Laurent Perfumeries.",                          time: "3h ago",  type: "dispatch" },
    { label: "Operator Calibration Check",text: "Low-temp extraction vacuum valves successfully calibrated.",                       time: "1d ago",  type: "system"   },
  ];

  /* ── Bar chart data ── */
  const barData = [
    { label: "Jan", val: 120 },
    { label: "Feb", val: 230 },
    { label: "Mar", val: 340 },
    { label: "Apr", val: 290 },
    { label: "May", val: 410 },
    { label: "Jun", val: 380 },
  ];
  const barMax = Math.max(...barData.map(d => d.val));

  /* ════════════════════ RENDER ════════════════════ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-7">

        {/* ══ 1. TOP CONTROL BAR ══ */}
        <section className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-5 py-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm">

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search batches by name or status…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search batches"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60 bg-slate-50/80 dark:bg-slate-950/80 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder-slate-400 font-medium text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button variant="outline" size="sm" onClick={() => triggerSimulation("refresh")} className="flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Sync Registry
            </Button>
            <Button variant="outline" size="sm" onClick={() => triggerSimulation("export")} className="flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Export Data
            </Button>
            <Button variant="primary" size="sm" onClick={() => setQuickAddModal(true)} className="flex items-center gap-1.5">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Log Extraction
            </Button>

            {/* Notifications */}
            <div className="relative pl-2.5 border-l border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-xl p-2.5 bg-slate-100/70 dark:bg-slate-800/60 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/10 border border-slate-200/60 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                aria-label={`Notifications${notifications.length > 0 ? ` (${notifications.length} unread)` : ""}`}
                aria-expanded={showNotifications}
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-3 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-2xl z-30 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Telemetry Alerts</span>
                      <button onClick={() => setNotifications([])} className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Clear all</button>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-400">No active alerts</div>
                      ) : notifications.map(n => (
                        <div key={n.id} className="flex gap-3 px-4 py-3 hover:bg-emerald-500/5 dark:hover:bg-slate-800/40 transition-colors">
                          <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-400 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-snug">{n.text}</p>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">{n.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ══ 2. WELCOME HERO BANNER ══ */}
        <motion.section
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-900 to-teal-900 dark:from-emerald-950 dark:via-slate-950 dark:to-teal-950 text-white p-8 md:p-10 border border-emerald-500/10 shadow-lg"
        >
          {/* Decorative blobs */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[radial-gradient(ellipse_at_right,_#fbbf24,transparent_60%)] pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 text-emerald-200 border border-white/10">
                <Sparkles className="h-3 w-3 text-amber-400" aria-hidden="true" />
                Distillery Console v1.2
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Pure Essences, Sealed Trails</h1>
              <p className="text-sm text-emerald-100/80 leading-relaxed">
                Monitor steam extraction parameters, catalog GC-MS certificates, and secure your supply chain from soil to recipient flask.
              </p>
              <div className="flex flex-wrap items-center gap-5 text-xs font-bold text-emerald-200 pt-1">
                <span className="flex items-center gap-1.5"><Leaf className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />NOP Organic Compliant</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />GC-MS Verified</span>
                <span className="flex items-center gap-1.5"><CheckCheck className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />ISO Certified</span>
              </div>
            </div>

            {/* Banner mini stats */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              {[
                { icon: BarChart2,    label: "Batches", value: batches.length },
                { icon: Droplet,      label: "Liters",  value: `${totalVolume}L` },
                { icon: CheckCircle2, label: "Cleared", value: certifiedCount },
              ].map(({ icon: I, label, value }) => (
                <div key={label} className="flex flex-col items-center justify-center bg-white/8 dark:bg-white/5 border border-white/10 rounded-2xl p-4 min-w-[80px]">
                  <I className="h-4 w-4 text-emerald-300 mb-2" aria-hidden="true" />
                  <p className="text-xl font-black text-white leading-none">{value}</p>
                  <p className="text-[9px] text-emerald-300 uppercase tracking-wider font-bold mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ══ 3. CONTENT ══ */}
        {loading ? (
          <Loader />
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-7">

            {/* ── KPI Cards ── */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" aria-label="Key performance indicators">
              {[
                {
                  icon: FlaskConical, label: "Total Batches", sublabel: "Botanical Logs",
                  target: batches.length, suffix: "", isFloat: false, trend: 12,
                  accentFrom: "from-emerald-500", accentTo: "to-teal-400",
                  iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15", iconColor: "text-emerald-600 dark:text-emerald-400",
                },
                {
                  icon: Clock, label: "Processing", sublabel: "Active Distillations",
                  target: activeCount, suffix: "", isFloat: false, trend: 5,
                  accentFrom: "from-amber-500", accentTo: "to-yellow-400",
                  iconBg: "bg-amber-500/10 dark:bg-amber-500/15", iconColor: "text-amber-600 dark:text-amber-400",
                },
                {
                  icon: PackageCheck, label: "Completed", sublabel: "Dispatched to Buyers",
                  target: dispatchCount, suffix: "", isFloat: false, trend: -3,
                  accentFrom: "from-blue-500", accentTo: "to-indigo-400",
                  iconBg: "bg-blue-500/10 dark:bg-blue-500/15", iconColor: "text-blue-600 dark:text-blue-400",
                },
                {
                  icon: Award, label: "Certificates", sublabel: "GC-MS Purity Checked",
                  target: certifiedCount, suffix: "", isFloat: false, trend: 8,
                  accentFrom: "from-purple-500", accentTo: "to-pink-400",
                  iconBg: "bg-purple-500/10 dark:bg-purple-500/15", iconColor: "text-purple-600 dark:text-purple-400",
                },
              ].map(s => (
                <KpiCard key={s.label} {...s} variants={itemVariants} />
              ))}
            </section>

            {/* ── Charts Row ── */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Bar chart — 2/3 */}
              <motion.div
                variants={itemVariants}
                className="lg:col-span-2 flex flex-col p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Production Overview</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Monthly Distillation Yields (Liters)</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    <Droplet className="h-3 w-3 text-amber-500" aria-hidden="true" />Active Yield
                  </span>
                </div>

                {/* Y-axis labels + bars */}
                <div className="flex gap-3 flex-1">
                  {/* Y-axis */}
                  <div className="flex flex-col justify-between pb-7 text-[9px] text-slate-300 dark:text-slate-700 font-bold text-right select-none w-8">
                    {[barMax, Math.round(barMax*0.75), Math.round(barMax*0.5), Math.round(barMax*0.25), 0].map(v => (
                      <span key={v}>{v}</span>
                    ))}
                  </div>

                  {/* Bars */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 relative">
                      {/* Grid lines */}
                      {[0.25, 0.5, 0.75].map(f => (
                        <div key={f} className="absolute inset-x-0 border-t border-dashed border-slate-100 dark:border-slate-800/50" style={{ bottom: `${f * 100}%` }} />
                      ))}
                      {/* Bar columns */}
                      <div className="absolute inset-0 flex items-end justify-between gap-3 px-1">
                        {barData.map(bar => (
                          <div key={bar.label} className="flex-1 flex flex-col items-center gap-1.5 h-full group relative justify-end">
                            {/* Tooltip */}
                            <div className="absolute bottom-[calc(100%+4px)] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 bg-slate-900 dark:bg-slate-700 text-white text-[10px] px-2.5 py-1.5 rounded-lg pointer-events-none font-bold whitespace-nowrap z-10 shadow-lg transition-all duration-150">
                              {bar.val}L
                            </div>
                            <div
                              className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 dark:from-emerald-600 dark:to-emerald-400 group-hover:from-amber-500 group-hover:to-amber-300 transition-all duration-300 shadow-sm"
                              style={{ height: `${(bar.val / barMax) * 100}%` }}
                              role="img"
                              aria-label={`${bar.label}: ${bar.val} liters`}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* X labels */}
                    <div className="flex justify-between px-1 pt-2">
                      {barData.map(bar => (
                        <span key={bar.label} className="flex-1 text-center text-[10px] font-bold text-slate-400">{bar.label}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Donut chart — 1/3 */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col p-6 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm shadow-sm"
              >
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Batch Ratios</h3>
                <p className="text-xs text-slate-400 mb-5">Status distribution</p>

                <div className="relative aspect-square flex items-center justify-center max-w-[160px] mx-auto">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r={chartRadius} fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="4.5" />
                    {activePct > 0 && (
                      <circle cx="18" cy="18" r={chartRadius} fill="none" stroke="#059669" strokeWidth="4.5"
                        strokeDasharray={`${activePct} ${100 - activePct}`} strokeDashoffset={100}
                        className="transition-all duration-700" />
                    )}
                    {pendingPct > 0 && (
                      <circle cx="18" cy="18" r={chartRadius} fill="none" stroke="#f59e0b" strokeWidth="4.5"
                        strokeDasharray={`${pendingPct} ${100 - pendingPct}`} strokeDashoffset={100 - activePct}
                        className="transition-all duration-700" />
                    )}
                    {dispatchPct > 0 && (
                      <circle cx="18" cy="18" r={chartRadius} fill="none" stroke="#3b82f6" strokeWidth="4.5"
                        strokeDasharray={`${dispatchPct} ${100 - dispatchPct}`} strokeDashoffset={100 - activePct - pendingPct}
                        className="transition-all duration-700" />
                    )}
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">{batches.length}</span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mt-0.5">Total</span>
                  </div>
                </div>

                <div className="mt-5 space-y-2.5">
                  {[
                    { color: "bg-emerald-500", label: "Active",    pct: activePct   },
                    { color: "bg-amber-500",   label: "Testing",   pct: pendingPct  },
                    { color: "bg-blue-500",    label: "Completed", pct: dispatchPct },
                  ].map(({ color, label, pct }) => (
                    <div key={label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${color} flex-shrink-0`} />
                        <span className="font-semibold text-slate-600 dark:text-slate-400">{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300 w-7 text-right">{pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* ── Table + Sidebar ── */}
            <section className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-stretch">

              {/* Batch table — 2/3 */}
              <motion.div
                variants={itemVariants}
                className="xl:col-span-2 flex flex-col rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Live Distillation Logs</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{filteredBatches.length} records found</p>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 px-2.5 py-1 rounded-full font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    Operational Feed
                  </span>
                </div>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left text-xs" role="table" aria-label="Distillation batch records">
                    <thead>
                      <tr className="bg-slate-50/80 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="px-5 py-3">Batch ID</th>
                        <th className="px-4 py-3">Oil Name</th>
                        <th className="px-4 py-3">Quantity</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                      {filteredBatches.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-12 text-center text-slate-400 font-semibold text-xs">
                            No batches match your search.
                          </td>
                        </tr>
                      ) : filteredBatches.slice(0, 5).map(batch => (
                        <tr
                          key={batch.id}
                          className="hover:bg-emerald-500/5 dark:hover:bg-slate-800/40 transition-colors group"
                        >
                          <td className="px-5 py-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400 text-[11px]">
                            #{batch.id.toString().slice(-6)}
                          </td>
                          <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200">{batch.name}</td>
                          <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 font-medium">{batch.quantity}L</td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusBadge(batch.status)}`}>
                              {batch.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <Link
                              to={`/batches/${batch.id}`}
                              className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              View Trace <ArrowRight className="h-3 w-3" aria-hidden="true" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredBatches.length > 5 && (
                  <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{filteredBatches.length - 5} more batches</span>
                    <Link to="/batches" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1">
                      View all <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </motion.div>

              {/* Right sidebar — 1/3 */}
              <div className="flex flex-col gap-5">

                {/* Quick Actions */}
                <motion.div
                  variants={itemVariants}
                  className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm shadow-sm"
                >
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { icon: RefreshCw,   label: "Reload Feed",  sub: "Sync registry",      action: "refresh",   style: "default" },
                      { icon: Award,       label: "Purity Check", sub: "Verify chromatograms",action: "audit",     style: "default" },
                      { icon: FlaskConical,label: "GC-MS Verify", sub: "Simulate composition",action: "lab-check", style: "default" },
                      { icon: Plus,        label: "Log Batch",    sub: "Distill new extract", action: "add",       style: "primary" },
                    ].map(({ icon: I, label, sub, action, style }) => (
                      <button
                        key={label}
                        onClick={() => action === "add" ? setQuickAddModal(true) : triggerSimulation(action)}
                        className={[
                          "p-4 rounded-xl text-left transition-all duration-200 group",
                          style === "primary"
                            ? "bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-500/20 shadow-sm hover:shadow-emerald-500/25 hover:shadow-lg"
                            : "bg-slate-50/80 dark:bg-slate-800/50 hover:bg-emerald-500/8 dark:hover:bg-emerald-500/8 border border-slate-200/60 dark:border-slate-700/50 hover:border-emerald-400/30 dark:hover:border-emerald-700/40",
                        ].join(" ")}
                        aria-label={label}
                      >
                        <I className={`h-4.5 w-4.5 mb-2 transition-transform group-hover:scale-110 ${style === "primary" ? "text-white" : "text-emerald-600 dark:text-emerald-400"}`} aria-hidden="true" />
                        <p className={`text-xs font-bold ${style === "primary" ? "text-white" : "text-slate-800 dark:text-slate-200"}`}>{label}</p>
                        <p className={`text-[10px] mt-0.5 ${style === "primary" ? "text-emerald-100/80" : "text-slate-400"}`}>{sub}</p>
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Activity Timeline */}
                <motion.div
                  variants={itemVariants}
                  className="flex-1 p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm shadow-sm"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Activity</h3>
                    <Activity className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                  </div>

                  <ol className="relative space-y-0" aria-label="Activity timeline">
                    {activityLogs.map((act, idx) => {
                      const { bg, ring, icon: ActIcon } = activityDot[act.type];
                      const isLast = idx === activityLogs.length - 1;
                      return (
                        <li key={idx} className="relative flex gap-3 pb-5 last:pb-0">
                          {/* Vertical connector */}
                          {!isLast && (
                            <div className="absolute left-[15px] top-8 bottom-0 w-px bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-700 dark:to-transparent" />
                          )}

                          {/* Dot */}
                          <div className={`flex-shrink-0 h-8 w-8 rounded-full ${bg} ${ring} ring-4 flex items-center justify-center shadow-sm mt-0.5`}>
                            <ActIcon className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 group">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">{act.label}</p>
                              <span className="text-[10px] text-slate-400 font-semibold flex-shrink-0">{act.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">{act.text}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </motion.div>
              </div>
            </section>
          </motion.div>
        )}

        {/* ══ Detail Modal (preserved exactly) ══ */}
        <Modal isOpen={!!selectedBatch} onClose={() => setSelectedBatch(null)} title="Distillation Telemetry Detail">
          {selectedBatch && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 rounded-xl flex items-center gap-3">
                <FlaskConical className="h-5 w-5 text-emerald-700 dark:text-emerald-400" aria-hidden="true" />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedBatch.name}</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest">Distillation Hash: #{selectedBatch.id.toString().slice(-10)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-2.5 border border-slate-100 dark:border-slate-800/80">
                  <p className="text-[9px] uppercase font-bold text-slate-400">Net Yield Volume</p>
                  <p className="font-bold mt-0.5 text-slate-800 dark:text-slate-200">{selectedBatch.quantity} Liters</p>
                </div>
                <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-2.5 border border-slate-100 dark:border-slate-800/80">
                  <p className="text-[9px] uppercase font-bold text-slate-400">Compliance State</p>
                  <p className="font-bold mt-0.5 text-slate-800 dark:text-slate-200">{selectedBatch.status}</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                This batch Distillation has passed gas chromatography-mass spectrometry screening, meeting premium composition indexes.
              </p>
            </div>
          )}
        </Modal>

        {/* ══ Quick-Add Modal (preserved exactly) ══ */}
        <Modal isOpen={quickAddModal} onClose={() => setQuickAddModal(false)} title="Log New Distillation Batch">
          <form onSubmit={handleCreateBatch} className="space-y-4">
            <Input
              label="Botanical / Oil Name"
              placeholder="e.g. Organic Lavender Oil"
              value={newBatchForm.name}
              onChange={e => setNewBatchForm({ ...newBatchForm, name: e.target.value })}
            />
            <Input
              label="Net Yield Volume (Liters)"
              type="number"
              placeholder="e.g. 150"
              value={newBatchForm.quantity}
              onChange={e => setNewBatchForm({ ...newBatchForm, quantity: e.target.value })}
            />
            <div className="w-full mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Clearance Status
              </label>
              <select
                value={newBatchForm.status}
                onChange={e => setNewBatchForm({ ...newBatchForm, status: e.target.value })}
                className="w-full border border-slate-200/85 p-3 rounded-xl text-sm transition-all duration-200 outline-none bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-800/85 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold"
              >
                <option value="Active">Active / Processing</option>
                <option value="Testing">GC-MS Testing</option>
                <option value="Completed">Completed / Dispatched</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" size="md" onClick={() => setQuickAddModal(false)}>Cancel</Button>
              <Button variant="primary" size="md" type="submit">Register Batch</Button>
            </div>
          </form>
        </Modal>

      </div>
    </div>
  );
}

export default Dashboard;