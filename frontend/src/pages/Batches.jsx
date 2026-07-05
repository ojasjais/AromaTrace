import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getBatches,
  createBatch,
  updateBatch,
  deleteBatch,
} from "../api/batches";
import showToast from "../components/ui/Toast";
import Modal from "../components/ui/Modal";
import Loader from "../components/ui/Loader";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Database,
  Calendar,
  Layers,
  FlaskConical,
  Leaf,
  Droplet,
  ArrowRight,
  SlidersHorizontal,
  PackageSearch,
  CheckCircle2,
  Clock,
  PackageCheck,
  X,
} from "lucide-react";

/* ─────────────────────────────────────────
   Status config
───────────────────────────────────────── */
const statusConfig = {
  active: {
    label: "Active",
    dot: "bg-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
    glow: "shadow-emerald-500/20",
    icon: CheckCircle2,
  },
  testing: {
    label: "Testing",
    dot: "bg-amber-500",
    badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
    glow: "shadow-amber-500/20",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    dot: "bg-blue-500",
    badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/25",
    glow: "shadow-blue-500/20",
    icon: PackageCheck,
  },
  default: {
    label: "Unknown",
    dot: "bg-slate-400",
    badge: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    glow: "",
    icon: Layers,
  },
};

function getStatusKey(status = "") {
  const v = status.toLowerCase();
  if (v.includes("test") || v.includes("pend")) return "testing";
  if (v.includes("dispatch") || v.includes("complet") || v.includes("success")) return "completed";
  if (v.includes("active") || v.includes("process")) return "active";
  return "default";
}

