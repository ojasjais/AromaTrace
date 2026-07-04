import { motion } from "framer-motion";

/**
 * Props:
 * variant: primary | secondary | outline
 * size: sm | md | lg
 * disabled: boolean
 * onClick: function
 * children: content
 */

function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  ...props
}) {
  let baseStyle = "inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40 active:scale-95 shadow-sm";

  let variantStyle = "";
  if (variant === "primary") {
    variantStyle = "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-600/20 hover:shadow-lg border border-emerald-500/10";
  } else if (variant === "secondary") {
    variantStyle = "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50";
  } else {
    // outline
    variantStyle = "border border-emerald-500/30 hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 hover:shadow-sm";
  }

  let sizeStyle = "";
  if (size === "sm") {
    sizeStyle = "px-3 py-1.5 text-xs gap-1.5";
  } else if (size === "lg") {
    sizeStyle = "px-6 py-3 text-base gap-2.5 font-semibold";
  } else {
    // md
    sizeStyle = "px-4.5 py-2.5 text-sm gap-2";
  }

  return (
    <motion.button
      whileHover={{ y: -1, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;