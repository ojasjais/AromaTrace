import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>AromaTrace</h2>

      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/batches">Batches</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;