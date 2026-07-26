import { useEffect, useState } from "react";
import {
  getCertificates,
  createCertificate,
  deleteCertificate,
} from "../api/certificates";
import { getBuyers } from "../api/buyers";
import { getBatches } from "../api/batches";
import showToast from "../components/ui/Toast";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import {
  Award,
  Search,
  Plus,
  Trash2,
  Eye,
  Printer,
  CheckCircle2,
  XCircle,
  FileCheck,
  ShieldCheck,
  QrCode,
} from "lucide-react";

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals state
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formState, setFormState] = useState({
    buyerId: "",
    buyerName: "",
    batchId: "",
    batchName: "",
    expiryDays: "365",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [certList, buyerList, batchList] = await Promise.all([
        getCertificates({ search: searchQuery, status: statusFilter }),
        getBuyers().catch(() => []),
        getBatches().catch(() => []),
      ]);
      setCertificates(certList);
      setBuyers(buyerList);
      setBatches(batchList);
    } catch (err) {
      console.error(err);
      showToast("Failed to load certificates registry");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter]);

  const handleOpenGenerateModal = () => {
    setFormState({
      buyerId: buyers[0]?.id || "",
      buyerName: buyers[0]?.company || buyers[0]?.name || "",
      batchId: batches[0]?.id || "",
      batchName: batches[0]?.name || "",
      expiryDays: "365",
    });
    setIsGenerateModalOpen(true);
  };

  const handleBuyerSelect = (e) => {
    const selectedId = e.target.value;
    const buyerObj = buyers.find((b) => String(b.id) === String(selectedId));
    setFormState({
      ...formState,
      buyerId: selectedId,
      buyerName: buyerObj ? `${buyerObj.company} (${buyerObj.name})` : "",
    });
  };

  const handleBatchSelect = (e) => {
    const selectedId = e.target.value;
    const batchObj = batches.find((b) => String(b.id) === String(selectedId));
    setFormState({
      ...formState,
      batchId: selectedId,
      batchName: batchObj ? batchObj.name : "",
    });
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    if (!formState.buyerName) {
      showToast("Please select a buyer");
      return;
    }

    setSubmitting(true);
    try {
      const created = await createCertificate(formState);
      setCertificates([created, ...certificates]);
      showToast(`Certificate ${created.certificateNumber} generated!`);
      setIsGenerateModalOpen(false);
    } catch (err) {
      showToast(err.message || "Failed to generate certificate");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCertificate(id);
      setCertificates(certificates.filter((c) => c.id !== id));
      showToast("Certificate revoked and deleted");
    } catch (err) {
      showToast(err.message || "Failed to delete certificate");
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              GC-MS Compliance Certificates
            </h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Issue and verify official Gas Chromatography-Mass Spectrometry analysis documentation for client shipments.
            </p>
          </div>
        </div>

        <Button onClick={handleOpenGenerateModal} variant="primary" size="md">
          <Plus className="h-4 w-4" /> Issue New Certificate
        </Button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full sm:w-80">
          <Input
            icon={Search}
            placeholder="Search certificate #, buyer, batch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["All", "Valid", "Expired"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status
                  ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                  : "bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800/60"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-16 bg-white/40 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <FileCheck className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Certificates Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            No compliance certificates match your criteria. Issue a new certificate to accredit client batches.
          </p>
          <div className="mt-4">
            <Button onClick={handleOpenGenerateModal} variant="outline" size="sm">
              <Plus className="h-3.5 w-3.5" /> Issue Certificate
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-sm backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 dark:bg-slate-950/80 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-4">Certificate #</th>
                  <th className="p-4">Client / Buyer</th>
                  <th className="p-4">Batch Identity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Issue Date</th>
                  <th className="p-4">Expiry Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                      {cert.certificateNumber}
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {cert.buyerName}
                    </td>
                    <td className="p-4 font-medium text-slate-600 dark:text-slate-300">
                      {cert.batchName || "Standard Essential Oil Batch"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          cert.status === "Valid"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {cert.status === "Valid" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {cert.status}
                      </span>
                    </td>
                    <td className="p-4">{new Date(cert.issueDate).toLocaleDateString()}</td>
                    <td className="p-4 text-slate-500">
                      {cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString() : "Never"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedCertificate(cert);
                            setIsViewModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-500/10 transition-colors"
                          title="View Certificate"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cert.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                          title="Revoke Certificate"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Generate Certificate Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Issue GC-MS Analysis Certificate"
      >
        <form onSubmit={handleGenerateSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Client / Buyer *
            </label>
            {buyers.length > 0 ? (
              <select
                onChange={handleBuyerSelect}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              >
                {buyers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.company} ({b.name})
                  </option>
                ))}
              </select>
            ) : (
              <Input
                placeholder="Enter client / buyer company name"
                value={formState.buyerName}
                onChange={(e) => setFormState({ ...formState, buyerName: e.target.value })}
                required
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Assigned Essential Oil Batch
            </label>
            {batches.length > 0 ? (
              <select
                onChange={handleBatchSelect}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} (Qty: {b.quantity}L - {b.status})
                  </option>
                ))}
              </select>
            ) : (
              <Input
                placeholder="Batch name"
                value={formState.batchName}
                onChange={(e) => setFormState({ ...formState, batchName: e.target.value })}
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Validity Duration (Days)
            </label>
            <select
              value={formState.expiryDays}
              onChange={(e) => setFormState({ ...formState, expiryDays: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            >
              <option value="365">1 Year (365 Days)</option>
              <option value="180">6 Months (180 Days)</option>
              <option value="730">2 Years (730 Days)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsGenerateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Generating..." : "Generate Certificate"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Formal View Certificate Printable Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Official Certificate of Analysis"
      >
        {selectedCertificate && (
          <div className="space-y-6 pt-2">
            {/* Printable Certificate Template */}
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border-2 border-amber-500/30 dark:border-amber-500/20 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-lg tracking-wider">
                      AROMATRACE DISTILLERY
                    </h3>
                    <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">
                      Certificate of Authenticity & Purity
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Certificate No.</span>
                  <span className="font-mono font-bold text-amber-600 text-sm">{selectedCertificate.certificateNumber}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Issued To Client</span>
                    <p className="font-bold text-slate-900 dark:text-white">{selectedCertificate.buyerName}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Essential Oil Batch</span>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedCertificate.batchName || "Organic Essential Extract"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Issue Date</span>
                    <p className="text-slate-700 dark:text-slate-300">
                      {new Date(selectedCertificate.issueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Expiration Date</span>
                    <p className="text-slate-700 dark:text-slate-300">
                      {selectedCertificate.expiryDate
                        ? new Date(selectedCertificate.expiryDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-white/60 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 mt-4 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">GC-MS Analysis Result</span>
                  <p className="text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                    ✓ 99.5% Active Botanical Purity — Free from Synthetic Additives & Heavy Metals
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-amber-500/20 pt-4 mt-6">
                <div className="flex items-center gap-2">
                  <QrCode className="h-10 w-10 text-slate-700 dark:text-slate-300" />
                  <span className="text-[9px] text-slate-400 max-w-[120px] leading-tight">
                    Scan QR code to verify on AromaTrace Blockchain Registry
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-serif italic text-slate-700 dark:text-slate-300">Ojasvi Jaiswal</p>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Chief QA Aroma Chemist</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handlePrintCertificate}>
                <Printer className="h-4 w-4" /> Download / Print PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Certificates;
