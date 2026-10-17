import { Link } from 'react-router-dom';
import { logout } from '../Controller/AuthController';
import logo from '../assets/logo.png';

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-wide hover:opacity-90 transition">
        <img src={logo} alt="Logo" className="w-8 h-8 object-contain rounded-full bg-white p-0.5" />
        TransferLK
      </Link>
      <div className="flex gap-6 text-sm">
        <Link to="/vacancies" className="hover:underline">Find Requests</Link>
        <Link to="/post-vacancy" className="hover:underline">Post a Request</Link>
        <Link to="/profile" className="hover:underline">Profile</Link>
        <button onClick={() => {
          logout();
          window.location.href = '/';
        }} className="hover:underline text-red-200">Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;

