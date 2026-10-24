import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated, logout } from '../../Controller/AuthController';
import logo from '../../assets/logo.png';
import './Welcome.css';

function Welcome() {
  const [authed, setAuthed] = useState(isAuthenticated());

  useEffect(() => {
    setAuthed(isAuthenticated());
  }, []);

  const handleLogout = () => {
    logout();
    setAuthed(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex flex-col items-center justify-center relative overflow-hidden">

      {/* Animated background circles */}
      <div className="bubble bubble-1" />
      <div className="bubble bubble-2" />
      <div className="bubble bubble-3" />
      <div className="bubble bubble-4" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">

        {/* Logo / Icon */}
        <div className="animate-float mb-4 sm:mb-6">
          <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center shadow-2xl p-2 mx-auto">
            <img src={logo} alt="TransferLK Logo" className="w-full h-full object-contain rounded-full" />
          </div>
        </div>

        {/* Title */}
        <h1 className="animate-fade-up text-4xl sm:text-6xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-3 sm:mb-4 tracking-tight">
          Transfer<span className="text-yellow-300">LK</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-up-delay text-base sm:text-lg md:text-xl text-blue-100 mb-2 max-w-lg px-2">
          Sri Lanka's Smartest Teacher Transfer Platform
        </p>
        <p className="animate-fade-up-delay-2 text-xs sm:text-sm text-blue-200 mb-8 sm:mb-10 max-w-md px-4">
          Find and post school transfer requests across all provinces with ease.
        </p>

        {/* Buttons */}
        <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center mb-5 max-w-sm sm:max-w-none">
          <Link
            to="/vacancies"
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-yellow-400 text-blue-900 font-bold rounded-full shadow-lg hover:bg-yellow-300 hover:scale-105 transition-all duration-300 text-sm sm:text-base text-center"
          >
            Find a Transfer Request
          </Link>
          <Link
            to="/post-vacancy"
            className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-white/20 text-white font-bold rounded-full border-2 border-white/60 backdrop-blur-sm hover:bg-white/30 hover:scale-105 transition-all duration-300 text-sm sm:text-base text-center"
          >
            Post a Transfer Request
          </Link>
        </div>

        {/* Auth Links */}
        {authed ? (
          <div className="animate-fade-up-delay-3 text-sm flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-1">
            <Link
              to="/dashboard"
              className="text-white hover:text-yellow-300 font-semibold transition-colors px-4 py-1.5 rounded-full border border-white/20 hover:border-yellow-300/50 bg-white/10 backdrop-blur-md text-xs sm:text-sm"
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className="text-white hover:text-yellow-300 font-semibold transition-colors px-4 py-1.5 rounded-full border border-white/20 hover:border-yellow-300/50 bg-white/10 backdrop-blur-md text-xs sm:text-sm"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-white/80 hover:text-red-300 font-semibold transition-colors px-3 py-1.5 rounded-full border border-white/20 hover:border-red-300/50 bg-white/10 backdrop-blur-md text-xs sm:text-sm cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="animate-fade-up-delay-3 text-sm flex items-center justify-center gap-3 mt-1">
            <Link
              to="/login"
              className="text-white hover:text-yellow-300 font-semibold hover:underline transition-colors px-4 py-1.5 rounded-full border border-white/20 hover:border-yellow-300/50 bg-white/10 backdrop-blur-md text-xs sm:text-sm"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="text-white hover:text-yellow-300 font-semibold hover:underline transition-colors px-4 py-1.5 rounded-full border border-white/20 hover:border-yellow-300/50 bg-white/10 backdrop-blur-md text-xs sm:text-sm"
            >
              Register
            </Link>
          </div>
        )}

        {/* Stats row */}
        <div className="animate-fade-up-delay-4 flex gap-4 sm:gap-8 mt-10 sm:mt-14 text-white">
          {[
            { value: '10,000+', label: 'Teachers' },
            { value: '9 Provinces', label: 'Coverage' },
            { value: '5,000+', label: 'Requests' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-extrabold text-yellow-300">{stat.value}</span>
              <span className="text-[11px] sm:text-xs text-blue-200 mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
          <path
            fill="rgba(255,255,255,0.08)"
            d="M0,64L60,58.7C120,53,240,43,360,53.3C480,64,600,96,720,101.3C840,107,960,85,1080,74.7C1200,64,1320,64,1380,64L1440,64L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          />
        </svg>
      </div>
    </div>
  );
}

export default Welcome;
