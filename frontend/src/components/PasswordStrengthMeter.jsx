import React from 'react';

function checkPasswordStrength(password = '') {
  const criteria = [
    { id: 'length', label: 'At least 8 characters', valid: password.length >= 8 },
    { id: 'lower', label: 'Lowercase letter (a-z)', valid: /[a-z]/.test(password) },
    { id: 'upper', label: 'Uppercase letter (A-Z)', valid: /[A-Z]/.test(password) },
    { id: 'numberOrSymbol', label: 'Number or special character', valid: /[0-9!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const score = criteria.filter((c) => c.valid).length;

  let strengthLabel = 'Very Weak';
  let strengthColor = 'bg-gray-200 text-gray-500';
  let barColor = 'bg-red-500';
  let barWidth = 'w-1/4';

  if (score === 1) {
    strengthLabel = 'Weak';
    strengthColor = 'bg-red-100 text-red-700';
    barColor = 'bg-red-500';
    barWidth = 'w-1/4';
  } else if (score === 2) {
    strengthLabel = 'Fair';
    strengthColor = 'bg-orange-100 text-orange-700';
    barColor = 'bg-orange-500';
    barWidth = 'w-2/4';
  } else if (score === 3) {
    strengthLabel = 'Good';
    strengthColor = 'bg-yellow-100 text-yellow-700';
    barColor = 'bg-yellow-500';
    barWidth = 'w-3/4';
  } else if (score === 4) {
    strengthLabel = 'Strong';
    strengthColor = 'bg-green-100 text-green-700';
    barColor = 'bg-green-500';
    barWidth = 'w-full';
  }

  return { criteria, score, strengthLabel, strengthColor, barColor, barWidth };
}

function PasswordStrengthMeter({ password = '', confirmPassword = null, showConfirmCheck = true }) {
  if (!password && !confirmPassword) return null;

  const { criteria, score, strengthLabel, barColor, barWidth } = checkPasswordStrength(password);
  const isMatch = confirmPassword !== null && confirmPassword.length > 0 && password === confirmPassword;
  const isMismatch = confirmPassword !== null && confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="mt-2.5 p-3 bg-gray-50/80 rounded-xl border border-gray-100 space-y-2.5 text-xs animate-fade">
      {/* Strength Bar */}
      {password.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-500 font-medium">Password Strength:</span>
            <span className={`font-bold ${
              score >= 4 ? 'text-green-600' : score >= 3 ? 'text-yellow-600' : score >= 2 ? 'text-orange-600' : 'text-red-500'
            }`}>
              {strengthLabel}
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full ${barColor} ${barWidth} transition-all duration-300 rounded-full`} />
          </div>
        </div>
      )}

      {/* Criteria Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
        {criteria.map((c) => (
          <div
            key={c.id}
            className={`flex items-center gap-1.5 transition-colors ${
              c.valid ? 'text-green-600 font-medium' : 'text-gray-400'
            }`}
          >
            <span>{c.valid ? '✓' : '○'}</span>
            <span>{c.label}</span>
          </div>
        ))}

        {/* Real-time Match Indicator */}
        {showConfirmCheck && confirmPassword !== null && confirmPassword.length > 0 && (
          <div
            className={`flex items-center gap-1.5 sm:col-span-2 pt-1 border-t border-gray-100 font-medium ${
              isMatch ? 'text-green-600' : 'text-red-500'
            }`}
          >
            <span>{isMatch ? '✓ Passwords match' : '✕ Passwords do not match'}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PasswordStrengthMeter;

