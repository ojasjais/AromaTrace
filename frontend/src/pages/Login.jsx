import { useState } from "react";
import { motion } from "framer-motion";
import showToast from "../components/ui/Toast";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { Leaf, Lock, Mail, ArrowRight } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please fill in all fields");
      return;
    }
    showToast("Welcome back to AromaTrace!");
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    showToast("Password reset link sent to your email.");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      
      {/* Left Column: Essential Oil Distillation Illustration & Branding (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-emerald-950 to-teal-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        
        {/* Dynamic Background Blurs */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl animate-pulse" />

        {/* Branding Title */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
            AromaTrace
          </span>
        </div>

        {/* Animated Essential Oil Distillation Illustration (SVG + CSS) */}
        <div className="my-auto py-10 flex flex-col items-center justify-center relative z-10">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-full max-w-[280px] aspect-square flex items-center justify-center"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full text-emerald-400">
              {/* Flask Neck */}
              <rect x="92" y="30" width="16" height="50" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
              {/* Flask Base */}
              <path d="M92 78L50 150A10 10 0 0 0 58 165H142A10 10 0 0 0 150 150L108 78" fill="none" stroke="currentColor" strokeWidth="4" />
              
              {/* Fluid level inside flask */}
              <motion.path
                animate={{
                  d: [
                    "M65 130 Q100 120 135 130 L140 160 H60 Z",
                    "M65 130 Q100 140 135 130 L140 160 H60 Z",
                    "M65 130 Q100 120 135 130 L140 160 H60 Z"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                fill="rgba(16, 185, 129, 0.25)"
              />

              {/* Distillation vapor tubes */}
              <path d="M100 30 C100 20, 130 20, 130 40 C130 60, 160 60, 160 80 V130" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6,4" />

              {/* Falling droplet */}
              <motion.circle
                cx="160"
                cy="85"
                r="4.5"
                fill="currentColor"
                animate={{
                  y: [0, 45],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeIn"
                }}
              />

              {/* Target Receiver Beaker */}
              <rect x="145" y="130" width="30" height="35" rx="4" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="147" y="145" width="26" height="18" rx="2" fill="rgba(16, 185, 129, 0.4)" />
            </svg>
          </motion.div>
          <div className="text-center mt-6">
            <h2 className="text-xl font-bold tracking-tight mb-2">Secure Quality Traceability</h2>
            <p className="text-xs text-emerald-200/70 max-w-sm mx-auto leading-relaxed">
              Verify chromatographic composition analysis reports and monitor batch transit safety logs from a single encrypted portal.
            </p>
          </div>
        </div>

        {/* Footer info in illustration panel */}
        <div className="text-xs text-emerald-350/50">
          © 2026 AromaTrace Systems Inc. All rights reserved.
        </div>
      </div>

      {/* Right Column: Glassmorphism Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        
        {/* Mobile decorative blurs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-80 w-80 rounded-full bg-emerald-500/5 dark:bg-emerald-500/5 blur-3xl md:hidden" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-md rounded-3xl border border-slate-200/50 bg-white/70 backdrop-blur-md p-8 shadow-2xl dark:border-slate-800/80 dark:bg-slate-900/60"
        >
          {/* Form Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 mb-4">
              <Leaf className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wide uppercase">
              Secure authentication check
            </p>
          </div>

          {/* Form fields */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                label="Corporate Email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <Input
                label="Security Key / Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Checkbox and Forgot password */}
            <div className="flex items-center justify-between text-xs pt-1.5 pb-2.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/40 h-4 w-4 bg-white dark:bg-slate-950 dark:border-slate-800"
                />
                <span className="font-semibold text-slate-500 dark:text-slate-400">Remember Me</span>
              </label>

              <a
                href="#"
                onClick={handleForgotPassword}
                className="font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
              >
                Forgot Password?
              </a>
            </div>

            {/* Sign in Button */}
            <div className="pt-2">
              <Button variant="primary" size="lg" type="submit" className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl">
                Authorize Session
                <ArrowRight className="h-4.5 w-4.5" />
              </Button>
            </div>
          </form>

          {/* Create new account mock text */}
          <div className="mt-8 text-center text-xs text-slate-400">
            Need administrator credentials?{" "}
            <a href="#" className="font-bold text-slate-700 dark:text-slate-200 hover:underline">
              Submit request
            </a>
          </div>

        </motion.div>
      </div>

    </div>
  );
}

export default Login;