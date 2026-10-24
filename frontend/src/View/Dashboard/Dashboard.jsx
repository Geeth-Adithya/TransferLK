import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyVacancies } from '../../Controller/VacancyController';

function Dashboard() {
  const [myVacancies, setMyVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyVacancies().then(vacs => {
      setMyVacancies(vacs || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 sm:space-y-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 anim-slide-up">Dashboard</h2>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <Link to="/vacancies" className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6 hover:shadow-md hover:border-blue-200 transition-all text-center anim-slide-up anim-delay-1 group">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800">Browse Requests</h3>
          <p className="text-gray-500 text-sm mt-1">Search for mutual transfers</p>
        </Link>
        <Link to="/post-vacancy" className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6 hover:shadow-md hover:border-blue-200 transition-all text-center anim-slide-up anim-delay-2 group">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800">Post a Request</h3>
          <p className="text-gray-500 text-sm mt-1">Create a new transfer request</p>
        </Link>
        <Link to="/profile" className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6 hover:shadow-md hover:border-blue-200 transition-all text-center anim-slide-up anim-delay-3 group sm:col-span-2 md:col-span-1">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800">My Profile</h3>
          <p className="text-gray-500 text-sm mt-1">View and edit your profile</p>
        </Link>
      </div>

      {/* Overview Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-8 anim-slide-up anim-delay-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">My Transfer Requests</h3>
          <Link to="/post-vacancy" className="text-sm font-semibold text-blue-600 hover:underline">Manage All &rarr;</Link>
        </div>
        
        {loading ? (
          <p className="text-gray-400 text-sm text-center py-4">Loading requests...</p>
        ) : myVacancies.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500 mb-3">You haven't posted any transfer requests yet.</p>
            <Link to="/post-vacancy" className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">
              Post your first request
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myVacancies.map(vac => (
              <div key={vac.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 sm:p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors gap-3 sm:gap-0">
                <div>
                  <h4 className="font-bold text-gray-800">{vac.subject}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Grade: {vac.teaching_grade} {vac.specific_grade && `(${vac.specific_grade})`}
                  </p>
                </div>
                <div className="mt-3 sm:mt-0 flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase ${vac.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {vac.status}
                  </span>
                  <Link to={`/post-vacancy`} className="text-sm font-semibold text-blue-600 hover:underline bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
