import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getBuyers,
  createBuyer,
  updateBuyer,
  deleteBuyer,
} from "../api/buyers";
import showToast from "../components/ui/Toast";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import {
  Users,
  Search,
  Plus,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Building,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  Eye,
  UserCheck,
  Calendar,
} from "lucide-react";

function Buyers() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [editingBuyer, setEditingBuyer] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formState, setFormState] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    status: "Active",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getBuyers({ search: searchQuery, status: statusFilter });
      setBuyers(data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load buyers directory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter]);

  const handleOpenAddModal = () => {
    setEditingBuyer(null);
    setFormState({
      name: "",
      company: "",
      email: "",
      phone: "",
      address: "",
      status: "Active",
    });
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (buyer) => {
    setEditingBuyer(buyer);
    setFormState({
      name: buyer.name,
      company: buyer.company,
      email: buyer.email,
      phone: buyer.phone || "",
      address: buyer.address || "",
      status: buyer.status || "Active",
    });
    setIsAddEditModalOpen(true);
  };

  const handleOpenViewModal = (buyer) => {
    setSelectedBuyer(buyer);
    setIsViewModalOpen(true);
  };

  const handleOpenDeleteModal = (buyer) => {
    setSelectedBuyer(buyer);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.name || !formState.company || !formState.email) {
      showToast("Please fill in Name, Company, and Email");
      return;
    }

    setSubmitting(true);
    try {
      if (editingBuyer) {
        const updated = await updateBuyer(editingBuyer.id, formState);
        setBuyers(buyers.map((b) => (b.id === editingBuyer.id ? updated : b)));
        showToast("Buyer account updated successfully");
      } else {
        const created = await createBuyer(formState);
        setBuyers([created, ...buyers]);
        showToast("New buyer registered successfully");
      }
      setIsAddEditModalOpen(false);
    } catch (err) {
      showToast(err.message || "Failed to save buyer");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBuyer) return;
    setSubmitting(true);
    try {
      await deleteBuyer(selectedBuyer.id);
      setBuyers(buyers.filter((b) => b.id !== selectedBuyer.id));
      showToast("Buyer record removed");
      setIsDeleteModalOpen(false);
    } catch (err) {
      showToast(err.message || "Failed to delete buyer");
    } finally {
      setSubmitting(false);
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(buyers.length / itemsPerPage) || 1;
  const paginatedBuyers = buyers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Buyers Directory
            </h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Manage commercial essential oil clients, wholesale contracts, and contact registries.
            </p>
          </div>
        </div>

        <Button onClick={handleOpenAddModal} variant="primary" size="md">
          <Plus className="h-4 w-4" /> Add New Buyer
        </Button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full sm:w-80">
          <Input
            icon={Search}
            placeholder="Search name, company, email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["All", "Active", "Inactive"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800/60"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" />
        </div>
      ) : paginatedBuyers.length === 0 ? (
        <div className="text-center py-16 bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <UserCheck className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Buyers Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            No commercial buyers match your query. Add a new buyer to get started.
          </p>
          <div className="mt-4">
            <Button onClick={handleOpenAddModal} variant="outline" size="sm">
              <Plus className="h-3.5 w-3.5" /> Add Buyer
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedBuyers.map((buyer) => (
            <motion.div
              key={buyer.id}
              whileHover={{ y: -4 }}
              className="bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-5 shadow-sm backdrop-blur-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                      {buyer.name}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                      <Building className="h-3 w-3" /> {buyer.company}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      buyer.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20"
                    }`}
                  >
                    {buyer.status === "Active" ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {buyer.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 mt-4 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{buyer.email}</span>
                  </div>
                  {buyer.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{buyer.phone}</span>
                    </div>
                  )}
                  {buyer.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{buyer.address}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 mt-5 pt-3">
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(buyer.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenViewModal(buyer)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(buyer)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-500/10 transition-colors"
                    title="Edit Buyer"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteModal(buyer)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                    title="Delete Buyer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white/40 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Page {currentPage} of {totalPages} ({buyers.length} total buyers)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        title={editingBuyer ? "Edit Buyer Information" : "Register New Buyer"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="Full Name *"
            placeholder="e.g. Eleanor Vance"
            value={formState.name}
            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
            required
          />
          <Input
            label="Company / Enterprise *"
            placeholder="e.g. Aetheria Perfumes Ltd."
            value={formState.company}
            onChange={(e) => setFormState({ ...formState, company: e.target.value })}
            required
          />
          <Input
            label="Email Address *"
            type="email"
            placeholder="e.g. eleanor@aetheria.com"
            value={formState.email}
            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
            required
          />
          <Input
            label="Phone Number"
            placeholder="e.g. +1 (555) 234-5678"
            value={formState.phone}
            onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
          />
          <Input
            label="Commercial Address"
            placeholder="e.g. Grasse, France"
            value={formState.address}
            onChange={(e) => setFormState({ ...formState, address: e.target.value })}
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Account Status
            </label>
            <select
              value={formState.status}
              onChange={(e) => setFormState({ ...formState, status: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Saving..." : editingBuyer ? "Update Buyer" : "Create Buyer"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Buyer Deletion"
      >
        <div className="space-y-4 pt-2">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to remove <strong className="text-slate-900 dark:text-white">{selectedBuyer?.name}</strong> ({selectedBuyer?.company}) from the buyer directory?
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDelete} disabled={submitting} className="bg-rose-600 hover:bg-rose-700 text-white">
              {submitting ? "Deleting..." : "Delete Buyer"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Buyer Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Buyer Dossier"
      >
        {selectedBuyer && (
          <div className="space-y-4 pt-2 text-sm">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Buyer Name</span>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{selectedBuyer.name}</h4>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Company</span>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedBuyer.company}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Email Address</span>
                <p className="text-slate-700 dark:text-slate-300">{selectedBuyer.email}</p>
              </div>

              {selectedBuyer.phone && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Phone</span>
                  <p className="text-slate-700 dark:text-slate-300">{selectedBuyer.phone}</p>
                </div>
              )}

              {selectedBuyer.address && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Address</span>
                  <p className="text-slate-700 dark:text-slate-300">{selectedBuyer.address}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t border-slate-200/50 dark:border-slate-800">
                <span className="text-xs text-slate-500">Status</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedBuyer.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-500"}`}>
                  {selectedBuyer.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Buyers;
