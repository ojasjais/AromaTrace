import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import showToast from "./ui/Toast";
import {
  LayoutDashboard,
  FlaskConical,
  Award,
  Users,
  FileCheck,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon,
  Leaf,
  LogOut,
  Droplet
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(
    localStorage.getItem("sidebar-collapsed") === "true"
  );
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", isCollapsed.toString());
  }, [isCollapsed]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    showToast("Distillery session closed.");
    navigate("/login");
  };

  const showUnderCultivation = (name) => {
    showToast(`${name} records are currently in cultivation. Coming soon!`);
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard, action: null },
    { name: "Batch Management", path: "/batches", icon: FlaskConical, action: null },
    { name: "Certificates", path: "#certificates", icon: Award, action: () => showUnderCultivation("GC-MS Certificate") },
    { name: "Buyers", path: "#buyers", icon: Users, action: () => showUnderCultivation("Buyer accounts") },
    { name: "Reports", path: "#reports", icon: FileCheck, action: () => showUnderCultivation("Distillation reports") },
    { name: "Settings", path: "#settings", icon: Sliders, action: () => showUnderCultivation("Distillery system settings") }
  ];

  // Nature-themed organic highlighting: soft emerald backgrounds, warm amber border guides
  const activeLinkStyle = "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-350 border-r-4 border-amber-500 rounded-xl";
  const inactiveLinkStyle = "text-emerald-800/70 hover:bg-emerald-500/5 dark:text-emerald-400/80 dark:hover:bg-emerald-950/40 hover:text-emerald-950 dark:hover:text-emerald-200 rounded-xl";

  const renderSidebarContent = () => (
    <div className="h-full flex flex-col justify-between select-none bg-emerald-50/50 dark:bg-slate-950 border-r border-emerald-100 dark:border-emerald-950/60 backdrop-blur-md">
      {/* Top Section */}
      <div>
        {/* Brand Header */}
        <div className={`flex items-center gap-3 px-5 h-16 border-b border-emerald-100/50 dark:border-emerald-950/40 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Leaf className="h-5 w-5 animate-pulse text-emerald-600 dark:text-emerald-400" />
          </div>
          {!isCollapsed && (
            <span className="font-black text-sm tracking-wide text-emerald-900 dark:text-white flex items-center gap-1">
              AromaTrace
              <span className="text-[9px] uppercase tracking-widest bg-amber-550/10 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/20">Distillery</span>
            </span>
          )}
        </div>

        {/* Links Navigation */}
        <div className="p-4 space-y-6">
          {!isCollapsed && (
            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-800/50 dark:text-emerald-500 px-2 flex items-center gap-1.5">
              <Droplet className="h-3 w-3 text-amber-550" />
              Harvest Tools
            </div>
          )}
          <nav className="space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = 
                !link.action && 
                (location.pathname === link.path || 
                (link.path !== "/" && location.pathname.startsWith(link.path)));
              
              if (link.action) {
                return (
                  <button
                    key={link.name}
                    onClick={link.action}
                    className={`w-full flex items-center gap-3.5 px-3 py-2.5 text-sm font-semibold transition-all ${inactiveLinkStyle} ${isCollapsed ? "justify-center px-0" : ""}`}
                    title={isCollapsed ? link.name : ""}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    {!isCollapsed && <span>{link.name}</span>}
                  </button>
                );
              }

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 text-sm font-semibold transition-all ${
                    isActive ? activeLinkStyle : inactiveLinkStyle
                  } ${isCollapsed ? "justify-center px-0" : ""}`}
                  title={isCollapsed ? link.name : ""}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  {!isCollapsed && <span>{link.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-emerald-100/50 dark:border-emerald-950/45 p-4 space-y-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 text-sm font-semibold transition-all ${inactiveLinkStyle} ${isCollapsed ? "justify-center px-0" : ""}`}
          title={isCollapsed ? (darkMode ? "Switch to Light Mode" : "Switch to Dark Mode") : ""}
        >
          {darkMode ? (
            <Sun className="h-4.5 w-4.5 shrink-0 text-amber-550" />
          ) : (
            <Moon className="h-4.5 w-4.5 shrink-0 text-emerald-700/60 dark:text-emerald-450" />
          )}
          {!isCollapsed && <span>{darkMode ? "Sunlight Mode" : "Moonlight Mode"}</span>}
        </button>

        {/* User profile & Logout */}
        <div className={`flex items-center gap-3 p-1 rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 ${isCollapsed ? "justify-center px-1 py-2" : "p-2"}`}>
          <div className="h-8 w-8 rounded-full bg-emerald-600 text-white dark:bg-emerald-555 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-500/10 shadow-sm">
            AD
          </div>
          
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-emerald-900 dark:text-slate-200 truncate">Aroma Distiller</div>
              <div className="text-[9px] text-emerald-800/60 dark:text-emerald-500 truncate font-semibold uppercase tracking-wider">Master Operator</div>
            </div>
          )}

          {!isCollapsed && (
            <button 
              onClick={handleLogout}
              className="p-1 rounded-lg text-emerald-800/40 hover:text-red-500 hover:bg-red-500/5 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>

        {isCollapsed && (
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center p-2.5 rounded-xl text-emerald-805/40 hover:text-red-500 hover:bg-red-500/5 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors border border-emerald-100/50 dark:border-emerald-900/30`}
            title="Logout"
          >
            <LogOut className="h-4 w-4 shrink-0" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 h-16 w-full bg-emerald-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-emerald-100/50 dark:border-emerald-950/40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Leaf className="h-4.5 w-4.5" />
          </div>
          <span className="font-black text-sm tracking-tight text-emerald-900 dark:text-white">
            AromaTrace
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-emerald-500/5 dark:bg-slate-900 border border-emerald-100/40 dark:border-slate-800 text-emerald-700 dark:text-emerald-400"
          >
            {darkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-emerald-700" />}
          </button>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg bg-emerald-500/5 dark:bg-slate-900 border border-emerald-100/40 dark:border-slate-800 text-emerald-700 dark:text-emerald-400"
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* 2. Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            {/* Drawer Panel */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-950 border-r border-emerald-100 dark:border-emerald-950 flex flex-col justify-between z-10"
            >
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-lg bg-emerald-500/5 dark:bg-slate-900 border border-emerald-100/40 dark:border-slate-800 text-emerald-700 dark:text-emerald-405"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {renderSidebarContent()}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:flex flex-col justify-between sticky top-0 h-screen bg-white dark:bg-slate-950 border-r border-emerald-100/60 dark:border-emerald-950/60 transition-all duration-300 z-30 shrink-0 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-emerald-100 bg-white dark:border-emerald-900 dark:bg-slate-950 text-emerald-600 hover:text-emerald-900 dark:hover:text-white flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-all z-40"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>

        {renderSidebarContent()}
      </aside>
    </>
  );
}

export default Sidebar;
