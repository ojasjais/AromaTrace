import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getBatches,
  createBatch,
  updateBatch,
  deleteBatch
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
  Droplet
} from "lucide-react";

const LoadingSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 border border-emerald-100/50 dark:border-emerald-950/60 rounded-2xl shadow-sm overflow-hidden divide-y divide-emerald-50 dark:divide-emerald-950/40 animate-pulse">
    <div className="bg-emerald-50/20 dark:bg-slate-950 p-4.5 pl-6 h-12 w-full flex items-center justify-between border-b border-emerald-100 dark:border-emerald-950">
      <div className="h-4 w-24 bg-emerald-600/10 dark:bg-emerald-955 rounded"></div>
      <div className="h-4 w-48 bg-emerald-600/10 dark:bg-emerald-955 rounded"></div>
    </div>
    {[1, 2, 3, 4, 5].map((idx) => (
      <div key={idx} className="p-4.5 flex items-center justify-between gap-4">
        <div className="h-4 w-16 bg-emerald-500/10 dark:bg-emerald-950/40 rounded"></div>
        <div className="h-4 w-40 bg-emerald-500/10 dark:bg-emerald-950/40 rounded"></div>
        <div className="h-4 w-24 bg-emerald-500/10 dark:bg-emerald-950/40 rounded"></div>
        <div className="h-5 w-20 bg-emerald-500/10 dark:bg-emerald-950/40 rounded-full"></div>
        <div className="h-4 w-28 bg-emerald-500/10 dark:bg-emerald-950/40 rounded"></div>
        <div className="flex gap-2">
          <div className="h-7 w-7 bg-emerald-500/10 dark:bg-emerald-950/40 rounded-lg"></div>
          <div className="h-7 w-7 bg-emerald-500/10 dark:bg-emerald-950/40 rounded-lg"></div>
        </div>
      </div>
    ))}
  </div>
);

