import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVacancyById } from '../../Controller/VacancyController';

function VacancyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getVacancyById(id)
      .then((data) => {
        if (isMounted) {
          if (data && !data.error) {
            setVacancy(data);
          } else {
            setError(data?.error || 'Vacancy not found');
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Failed to load transfer request details');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 font-medium">Loading transfer request...</p>
        </div>
      </div>
    );
  }

  if (error || !vacancy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center space-y-4 border border-gray-100">
          <p className="text-5xl">😕</p>
          <h2 className="text-xl font-bold text-gray-800">{error || 'Vacancy not found'}</h2>
          <p className="text-gray-500 text-sm">
            This transfer request may have been removed or is no longer available.
          </p>
          <button
            onClick={() => navigate('/vacancies')}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition"
          >
            ← Back to Vacancies
          </button>
        </div>
      </div>
    );
  }

  const phoneNum = vacancy.teacher_mobile ? vacancy.teacher_mobile.replace(/[^0-9]/g, '') : '';
  const waPhone = phoneNum.startsWith('0') ? '94' + phoneNum.slice(1) : (phoneNum.startsWith('94') ? phoneNum : '94' + phoneNum);
  const waMessage = encodeURIComponent(
    `Hello ${vacancy.teacher_name || 'Teacher'}, I saw your ${vacancy.subject} transfer request on TransferLK (${vacancy.school_name}) and would like to discuss a mutual transfer.`
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Back button */}
        <button
          onClick={() => navigate('/vacancies')}
          className="text-sm font-semibold text-gray-500 hover:text-blue-600 flex items-center gap-1.5 transition"
        >
          ← Back to all requests
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-6">

          {/* Top badges */}
          <div className="flex justify-between items-start gap-2">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              vacancy.school_type === 'National' ? 'bg-blue-100 text-blue-700' :
              vacancy.school_type === 'Provincial' ? 'bg-purple-100 text-purple-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              🏛️ {vacancy.school_type || 'School'}
            </span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              vacancy.status === 'open' ? 'bg-green-100 text-green-700' :
              vacancy.status === 'closed' ? 'bg-red-100 text-red-600' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              ● {vacancy.status ? (vacancy.status.charAt(0).toUpperCase() + vacancy.status.slice(1)) : 'Open'}
            </span>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-900 mb-1">
              {vacancy.subject} Transfer Request
            </h1>
            <p className="text-gray-500 text-sm">
              📚 Teaching Grade: <span className="font-semibold text-gray-700">{vacancy.teaching_grade}</span> {vacancy.specific_grade && `(${vacancy.specific_grade})`}
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* Current School & Location */}
          <div className="space-y-2.5 text-sm text-gray-600 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Current Posting</h3>
            <p className="text-base font-bold text-gray-800">
              🏫 {vacancy.school_name || 'School not specified'}
              {vacancy.school_city && <span className="text-sm font-normal text-gray-500"> ({vacancy.school_city})</span>}
            </p>
            <p className="text-gray-600">
              📍 {vacancy.district ? `${vacancy.district}, ` : ''}{vacancy.province ? `${vacancy.province} Province` : ''}
            </p>
            {vacancy.created_at && (
              <p className="text-xs text-gray-400 pt-1">
                📅 Posted on {vacancy.created_at.split(' ')[0]}
              </p>
            )}
          </div>

          {/* Preferred Destination */}
          <div className="space-y-2.5 text-sm bg-blue-50/60 p-4 rounded-xl border border-blue-100">
            <h3 className="text-xs font-bold uppercase text-blue-600 tracking-wider">Preferred Transfer Target</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
              <div>
                <span className="text-xs text-gray-400 block font-medium">Target Province</span>
                <span className="font-semibold">{vacancy.pref_province || 'Any Province'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 block font-medium">Target District</span>
                <span className="font-semibold">{vacancy.pref_district || 'Any District'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs text-gray-400 block font-medium">Target School</span>
                <span className="font-semibold text-blue-800">{vacancy.pref_school || 'Any School'}</span>
              </div>
            </div>
          </div>

          {/* Notes / Description */}
          {vacancy.description && (
            <div>
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Notes & Remarks</h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-line">
                {vacancy.description}
              </p>
            </div>
          )}

          {/* Teacher Contact Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shrink-0 shadow-sm">
                {vacancy.teacher_name ? vacancy.teacher_name.charAt(0).toUpperCase() : 'T'}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-base">
                  {vacancy.teacher_name || 'Teacher'}
                </h3>
                <p className="text-xs text-gray-500">Posted Teacher</p>
              </div>
            </div>

            <div className="space-y-1.5 text-sm text-gray-600 break-all pt-1">
              {vacancy.teacher_email && (
                <p className="flex items-center gap-2">
                  <span>✉️</span>
                  <a href={`mailto:${vacancy.teacher_email}`} className="text-blue-600 hover:underline font-medium">
                    {vacancy.teacher_email}
                  </a>
                </p>
              )}
              {vacancy.teacher_mobile && (
                <p className="flex items-center gap-2">
                  <span>📞</span>
                  <a href={`tel:${vacancy.teacher_mobile}`} className="text-blue-600 hover:underline font-medium">
                    {vacancy.teacher_mobile}
                  </a>
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              {vacancy.teacher_email && (
                <a
                  href={`mailto:${vacancy.teacher_email}?subject=${encodeURIComponent(`Transfer Request Inquiry - ${vacancy.subject} - ${vacancy.school_name || ''}`)}`}
                  className="flex-1 text-center px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition shadow-sm"
                >
                  ✉️ Send Email
                </a>
              )}
              {vacancy.teacher_mobile && (
                <a
                  href={`tel:${vacancy.teacher_mobile}`}
                  className="flex-1 text-center px-4 py-2.5 bg-white border border-blue-300 text-blue-700 rounded-xl font-semibold text-sm hover:bg-blue-50 transition"
                >
                  📞 Call
                </a>
              )}
              {vacancy.teacher_mobile && (
                <a
                  href={`https://wa.me/${waPhone}?text=${waMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center px-4 py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition shadow-sm"
                >
                  💬 WhatsApp
                </a>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default VacancyDetails;
