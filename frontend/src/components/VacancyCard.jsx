import { Link } from 'react-router-dom';

function VacancyCard({ vacancy }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5 hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-blue-700">{vacancy.subject} - Grade {vacancy.grade}</h3>
      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{vacancy.description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${vacancy.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {vacancy.status}
        </span>
        <Link to={`/vacancies/${vacancy.id}`} className="text-blue-600 text-sm hover:underline">View Details →</Link>
      </div>
    </div>
  );
}

export default VacancyCard;