/* ─────────────────────────────────────────
   Loading Skeleton
───────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 shadow-sm overflow-hidden animate-pulse">
      {/* Fake header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
        <div className="h-3.5 w-28 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 px-6 py-4 border-b border-slate-100/60 dark:border-slate-800/40 last:border-0"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="h-3 w-14 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-3 flex-1 max-w-[160px] rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-3 w-20 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-5 w-24 rounded-full bg-slate-100 dark:bg-slate-800" />
          <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="ml-auto flex gap-2">
            <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800" />
            <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Empty State
───────────────────────────────────────── */
function EmptyState({ hasFilters, onAdd, onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center py-20 px-8 text-center rounded-2xl border border-dashed border-emerald-300/50 dark:border-emerald-800/40 bg-emerald-50/30 dark:bg-emerald-950/10"
    >
      {/* Illustrated icon */}
      <div className="relative mb-6">
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40 flex items-center justify-center shadow-inner">
          <PackageSearch className="h-9 w-9 text-emerald-500 dark:text-emerald-400" aria-hidden="true" />
        </div>
        <div className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
          <Leaf className="h-4 w-4 text-emerald-500" aria-hidden="true" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
        {hasFilters ? "No batches match your filters" : "No distillation logs yet"}
      </h3>
      <p className="text-sm text-slate-400 dark:text-slate-500 max-w-sm leading-relaxed mb-8">
        {hasFilters
          ? "Try adjusting your search terms or filter chips to find what you're looking for."
          : "Start by registering your first essential oil distillation batch to begin traceability."}
      </p>

      <div className="flex items-center gap-3">
        {hasFilters && (
          <Button variant="outline" size="sm" onClick={onClear} className="flex items-center gap-1.5">
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear Filters
          </Button>
        )}
        <Button variant="primary" size="sm" onClick={onAdd} className="flex items-center gap-1.5">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Log First Batch
        </Button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Filter chip
───────────────────────────────────────── */
function FilterChip({ label, active, count, onClick, dot }) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap",
        active
          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/25"
          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:text-emerald-600 dark:hover:border-emerald-700 dark:hover:text-emerald-400",
      ].join(" ")}
      aria-pressed={active}
    >
      {dot && !active && <span className={`h-1.5 w-1.5 rounded-full ${dot} flex-shrink-0`} />}
      {label}
      {count != null && (
        <span className={[
          "text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none",
          active ? "bg-white/25 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400",
        ].join(" ")}>
          {count}
        </span>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════════
   Batches page
═══════════════════════════════════════════ */
function Batches() {
  /* ── All original state ── */
  const [batches, setBatches]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [searchQuery, setSearchQuery]       = useState("");
  const [statusFilter, setStatusFilter]     = useState("All");
  const [sortBy, setSortBy]                 = useState("newest");
  const [currentPage, setCurrentPage]       = useState(1);
  const itemsPerPage                        = 6;
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingBatch, setEditingBatch]     = useState(null);
  const [formState, setFormState]           = useState({ name: "", quantity: "", status: "Active" });

  /* ── Original API / logic ── */
  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getBatches();
      setBatches(data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load distillation registry");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.quantity) { showToast("Please complete all form fields"); return; }
    try {
      if (editingBatch) {
        const updated = await updateBatch(editingBatch.id, formState);
        setBatches(batches.map(b => b.id === editingBatch.id ? updated : b));
        showToast("Batch updated successfully!");
      } else {
        const created = await createBatch(formState);
        setBatches([created, ...batches]);
        showToast("Batch created successfully!");
      }
      setIsAddEditModalOpen(false);
      setEditingBatch(null);
      setFormState({ name: "", quantity: "", status: "Active" });
    } catch (err) {
      console.error(err);
      showToast(editingBatch ? "Failed to update batch" : "Failed to create batch");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this batch record?")) return;
    try {
      await deleteBatch(id);
      setBatches(batches.filter(b => b.id !== id));
      showToast("Batch record deleted");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete batch");
    }
  };

  const openEditModal = (batch) => {
    setEditingBatch(batch);
    setFormState({ name: batch.name, quantity: batch.quantity.toString(), status: batch.status });
    setIsAddEditModalOpen(true);
  };

  const openAddModal = () => {
    setEditingBatch(null);
    setFormState({ name: "", quantity: "", status: "Active" });
    setIsAddEditModalOpen(true);
  };

  /* ── Filter / sort logic (identical to original) ── */
  const filteredBatches = batches
    .filter(b => {
      const matchSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toString().includes(searchQuery);
      const matchStatus = statusFilter === "All" || b.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest")        return new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id);
      if (sortBy === "oldest")        return new Date(a.createdAt || a.id) - new Date(b.createdAt || b.id);
      if (sortBy === "quantity-desc") return b.quantity - a.quantity;
      if (sortBy === "name-asc")      return a.name.localeCompare(b.name);
      return 0;
    });

  /* ── Pagination ── */
  const totalPages      = Math.ceil(filteredBatches.length / itemsPerPage) || 1;
  const indexOfLast     = currentPage * itemsPerPage;
  const indexOfFirst    = indexOfLast - itemsPerPage;
  const currentItems    = filteredBatches.slice(indexOfFirst, indexOfLast);

  /* ── Derived counts for filter chips ── */
  const countAll       = batches.length;
  const countActive    = batches.filter(b => getStatusKey(b.status) === "active").length;
  const countTesting   = batches.filter(b => getStatusKey(b.status) === "testing").length;
  const countCompleted = batches.filter(b => getStatusKey(b.status) === "completed").length;

  const hasFilters = searchQuery !== "" || statusFilter !== "All";

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  /* ════════════════════ RENDER ════════════════════ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* ══ PAGE HEADER ══ */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-5 shadow-sm"
        >
          {/* Subtle bg blob */}
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-50/50 to-transparent dark:from-emerald-950/20 pointer-events-none" />

          <div className="relative space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 dark:bg-emerald-500/15">
                <FlaskConical className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Inventory Registry
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Batch Management
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              Distill, monitor GC-MS chromatography results, and manage dispatch clearances.
            </p>
          </div>

          <div className="relative flex items-center gap-3 flex-shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{countAll}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mt-0.5">Total Batches</p>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
            <Button
              variant="primary"
              size="md"
              onClick={openAddModal}
              className="flex items-center gap-2 font-bold shadow-lg shadow-emerald-500/20"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Log New Batch
            </Button>
          </div>
        </motion.div>

        {/* ══ SEARCH + SORT BAR ══ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 }}
          className="flex flex-col gap-4"
        >
          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search by botanical oil name or batch ID…"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                aria-label="Search batches"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/80 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder-slate-400 text-slate-800 dark:text-slate-200 font-medium shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative sm:w-56">
              <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" aria-hidden="true" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                aria-label="Sort batches"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/80 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none font-semibold text-slate-700 dark:text-slate-300 shadow-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="quantity-desc">Quantity (High → Low)</option>
                <option value="name-asc">Name (A → Z)</option>
              </select>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
              Filter:
            </span>
            <FilterChip label="All Batches"  active={statusFilter === "All"}       count={countAll}       onClick={() => { setStatusFilter("All");       setCurrentPage(1); }} />
            <FilterChip label="Active"       active={statusFilter === "Active"}     count={countActive}    dot="bg-emerald-500" onClick={() => { setStatusFilter("Active");     setCurrentPage(1); }} />
            <FilterChip label="GC-MS Testing" active={statusFilter === "Testing"}   count={countTesting}   dot="bg-amber-500"   onClick={() => { setStatusFilter("Testing");    setCurrentPage(1); }} />
            <FilterChip label="Completed"    active={statusFilter === "Completed"}  count={countCompleted} dot="bg-blue-500"     onClick={() => { setStatusFilter("Completed"); setCurrentPage(1); }} />

            {hasFilters && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={clearFilters}
                className="ml-1 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-500 transition-colors font-semibold"
                aria-label="Clear all filters"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </motion.button>
            )}

            <span className="ml-auto text-xs text-slate-400 font-medium">
              {filteredBatches.length} result{filteredBatches.length !== 1 ? "s" : ""}
            </span>
          </div>
        </motion.div>

        {/* ══ TABLE / STATES ══ */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingSkeleton />
            </motion.div>

          ) : filteredBatches.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState hasFilters={hasFilters} onAdd={openAddModal} onClear={clearFilters} />
            </motion.div>

          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shadow-sm overflow-hidden"
            >
              {/* Table header row */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <Database className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Distillation Registry
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs" role="table" aria-label="Essential oil batch registry">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      <th className="px-5 py-3 pl-6">Batch ID</th>
                      <th className="px-4 py-3">Botanical Oil Name</th>
                      <th className="px-4 py-3">Yield</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-5 py-3 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {currentItems.map((batch, idx) => {
                        const sk = getStatusKey(batch.status);
                        const sc = statusConfig[sk];
                        return (
                          <motion.tr
                            key={batch.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="group border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-emerald-500/5 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            {/* Batch ID */}
                            <td className="px-5 py-4 pl-6">
                              <Link
                                to={`/batches/${batch.id}`}
                                className="font-mono font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors text-[11px]"
                              >
                                #{batch.id.toString().slice(-6)}
                              </Link>
                            </td>

                            {/* Name */}
                            <td className="px-4 py-4">
                              <Link
                                to={`/batches/${batch.id}`}
                                className="font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-1.5 group/link"
                              >
                                {batch.name}
                                <ArrowRight className="h-3 w-3 opacity-0 group-hover/link:opacity-100 -translate-x-1 group-hover/link:translate-x-0 transition-all duration-150" aria-hidden="true" />
                              </Link>
                            </td>

                            {/* Quantity */}
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
                                <Droplet className="h-3 w-3 text-teal-500 flex-shrink-0" aria-hidden="true" />
                                {batch.quantity}L
                              </div>
                            </td>

                            {/* Status badge */}
                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${sc.badge} ${sc.glow}`}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full ${sc.dot} animate-pulse flex-shrink-0`} />
                                {batch.status}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-500 font-medium">
                                <Calendar className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                                {batch.createdAt
                                  ? new Date(batch.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })
                                  : "—"}
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="px-5 py-4 pr-6 text-right">
                              <div className="inline-flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => openEditModal(batch)}
                                  title="Edit batch"
                                  aria-label={`Edit ${batch.name}`}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-400/50 dark:hover:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all duration-200"
                                >
                                  <Edit2 className="h-3.5 w-3.5" aria-hidden="true" />
                                </button>
                                <button
                                  onClick={() => handleDelete(batch.id)}
                                  title="Delete batch"
                                  aria-label={`Delete ${batch.name}`}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:border-rose-400/50 dark:hover:border-rose-700/50 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-200"
                                >
                                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/30">
                <p className="text-xs text-slate-400 font-medium">
                  Showing{" "}
                  <span className="font-bold text-slate-700 dark:text-slate-300">{indexOfFirst + 1}</span>
                  {" – "}
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {Math.min(indexOfLast, filteredBatches.length)}
                  </span>
                  {" of "}
                  <span className="font-bold text-slate-700 dark:text-slate-300">{filteredBatches.length}</span>
                  {" batches"}
                </p>

                <div className="inline-flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    aria-label="Previous page"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:border-emerald-400/50 disabled:opacity-35 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pg = i + 1;
                    const active = currentPage === pg;
                    return (
                      <button
                        key={pg}
                        onClick={() => setCurrentPage(pg)}
                        aria-label={`Page ${pg}`}
                        aria-current={active ? "page" : undefined}
                        className={[
                          "h-8 w-8 rounded-lg border text-xs font-bold transition-all",
                          active
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-emerald-400/50 hover:text-emerald-600 dark:hover:text-emerald-400",
                        ].join(" ")}
                      >
                        {pg}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    aria-label="Next page"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:border-emerald-400/50 disabled:opacity-35 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ ADD / EDIT MODAL (preserved exactly) ══ */}
        <Modal
          isOpen={isAddEditModalOpen}
          onClose={() => setIsAddEditModalOpen(false)}
          title={editingBatch ? "Update Distilled Batch Details" : "Register New Distillation Batch"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Botanical / Oil Name"
              placeholder="e.g. Lavender Extra"
              value={formState.name}
              onChange={e => setFormState({ ...formState, name: e.target.value })}
            />
            <Input
              label="Net Yield Volume (Liters)"
              type="number"
              placeholder="e.g. 80"
              value={formState.quantity}
              onChange={e => setFormState({ ...formState, quantity: e.target.value })}
            />
            <div className="w-full mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Clearance Status
              </label>
              <select
                value={formState.status}
                onChange={e => setFormState({ ...formState, status: e.target.value })}
                className="w-full border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-sm transition-all duration-200 outline-none bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-semibold"
              >
                <option value="Active">Active / Processing</option>
                <option value="Testing">GC-MS Testing</option>
                <option value="Completed">Completed / Dispatched</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" size="md" onClick={() => setIsAddEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                {editingBatch ? "Save Changes" : "Register Record"}
              </Button>
            </div>
          </form>
        </Modal>

      </div>
    </div>
  );
}

export default Batches;