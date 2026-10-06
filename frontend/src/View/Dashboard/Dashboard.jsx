import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/vacancies" className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition text-center">
          <h3 className="text-xl font-semibold text-gray-700">Find Vacancies</h3>
          <p className="text-gray-400 text-sm mt-2">Browse open transfer vacancies</p>
        </Link>
        <Link to="/post-vacancy" className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition text-center">
          <h3 className="text-xl font-semibold text-gray-700">Post a Vacancy</h3>
          <p className="text-gray-400 text-sm mt-2">Create a new vacancy listing</p>
        </Link>
        <Link to="/profile" className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition text-center">
          <h3 className="text-xl font-semibold text-gray-700">My Profile</h3>
          <p className="text-gray-400 text-sm mt-2">View and edit your profile</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;