function Batches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // CRUD Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [formState, setFormState] = useState({ name: "", quantity: "", status: "Active" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getBatches();
      setBatches(data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load distillation registry");
    } finally {
      setLoading(false);
    }
  };

  // Create or Update Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.quantity) {
      showToast("Please complete all form fields");
      return;
    }

    try {
      if (editingBatch) {
        // Edit flow
        const updated = await updateBatch(editingBatch.id, formState);
        setBatches(batches.map(b => b.id === editingBatch.id ? updated : b));
        showToast("Batch updated successfully!");
      } else {
        // Create flow
        const created = await createBatch(formState);
        setBatches([created, ...batches]);
        showToast("Batch created successfully!");
      }
      setIsAddEditModalOpen(false);
      setEditingBatch(null);
      setFormState({ name: "", quantity: "", status: "Active" });
    } catch (error) {
      console.error(error);
      showToast(editingBatch ? "Failed to update batch" : "Failed to create batch");
    }
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this batch record?")) {
      return;
    }
    try {
      await deleteBatch(id);
      setBatches(batches.filter(b => b.id !== id));
      showToast("Batch record deleted");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete batch");
    }
  };

  // Open modal for editing
  const openEditModal = (batch) => {
    setEditingBatch(batch);
    setFormState({ name: batch.name, quantity: batch.quantity.toString(), status: batch.status });
    setIsAddEditModalOpen(true);
  };

  // Open modal for adding
  const openAddModal = () => {
    setEditingBatch(null);
    setFormState({ name: "", quantity: "", status: "Active" });
    setIsAddEditModalOpen(true);
  };

  // Filter & Sort Logic
  const filteredBatches = batches
    .filter(batch => {
      const matchesSearch = batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        batch.id.toString().includes(searchQuery);
      
      const matchesStatus = statusFilter === "All" || batch.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt || a.id) - new Date(b.createdAt || b.id);
      }
      if (sortBy === "quantity-desc") {
        return b.quantity - a.quantity;
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  // Pagination Logic
  const totalPages = Math.ceil(filteredBatches.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBatches.slice(indexOfFirstItem, indexOfLastItem);

  // Helper for status colors with glowing dot
  const getStatusBadge = (statusVal) => {
    const val = statusVal.toLowerCase();
    if (val.includes("test") || val.includes("pend")) {
      return {
        colors: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
        dot: "bg-amber-500"
      };
    }
    if (val.includes("dispatch") || val.includes("complet") || val.includes("success") || val.includes("active")) {
      return {
        colors: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
        dot: "bg-emerald-500"
      };
    }
    return {
      colors: "bg-slate-500/10 text-slate-650 dark:text-slate-400 border-slate-500/20",
      dot: "bg-slate-400"
    };
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-50/40 dark:bg-slate-900/60 backdrop-blur-md p-6 border border-emerald-100 dark:border-emerald-950/60 rounded-3xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Inventory Logs</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-emerald-950 dark:text-white">Essential Oil Batch Management</h1>
          <p className="text-xs text-slate-400">Distill, monitor chromatography, and clear shipping releases for active batches.</p>
        </div>
        <Button variant="primary" size="md" onClick={openAddModal} className="flex items-center gap-2 font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-emerald-600/10">
          <Plus className="h-4.5 w-4.5" />
          Log New Distillation
        </Button>
      </div>

      {/* Filters Controls Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-emerald-50/30 dark:bg-slate-900/40 backdrop-blur-sm p-4 border border-emerald-105/50 dark:border-emerald-950/40 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-emerald-600/70" />
          <input
            type="text"
            placeholder="Search by botanical oil name or batch ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-emerald-100/60 dark:border-emerald-950 bg-white dark:bg-slate-950 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder-slate-400 font-semibold"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-emerald-100/60 dark:border-emerald-950 bg-white dark:bg-slate-950 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none font-bold text-emerald-800/80 dark:text-emerald-350"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active / Processing</option>
            <option value="Testing">GC-MS Testing</option>
            <option value="Completed">Completed / Dispatched</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-emerald-600/70">
            <Filter className="h-4 w-4" />
          </div>
        </div>

        {/* Sort By */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-emerald-100/60 dark:border-emerald-950 bg-white dark:bg-slate-950 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none font-bold text-emerald-800/80 dark:text-emerald-355"
          >
            <option value="newest">Distilled (Newest)</option>
            <option value="oldest">Distilled (Oldest)</option>
            <option value="quantity-desc">Quantity (High to Low)</option>
            <option value="name-asc">Alphabetical (A-Z)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-emerald-600/70">
            <ArrowUpDown className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Data Table / List */}
      {loading ? (
        <LoadingSkeleton />
      ) : filteredBatches.length === 0 ? (
        /* Empty state with premium hand-drawn leaf illustration */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-16 text-center bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-950/60 rounded-3xl shadow-sm"
        >
          {/* Leaf Illustration SVG */}
          <svg viewBox="0 0 100 100" className="w-16 h-16 text-emerald-600/50 dark:text-emerald-500/55 mb-6 animate-bounce">
            <path 
              d="M50 15 C30 35 30 70 50 85 C70 70 70 35 50 15 Z" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="3" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M50 15 V85" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round"
            />
            <path d="M50 35 Q40 40 33 36" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M50 45 Q60 50 67 46" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M50 55 Q40 60 33 56" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M50 65 Q60 70 67 66" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No distillation logs located</h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1.5 mb-8 leading-relaxed">
            No active batches match your queries. Please modify filter parameters or start a new distillation record.
          </p>
          <Button variant="outline" size="sm" onClick={openAddModal} className="flex items-center gap-1.5 font-bold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50">
            <Plus className="h-4 w-4" />
            Add Extraction Batch
          </Button>
        </motion.div>
      ) : (
        /* Modern Data Table */
        <div className="bg-white dark:bg-slate-900 border border-emerald-100/50 dark:border-emerald-950/60 rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-emerald-50/20 dark:bg-slate-950 border-b border-emerald-100/55 dark:border-emerald-950 text-emerald-800/80 dark:text-emerald-400 font-bold uppercase tracking-wider">
                  <th className="p-4.5 pl-6">Batch ID</th>
                  <th className="p-4.5">Botanical Oil Name</th>
                  <th className="p-4.5">Yield Quantity</th>
                  <th className="p-4.5">Status Check</th>
                  <th className="p-4.5">Extraction Date</th>
                  <th className="p-4.5 pr-6 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50/20 dark:divide-emerald-950/40">
                {currentItems.map((batch) => {
                  const statusInfo = getStatusBadge(batch.status);
                  return (
                    <tr key={batch.id} className="hover:bg-emerald-500/5 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="p-4.5 pl-6 font-mono font-bold text-emerald-700/60 dark:text-emerald-500">
                        <Link to={`/batches/${batch.id}`} className="hover:text-emerald-750 transition-colors">
                          #{batch.id.toString().slice(-6)}
                        </Link>
                      </td>
                      <td className="p-4.5 font-bold text-emerald-950 dark:text-slate-200">
                        <Link to={`/batches/${batch.id}`} className="hover:text-emerald-750 transition-colors">
                          {batch.name}
                        </Link>
                      </td>
                      <td className="p-4.5 font-semibold text-slate-700 dark:text-slate-350">
                        {batch.quantity} Liters
                      </td>
                      <td className="p-4.5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusInfo.colors}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.dot} animate-pulse`} />
                          {batch.status}
                        </span>
                      </td>
                      <td className="p-4.5 text-slate-500 dark:text-slate-450 font-bold">
                        {batch.createdAt ? new Date(batch.createdAt).toLocaleDateString() : "Pending"}
                      </td>
                      <td className="p-4.5 pr-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(batch)}
                            className="p-1.5 rounded-lg border border-emerald-100/50 dark:border-emerald-950/60 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-450 hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 transition-colors"
                            title="Edit Batch"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(batch.id)}
                            className="p-1.5 rounded-lg border border-emerald-100/50 dark:border-emerald-950/60 text-slate-400 hover:text-red-500 dark:hover:text-red-450 hover:bg-red-500/5 dark:hover:bg-red-500/10 transition-colors"
                            title="Delete Batch"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="border-t border-emerald-50 dark:border-emerald-950/40 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400 font-medium">
              Showing <span className="font-bold text-emerald-800 dark:text-emerald-350">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-bold text-emerald-800 dark:text-emerald-350">
                {Math.min(indexOfLastItem, filteredBatches.length)}
              </span>{" "}
              of <span className="font-bold text-emerald-800 dark:text-emerald-350">{filteredBatches.length}</span> logs
            </span>

            <div className="inline-flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-2 rounded-xl border border-emerald-100/60 dark:border-emerald-950 bg-slate-50 dark:bg-slate-950 text-slate-400 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pg = idx + 1;
                const isCurrent = currentPage === pg;
                return (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`h-8.5 w-8.5 rounded-xl border text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-500/15"
                        : "border-emerald-100 dark:border-emerald-955 bg-slate-50 dark:bg-slate-950 text-slate-500 hover:bg-emerald-50 dark:text-slate-400"
                    }`}
                  >
                    {pg}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-2 rounded-xl border border-emerald-100/60 dark:border-emerald-950 bg-slate-50 dark:bg-slate-955 text-slate-400 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Add / Edit Form Modal */}
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
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          />

          <Input
            label="Net Yield Volume (Liters)"
            type="number"
            placeholder="e.g. 80"
            value={formState.quantity}
            onChange={(e) => setFormState({ ...formState, quantity: e.target.value })}
          />

          <div className="w-full max-w-xl mb-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Clearance Status
            </label>
            <select
              value={formState.status}
              onChange={(e) => setFormState({ ...formState, status: e.target.value })}
              className="w-full border border-emerald-105/50 p-3 rounded-xl text-sm transition-all duration-200 outline-none bg-white text-slate-850 dark:bg-slate-950 dark:text-slate-100 dark:border-slate-850 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-bold"
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
  );
}

export default Batches;