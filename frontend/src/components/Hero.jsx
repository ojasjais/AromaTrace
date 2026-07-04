import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Leaf, Sparkles } from "lucide-react";
import Button from "./ui/Button";

function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-950 transition-colors duration-200">
      
      {/* Dynamic Background Blurs */}
      <div className="absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl" />
      <div className="absolute top-10 right-1/4 -z-10 h-96 w-96 rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-3xl" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center"
      >
        
        {/* Top Pill Badge */}
        <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 dark:text-emerald-400 dark:bg-emerald-500/10 dark:border-emerald-500/20 shadow-sm mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Introducing AromaTrace v2.0</span>
          <ArrowRight className="h-3 w-3 ml-0.5" />
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white leading-[1.1] max-w-4xl mx-auto"
        >
          Track Essential Oil Batches with{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
            Confidence
          </span>
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          variants={itemVariants}
          className="mt-6 text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Manage production batches, laboratory certificates, and buyer dispatch records in one unified, auditable dashboard built for producers and buyers.
        </motion.p>

        {/* Hero CTA Actions */}
        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Button variant="primary" size="lg" className="w-full sm:w-auto">
            Get Started Free
            <ArrowRight className="h-4.5 w-4.5" />
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Watch Demo Video
          </Button>
        </motion.div>

        {/* Feature Checkmarks Row */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-xs font-semibold text-slate-500 dark:text-slate-400"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            GC-MS Lab Verified
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Immutable Audits
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            100% Traceability
          </span>
        </motion.div>

        {/* Decorative Dashboard Preview mockup */}
        <motion.div
          variants={itemVariants}
          className="relative mt-16 rounded-2xl border border-slate-200/80 bg-white/50 p-3 shadow-2xl dark:border-slate-800/80 dark:bg-slate-900/50 backdrop-blur-sm"
        >
          <div className="rounded-xl border border-slate-200/50 bg-slate-50 dark:border-slate-800/50 dark:bg-slate-950 overflow-hidden shadow-inner aspect-[21/9] flex items-center justify-center p-6 text-left">
            <div className="w-full h-full flex flex-col justify-between">
              <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
                <div className="flex gap-1.5">
                  <div className="h-3.5 w-3.5 rounded-full bg-red-400" />
                  <div className="h-3.5 w-3.5 rounded-full bg-yellow-400" />
                  <div className="h-3.5 w-3.5 rounded-full bg-green-400" />
                </div>
                <div className="h-5 w-40 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
              </div>
              <div className="grid grid-cols-3 gap-4 py-4 flex-1">
                <div className="col-span-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-4 flex flex-col justify-between">
                  <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    <div className="h-3.5 w-5/6 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  </div>
                </div>
                <div className="rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-4 flex flex-col justify-between">
                  <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <Leaf className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}

export default Hero;