import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../Controller/AuthController';

function Login() {
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate  = useNavigate();
  const location  = useLocation();

  // Where to go after login — defaults to dashboard
  const from = location.state?.from || '/dashboard';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
      navigate(from, { replace: true }); // ← redirect back to intended page
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">

        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-blue-700">Welcome Back 👋</h2>
          <p className="text-gray-400 text-sm mt-1">Login to your TransferLK account</p>
          {from !== '/dashboard' && (
            <p className="text-xs text-blue-500 mt-2 bg-blue-50 px-3 py-1.5 rounded-lg">
              🔐 Login to view the vacancy details
            </p>
          )}
        </div>

        {error && <p className="text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email" type="email" placeholder="Email address"
            value={form.email} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            required
          />
          <input
            name="password" type="password" placeholder="Password"
            value={form.password} onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition text-sm"
          >
            Login →
          </button>
        </form>

        <div className="mt-5 text-center space-y-2">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" state={{ from }} className="text-blue-600 font-semibold hover:underline">
              Register free
            </Link>
          </p>
          <Link to="/vacancies" className="text-xs text-gray-400 hover:underline block">
            ← Back to vacancy search
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
