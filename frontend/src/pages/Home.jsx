import { useEffect, useState } from "react";
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

      {/* 2. Platform Value Propositions Grid */}
      <section className="py-16 md:py-24 border-t border-b border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Enterprise Grade Supply Chain Integrity
            </h2>
            <p className="mt-4 text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              Verify purity, track organic certificates, and automate transport compliance from harvest to buyer dispatch with high-fidelity telemetry.
            </p>
          </div>

          <motion.div
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <motion.div variants={fadeInVariants} className="flex flex-col p-6 rounded-2xl border border-slate-200/60 bg-white dark:border-slate-800/80 dark:bg-slate-900/60 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 mb-5">
                <Database className="h-5.5 w-5.5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Immutable Batch Ledger</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-grow">
                Log batches with verified weight, source coordinates, and botanical specifications. Each record is sealed to prevent tamper modification.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={fadeInVariants} className="flex flex-col p-6 rounded-2xl border border-slate-200/60 bg-white dark:border-slate-800/80 dark:bg-slate-900/60 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 mb-5">
                <FlaskConical className="h-5.5 w-5.5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">GC-MS Laboratory Audits</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-grow">
                Upload gas chromatography-mass spectrometry certificates directly. Link tests directly to distillation records for maximum transparency.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={fadeInVariants} className="flex flex-col p-6 rounded-2xl border border-slate-200/60 bg-white dark:border-slate-800/80 dark:bg-slate-900/60 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 mb-5">
                <Layers className="h-5.5 w-5.5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Multi-Tier Dispatches</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-grow">
                Map complex batch splits, blends, and shipping lanes. Give global buyers instant visibility on the exact origin of their active compounds.
              </p>
            </motion.div>
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

      {/* 4. Numerical Metrics Callout Banner */}
      <section className="py-16 md:py-20 bg-slate-900 text-white dark:bg-slate-950 dark:border-t dark:border-b dark:border-slate-900 transition-colors duration-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-emerald-400">
                12,500L+
              </div>
              <div className="text-xs text-slate-400 mt-2 font-semibold uppercase tracking-wider">
                Total Liters Traced
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-emerald-400">
                99.9%
              </div>
              <div className="text-xs text-slate-400 mt-2 font-semibold uppercase tracking-wider">
                Audited Compliance
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-emerald-400">
                240+
              </div>
              <div className="text-xs text-slate-400 mt-2 font-semibold uppercase tracking-wider">
                Independent Growers
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold text-emerald-400">
                15s
              </div>
              <div className="text-xs text-slate-400 mt-2 font-semibold uppercase tracking-wider">
                Dispatch Verification
              </div>
            </div>
          </div>
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