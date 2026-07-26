import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Batches from "./pages/Batches";
import BatchDetails from "./pages/BatchDetails";
import Buyers from "./pages/Buyers";
import Reports from "./pages/Reports";
import Certificates from "./pages/Certificates";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function AppContent() {
  const location = useLocation();
  const isAuthPage =
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/batches") ||
    location.pathname.startsWith("/buyers") ||
    location.pathname.startsWith("/reports") ||
    location.pathname.startsWith("/certificates");

  return (
    <>
      <Toaster />
      {isAuthPage ? (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
          <Sidebar />
          <div className="flex-1 min-w-0">
            <Routes>
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/batches" element={<ProtectedRoute><Batches /></ProtectedRoute>} />
              <Route path="/batches/:id" element={<ProtectedRoute><BatchDetails /></ProtectedRoute>} />
              <Route path="/buyers" element={<ProtectedRoute><Buyers /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;