import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, Globe, Mail, MapPin, ArrowRight, Send } from "lucide-react";

/* ── Social icon SVGs (unchanged from original) ── */
const TwitterSVG = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const GithubSVG = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinSVG = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

/* ── Reusable footer link ── */
function FooterLink({ to, href, children }) {
  const cls =
    "group inline-flex items-center gap-1.5 text-slate-400 hover:text-emerald-400 transition-colors duration-200 text-sm";
  const arrow = (
    <ArrowRight
      className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
      aria-hidden="true"
    />
  );
  if (to) return <Link to={to} className={cls}>{children}{arrow}</Link>;
  return <a href={href ?? "#"} className={cls}>{children}{arrow}</a>;
}

/* ── Social icon button ── */
function SocialBtn({ href, label, children }) {
  return (
    <a
      href={href ?? "#"}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/60 text-slate-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-200"
    >
      {children}
    </a>
  );
}

/* ═══════════════════════════════════
   Footer
═══════════════════════════════════ */
function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="relative w-full overflow-hidden bg-slate-950 text-slate-400 border-t border-slate-800/60">

      {/* Decorative background blobs */}
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-emerald-500/6 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-24 right-1/3 h-64 w-64 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" aria-hidden="true" />

      {/* Subtle grid texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(52,211,153,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Newsletter banner ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800/60 py-10">
          <div className="max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-emerald-500/15">
                <Mail className="h-3 w-3 text-emerald-400" aria-hidden="true" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                Stay Updated
              </span>
            </div>
            <h3 className="text-lg font-bold text-white leading-snug">
              Get traceability insights & product updates
            </h3>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              Join 1,200+ essential oil producers. No spam — unsubscribe anytime.
            </p>
          </div>

          {subscribed ? (
            <div className="flex items-center gap-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-3 text-sm font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              You're subscribed — thank you!
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex w-full max-w-sm items-center gap-2"
              aria-label="Newsletter subscription"
            >
              <div className="relative flex-1">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  aria-label="Email address for newsletter"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500/60 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                />
              </div>
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold px-4 py-2.5 transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex-shrink-0"
              >
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
                Subscribe
              </button>
            </form>
          )}
        </div>

        {/* ── Four-column main grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12">

          {/* Col 1 — Brand */}
          <div className="space-y-5 lg:col-span-1">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2.5 group" aria-label="AromaTrace home">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                <Leaf className="h-4.5 w-4.5 text-emerald-400" aria-hidden="true" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-white">
                Aroma<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Trace</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-slate-400">
              Next-generation supply chain traceability and quality verification platform for essential oil batches worldwide.
            </p>

            {/* Certification chips */}
            <div className="flex flex-wrap gap-2">
              {["GC-MS Verified", "ISO Compliant", "NOP Organic"].map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-emerald-500/8 border border-emerald-500/15 text-emerald-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2" aria-label="Social media links">
              <SocialBtn href="#" label="Follow us on X (Twitter)">
                <TwitterSVG className="h-4 w-4" />
              </SocialBtn>
              <SocialBtn href="#" label="Connect on LinkedIn">
                <LinkedinSVG className="h-4 w-4" />
              </SocialBtn>
              <SocialBtn href="#" label="View on GitHub">
                <GithubSVG className="h-4 w-4" />
              </SocialBtn>
              <SocialBtn href="#" label="Visit our website">
                <Globe className="h-4 w-4" />
              </SocialBtn>
            </div>
          </div>

          {/* Col 2 — Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 mb-5 flex items-center gap-2">
              <span className="h-px flex-1 bg-slate-800" />
              Platform
              <span className="h-px flex-1 bg-slate-800" />
            </h4>
            <ul className="space-y-3" role="list">
              {[
                { label: "Analytics Dashboard", to: "/dashboard" },
                { label: "Batch Management",    to: "/batches"   },
                { label: "API Docs",            href: "#"        },
                { label: "Pricing",             href: "#"        },
              ].map(({ label, to, href }) => (
                <li key={label}>
                  <FooterLink to={to} href={href}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 mb-5 flex items-center gap-2">
              <span className="h-px flex-1 bg-slate-800" />
              Resources
              <span className="h-px flex-1 bg-slate-800" />
            </h4>
            <ul className="space-y-3" role="list">
              {[
                { label: "Support Center"    },
                { label: "Security & Trust"  },
                { label: "Developer Portal"  },
                { label: "Laboratory Partners"},
              ].map(({ label }) => (
                <li key={label}>
                  <FooterLink href="#">{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200 mb-5 flex items-center gap-2">
              <span className="h-px flex-1 bg-slate-800" />
              AromaTrace HQ
              <span className="h-px flex-1 bg-slate-800" />
            </h4>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/50">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-300 leading-snug">
                    100 Organic Way, Suite 400
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">San Francisco, CA 94107</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/50">
                  <Mail className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-300 leading-snug">support@aromatrace.com</p>
                  <p className="text-xs text-slate-500 mt-0.5">Mon – Fri, 9am – 6pm PST</p>
                </div>
              </div>

              {/* Status badge */}
              <div className="flex items-center gap-2 pt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="text-xs font-semibold text-emerald-400">All systems operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-slate-800/60 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} AromaTrace. All rights reserved.
          </p>

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Legal links">
            {["Privacy Policy", "Terms of Service", "Contact Us", "Support"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-slate-500 hover:text-slate-200 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

      </div>
    </footer>
  );
}

export default Footer;