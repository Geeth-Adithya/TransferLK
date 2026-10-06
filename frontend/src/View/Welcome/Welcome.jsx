import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Welcome.css';

function Welcome() {
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
        <div className="animate-float mb-6">
          <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-2xl p-2">
            <img src={logo} alt="TransferLK Logo" className="w-full h-full object-contain rounded-full" />
          </div>
        </div>

        {/* Title */}
        <h1 className="animate-fade-up text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg mb-4 tracking-tight">
          Transfer<span className="text-yellow-300">LK</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-up-delay text-lg md:text-xl text-blue-100 mb-2 max-w-lg">
          Sri Lanka's Smartest Teacher Transfer Platform
        </p>
        <p className="animate-fade-up-delay-2 text-sm text-blue-200 mb-10 max-w-md">
          Find and post school vacancies across all provinces with ease.
        </p>

        {/* Buttons */}
        <div className="animate-fade-up-delay-3 flex gap-4 flex-wrap justify-center">
          <Link
            to="/vacancies"
            className="flex items-center gap-2 px-8 py-3 bg-yellow-400 text-blue-900 font-bold rounded-full shadow-lg hover:bg-yellow-300 hover:scale-105 transition-all duration-300"
          >
            🔍 Find a Vacancy
          </Link>
          <Link
            to="/post-vacancy"
            className="flex items-center gap-2 px-8 py-3 bg-white/20 text-white font-bold rounded-full border-2 border-white/60 backdrop-blur-sm hover:bg-white/30 hover:scale-105 transition-all duration-300"
          >
            📝 Post a Vacancy
          </Link>
        </div>

        {/* Stats row */}
        <div className="animate-fade-up-delay-4 flex gap-8 mt-14 text-white">
          {[
            { value: '10,000+', label: 'Teachers' },
            { value: '9 Provinces', label: 'Coverage' },
            { value: '5,000+', label: 'Vacancies' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              <span className="text-2xl font-extrabold text-yellow-300">{stat.value}</span>
              <span className="text-xs text-blue-200 mt-1">{stat.label}</span>
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
