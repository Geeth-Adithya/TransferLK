import { useParams, useNavigate } from 'react-router-dom';

// Mock data — same as PublicFindVacancy (replace with API later)
const MOCK_VACANCIES = [
  { id: 1, subject: 'Mathematics', grade: '6-11', school: 'Ananda College', province: 'Western', district: 'Colombo', type: 'National', status: 'open', postedAt: '2026-10-01', description: 'We are looking for a qualified Mathematics teacher for grades 6-11. The teacher should have a degree in Mathematics and teaching experience of at least 2 years.', contact: 'principal@ananda.edu.lk', phone: '011-2695410' },
  { id: 2, subject: 'Science', grade: '6-9', school: 'Nalanda College', province: 'Western', district: 'Colombo', type: 'National', status: 'open', postedAt: '2026-10-02', description: 'Seeking an enthusiastic Science teacher for grades 6-9. Must be able to conduct practical lab sessions.', contact: 'admin@nalanda.edu.lk', phone: '011-2696060' },
  { id: 3, subject: 'English', grade: '1-5', school: 'Richmond College', province: 'Southern', district: 'Galle', type: 'National', status: 'open', postedAt: '2026-10-03', description: 'English teacher needed for primary grades 1-5. Strong communication skills required.', contact: 'richmond@edu.lk', phone: '091-2222345' },
  { id: 4, subject: 'Sinhala', grade: '6-11', school: 'Mahinda College', province: 'Southern', district: 'Galle', type: 'National', status: 'open', postedAt: '2026-10-03', description: 'Sinhala language teacher for secondary grades 6-11.', contact: 'mahinda@edu.lk', phone: '091-2234567' },
  { id: 5, subject: 'History', grade: '10-13', school: 'Dharmaraja College', province: 'Central', district: 'Kandy', type: 'National', status: 'open', postedAt: '2026-10-04', description: 'History teacher for A/L and O/L classes. Must be able to teach both local and world history.', contact: 'dharmaraja@edu.lk', phone: '081-2234567' },
  { id: 6, subject: 'ICT', grade: '6-11', school: 'Zahira College', province: 'Western', district: 'Colombo', type: 'National', status: 'open', postedAt: '2026-10-04', description: 'ICT teacher for grades 6-11. Knowledge of programming, networking, and digital literacy required.', contact: 'zahira@edu.lk', phone: '011-2324455' },
  { id: 7, subject: 'Art', grade: '1-5', school: 'Kandy Maha Vidyalaya', province: 'Central', district: 'Kandy', type: 'Provincial', status: 'open', postedAt: '2026-10-05', description: 'Art teacher for primary section. Creative and passionate about teaching young children.', contact: 'kmv@edu.lk', phone: '081-2244556' },
  { id: 8, subject: 'Mathematics', grade: '10-13', school: 'Jaffna Central College', province: 'Northern', district: 'Jaffna', type: 'National', status: 'open', postedAt: '2026-10-05', description: 'Advanced Mathematics teacher for O/L and A/L classes. Strong results-oriented approach needed.', contact: 'jcc@edu.lk', phone: '021-2234567' },
];

function VacancyDetails() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const vacancy    = MOCK_VACANCIES.find((v) => v.id === parseInt(id));

  if (!vacancy) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-5xl">😕</p>
        <p className="text-gray-500 text-lg">Vacancy not found</p>
        <button onClick={() => navigate('/vacancies')} className="text-blue-600 hover:underline text-sm">← Back to search</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Back button */}
        <button onClick={() => navigate('/vacancies')} className="text-sm text-gray-400 hover:text-blue-600 mb-4 flex items-center gap-1 transition">
          ← Back to vacancies
        </button>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-lg p-7">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">{vacancy.type} School</span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${vacancy.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              ● {vacancy.status.charAt(0).toUpperCase() + vacancy.status.slice(1)}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-blue-800 mb-1">{vacancy.subject}</h1>
          <p className="text-gray-500 text-sm mb-1">📚 Grade {vacancy.grade}</p>

          <hr className="my-4 border-gray-100" />

          <div className="space-y-2 text-sm text-gray-600">
            <p>🏫 <span className="font-semibold text-gray-800">{vacancy.school}</span></p>
            <p>📍 {vacancy.district}, {vacancy.province} Province</p>
            <p>📅 Posted on {vacancy.postedAt}</p>
          </div>

          <div className="mt-5 bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-2">About this Vacancy</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{vacancy.description}</p>
          </div>

          {/* Apply / Contact section */}
          <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5">
            <h3 className="font-bold text-blue-800 mb-3 text-base">📬 Apply / Contact</h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>✉️ <a href={`mailto:${vacancy.contact}`} className="text-blue-600 hover:underline">{vacancy.contact}</a></p>
              <p>📞 <a href={`tel:${vacancy.phone}`} className="text-blue-600 hover:underline">{vacancy.phone}</a></p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <a
                href={`mailto:${vacancy.contact}?subject=Transfer Application - ${vacancy.subject} - ${vacancy.school}`}
                className="flex-1 text-center px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition"
              >
                ✉️ Send Email
              </a>
              <a
                href={`tel:${vacancy.phone}`}
                className="flex-1 text-center px-5 py-2.5 bg-white border border-blue-300 text-blue-700 rounded-xl font-semibold text-sm hover:bg-blue-50 transition"
              >
                📞 Call School
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default VacancyDetails;
