/**
 * Loader Component
 * Displays loading spinner while fetching data
 */

function Loader() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center p-8">
      <div className="relative flex items-center justify-center">
        {/* Glowing Background Pulse */}
        <div className="absolute h-12 w-12 rounded-full bg-emerald-500/10 blur-xl animate-pulse"></div>
        {/* Gradient Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-emerald-500/10 border-t-emerald-600 dark:border-emerald-500/20 dark:border-t-emerald-400"></div>
      </div>
      <p className="mt-4 text-xs font-medium text-slate-400 dark:text-slate-500 animate-pulse tracking-wide uppercase">
        Loading Trace Data...
      </p>
    </div>
  );
}

export default Loader;