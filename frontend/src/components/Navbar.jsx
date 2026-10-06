import { Link } from 'react-router-dom';
import { logout } from '../Controller/AuthController';
import logo from '../assets/logo.png';

function Navbar() {
  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold tracking-wide">
        <img src={logo} alt="Logo" className="w-8 h-8 object-contain rounded-full bg-white p-0.5" />
        TransferLK
      </Link>
      <div className="flex gap-6 text-sm">
        <Link to="/vacancies" className="hover:underline">Find Vacancy</Link>
        <Link to="/post-vacancy" className="hover:underline">Post Vacancy</Link>
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

