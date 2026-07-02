import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="bg-green-700 text-white p-4 flex flex-wrap justify-between items-center">
      <h2 className="font-bold text-xl">AromaTrace</h2>

      <ul className="flex flex-wrap gap-2 text-xs md:text-sm">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/batches">Batches</Link></li>
        <li><Link to="/login">Login</Link></li>

        <li>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-white text-black px-2 py-1 rounded"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;