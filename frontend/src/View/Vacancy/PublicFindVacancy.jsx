import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../Controller/AuthController';
import SchoolDropdown from '../../components/SchoolDropdown';
import SubjectDropdown from '../../components/SubjectDropdown';
import { getSubjects } from '../../Controller/ConfigController';
import { getVacancies } from '../../Controller/VacancyController';

// ── Data ─────────────────────────────────────────────────────
const DISTRICTS = {
  'All Provinces': ['All Districts'],
  Western:         ['All Districts', 'Colombo', 'Gampaha', 'Kalutara'],
  Central:         ['All Districts', 'Kandy', 'Matale', 'Nuwara Eliya'],
  Southern:        ['All Districts', 'Galle', 'Matara', 'Hambantota'],
  Northern:        ['All Districts', 'Jaffna', 'Kilinochchi', 'Mannar', 'Vavuniya', 'Mullaitivu'],
  Eastern:         ['All Districts', 'Trincomalee', 'Batticaloa', 'Ampara'],
  'North Western':  ['All Districts', 'Kurunegala', 'Puttalam'],
  'North Central':  ['All Districts', 'Anuradhapura', 'Polonnaruwa'],
  Uva:             ['All Districts', 'Badulla', 'Monaragala'],
  Sabaragamuwa:    ['All Districts', 'Ratnapura', 'Kegalle'],
};

const SCHOOL_TYPES = ['All Types', 'National', 'Provincial', 'Pirivena', 'International'];
const STATUSES     = ['All', 'open', 'closed', 'paused'];

const SUBJECT_ICONS = {
  Mathematics: '📐', Science: '🔬', English: '📖', Sinhala: '📜',
  Tamil: '📜', History: '🏛️', ICT: '💻', Art: '🎨', Biology: '🧬',
  Commerce: '📊', Music: '🎵', Physics: '⚛️', Chemistry: '🧪',
  Geography: '🗺️', default: '📚',
};

const statusLabel = (s) => {
  if (s === 'open')   return { label: '● Open',   cls: 'bg-green-100 text-green-700' };
  if (s === 'closed') return { label: '● Closed', cls: 'bg-red-100 text-red-600' };
  if (s === 'paused') return { label: '⏸ Paused', cls: 'bg-yellow-100 text-yellow-700' };
  return { label: s, cls: 'bg-gray-100 text-gray-600' };
};

// ── Login Required Modal ──────────────────────────────────────
function LoginModal({ vacancy, onClose, onLogin, onRegister }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 relative"
        onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-600 text-xl transition">✕</button>
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-4xl mb-3">🔐</div>
          <h2 className="text-xl font-extrabold text-gray-800">Login Required</h2>
          <p className="text-gray-400 text-sm mt-1 leading-relaxed">
            Please login or create an account to view full request details.
          </p>
        </div>
        {vacancy && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5 text-sm text-gray-600 space-y-1">
            <p className="font-semibold text-blue-800">
              {SUBJECT_ICONS[vacancy.subject] || SUBJECT_ICONS.default} {vacancy.subject} Transfer Request
            </p>
            <p>📍 {vacancy.district}</p>
            <p>🏫 {vacancy.school_name}</p>
            {vacancy.school_type && <p>🏛️ {vacancy.school_type} School</p>}
          </div>
        )}
        <div className="flex flex-col gap-3">
          <button onClick={onLogin}
            className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition text-sm">
            Login to Continue →
          </button>
          <button onClick={onRegister}
            className="w-full border-2 border-blue-200 text-blue-700 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition text-sm">
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Vacancy Card ──────────────────────────────────────────────
function VacancyCard({ vacancy, onViewClick }) {
  const icon = SUBJECT_ICONS[vacancy.subject] || SUBJECT_ICONS.default;
  const { label, cls } = statusLabel(vacancy.status);
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            vacancy.school_type === 'National' ? 'bg-blue-100 text-blue-700' :
            vacancy.school_type === 'Provincial' ? 'bg-purple-100 text-purple-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            🏛️ {vacancy.school_type || 'School'}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
            {label}
          </span>
        </div>
        <h3 className="text-lg font-extrabold text-gray-800 mb-3">
          {icon} {vacancy.subject} Transfer Request
        </h3>
        <div className="space-y-1.5 text-sm text-gray-500">
          <p>📍 {vacancy.district || vacancy.province ? `${vacancy.district || ''}${vacancy.district && vacancy.province ? ', ' : ''}${vacancy.province || ''}` : 'Location not specified'}</p>
          <p>🏫 {vacancy.school_name || 'School not specified'}</p>
          {(vacancy.teaching_grade || vacancy.grade) && <p>📋 Grade: {vacancy.teaching_grade || vacancy.grade} {vacancy.specific_grade && `(${vacancy.specific_grade})`}</p>}
        </div>
      </div>
      <button
        onClick={() => onViewClick(vacancy)}
        className="mt-5 w-full py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 active:scale-95 transition-all duration-200"
      >
        View Request →
      </button>
    </div>
  );
}

