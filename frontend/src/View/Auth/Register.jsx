import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../../Controller/AuthController';
import { getSubjects, getGrades } from '../../Controller/ConfigController';
import SchoolDropdown from '../../components/SchoolDropdown';
import SubjectDropdown from '../../components/SubjectDropdown';
import GradeDropdown from '../../components/GradeDropdown';
import PasswordStrengthMeter from '../../components/PasswordStrengthMeter';

// ── NIC Utilities ────────────────────────────────────────────
function extractFromNIC(nic) {
  if (!nic) return null;
  const oldRegex = /^(\d{9})[VvXx]$/;
  const newRegex = /^(\d{12})$/;
  
  let year, days;
  if (oldRegex.test(nic)) {
    year = '19' + nic.substring(0, 2);
    days = parseInt(nic.substring(2, 5), 10);
  } else if (newRegex.test(nic)) {
    year = nic.substring(0, 4);
    days = parseInt(nic.substring(4, 7), 10);
  } else {
    return null;
  }

  let gender = 'Male';
  if (days > 500) {
    gender = 'Female';
    days -= 500;
  }

  if (days < 1 || days > 366) return null;

  // SL NICs assume leap year for day mapping (Feb always has 29 days)
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let m = 0;
  for (let i = 0; i < daysInMonth.length; i++) {
    if (days <= daysInMonth[i]) {
      m = i;
      break;
    }
    days -= daysInMonth[i];
  }
  
  // Handle Feb 29 in non-leap years by falling back to Feb 28 or Mar 1
  // However, most systems just map to the date directly if possible.
  // The <input type="date"> requires a valid date.
  let isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  if (m === 1 && days === 29 && !isLeap) {
    days = 28; // fallback to 28th to make the date valid for input type="date"
  }

  const mm = String(m + 1).padStart(2, '0');
  const dd = String(days).padStart(2, '0');

  return { dob: `${year}-${mm}-${dd}`, gender };
}

// ── Data ─────────────────────────────────────────────────────
const DISTRICTS_BY_PROVINCE = {
  Western:         ['Colombo', 'Gampaha', 'Kalutara'],
  Central:         ['Kandy', 'Matale', 'Nuwara Eliya'],
  Southern:        ['Galle', 'Matara', 'Hambantota'],
  Northern:        ['Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu'],
  Eastern:         ['Trincomalee', 'Batticaloa', 'Ampara'],
  'North Western': ['Kurunegala', 'Puttalam'],
  'North Central': ['Anuradhapura', 'Polonnaruwa'],
  Uva:             ['Badulla', 'Monaragala'],
  Sabaragamuwa:    ['Ratnapura', 'Kegalle'],
};
const PROVINCES = Object.keys(DISTRICTS_BY_PROVINCE);
const POSITIONS = ['Assistant Teacher', 'Senior Teacher', 'Deputy Principal', 'Principal'];

// ── Step Config ───────────────────────────────────────────────
const STEPS = [
  { label: 'Account',     icon: '👤' },
  { label: 'Teacher Info', icon: '📋' },
  { label: 'Current School', icon: '🏫' },
  { label: 'Preferences', icon: '📍' },
];

