import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getBatch } from "../api/batches";
import { getBatchInsights } from "../api/ai";
import Loader from "../components/ui/Loader";
import Button from "../components/ui/Button";
import showToast from "../components/ui/Toast";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  FlaskConical,
  ShieldCheck,
  QrCode,
  Building,
  History,
  FileCheck,
  Leaf,
  Clock,
  Printer,
  Globe,
  Copy,
  Check,
  Download,
  ExternalLink,
  Award,
  Users,
  Truck,
  Sparkles,
  Brain,
  AlertTriangle,
  Wand2
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
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

function BatchDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // AI Insights State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMode, setAiMode] = useState("botanical");
  const [aiInsights, setAiInsights] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [aiCustomQuery, setAiCustomQuery] = useState("");
  const [isAiMocked, setIsAiMocked] = useState(false);
  const [aiWarning, setAiWarning] = useState("");

  useEffect(() => {
    fetchBatchDetails();
  }, [id]);

  const fetchBatchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBatch(id);
      setBatch(data);
    } catch (err) {
      console.error(err);
      setError("Failed to locate batch details. Please verify the registry ID.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAIInsights = async (selectedMode = aiMode, customQueryText = "") => {
    setAiLoading(true);
    setAiError(null);
    setAiWarning("");
    try {
      const data = await getBatchInsights({
        batchId: id,
        mode: selectedMode,
        customQuery: customQueryText || undefined,
      });
      setAiInsights(data.insights);
      setIsAiMocked(!!data.isMocked);
      setAiWarning(data.warning || "");
    } catch (err) {
      console.error(err);
      setAiError(err.message || "Failed to generate AI insights. Check your server connection.");
    } finally {
      setAiLoading(false);
    }
  };

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text);
    showToast(message || "Copied to clipboard!");
  };

  const formatMarkdown = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();

      // Check #### BEFORE ### (#### starts with ###, so order matters)
      if (trimmed.startsWith("####")) {
        return (
          <h5 key={idx} className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-3 mb-1.5 uppercase tracking-wider">
            {trimmed.replace(/^####\s*/, "")}
          </h5>
        );
      }

      if (trimmed.startsWith("###")) {
        return (
          <h4 key={idx} className="text-xs font-black text-emerald-900 dark:text-emerald-400 mt-4 mb-2 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-1 uppercase tracking-wider">
            {trimmed.replace(/^###\s*/, "")}
          </h4>
        );
      }

      if (trimmed.startsWith("- ")) {
        const parts = trimmed.replace(/^-\s*/, "").split("**");
        return (
          <li key={idx} className="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-300 ml-3 mb-1 leading-relaxed">
            {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-slate-900 dark:text-white font-bold">{part}</strong> : part)}
          </li>
        );
      }

      if (/^\d+\.\s/.test(trimmed)) {
        const parts = trimmed.replace(/^\d+\.\s*/, "").split("**");
        return (
          <li key={idx} className="list-decimal list-inside text-[11px] text-slate-600 dark:text-slate-300 ml-3 mb-1 leading-relaxed">
            {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-slate-900 dark:text-white font-bold">{part}</strong> : part)}
          </li>
        );
      }

      if (trimmed.includes("**")) {
        const parts = trimmed.split("**");
        return (
          <p key={idx} className="text-[11px] text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
            {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-slate-900 dark:text-white font-bold">{part}</strong> : part)}
          </p>
        );
      }

      if (trimmed === "") {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-[11px] text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !batch) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-955 flex flex-col items-center justify-center p-8 text-center">
        <div className="h-14 w-14 rounded-full bg-red-50 dark:bg-red-950/20 text-red-500 border border-red-100 dark:border-red-900/30 flex items-center justify-center mb-4 animate-bounce">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-805 dark:text-slate-200">Registry Error</h2>
        <p className="text-xs text-slate-400 mt-1.5 max-w-sm mb-6 leading-relaxed">{error || "Batch not found"}</p>
        <Link to="/batches">
          <Button variant="secondary" size="md">
            Return to Registry
          </Button>
        </Link>
      </div>
    );
  }

  // Calculate status active values for progress steps
  const statusLower = batch.status.toLowerCase();
  let stepIndex = 1; // Harvested
  if (statusLower.includes("active") || statusLower.includes("process")) {
    stepIndex = 2; // Distilled
  } else if (statusLower.includes("test") || statusLower.includes("pend")) {
    stepIndex = 3; // GC-MS Testing
  } else if (statusLower.includes("clear") || statusLower.includes("cert")) {
    stepIndex = 4; // Purity Cleared
  } else if (statusLower.includes("complet") || statusLower.includes("dispatch") || statusLower.includes("success")) {
    stepIndex = 5; // Dispatched
  }

  const steps = [
    { label: "Harvested", desc: "Raw Crop Logged", date: "June 28, 2026" },
    { label: "Distilled", desc: "Steam Yield Sealed", date: "July 2, 2026" },
    { label: "GC-MS Checked", desc: "Chromatography Run", date: "July 3, 2026" },
    { label: "Purity Cleared", desc: "Organic Certified", date: "July 3, 2026" },
    { label: "Dispatched", desc: "Shipped to Recipient", date: "July 4, 2026" }
  ];

  return (
    <div className="min-h-screen bg-emerald-50/10 dark:bg-slate-955 text-slate-900 dark:text-slate-100 transition-colors duration-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <Link to="/batches" className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-950/60 text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-white shadow-sm transition-all duration-200">
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <span className="text-xs font-semibold text-slate-400">Back to Batch Registry</span>
        </motion.div>

        {/* Hero Card Overview */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 bg-gradient-to-r from-emerald-800 to-teal-850 dark:from-emerald-950 dark:to-teal-950 text-white p-6 border border-emerald-500/10 rounded-3xl shadow-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-1.5">
            <div className="flex items-center gap-2">
              <Leaf className="h-4.5 w-4.5 text-emerald-350 animate-bounce" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-250">Verified Botanical Extract</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">{batch.name}</h1>
            <p className="text-xs text-emerald-200/70 font-mono">Registry ID: <span className="text-white font-bold">#{batch.id.toString().padStart(6, '0')}</span></p>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => window.print()} className="flex items-center gap-1.5 font-bold bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-sm">
              <Printer className="h-4 w-4" />
              Print Certificate
            </Button>
            <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm ${
              stepIndex >= 5 ? "bg-emerald-550/20 text-emerald-300 border-emerald-500/30" :
              stepIndex >= 3 ? "bg-amber-550/20 text-amber-300 border-amber-555/30" :
              "bg-white/10 text-emerald-100 border-white/10"
            }`}>
              <span className="h-1.5 w-1.5 rounded-full bg-current mr-2 animate-ping" />
              {batch.status}
            </span>
          </div>
        </motion.div>

        {/* Status Progress Stepper */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 p-6 border border-emerald-100/50 dark:border-emerald-950/60 rounded-3xl shadow-sm"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-850/60 dark:text-emerald-500 mb-8">Extraction Lifecycle Progress</h3>
          
          <div className="relative">
            {/* Desktop Horizontal View */}
            <div className="hidden md:block">
              <div className="grid grid-cols-5 gap-6 relative">
                {/* Stepper horizontal track background */}
                <div className="absolute top-[18px] left-[10%] right-[10%] h-0.5 bg-emerald-50 dark:bg-slate-805 -z-0" />
                {/* Stepper horizontal track fill */}
                <div 
                  className="absolute top-[18px] left-[10%] h-0.5 bg-gradient-to-r from-emerald-600 to-amber-500 transition-all duration-1000 -z-0" 
                  style={{ width: `${Math.max(0, Math.min(100, ((stepIndex - 1) / 4) * 80))}%` }}
                />
                
                {steps.map((step, idx) => {
                  const activeIndex = idx + 1;
                  const isDone = stepIndex > activeIndex;
                  const isCurrent = stepIndex === activeIndex;

                  return (
                    <div key={idx} className="flex flex-col items-center text-center relative z-10">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center border font-bold text-sm transition-all duration-300 ${
                        isDone
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                          : isCurrent
                          ? "bg-amber-500 border-amber-500 text-white shadow-md ring-4 ring-amber-500/25"
                          : "bg-emerald-50/20 border-emerald-100 dark:bg-slate-950 dark:border-slate-800 text-slate-400"
                      }`}>
                        {isDone ? <Check className="h-4.5 w-4.5" /> : idx + 1}
                      </div>
                      <div className="mt-3">
                        <div className={`text-xs font-bold ${isDone || isCurrent ? "text-emerald-950 dark:text-white" : "text-slate-400"}`}>
                          {step.label}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{step.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Vertical View */}
            <div className="block md:hidden space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-50 dark:before:bg-slate-800">
              {steps.map((step, idx) => {
                const activeIndex = idx + 1;
                const isDone = stepIndex > activeIndex;
                const isCurrent = stepIndex === activeIndex;

                return (
                  <div key={idx} className="flex items-start gap-4 relative z-10">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center border font-bold text-sm shrink-0 transition-all duration-300 ${
                      isDone
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-md"
                        : isCurrent
                        ? "bg-amber-500 border-amber-500 text-white shadow-md ring-4 ring-amber-500/25"
                        : "bg-emerald-50/20 border-emerald-100 dark:bg-slate-950 dark:border-slate-800 text-slate-400"
                    }`}>
                      {isDone ? <Check className="h-4 w-4" /> : idx + 1}
                    </div>
                    <div className="pt-1">
                      <div className={`text-xs font-bold ${isDone || isCurrent ? "text-emerald-950 dark:text-white" : "text-slate-400"}`}>
                        {step.label}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Multi-Card Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          
          {/* Column 1: Purity Certificates & Source Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Purity Certificate Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-slate-900 p-6 border-l-4 border-l-amber-500 border-t border-r border-b border-emerald-100/50 dark:border-emerald-955/60 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-emerald-50 dark:border-emerald-950/40 pb-3 mb-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-850/60 dark:text-emerald-500 flex items-center gap-2">
                  <Award className="h-4.5 w-4.5 text-amber-500" />
                  GC-MS Purity Certificate Statement
                </h3>
                <span className="text-[9px] uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">Lab Verified</span>
              </div>
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Circular Purity Gauge */}
                <div className="flex flex-col items-center justify-center p-4 bg-emerald-50/20 dark:bg-slate-950 border border-emerald-100/50 dark:border-emerald-950 rounded-2xl w-full md:w-auto shrink-0 shadow-inner">
                  <div className="relative h-28 w-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="45"
                        className="stroke-emerald-50 dark:stroke-slate-800"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="56"
                        cy="56"
                        r="45"
                        className="stroke-emerald-600"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={282}
                        initial={{ strokeDashoffset: 282 }}
                        animate={{ strokeDashoffset: 282 - (282 * 99.42) / 100 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-emerald-950 dark:text-white">99.42%</span>
                      <span className="text-[8px] uppercase font-bold text-amber-600 tracking-wider">Pinene</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 mt-2">GC-MS Organic composition</span>
                </div>

                {/* Lab parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-xs">
                  <div className="rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-100/40 p-3.5 flex items-center gap-3">
                    <FlaskConical className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Total Volume Yield</span>
                      <span className="font-bold text-emerald-950 dark:text-slate-200">{batch.quantity} Liters Net</span>
                    </div>
                  </div>
                  
                  <div className="rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-100/40 p-3.5 flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Distillation Date</span>
                      <span className="font-bold text-emerald-950 dark:text-slate-200">
                        {batch.createdAt ? new Date(batch.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "July 3, 2026"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-100/40 p-3.5 flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Distillery Coordinates</span>
                      <a 
                        href="https://maps.google.com/?q=37.7749,-122.4194" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-bold text-emerald-900 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                      >
                        37.7749° N, 122.4194° W
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-100/40 p-3.5 flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">GC-MS Reference ID</span>
                      <span className="font-bold text-emerald-950 dark:text-slate-200">AROMA-GC-MS-9942</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Distillery & Source Info Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-slate-900 p-6 border border-emerald-105/50 dark:border-emerald-955/60 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 space-y-4"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-850/60 dark:text-emerald-555 border-b border-emerald-50 dark:border-emerald-950/40 pb-3 mb-2 flex items-center gap-2">
                <Building className="h-4.5 w-4.5 text-emerald-650" />
                Distillery & Botanical Origin
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs">
                <div className="bg-emerald-50/20 dark:bg-slate-950 p-3 rounded-2xl border border-emerald-100/30">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Extraction Operator</span>
                  <p className="font-bold mt-0.5 text-emerald-950 dark:text-slate-200">Cascade Herb Farms Ltd.</p>
                </div>
                <div className="bg-emerald-50/20 dark:bg-slate-950 p-3 rounded-2xl border border-emerald-100/30">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Method Used</span>
                  <p className="font-bold mt-0.5 text-emerald-950 dark:text-slate-200">Low-Temp Steam Distillation</p>
                </div>
                <div className="bg-emerald-50/20 dark:bg-slate-950 p-3 rounded-2xl border border-emerald-100/30">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Botanical Part</span>
                  <p className="font-bold mt-0.5 text-emerald-950 dark:text-slate-200">Upper Flowers & Sage Leaves</p>
                </div>
                <div className="bg-emerald-50/20 dark:bg-slate-950 p-3 rounded-2xl border border-emerald-100/30">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Organic Compliance Code</span>
                  <p className="font-bold mt-0.5 text-amber-600 dark:text-amber-450">NOP Organic ID: US-488219</p>
                </div>
              </div>
            </motion.div>

            {/* AI Insights & Assistant Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-slate-900 p-6 border-l-4 border-l-emerald-600 border-t border-r border-b border-emerald-105/50 dark:border-emerald-955/60 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-emerald-50 dark:border-emerald-950/40 pb-3 mb-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-850/60 dark:text-emerald-500 flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-emerald-600 animate-pulse" />
                  AromaTrace AI Batch Assistant
                </h3>
                <span className="text-[9px] uppercase tracking-wider bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold flex items-center gap-1">
                  <Brain className="h-3 w-3" /> Powered by Gemini
                </span>
              </div>

              <div className="space-y-4">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Generate chemical composition, dilution guides, product yields, storage suggestions, or ask custom questions grounded in this batch data.
                </p>

                {/* Mode Selector Tab buttons */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                  {[
                    { id: "botanical", label: "Botanical Standards" },
                    { id: "formulation", label: "Formulation Yield" },
                    { id: "optimization", label: "Storage & Market" }
                  ].map((modeItem) => (
                    <button
                      key={modeItem.id}
                      onClick={() => {
                        setAiMode(modeItem.id);
                        if (aiInsights && !aiCustomQuery) {
                          fetchAIInsights(modeItem.id, "");
                        }
                      }}
                      className={`py-2 px-1 text-[10px] font-bold rounded-xl transition-all ${
                        aiMode === modeItem.id && !aiCustomQuery
                          ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm border border-slate-150 dark:border-slate-800"
                          : "text-slate-400 hover:text-slate-500"
                      }`}
                    >
                      {modeItem.label}
                    </button>
                  ))}
                </div>

                {/* Custom query input */}
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={aiCustomQuery}
                      onChange={(e) => setAiCustomQuery(e.target.value)}
                      placeholder={isAuthenticated ? "Ask a custom question about this batch..." : "Log in to ask custom questions..."}
                      disabled={!isAuthenticated || aiLoading}
                      className={`w-full text-xs border rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 transition-colors ${
                        isAuthenticated
                          ? "bg-slate-50 dark:bg-slate-950 border-slate-205 dark:border-slate-800"
                          : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-60"
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && aiCustomQuery.trim() && isAuthenticated) {
                          fetchAIInsights(aiMode, aiCustomQuery);
                        }
                      }}
                    />
                    {aiCustomQuery && isAuthenticated && (
                      <button
                        onClick={() => setAiCustomQuery("")}
                        className="absolute right-3 top-2.5 text-slate-450 hover:text-slate-600 text-xs font-bold"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={aiLoading || !isAuthenticated}
                    onClick={() => isAuthenticated && fetchAIInsights(aiMode, aiCustomQuery)}
                    className="font-bold flex items-center gap-1 border-emerald-500/20 text-emerald-700 shrink-0"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    Consult
                  </Button>
                </div>

                {/* Guest / not-logged-in gate */}
                {!isAuthenticated && !aiInsights && (
                  <div className="flex flex-col items-center justify-center p-6 bg-slate-50/50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-3">
                    <Brain className="h-8 w-8 text-slate-300 dark:text-slate-700 mb-1" />
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">AI insights require a free account</p>
                    <p className="text-[10px] text-slate-400 leading-relaxed max-w-[220px]">Log in or register to unlock AI-powered batch analysis powered by Gemini.</p>
                    <Link to="/login">
                      <Button variant="primary" size="sm" className="font-bold flex items-center gap-1.5 mt-1">
                        <Sparkles className="h-4 w-4" />
                        Log In to Use AI
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Main Action if authenticated but no insights generated yet */}
                {isAuthenticated && !aiInsights && !aiLoading && !aiError && (
                  <div className="flex flex-col items-center justify-center p-6 bg-slate-50/50 dark:bg-slate-950/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center">
                    <Brain className="h-8 w-8 text-emerald-600/40 mb-2 animate-pulse" />
                    <p className="text-xs font-semibold text-slate-450 mb-4">No analysis generated yet for this batch</p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => fetchAIInsights(aiMode, "")}
                      className="font-bold flex items-center gap-1.5"
                    >
                      <Sparkles className="h-4 w-4" />
                      Generate Batch Analysis
                    </Button>
                  </div>
                )}

                {/* Loading indicator */}
                {aiLoading && (
                  <div className="flex flex-col items-center justify-center p-12 bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/40 rounded-3xl text-center space-y-4">
                    <div className="relative h-12 w-12 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-emerald-600/20 border-t-emerald-600 animate-spin" />
                      <Sparkles className="h-5 w-5 text-emerald-600 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">AromaTrace AI is consulting...</p>
                      <p className="text-[10px] text-slate-400 mt-1">Formulating batch report specifications using Gemini 1.5 Flash</p>
                    </div>
                  </div>
                )}

                {/* Error panel */}
                {aiError && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <AlertTriangle className="h-4.5 w-4.5 shrink-0" />
                      <span className="text-xs font-bold">AI Generation Failed</span>
                    </div>
                    <p className="text-[10px] text-red-650 dark:text-red-400 leading-relaxed">{aiError}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchAIInsights(aiMode, aiCustomQuery)}
                      className="bg-white hover:bg-slate-50 border-red-200 hover:border-red-300 text-red-700 font-bold dark:bg-transparent dark:border-red-900/30 dark:hover:bg-red-950/10 text-xs"
                    >
                      Retry Consultation
                    </Button>
                  </div>
                )}

                {/* Success Display Panel */}
                {aiInsights && !aiLoading && (
                  <div className="space-y-4">
                    {aiWarning && (
                      <div className="p-2.5 bg-amber-50 dark:bg-amber-955/10 border border-amber-200/40 dark:border-amber-900/20 rounded-xl flex items-start gap-2 text-[10px] text-amber-700 dark:text-amber-450 leading-relaxed">
                        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
                        <span>{aiWarning}</span>
                      </div>
                    )}

                    <div className="p-4.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-800 rounded-3xl overflow-y-auto max-h-[380px] shadow-inner select-text">
                      <div className="prose prose-slate dark:prose-invert max-w-none text-xs space-y-1">
                        {formatMarkdown(aiInsights)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-[10px] text-slate-450 pt-1 border-t border-slate-100 dark:border-slate-800/40">
                      <span>Source: Grounded batch specifications</span>
                      <div className="flex items-center gap-3">
                        {isAiMocked && (
                          <span className="font-bold text-amber-600 uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Demo Mode</span>
                        )}
                        <button
                          onClick={() => copyToClipboard(aiInsights, "AI Insights copied to clipboard!")}
                          className="flex items-center gap-1 font-bold text-emerald-800 hover:text-emerald-950 dark:text-emerald-400 dark:hover:text-white transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copy Report
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

          </div>

          {/* Column 2: QR Trace Pass, Buyers, Shipment Ledger */}
          <div className="space-y-6">
            
            {/* QR Code Section */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-slate-900 p-6 border-l-4 border-l-amber-500 border-t border-r border-b border-emerald-100/50 dark:border-emerald-950/60 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center justify-between"
            >
              <style>{`
                @keyframes scan {
                  0%, 100% { top: 0%; }
                  50% { top: 100%; }
                }
                .animate-scan {
                  animation: scan 2.5s ease-in-out infinite;
                }
              `}</style>
              
              <div className="w-full">
                <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-850/60 dark:text-emerald-500 border-b border-emerald-50 dark:border-emerald-950/45 pb-3 mb-6 flex items-center justify-center gap-2">
                  <QrCode className="h-4.5 w-4.5 text-amber-550" />
                  QR Trace Pass
                </h3>

                {/* SVG QR Code Mockup with animated scanline */}
                <div className="relative mx-auto h-36 w-36 bg-emerald-50/20 dark:bg-slate-950 p-3 rounded-2xl border border-emerald-100/50 dark:border-emerald-950 flex items-center justify-center shadow-inner overflow-hidden">
                  <div className="absolute left-0 right-0 h-0.5 bg-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-scan z-10" />
                  <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-950 dark:text-white opacity-95">
                    {/* Corners anchor squares */}
                    <rect x="0" y="0" width="30" height="30" fill="currentColor" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" fill="currentColor" />

                    <rect x="70" y="0" width="30" height="30" fill="currentColor" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" fill="currentColor" />

                    <rect x="0" y="70" width="30" height="30" fill="currentColor" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" fill="currentColor" />

                    {/* Dotted random pixels */}
                    <rect x="40" y="10" width="10" height="20" fill="currentColor" />
                    <rect x="55" y="0" width="10" height="10" fill="currentColor" />
                    <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                    <rect x="10" y="40" width="15" height="15" fill="currentColor" />
                    <rect x="70" y="40" width="25" height="10" fill="currentColor" />
                    <rect x="40" y="70" width="15" height="15" fill="currentColor" />
                    <rect x="70" y="70" width="10" height="20" fill="currentColor" />
                    <rect x="85" y="85" width="15" height="15" fill="currentColor" />
                  </svg>
                </div>
              </div>

              <div className="mt-6 w-full">
                <p className="text-[11px] text-slate-400 leading-relaxed mb-4 px-3">
                  Scan to pull verified GC-MS compound analysis and distillation logging signatures directly.
                </p>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => copyToClipboard(window.location.href, "Verifiable link copied!")}
                    className="w-full font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Copy Trace Link
                  </Button>
                  <Button variant="outline" size="sm" className="w-full font-bold bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 text-emerald-800 dark:text-emerald-400">
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    Download Label
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Buyer Information Card */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-slate-900 p-6 border border-emerald-100/50 dark:border-emerald-950/60 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 space-y-4"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-850/60 dark:text-emerald-555 border-b border-emerald-50 dark:border-emerald-950/40 pb-3 mb-2 flex items-center gap-2">
                <Users className="h-4.5 w-4.5 text-emerald-650" />
                Recipient Buyer Info
              </h3>
              <div className="text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400">Designated Buyer</span>
                  <span className="font-bold text-emerald-950 dark:text-slate-200">Laurent Perfumeries Corp</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400">Delivery Location</span>
                  <span className="font-bold text-emerald-950 dark:text-slate-200">Grasse, France</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400">Organic Dispatch Clear</span>
                  <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Authorized</span>
                </div>
              </div>
            </motion.div>

            {/* Shipment History & Ledger Transactions */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-slate-900 p-6 border border-emerald-100/50 dark:border-emerald-950/60 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 space-y-4"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-855/60 dark:text-emerald-500 border-b border-emerald-50 dark:border-emerald-950/40 pb-3 mb-2 flex items-center gap-2">
                <History className="h-4.5 w-4.5 text-emerald-650" />
                Shipment Ledger Trails
              </h3>
              
              <div className="space-y-3.5 text-[11px]">
                {[
                  { title: "Distillation Seal Log", tx: "0x8df2a8c3e210b42f1869e5d713c2f9d6c41b80", status: "Cleared" },
                  { title: "GC-MS Cert Lock", tx: "0x1fb8e0a2d591b64b18c64115f5c907b3112c8a", status: "Sealed" },
                  { title: "Buyer Dispatch Clearing", tx: "0x93ab4988f562b71946e6a12b48d28c2e01b3da", status: "Signed" }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1 p-2.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-100/30 hover:border-amber-500/20 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 dark:text-emerald-350">{item.title}</span>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        item.status === "Cleared" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                        item.status === "Sealed" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                        "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[9px] text-slate-400 mt-1">
                      <span 
                        className="truncate hover:text-emerald-605 transition-colors cursor-pointer select-all"
                        onClick={() => copyToClipboard(item.tx, `Copied ${item.title} hash!`)}
                      >
                        {item.tx.slice(0, 10)}...{item.tx.slice(-8)}
                      </span>
                      <button 
                        onClick={() => copyToClipboard(item.tx, `Copied ${item.title} hash!`)}
                        className="p-1 rounded hover:bg-slate-205 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 transition-colors"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </motion.div>

        {/* Timeline (Detailed vertical audit trail) */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 p-6 border border-emerald-100/50 dark:border-emerald-955/60 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200"
        >
          <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-850/60 dark:text-emerald-500 mb-6 flex items-center gap-2">
            <Truck className="h-4.5 w-4.5 text-amber-500" />
            Distillation & Shipping Audit Timeline
          </h3>
          
          <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-100 dark:before:bg-emerald-950/60">
            {[
              { title: "GC-MS Purity Report Released", text: "Laboratory results verified pure compound trace compositions. Certified organic.", date: "July 3, 2026" },
              { title: "Steam Distillation Logged", text: "Distilled yields sealed at organic vacuum pressure extraction configurations.", date: "July 2, 2026" },
              { title: "Organic Crop Harvested", text: "Raw botanical crops harvested and tagged from agricultural Plot #4.", date: "June 28, 2026" }
            ].map((log, idx) => (
              <div key={idx} className="flex gap-6 relative pl-8 group">
                <div className="absolute left-1.5 top-1.5 h-4.5 w-4.5 rounded-full border-[3.5px] border-white dark:border-slate-900 bg-emerald-600 group-hover:scale-110 transition-transform duration-200 z-10" />
                <div className="text-xs bg-emerald-500/5 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-100/20 flex-grow hover:border-emerald-500/20 transition-all duration-200">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="font-bold text-emerald-950 dark:text-slate-200">{log.title}</span>
                    <span className="text-[10px] text-slate-400 font-semibold font-mono">{log.date}</span>
                  </div>
                  <p className="text-slate-550 dark:text-slate-400 leading-relaxed">{log.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
}

export default BatchDetails;
