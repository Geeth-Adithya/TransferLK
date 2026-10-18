import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout, isAuthenticated } from '../Controller/AuthController';
import logo from '../assets/logo.png';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const authed = isAuthenticated();

  const closeMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    window.location.href = '/';
  };

  const navLinkClass = (path) =>
    `text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
      location.pathname === path
        ? 'bg-white/20 text-white font-semibold'
        : 'text-blue-100 hover:text-white hover:bg-white/10'
    }`;

  const mobileNavLinkClass = (path) =>
    `block w-full text-left px-4 py-3 rounded-xl text-base font-medium transition-colors ${
      location.pathname === path
        ? 'bg-blue-700 text-white font-bold'
        : 'text-blue-100 hover:bg-blue-800 hover:text-white'
    }`;

  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 hover:opacity-95 transition">
            <img src={logo} alt="TransferLK Logo" className="w-9 h-9 object-contain rounded-full bg-white p-0.5 shadow-sm" />
            <span className="text-xl font-extrabold tracking-tight">
              Transfer<span className="text-yellow-400">LK</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/vacancies" className={navLinkClass('/vacancies')}>
              🔍 Find Requests
            </Link>
            {authed ? (
              <>
                <Link to="/post-vacancy" className={navLinkClass('/post-vacancy')}>
                  📝 Post a Request
                </Link>
                <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                  📊 Dashboard
                </Link>
                <Link to="/profile" className={navLinkClass('/profile')}>
                  👤 Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-red-200 hover:text-white hover:bg-red-600/30 px-3 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-blue-100 hover:text-white px-3 py-2 rounded-lg transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 font-bold px-4 py-2 rounded-xl text-sm transition shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-white hover:bg-white/10 focus:outline-none transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-900/95 backdrop-blur-md border-t border-blue-800 px-4 pt-3 pb-5 space-y-1.5 animate-fade shadow-2xl">
          <Link to="/vacancies" onClick={closeMenu} className={mobileNavLinkClass('/vacancies')}>
            🔍 Find Transfer Requests
          </Link>
          {authed ? (
            <>
              <Link to="/post-vacancy" onClick={closeMenu} className={mobileNavLinkClass('/post-vacancy')}>
                📝 Post a Request
              </Link>
              <Link to="/dashboard" onClick={closeMenu} className={mobileNavLinkClass('/dashboard')}>
                📊 Dashboard
              </Link>
              <Link to="/profile" onClick={closeMenu} className={mobileNavLinkClass('/profile')}>
                👤 My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-red-300 hover:bg-red-900/40 hover:text-white transition flex items-center gap-2"
              >
                <span>🚪</span> Logout
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={closeMenu}
                className="w-full text-center py-2.5 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 text-sm"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={closeMenu}
                className="w-full text-center py-2.5 rounded-xl bg-yellow-400 text-blue-900 font-bold hover:bg-yellow-300 text-sm shadow-md"
              >
                Register Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;