// ── Progress Stepper ──────────────────────────────────────────
function Stepper({ current }) {
  return (
    <div className="flex items-center justify-center mb-6 sm:mb-8 overflow-hidden">
      {STEPS.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold border-2 transition-all duration-300 ${
              i < current  ? 'bg-blue-600 border-blue-600 text-white' :
              i === current ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105 sm:scale-110' :
                             'bg-white border-gray-200 text-gray-300'
            }`}>
              {i < current ? '✓' : step.icon}
            </div>
            <span className={`text-[11px] sm:text-xs mt-1.5 font-medium hidden sm:block ${
              i <= current ? 'text-blue-600' : 'text-gray-300'
            }`}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-0.5 w-6 sm:w-12 md:w-16 mx-0.5 sm:mx-1 transition-all duration-500 ${
              i < current ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Field Components ──────────────────────────────────────────
function Field({ label, required, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 mb-1 block">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition';
const selectCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white transition';

// ── Steps ─────────────────────────────────────────────────────
function Step1({ data, onChange, errors }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" required>
          <input className={inputCls} placeholder="e.g. Kamal Perera"
            value={data.fullName} onChange={(e) => onChange('fullName', e.target.value)} />
          {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
        </Field>
        <Field label="Mobile Number" required>
          <input className={inputCls} placeholder="07X XXX XXXX" type="tel"
            value={data.mobile} onChange={(e) => onChange('mobile', e.target.value)} />
          {errors.mobile && <p className="text-red-400 text-xs mt-1">{errors.mobile}</p>}
        </Field>
      </div>
      <Field label="Email Address" required>
        <input className={inputCls} placeholder="teacher@example.com" type="email"
          value={data.email} onChange={(e) => onChange('email', e.target.value)} />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Password" required>
          <input className={inputCls} placeholder="Min. 8 characters" type="password"
            value={data.password} onChange={(e) => onChange('password', e.target.value)} />
          {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
        </Field>
        <Field label="Confirm Password" required>
          <input className={inputCls} placeholder="Re-enter password" type="password"
            value={data.confirmPassword} onChange={(e) => onChange('confirmPassword', e.target.value)} />
          {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
        </Field>
      </div>

      <PasswordStrengthMeter
        password={data.password}
        confirmPassword={data.confirmPassword}
      />
    </div>
  );
}

function Step2({ data, onChange, errors, subjects, grades }) {
  // Filter grades and subjects based on teachingLevel
  const filteredGrades = data.teachingLevel && grades
    ? grades.filter(g => {
        if (data.teachingLevel === 'Primary') return g.category === 'Primary';
        if (data.teachingLevel === 'Junior Secondary') return g.category === 'Junior Secondary';
        if (data.teachingLevel === 'O/L') return g.category === 'Senior Secondary';
        if (data.teachingLevel === 'A/L') return g.category === 'A/L';
        return true;
      })
    : [];

  const filteredSubjects = data.teachingLevel && subjects
    ? subjects.filter(s => s.level === data.teachingLevel)
    : [];

  return (
    <div className="space-y-4">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="NIC Number" required>
          <input className={inputCls} placeholder="XXXXXXXXXX or XXXXXXXXXV"
            value={data.nic} onChange={(e) => onChange('nic', e.target.value)} />
          {errors.nic && <p className="text-red-400 text-xs mt-1">{errors.nic}</p>}
        </Field>
        <Field label="Teacher ID / Employee ID (Optional)">
          <input className={inputCls} placeholder="e.g. T-123456"
            value={data.teacherId} onChange={(e) => onChange('teacherId', e.target.value)} />
          {errors.teacherId && <p className="text-red-400 text-xs mt-1">{errors.teacherId}</p>}
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Date of Birth" required>
          <input className={inputCls} type="date"
            value={data.dob} onChange={(e) => onChange('dob', e.target.value)} />
          {errors.dob && <p className="text-red-400 text-xs mt-1">{errors.dob}</p>}
        </Field>
        <Field label="Gender" required>
          <select className={selectCls} value={data.gender} onChange={(e) => onChange('gender', e.target.value)}>
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Prefer not to say</option>
          </select>
          {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
        </Field>
      </div>

      <Field label="Teaching Level" required>
        <select className={selectCls} value={data.teachingLevel} onChange={(e) => {
          onChange('teachingLevel', e.target.value);
          onChange('teacherGrade', ''); // reset
          onChange('subject', ''); // reset
        }}>
          <option value="">Select Level</option>
          <option value="Primary">Primary (Grade 1-5)</option>
          <option value="Junior Secondary">Junior Secondary (Grade 6-9)</option>
          <option value="O/L">O/L (Grade 10-11)</option>
          <option value="A/L">A/L (Grade 12-13)</option>
        </select>
        {errors.teachingLevel && <p className="text-red-400 text-xs mt-1">{errors.teachingLevel}</p>}
      </Field>

      {data.teachingLevel && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Specific Grade (Optional)">
            <GradeDropdown 
              className={selectCls} 
              value={data.teacherGrade} 
              onChange={(e) => onChange('teacherGrade', e.target.value)} 
              grades={filteredGrades} 
              placeholder="Select Grade" 
            />
            {errors.teacherGrade && <p className="text-red-400 text-xs mt-1">{errors.teacherGrade}</p>}
          </Field>
          <Field label="Teaching Subject" required>
            <SubjectDropdown 
              className={selectCls} 
              value={data.subject} 
              onChange={(e) => onChange('subject', e.target.value)} 
              subjects={filteredSubjects} 
              placeholder="Select Subject" 
            />
            {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
          </Field>
        </div>
      )}

      <Field label="Years of Service" required>
        <input className={inputCls} type="number" min="0" max="40" placeholder="e.g. 5"
          value={data.yearsOfService} onChange={(e) => onChange('yearsOfService', e.target.value)} />
        {errors.yearsOfService && <p className="text-red-400 text-xs mt-1">{errors.yearsOfService}</p>}
      </Field>
    </div>
  );
}

function Step3({ data, onChange, errors }) {
  const districts = data.province ? (DISTRICTS_BY_PROVINCE[data.province] || []) : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Province" required>
          <select className={selectCls} value={data.province}
            onChange={(e) => { onChange('province', e.target.value); onChange('district', ''); }}>
            <option value="">Select Province</option>
            {PROVINCES.map((p) => <option key={p}>{p}</option>)}
          </select>
          {errors.province && <p className="text-red-400 text-xs mt-1">{errors.province}</p>}
        </Field>
        <Field label="District" required>
          <select className={selectCls} value={data.district} onChange={(e) => onChange('district', e.target.value)}
            disabled={!data.province}>
            <option value="">Select District</option>
            {districts.map((d) => <option key={d}>{d}</option>)}
          </select>
          {errors.district && <p className="text-red-400 text-xs mt-1">{errors.district}</p>}
        </Field>
      </div>

      <Field label="Current School" required>
        <SchoolDropdown
          province={data.province}
          district={data.district}
          value={data.currentSchool}
          onChange={(e) => onChange('currentSchool', e.target.value)}
          className={selectCls}
        />
        {errors.currentSchool && <p className="text-red-400 text-xs mt-1">{errors.currentSchool}</p>}
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="School Type" required>
          <select className={selectCls} value={data.schoolType} onChange={(e) => onChange('schoolType', e.target.value)}>
            <option value="">Select Type</option>
            <option>National</option>
            <option>Provincial</option>
            <option>Pirivena</option>
            <option>International</option>
          </select>
          {errors.schoolType && <p className="text-red-400 text-xs mt-1">{errors.schoolType}</p>}
        </Field>
        <Field label="Appointment / Current Position" required>
          <select className={selectCls} value={data.position} onChange={(e) => onChange('position', e.target.value)}>
            <option value="">Select Position</option>
            {POSITIONS.map((p) => <option key={p}>{p}</option>)}
          </select>
          {errors.position && <p className="text-red-400 text-xs mt-1">{errors.position}</p>}
        </Field>
      </div>
    </div>
  );
}

function Step4({ data, onChange, subjects, errors }) {
  const districts = data.prefProvince ? (DISTRICTS_BY_PROVINCE[data.prefProvince] || []) : [];

  const filteredSubjects = data.teachingLevel && subjects
    ? subjects.filter(s => s.level === data.teachingLevel)
    : subjects || [];

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-600">
        💡 Transfer preferences help us match you with the most suitable vacancies. These can be changed later.
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Preferred Province">
          <select className={selectCls} value={data.prefProvince}
            onChange={(e) => { onChange('prefProvince', e.target.value); onChange('prefDistrict', ''); }}>
            <option value="">Any Province</option>
            {PROVINCES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Preferred District">
          <select className={selectCls} value={data.prefDistrict}
            onChange={(e) => onChange('prefDistrict', e.target.value)} disabled={!data.prefProvince}>
            <option value="">Any District</option>
            {districts.map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Preferred School (Optional)">
        <SchoolDropdown
          province={data.prefProvince}
          district={data.prefDistrict}
          value={data.prefSchool}
          onChange={(e) => onChange('prefSchool', e.target.value)}
          className={selectCls}
        />
      </Field>

      <Field label="Preferred Subject (Optional)">
        <SubjectDropdown 
          className={selectCls} 
          value={data.prefSubject} 
          onChange={(e) => onChange('prefSubject', e.target.value)} 
          subjects={filteredSubjects} 
          placeholder="Same as current subject" 
        />
      </Field>

      <Field label="Transfer Reason (Optional)">
        <textarea className={inputCls + ' resize-none'} rows={3}
          placeholder="e.g. Family relocation to Kandy area..."
          value={data.transferReason} onChange={(e) => onChange('transferReason', e.target.value)} />
      </Field>

      {/* Terms */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={data.agreed} onChange={(e) => onChange('agreed', e.target.checked)}
            className="mt-0.5 accent-blue-600 w-4 h-4 flex-shrink-0" />
          <span className="text-xs text-gray-500">
            I agree to the{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a> and{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
            I confirm that all provided information is accurate.
          </span>
        </label>
        {errors?.agreed && (
          <p className="text-red-500 text-xs font-semibold mt-2 bg-red-50 border border-red-200 p-2.5 rounded-lg flex items-center gap-1.5 animate-fade">
            <span>⚠️</span>
            <span>{errors.agreed}</span>
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main Register Component ───────────────────────────────────

function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [subjectsList, setSubjectsList] = useState([]);
  const [gradesList, setGradesList] = useState([]);

  useEffect(() => {
    getSubjects().then(setSubjectsList);
    getGrades().then(setGradesList);
  }, []);

  // All form data combined
  const [form, setForm] = useState({
    // Step 1
    fullName: '', email: '', mobile: '', password: '', confirmPassword: '',
    // Step 2
    nic: '', teacherId: '', dob: '', gender: '', teachingLevel: '', teacherGrade: '', subject: '', yearsOfService: '',
    // Step 3
    province: '', district: '', currentSchool: '', schoolType: '', position: '',
    // Step 4
    prefProvince: '', prefDistrict: '', prefSchool: '', prefSubject: '', transferReason: '', agreed: false,
  });

  const handleChange = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      
      // Auto-calculate DOB and Gender from NIC
      if (field === 'nic') {
        const extracted = extractFromNIC(value.trim());
        if (extracted) {
          next.dob = extracted.dob;
          next.gender = extracted.gender;
        }
      }
      
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // ── Validation ─────────────────────────────────────────────
  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.fullName.trim())              e.fullName        = 'Full name is required';
      if (!form.email.includes('@'))          e.email           = 'Valid email is required';
      if (!/^07\d{8}$/.test(form.mobile))    e.mobile          = 'Valid Sri Lanka mobile number required (07X XXXXXXX)';
      if (form.password.length < 8)           e.password        = 'Password must be at least 8 characters';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    if (step === 1) {
      const nicRegex = /^(\d{9}[VvXx]|\d{12})$/;
      if (!nicRegex.test(form.nic))           e.nic             = 'Enter a valid NIC (9+V or 12 digits)';
      if (!form.dob)                          e.dob             = 'Date of birth is required';
      if (!form.gender)                       e.gender          = 'Please select gender';
      if (!form.teachingLevel)                e.teachingLevel   = 'Please select teaching level';
      if (!form.subject)                      e.subject         = 'Please select your subject';
      // teacherGrade is optional now
      // if (!form.teacherGrade)                 e.teacherGrade    = 'Please select specific grade';
      if (!form.yearsOfService)               e.yearsOfService  = 'Years of service is required';
    }
    if (step === 2) {
      if (!form.province)                     e.province        = 'Province is required';
      if (!form.district)                     e.district        = 'District is required';
      if (!form.currentSchool.trim())         e.currentSchool   = 'Current school is required';
      if (!form.schoolType)                   e.schoolType      = 'School type is required';
      if (!form.position)                     e.position        = 'Position is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!form.agreed) {
      setSubmitError('Please agree to the Terms & Conditions and Privacy Policy to register.');
      setErrors((prev) => ({ ...prev, agreed: 'You must agree to the terms to proceed' }));
      return;
    }
    
    setLoading(true);
    try {
      // Call the API (from AuthController.js)
      await registerApi(form);
      setSubmitted(true);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Registration failed. Please try again.';
      setSubmitError(msg);
      setErrors((prev) => ({ ...prev, agreed: msg }));
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ─────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-extrabold text-blue-700 mb-2">Registration Successful!</h2>
          <p className="text-gray-400 text-sm mb-2">Welcome to TransferLK, <span className="font-semibold text-gray-700">{form.fullName}</span>!</p>
          <p className="text-xs text-gray-400 mb-6">Please check your email to verify your account before logging in.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 mb-6 text-left">
            🔐 <strong>NIC Verification:</strong> Your NIC will be verified by an admin within 24-48 hours. Full access will be granted after verification.
          </div>
          <button onClick={() => navigate('/login')}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            Go to Login →
          </button>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-10">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-xl p-4 sm:p-7">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-blue-700">Teacher Registration</h1>
          <p className="text-xs text-gray-400 mt-1">Step {step + 1} of {STEPS.length} — {STEPS[step].label}</p>
        </div>

        {/* Stepper */}
        <Stepper current={step} />

        {/* Global Submit Error Banner */}
        {submitError && (
          <div className="my-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-xl flex items-center justify-between gap-2 animate-fade">
            <div className="flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <span className="font-medium">{submitError}</span>
            </div>
            {submitError.toLowerCase().includes('already registered') && (
              <Link to="/login" className="font-bold underline text-blue-600 hover:text-blue-800 shrink-0">
                Login here →
              </Link>
            )}
          </div>
        )}

        {/* Step content */}
        <form onSubmit={handleSubmit}>
          <div className="min-h-[300px]">
            {step === 0 && <Step1 data={form} onChange={handleChange} errors={errors} />}
            {step === 1 && <Step2 data={form} onChange={handleChange} errors={errors} subjects={subjectsList} grades={gradesList} />}
            {step === 2 && <Step3 data={form} onChange={handleChange} errors={errors} />}
            {step === 3 && <Step4 data={form} onChange={handleChange} errors={errors} subjects={subjectsList} />}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-8 pt-5 border-t border-gray-100">
            <button type="button" onClick={handleBack} disabled={step === 0 || loading}
              className="px-5 py-2 text-sm text-gray-400 hover:text-blue-600 disabled:opacity-0 transition font-semibold">
              ← Back
            </button>

            <div className="flex gap-1">
              {STEPS.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-blue-600 w-6' : i < step ? 'bg-blue-300' : 'bg-gray-200'}`} />
              ))}
            </div>

            {step < STEPS.length - 1 ? (
              <button type="button" onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition">
                Next →
              </button>
            ) : (
              <button type="submit" disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md shadow-green-200">
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Registering...</span>
                  </>
                ) : (
                  <span>✓ Register</span>
                )}
              </button>
            )}
          </div>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
