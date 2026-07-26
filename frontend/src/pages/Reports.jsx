import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getReportSummary } from "../api/reports";
import showToast from "../components/ui/Toast";
import Loader from "../components/ui/Loader";
import Button from "../components/ui/Button";
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Filter,
  TrendingUp,
  Droplet,
  ShieldCheck,
  Users,
  Award,
  BarChart2,
  RefreshCw,
} from "lucide-react";

function Reports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [dateRange, setDateRange] = useState("all");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchReports = async () => {
    setLoading(true);
    try {
      const result = await getReportSummary();
      setData(result);
    } catch (err) {
      console.error(err);
      showToast("Failed to load reports analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReports();
  }, []);

  // Export CSV helper
  const handleExportCSV = () => {
    if (!data) return;
    const headers = ["Month", "Distillation Volume (L)", "Active Batches", "Purity Score (%)"];
    const rows = data.monthlyTrends.map((t) => [
      t.month,
      t.volume,
      t.activeBatches,
      `${t.purityScore}%`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AromaTrace_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("CSV report generated and downloaded!");
  };

  // Printable PDF view helper
  const handlePrintPDF = () => {
    window.print();
  };

  const summary = data?.summary;
  const monthlyTrends = data?.monthlyTrends || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Executive Production & Compliance Reports
            </h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Audit distillation statistics, commercial yields, buyer allocations, and purity certifications.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleExportCSV} variant="secondary" size="md">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button onClick={handlePrintPDF} variant="primary" size="md">
            <Printer className="h-4 w-4" /> Print PDF Report
          </Button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Timeframe:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="all">Year to Date (YTD 2026)</option>
            <option value="q2">Q2 2026</option>
            <option value="q1">Q1 2026</option>
          </select>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Filter className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="All">All Operations</option>
            <option value="Active">Active Batches</option>
            <option value="Completed">Completed Harvests</option>
          </select>
          <button
            onClick={fetchReports}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-emerald-600"
            title="Refresh Metrics"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" />
        </div>
      ) : !data ? (
        <div className="text-center py-16">
          <p className="text-slate-500">No report metrics available.</p>
        </div>
      ) : (
        <>
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Total Production</span>
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                  <Droplet className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{summary?.totalVolume} Liters</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +14.2% from previous month
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Registered Buyers</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{summary?.totalBuyers} Clients</p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1">
                {summary?.activeBuyers} active commercial accounts
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">GC-MS Certificates</span>
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                  <Award className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{summary?.totalCertificates} Issued</p>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
                100% QA verified
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Average Purity</span>
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{summary?.averagePurityRating}</p>
              <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold mt-1">
                Pharmaceutical Grade
              </p>
            </div>
          </div>

          {/* Interactive Visual Bar Chart */}
          <div className="bg-white/70 dark:bg-slate-900/70 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Monthly Essential Oil Yield (Liters)
                </h3>
                <p className="text-xs text-slate-500">2026 Production trajectory across distillation runs</p>
              </div>
            </div>

            <div className="h-48 flex items-end gap-3 pt-6 border-b border-slate-100 dark:border-slate-800 pb-4 overflow-x-auto">
              {monthlyTrends.map((t) => {
                const maxVol = 700;
                const heightPct = Math.round((t.volume / maxVol) * 100);
                return (
                  <div key={t.month} className="flex-1 flex flex-col items-center gap-2 min-w-[40px] group">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.volume}L
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPct}%` }}
                      transition={{ duration: 0.8 }}
                      className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 dark:from-emerald-700 dark:to-teal-500 rounded-t-xl group-hover:brightness-110 shadow-sm"
                    />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{t.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Breakdown Table */}
          <div className="bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-sm backdrop-blur-sm">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                Distillation Output & Quality Audit Table
              </h3>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                7 Monthly Cycles Recorded
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-950/80 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Month</th>
                    <th className="p-4">Volume (Liters)</th>
                    <th className="p-4">Active Batches</th>
                    <th className="p-4">Purity Index</th>
                    <th className="p-4">Compliance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                  {monthlyTrends.map((t) => (
                    <tr key={t.month} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{t.month} 2026</td>
                      <td className="p-4 font-semibold text-emerald-600 dark:text-emerald-400">{t.volume} Liters</td>
                      <td className="p-4">{t.activeBatches} Batches</td>
                      <td className="p-4 font-bold">{t.purityScore}% GC-MS</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          PASSED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;
