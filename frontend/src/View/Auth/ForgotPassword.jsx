import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, verifyOtp, resetPassword } from '../../Controller/AuthController';
import PasswordStrengthMeter from '../../components/PasswordStrengthMeter';

function ForgotPassword() {
  const navigate = useNavigate();

  // Step 1: email, Step 2: otp, Step 3: new password, Step 4: success
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // ── Step 1: Request Code ─────────────────────────────────────
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(email.trim());
      setSuccessMsg(res.message || 'Verification code sent!');
      if (res.dev_otp) {
        setDevOtp(res.dev_otp);
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to send reset code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify Code ──────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    const cleanOtp = otp.trim();
    if (cleanOtp.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(email.trim(), cleanOtp);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ───────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(email.trim(), otp.trim(), newPassword);
      setSuccessMsg(res.message || 'Password reset successfully!');
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Resend Code ──────────────────────────────────────────────
  const handleResend = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await forgotPassword(email.trim());
      setSuccessMsg('A new verification code has been sent!');
      if (res.dev_otp) setDevOtp(res.dev_otp);
    } catch (err) {
      setError('Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 p-3 sm:p-4">
      <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md anim-scale-in border border-gray-100">
        
        {/* Step Indicator Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            {step === 1 && (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            )}
            {step === 2 && (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            )}
            {step === 3 && (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            )}
            {step === 4 && (
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>

          <h2 className="text-2xl font-extrabold text-gray-800">
            {step === 1 && 'Forgot Password?'}
            {step === 2 && 'Verify Code'}
            {step === 3 && 'Set New Password'}
            {step === 4 && 'Reset Complete!'}
          </h2>

          <p className="text-gray-400 text-xs mt-1">
            {step === 1 && 'Enter your registered email to receive a verification code.'}
            {step === 2 && `Enter the 6-digit code sent to ${email}`}
            {step === 3 && 'Create a strong new password for your account.'}
            {step === 4 && 'Your password has been changed successfully.'}
          </p>
        </div>

        {/* Global Notifications */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3.5 rounded-xl mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-xs p-3.5 rounded-xl mb-4 flex items-center gap-2">
            <span>✓</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* ── STEP 1: Enter Email ── */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Registered Email</label>
              <input
                type="email"
                placeholder="teacher@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.99] transition text-sm disabled:opacity-60 shadow-md shadow-blue-200"
            >
              {loading ? 'Sending code...' : 'Send Verification Code →'}
            </button>

            <div className="pt-2 text-center">
              <Link to="/login" className="text-xs text-gray-400 hover:text-blue-600 hover:underline">
                ← Back to Login
              </Link>
            </div>
          </form>
        )}

        {/* ── STEP 2: Enter OTP ── */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {devOtp && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs p-3 rounded-xl flex items-center justify-between">
                <span>Verification code: <strong className="font-mono text-sm tracking-wider">{devOtp}</strong></span>
                <button
                  type="button"
                  onClick={() => setOtp(devOtp)}
                  className="text-xs text-blue-600 font-semibold underline hover:text-blue-800"
                >
                  Auto-fill
                </button>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">6-Digit Verification Code</label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.99] transition text-sm disabled:opacity-60 shadow-md shadow-blue-200"
            >
              {loading ? 'Verifying code...' : 'Confirm Code →'}
            </button>

            <div className="flex justify-between items-center pt-2 text-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-400 hover:text-gray-600 hover:underline"
              >
                Change Email
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="text-blue-600 font-semibold hover:underline"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3: Set New Password ── */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">New Password</label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Real-time Password Strength Meter */}
            <PasswordStrengthMeter
              password={newPassword}
              confirmPassword={confirmPassword}
            />

            <button
              type="submit"
              disabled={loading || newPassword.length < 8 || newPassword !== confirmPassword}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 active:scale-[0.99] transition text-sm disabled:opacity-60 shadow-md shadow-green-200 mt-2"
            >
              {loading ? 'Resetting password...' : 'Update Password & Finish →'}
            </button>
          </form>
        )}

        {/* ── STEP 4: Success ── */}
        {step === 4 && (
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Your password has been reset successfully. You can now log into your TransferLK account.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition text-sm shadow-md shadow-blue-200"
            >
              Go to Login →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default ForgotPassword;

