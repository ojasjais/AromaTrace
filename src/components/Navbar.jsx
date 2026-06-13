import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-green-700 text-white p-4 flex  flex-wrap justify-between items-center">
      <h2 className="font-bold text-xl">AromaTrace</h2>

      <ul className="flex gap-3 text-sm">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/batches">Batches</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;