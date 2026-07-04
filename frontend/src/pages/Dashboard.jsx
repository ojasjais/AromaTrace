import { useEffect, useState } from "react";
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
  Compass
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 80,
      damping: 15
    } 
  }
};

function Dashboard() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [quickAddModal, setQuickAddModal] = useState(false);
  const [newBatchForm, setNewBatchForm] = useState({ name: "", quantity: "", status: "Active" });

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, text: "GC-MS Purity test passed (99.4%) for Rosemary RM-409", type: "success", time: "10m ago" },
    { id: 2, text: "New Lavender LV-112 batch added to trace registry", type: "info", time: "1h ago" },
    { id: 3, text: "Batch EU-882 dispatch cleared for Laurent Perfumeries", type: "dispatch", time: "3h ago" },
  ]);

  useEffect(() => {
    fetchBatches();
  }, []);

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

  // Calculations for live metrics
  const totalVolume = batches.reduce((sum, batch) => sum + (Number(batch.quantity) || 0), 0);
  const activeCount = batches.filter(b => b.status.toLowerCase().includes("active") || b.status.toLowerCase().includes("process")).length;
  const pendingCount = batches.filter(b => b.status.toLowerCase().includes("test") || b.status.toLowerCase().includes("pend")).length;
  const dispatchCount = batches.filter(b => b.status.toLowerCase().includes("dispatch") || b.status.toLowerCase().includes("complet") || b.status.toLowerCase().includes("success")).length;
  const certifiedCount = batches.length - pendingCount; // Completed & Active are considered certified

  // Filter batches for search
  const filteredBatches = batches.filter(batch =>
    batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    batch.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Status colors utility
  const getStatusBadge = (statusVal) => {
    const val = statusVal.toLowerCase();
    if (val.includes("test") || val.includes("pend")) {
      return "bg-amber-500/10 text-amber-605 dark:text-amber-400 border border-amber-500/20";
    }
    if (val.includes("dispatch") || val.includes("complet") || val.includes("success") || val.includes("active")) {
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
    }
    return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20";
  };

  // Simulated quick actions
  const triggerSimulation = (actionName) => {
    if (actionName === "refresh") {
      fetchBatches();
      showToast("Distillery Registry Synced!");
    } else if (actionName === "export") {
      showToast("Liters database exported successfully!");
    } else if (actionName === "audit") {
      showToast("Distillery compliance trail: 100% Purity Cleared");
    } else if (actionName === "lab-check") {
      showToast("GC-MS Analysis validation completed.");
    }
  };

  const handleCreateBatch = (e) => {
    e.preventDefault();
    if (!newBatchForm.name || !newBatchForm.quantity) {
      showToast("Please fill out all fields");
      return;
    }
    
    const simulatedBatch = {
      id: Date.now(),
      name: newBatchForm.name,
      quantity: Number(newBatchForm.quantity),
      status: newBatchForm.status,
      createdAt: new Date().toISOString()
    };
    
    setBatches([simulatedBatch, ...batches]);
    setQuickAddModal(false);
    setNewBatchForm({ name: "", quantity: "", status: "Active" });
    showToast("Batch Logged Successfully!");
  };

  // Donut chart calculations
  const totalForChart = activeCount + pendingCount + dispatchCount || 1;
  const activePct = Math.round((activeCount / totalForChart) * 100);
  const pendingPct = Math.round((pendingCount / totalForChart) * 100);
  const dispatchPct = Math.round((dispatchCount / totalForChart) * 100);

  const chartRadius = 15.91549430918954;

  const activityLogs = [
    { label: "Purity Released", text: "Rosemary Batch RM-409 passed GC-MS chromatogram test. 99.4% pinene detected.", time: "10m ago", type: "purity" },
    { label: "Steam Distillation Logged", text: "Organic Lavender distillation yield registered into inventory.", time: "1h ago", type: "distill" },
    { label: "Buyer Dispatch Sealed", text: "Rosemary yield batch dispatched to Laurent Perfumeries.", time: "3h ago", type: "dispatch" },
    { label: "Operator Calibration Check", text: "Low-temp extraction vacuum valves successfully calibrated.", time: "1d ago", type: "system" },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Banner Control Bar */}
      <section className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-emerald-50/40 dark:bg-slate-900/60 backdrop-blur-md p-4 border border-emerald-100 dark:border-emerald-950/60 rounded-2xl shadow-sm">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-600 dark:text-emerald-450" />
          <input
            type="text"
            placeholder="Search distillations by botanical name or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-100/60 dark:border-emerald-950/50 bg-white/70 dark:bg-slate-950 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder-slate-400 font-semibold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={() => triggerSimulation("refresh")} className="flex items-center gap-1.5 font-bold bg-white dark:bg-slate-900 border border-emerald-100/60 dark:border-emerald-950 shadow-sm text-emerald-800 dark:text-emerald-400">
            <RefreshCw className="h-3.5 w-3.5 text-amber-500" />
            Sync Registry
          </Button>
          <Button variant="outline" size="sm" onClick={() => triggerSimulation("export")} className="flex items-center gap-1.5 font-bold bg-white dark:bg-slate-900 border border-emerald-100/60 dark:border-emerald-950 shadow-sm text-emerald-800 dark:text-emerald-400">
            <Download className="h-3.5 w-3.5 text-amber-550" />
            Export Data
          </Button>
          <Button variant="primary" size="sm" onClick={() => setQuickAddModal(true)} className="flex items-center gap-1.5 font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-emerald-600/10">
            <Plus className="h-4 w-4" />
            Log Extraction
          </Button>

          {/* Notifications Dropdown */}
          <div className="relative pl-2.5 border-l border-emerald-100 dark:border-emerald-900">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-xl p-2.5 bg-emerald-500/5 hover:bg-emerald-500/10 dark:bg-slate-900 dark:hover:bg-slate-850 border border-emerald-100/40 dark:border-emerald-950 text-emerald-750 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-white transition-colors"
            >
              <Bell className="h-4 w-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-emerald-50 dark:ring-slate-950"></span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-950 shadow-2xl z-30"
                >
                  <div className="p-4 border-b border-emerald-50 dark:border-emerald-950/80 flex items-center justify-between bg-emerald-50/50 dark:bg-slate-900/50">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Telemetry Alerts</span>
                    <button onClick={() => setNotifications([])} className="text-[10px] text-amber-600 hover:underline">Clear all</button>
                  </div>
                  <div className="divide-y divide-emerald-50 dark:divide-emerald-950/40">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">No active alerts</div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="p-4 flex gap-3 hover:bg-emerald-500/5 dark:hover:bg-slate-900/50 transition-colors">
                          <div className="h-2 w-2 rounded-full bg-amber-550 mt-1.5 shrink-0" />
                          <div className="flex-1 text-xs">
                            <p className="text-emerald-900 dark:text-slate-350 leading-relaxed font-semibold">{notif.text}</p>
                            <span className="text-[10px] text-slate-400 block mt-1">{notif.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Nature Hero Welcome Card */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-850 to-teal-850 text-white p-8 dark:from-emerald-950 dark:to-teal-950 shadow-sm border border-emerald-500/10"
      >
        {/* Organic overlay designs representing oil extractions */}
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent pointer-events-none" />
        <div className="absolute left-1/3 top-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-emerald-200 border border-white/5 backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-amber-400" />
            Distillery Console v1.2
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Pure Essences, Sealed Trails</h1>
          <p className="text-sm text-emerald-100/90 leading-relaxed">
            Welcome back to AromaTrace. Monitor your organic steam extraction parameters, catalog GC-MS chemical composition certificates, and secure the supply chain lineage from soil to recipient flask.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs font-bold text-emerald-200">
            <div className="flex items-center gap-1.5"><Leaf className="h-4 w-4 text-amber-400" /> NOP Organic Compliant</div>
            <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-amber-400" /> GC-MS Verified</div>
          </div>
        </div>
      </motion.section>

      {/* KPI Cards Grid */}
      {loading ? (
        <Loader />
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          {/* KPI Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Total Batches", value: batches.length, label: "Botanical Logs", icon: FlaskConical, borderAccent: "border-emerald-500", bgAccent: "from-emerald-500/5 to-teal-500/5" },
              { title: "Processing", value: activeCount, label: "Active Distillations", icon: Clock, borderAccent: "border-amber-500", bgAccent: "from-amber-500/5 to-amber-600/5" },
              { title: "Completed", value: dispatchCount, label: "Dispatched to Buyers", icon: PackageCheck, borderAccent: "border-blue-500", bgAccent: "from-blue-500/5 to-indigo-500/5" },
              { title: "Certificates", value: `${certifiedCount} Verified`, label: "GC-MS Purity Checked", icon: Award, borderAccent: "border-purple-500", bgAccent: "from-purple-500/5 to-pink-500/5" }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  variants={itemVariants}
                  whileHover={{ y: -3, scale: 1.01 }}
                  className={`p-5 rounded-2xl border-l-4 border-t border-r border-b border-emerald-100/50 dark:border-emerald-950/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md relative overflow-hidden bg-gradient-to-br ${stat.bgAccent} ${stat.borderAccent}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-emerald-800/60 dark:text-emerald-500 uppercase tracking-widest">{stat.title}</span>
                    <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black tracking-tight text-emerald-950 dark:text-white mb-1">{stat.value}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </section>

          {/* Charts Grid */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Yield Overview Chart (Sage/Emerald bars) */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-2 p-6 rounded-2xl border border-emerald-100/50 dark:border-emerald-950/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-800/60 dark:text-emerald-500 mb-1">Production Overview</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Monthly Distillation Yields (Liters)</p>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    <Droplet className="h-3 w-3 text-amber-500" /> Active Yield
                  </span>
                </div>
                {/* SVG Bar Chart */}
                <div className="w-full aspect-[21/9] flex items-end justify-between gap-4 px-2 pt-6 border-b border-emerald-100/20 dark:border-emerald-950/30">
                  {[
                    { label: "Jan", val: 120, h: "30%" },
                    { label: "Feb", val: 230, h: "55%" },
                    { label: "Mar", val: 340, h: "80%" },
                    { label: "Apr", val: 290, h: "70%" },
                    { label: "May", val: 410, h: "95%" },
                    { label: "Jun", val: 380, h: "88%" },
                  ].map((bar) => (
                    <div key={bar.label} className="flex-1 flex flex-col items-center gap-2 group relative">
                      {/* Tooltip */}
                      <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-slate-950 text-white text-[10px] px-2.5 py-1.5 rounded-lg transition-all duration-150 pointer-events-none font-bold z-10 shadow-lg">
                        {bar.val} Liters
                      </div>
                      {/* Bar */}
                      <div 
                        style={{ height: bar.h }} 
                        className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 dark:from-emerald-550 dark:to-emerald-450 group-hover:from-amber-500 group-hover:to-amber-400 transition-all duration-300 shadow-sm"
                      />
                      <span className="text-[10px] font-bold text-slate-400 mt-1">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Batch Status Donut Chart */}
            <motion.div 
              variants={itemVariants}
              className="p-6 rounded-2xl border border-emerald-100/50 dark:border-emerald-950/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-800/60 dark:text-emerald-500 mb-4">Batch Ratios</h3>
                <div className="relative aspect-square flex items-center justify-center max-w-[170px] mx-auto py-4">
                  <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                    <circle cx="18" cy="18" r={chartRadius} fill="none" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="4.5" />
                    
                    {activePct > 0 && (
                      <circle
                        cx="18"
                        cy="18"
                        r={chartRadius}
                        fill="none"
                        stroke="#059669" // emerald-600 (Active)
                        strokeWidth="4.5"
                        strokeDasharray={`${activePct} ${100 - activePct}`}
                        strokeDashoffset={100}
                        className="transition-all duration-500"
                      />
                    )}
                    
                    {pendingPct > 0 && (
                      <circle
                        cx="18"
                        cy="18"
                        r={chartRadius}
                        fill="none"
                        stroke="#f59e0b" // amber-500 (Testing)
                        strokeWidth="4.5"
                        strokeDasharray={`${pendingPct} ${100 - pendingPct}`}
                        strokeDashoffset={100 - activePct}
                        className="transition-all duration-500"
                      />
                    )}

                    {dispatchPct > 0 && (
                      <circle
                        cx="18"
                        cy="18"
                        r={chartRadius}
                        fill="none"
                        stroke="#3b82f6" // blue-500 (Completed)
                        strokeWidth="4.5"
                        strokeDasharray={`${dispatchPct} ${100 - dispatchPct}`}
                        strokeDashoffset={100 - activePct - pendingPct}
                        className="transition-all duration-500"
                      />
                    )}
                  </svg>

                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black tracking-tight text-emerald-950 dark:text-white">{batches.length}</span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Distillations</span>
                  </div>
                </div>
              </div>

              {/* Legends */}
              <div className="grid grid-cols-3 gap-1 border-t border-emerald-50 dark:border-emerald-950/40 pt-4 text-center">
                <div>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5" />
                  <span className="text-[9px] font-bold text-slate-500">{activePct}% Active</span>
                </div>
                <div>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
                  <span className="text-[9px] font-bold text-slate-500">{pendingPct}% Test</span>
                </div>
                <div>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
                  <span className="text-[9px] font-bold text-slate-500">{dispatchPct}% Done</span>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Table Feed + Timelines + Quick actions */}
          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
            
            {/* Table layout (2/3 width) */}
            <motion.div 
              variants={itemVariants}
              className="xl:col-span-2 rounded-2xl border border-emerald-100/50 dark:border-emerald-950/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="p-5 border-b border-emerald-50 dark:border-emerald-950/40 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-800/60 dark:text-emerald-500">Live Distillation logs</h3>
                  <span className="text-[10px] bg-emerald-500/10 px-2.5 py-1 rounded-full font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">Operational Feed</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-emerald-50/20 dark:bg-slate-950 border-b border-emerald-100/50 dark:border-emerald-950/40 text-emerald-800/70 dark:text-emerald-400 font-bold uppercase tracking-wider">
                        <th className="p-4 pl-6">Batch ID</th>
                        <th className="p-4">Botanical Oil Name</th>
                        <th className="p-4">Yield Quantity</th>
                        <th className="p-4">Clearance Status</th>
                        <th className="p-4 pr-6 text-right font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-50/20 dark:divide-emerald-950/40">
                      {filteredBatches.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-slate-400 font-bold">No active distillations matches</td>
                        </tr>
                      ) : (
                        filteredBatches.slice(0, 5).map((batch) => (
                          <tr key={batch.id} className="hover:bg-emerald-500/5 dark:hover:bg-slate-900/40 transition-colors">
                            <td className="p-4 pl-6 font-mono font-bold text-emerald-750/70 dark:text-emerald-500">#{batch.id.toString().slice(-6)}</td>
                            <td className="p-4 font-bold text-emerald-950 dark:text-slate-200">{batch.name}</td>
                            <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{batch.quantity} Liters</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${getStatusBadge(batch.status)}`}>
                                {batch.status}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <Link
                                to={`/batches/${batch.id}`}
                                className="text-emerald-600 hover:text-emerald-750 dark:text-emerald-400 dark:hover:text-emerald-350 font-bold transition-colors inline-flex items-center gap-1"
                              >
                                View Trace <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>

            {/* Sidebar widgets */}
            <div className="flex flex-col gap-6">
              
              {/* Quick Action buttons */}
              <motion.div 
                variants={itemVariants}
                className="p-5 rounded-2xl border border-emerald-100/50 dark:border-emerald-950/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm"
              >
                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-800/60 dark:text-emerald-500 mb-4">Distillery Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => triggerSimulation("refresh")}
                    className="p-3.5 rounded-xl border border-emerald-100/40 hover:border-emerald-500/20 bg-emerald-50/20 hover:bg-emerald-500/5 dark:border-emerald-900/30 dark:hover:border-emerald-900/10 dark:bg-slate-950/40 text-left transition-all duration-200 group"
                  >
                    <RefreshCw className="h-4.5 w-4.5 text-emerald-700 dark:text-emerald-450 mb-2 group-hover:rotate-180 transition-transform duration-500" />
                    <div className="text-xs font-bold text-emerald-900 dark:text-slate-200">Reload Feed</div>
                    <p className="text-[9px] text-slate-400 mt-1">Sync distillation logs</p>
                  </button>
                  <button 
                    onClick={() => triggerSimulation("audit")}
                    className="p-3.5 rounded-xl border border-emerald-100/40 hover:border-emerald-500/20 bg-emerald-50/20 hover:bg-emerald-500/5 dark:border-emerald-900/30 dark:hover:border-emerald-900/10 dark:bg-slate-950/40 text-left transition-all duration-200 group"
                  >
                    <Award className="h-4.5 w-4.5 text-emerald-700 dark:text-emerald-450 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-emerald-900 dark:text-slate-200">Purity Check</div>
                    <p className="text-[9px] text-slate-400 mt-1">Verify chromatograms</p>
                  </button>
                  <button 
                    onClick={() => triggerSimulation("lab-check")}
                    className="p-3.5 rounded-xl border border-emerald-100/40 hover:border-emerald-500/20 bg-emerald-50/20 hover:bg-emerald-500/5 dark:border-emerald-900/30 dark:hover:border-emerald-900/10 dark:bg-slate-950/40 text-left transition-all duration-200 group"
                  >
                    <FlaskConical className="h-4.5 w-4.5 text-emerald-700 dark:text-emerald-450 mb-2 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-emerald-900 dark:text-slate-200">GC-MS Verify</div>
                    <p className="text-[9px] text-slate-400 mt-1">Simulate composition</p>
                  </button>
                  <button 
                    onClick={() => setQuickAddModal(true)}
                    className="p-3.5 rounded-xl border border-emerald-500/10 bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-left transition-all duration-200 shadow-sm"
                  >
                    <Plus className="h-4.5 w-4.5 text-white mb-2" />
                    <div className="text-xs font-bold">Log Batch</div>
                    <p className="text-[9px] text-emerald-100 mt-1">Distill new extract</p>
                  </button>
                </div>
              </motion.div>

              {/* Recent activity timeline */}
              <motion.div 
                variants={itemVariants}
                className="p-5 rounded-2xl border border-emerald-100/50 dark:border-emerald-950/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm shadow-sm flex-1 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-800/60 dark:text-emerald-500 mb-4">Recent Activity</h3>
                  <div className="space-y-4.5 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-100/50 dark:before:bg-emerald-900/30">
                    {activityLogs.map((act, idx) => (
                      <div key={idx} className="flex gap-4 relative pl-5 text-xs group">
                        <div className={`absolute left-0.5 top-1.5 h-3.5 w-3.5 rounded-full border-[3px] border-white dark:border-slate-900 ${
                          act.type === "purity" ? "bg-amber-500" :
                          act.type === "distill" ? "bg-emerald-600" :
                          act.type === "dispatch" ? "bg-blue-500" : "bg-slate-400"
                        } group-hover:scale-110 transition-transform`} />
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="font-bold text-emerald-900 dark:text-slate-200">{act.label}</span>
                            <span className="text-[9px] font-semibold text-slate-400">{act.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{act.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

            </div>
          </section>
        </motion.div>
      )}

      {/* Detail Modal */}
      <Modal isOpen={!!selectedBatch} onClose={() => setSelectedBatch(null)} title="Distillation Telemetry Detail">
        {selectedBatch && (
          <div className="space-y-4">
            <div className="p-3.5 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 rounded-xl flex items-center gap-3">
              <FlaskConical className="h-5.5 w-5.5 text-emerald-700 dark:text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-slate-850 dark:text-slate-150">{selectedBatch.name}</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-450 font-bold uppercase tracking-widest">Distillation Hash: #{selectedBatch.id.toString().slice(-10)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-2.5 border border-slate-100 dark:border-slate-800/80">
                <p className="text-[9px] uppercase font-bold text-slate-405">Net Yield Volume</p>
                <p className="font-bold mt-0.5 text-slate-800 dark:text-slate-200">{selectedBatch.quantity} Liters</p>
              </div>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-2.5 border border-slate-100 dark:border-slate-800/80">
                <p className="text-[9px] uppercase font-bold text-slate-405">Compliance State</p>
                <p className="font-bold mt-0.5 text-slate-800 dark:text-slate-200">{selectedBatch.status}</p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              This batch Distillation has passed gas chromatography-mass spectrometry screening, meeting premium composition indexes.
            </p>
          </div>
        )}
      </Modal>

      {/* Quick Add Modal */}
      <Modal isOpen={quickAddModal} onClose={() => setQuickAddModal(false)} title="Log New Distillation Batch">
        <form onSubmit={handleCreateBatch} className="space-y-4">
          <Input
            label="Botanical / Oil Name"
            placeholder="e.g. Organic Lavender Oil"
            value={newBatchForm.name}
            onChange={(e) => setNewBatchForm({ ...newBatchForm, name: e.target.value })}
          />

          <Input
            label="Net Yield Volume (Liters)"
            type="number"
            placeholder="e.g. 150"
            value={newBatchForm.quantity}
            onChange={(e) => setNewBatchForm({ ...newBatchForm, quantity: e.target.value })}
          />

          <div className="w-full max-w-xl mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Clearance Status
            </label>
            <select
              value={newBatchForm.status}
              onChange={(e) => setNewBatchForm({ ...newBatchForm, status: e.target.value })}
              className="w-full border border-slate-200/85 p-3 rounded-xl text-sm transition-all duration-200 outline-none bg-white text-slate-800 dark:bg-slate-955 dark:text-slate-100 dark:border-slate-800/85 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold"
            >
              <option value="Active">Active / Processing</option>
              <option value="Testing">GC-MS Testing</option>
              <option value="Completed">Completed / Dispatched</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" size="md" onClick={() => setQuickAddModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Register Batch
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}

export default Dashboard;