import { motion } from "framer-motion";
import { Beaker, Award, ChevronRight } from "lucide-react";

function Card({ title, description, ...props }) {
  // Try to parse quantity and status if they are in the format "Quantity: X | Status: Y"
  let quantity = "";
  let status = "";
  if (description && description.includes("Quantity:") && description.includes("Status:")) {
    const parts = description.split("|");
    quantity = parts[0].replace("Quantity:", "").trim();
    status = parts[1].replace("Status:", "").trim();
  }

  // Define status badge colors
  const getStatusStyle = (statusVal) => {
    const val = statusVal.toLowerCase();
    if (val.includes("testing") || val.includes("pending")) {
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
    }
    if (val.includes("dispatch") || val.includes("completed") || val.includes("success") || val.includes("active")) {
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
    }
    return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20";
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white p-5 dark:bg-slate-900 transition-colors duration-200 shadow-sm"
      {...props}
    >
      {/* Background Hover Highlight */}
      <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between gap-4">
        {/* Left Side: Icon and Details */}
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600 border border-slate-100 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800 group-hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:group-hover:bg-emerald-500/20 dark:group-hover:text-emerald-400 transition-colors">
            <Beaker className="h-5.5 w-5.5" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
              {title}
            </h3>

            {quantity ? (
              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  Qty: <span className="text-slate-700 dark:text-slate-300 font-semibold">{quantity}</span>
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(status)}`}>
                  {status}
                </span>
              </div>
            ) : (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right Side Action Indicator */}
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-slate-100 dark:bg-slate-950 dark:group-hover:bg-slate-900 group-hover:text-slate-600 transition-colors">
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </motion.div>
  );
}

export default Card;