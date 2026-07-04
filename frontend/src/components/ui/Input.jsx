/**
 * Props:
 * label
 * placeholder
 * type
 * value
 * onChange
 * error
 */

function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  ...props
}) {
  return (
    <div className="mb-5 w-full max-w-xl">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border p-3 rounded-xl text-sm transition-all duration-200 outline-none
          bg-white text-slate-800 placeholder-slate-400 border-slate-200/80
          dark:bg-slate-950 dark:text-slate-100 dark:placeholder-slate-500 dark:border-slate-800/80
          focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:shadow-sm
          ${error ? "border-red-500 dark:border-red-500/60 focus:ring-red-500/10 focus:border-red-500" : ""}`}
        {...props}
      />

      {error && (
        <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;