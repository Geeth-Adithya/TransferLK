import { useEffect, useState } from 'react';
import VacancyCard from '../../components/VacancyCard';
import { getVacancies } from '../../Controller/VacancyController';

function FindVacancy() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVacancies().then((data) => {
      setVacancies(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Find Vacancies</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : vacancies.length === 0 ? (
        <p className="text-gray-500">No vacancies found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vacancies.map((v) => <VacancyCard key={v.id} vacancy={v} />)}
        </div>
      )}
    </div>
  );
}

export default FindVacancy;