// ── Skeleton Card ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-5 w-20 bg-gray-200 rounded-full" />
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
      </div>
      <div className="h-6 w-3/4 bg-gray-200 rounded mb-3" />
      <div className="space-y-2 mb-5">
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
      </div>
      <div className="h-9 bg-gray-200 rounded-xl" />
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
function PublicFindVacancy() {
  const navigate = useNavigate();

  const [province, setProvince] = useState('All Provinces');
  const [district, setDistrict] = useState('All Districts');
  const [school,   setSchool]   = useState('');
  const [subject,  setSubject]  = useState('');
  const [type,     setType]     = useState('All Types');
  const [status,   setStatus]   = useState('All');

  const [subjectsList, setSubjectsList] = useState([]);
  const [vacancies,    setVacancies]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');

  const [modalVacancy, setModalVacancy] = useState(null);

  // Load subjects once
  useEffect(() => {
    getSubjects()
      .then((data) => setSubjectsList(Array.isArray(data) ? data : (data?.data || [])))
      .catch(() => {});
  }, []);

  // Fetch vacancies whenever filters change
  const fetchVacancies = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getVacancies({
        province,
        district,
        school_name: school,
        subject,
        school_type: type,
        status,
      });
      setVacancies(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load vacancies. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [province, district, school, subject, type, status]);

  useEffect(() => {
    fetchVacancies();
  }, [fetchVacancies]);

  const districtOptions = DISTRICTS[province] || ['All Districts'];

  const handleProvinceChange = (val) => {
    setProvince(val);
    setDistrict('All Districts');
    setSchool('');
  };

  const handleViewClick = (vacancy) => {
    if (isAuthenticated()) {
      navigate(`/vacancies/${vacancy.id}`);
    } else {
      setModalVacancy(vacancy);
    }
  };

  const clearFilters = () => {
    setProvince('All Provinces');
    setDistrict('All Districts');
    setSchool('');
    setSubject('');
    setType('All Types');
    setStatus('All');
  };

  const selectCls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Login Modal */}
      {modalVacancy && (
        <LoginModal
          vacancy={modalVacancy}
          onClose={() => setModalVacancy(null)}
          onLogin={() => navigate('/login', { state: { from: `/vacancies/${modalVacancy.id}` } })}
          onRegister={() => navigate('/register', { state: { from: `/vacancies/${modalVacancy.id}` } })}
        />
      )}

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-600 pt-28 pb-12 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">🔍 Find a Transfer Request</h1>
        <p className="text-blue-200 text-sm">Browse school transfer requests across all provinces in Sri Lanka</p>
      </div>

      {/* Filters Panel */}
      <div className="max-w-6xl mx-auto px-4 mt-6 mb-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 anim-slide-up anim-delay-1">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Filter Requests</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block">Province</label>
              <select value={province} onChange={(e) => handleProvinceChange(e.target.value)} className={selectCls}>
                {Object.keys(DISTRICTS).map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block">District</label>
              <select value={district} onChange={(e) => setDistrict(e.target.value)} className={selectCls}>
                {districtOptions.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block">School Name</label>
              <SchoolDropdown
                province={province}
                district={district}
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className={selectCls}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block">Subject</label>
              <SubjectDropdown
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                subjects={subjectsList}
                placeholder="All Subjects"
                className={selectCls}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block">School Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className={selectCls}>
                {SCHOOL_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 mb-1 block">Request Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

          </div>
          <div className="flex justify-end mt-4">
            <button onClick={clearFilters} className="text-sm text-gray-400 hover:text-red-500 transition flex items-center gap-1">
              ✕ Clear all filters
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex justify-between items-center mb-5">
          <p className="text-sm text-gray-400">
            {loading ? 'Loading...' : <>Showing <span className="font-semibold text-gray-700">{vacancies.length}</span> requests</>}
          </p>
          {!isAuthenticated() && (
            <p className="text-xs text-blue-500">🔐 Login to view full details</p>
          )}
        </div>

        {error && (
          <div className="text-center py-12 text-red-400">
            <p className="text-4xl mb-3">⚠️</p>
            <p className="font-semibold">{error}</p>
            <button onClick={fetchVacancies} className="mt-3 text-blue-500 hover:underline text-sm">Try again</button>
          </div>
        )}

        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && !error && vacancies.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">🏫</p>
            <p className="text-lg font-semibold">No requests found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
            <button onClick={clearFilters} className="mt-4 text-blue-500 hover:underline text-sm">Clear filters</button>
          </div>
        )}

        {!loading && !error && vacancies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {vacancies.map((v, i) => (
              <div key={v.id} className={`anim-slide-up anim-delay-${Math.min(i + 1, 12)}`}>
                <VacancyCard vacancy={v} onViewClick={handleViewClick} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicFindVacancy;
