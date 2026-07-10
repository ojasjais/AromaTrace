import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import showToast from "../components/ui/Toast";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { getGoogleAuthUrl } from "../api/auth";
import { Leaf, ArrowRight } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated, completeOAuthLogin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [loading, isAuthenticated, navigate, redirectTo]);

  useEffect(() => {
    const oauthToken = searchParams.get("token");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      showToast("Google sign-in failed. Please try again.");
      setSearchParams({});
      return;
    }

    if (oauthToken) {
      setSubmitting(true);
      completeOAuthLogin(oauthToken)
        .then(() => {
          showToast("Signed in with Google!");
          setSearchParams({});
          navigate(redirectTo, { replace: true });
        })
        .catch(() => {
          showToast("Google sign-in failed. Please try again.");
          setSearchParams({});
        })
        .finally(() => setSubmitting(false));
    }
  }, [searchParams, setSearchParams, completeOAuthLogin, navigate, redirectTo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }
      showToast("Welcome back to AromaTrace!");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      showToast(error.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    showToast("Password reset link sent to your email.");
  };

  const handleGoogleLogin = () => {
    window.location.href = getGoogleAuthUrl();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-emerald-950 to-teal-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl animate-pulse" />

        <div className="flex items-center gap-2.5 relative z-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
            AromaTrace
          </span>
        </div>

        <div className="my-auto py-10 flex flex-col items-center justify-center relative z-10">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-full max-w-[280px] aspect-square flex items-center justify-center"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full text-emerald-400">
              <rect x="92" y="30" width="16" height="50" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
              <path d="M92 78L50 150A10 10 0 0 0 58 165H142A10 10 0 0 0 150 150L108 78" fill="none" stroke="currentColor" strokeWidth="4" />
              <motion.path
                animate={{
                  d: [
                    "M65 130 Q100 120 135 130 L140 160 H60 Z",
                    "M65 130 Q100 140 135 130 L140 160 H60 Z",
                    "M65 130 Q100 120 135 130 L140 160 H60 Z",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                fill="rgba(16, 185, 129, 0.25)"
              />
              <path d="M100 30 C100 20, 130 20, 130 40 C130 60, 160 60, 160 80 V130" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6,4" />
              <motion.circle
                cx="160"
                cy="85"
                r="4.5"
                fill="currentColor"
                animate={{ y: [0, 45], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeIn" }}
              />
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

        <div className="text-xs text-emerald-350/50">
          © 2026 AromaTrace Systems Inc. All rights reserved.
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-80 w-80 rounded-full bg-emerald-500/5 dark:bg-emerald-500/5 blur-3xl md:hidden" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-md rounded-3xl border border-slate-200/50 bg-white/70 backdrop-blur-md p-8 shadow-2xl dark:border-slate-800/80 dark:bg-slate-900/60"
        >
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Corporate Email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Security Key / Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

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

            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl"
            >
              {submitting ? "Signing in..." : "Authorize Session"}
              <ArrowRight className="h-4.5 w-4.5" />
            </Button>
          </form>

          <div className="mt-5">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={handleGoogleLogin}
              disabled={submitting}
              className="w-full font-bold"
            >
              Sign in with Google
            </Button>
          </div>

          <div className="mt-8 text-center text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              Create one
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
