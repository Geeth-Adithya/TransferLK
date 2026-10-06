import { useState, useEffect } from 'react';
import { postVacancy, getMyVacancies, deleteVacancy, updateVacancy } from '../../Controller/VacancyController';
import { getSubjects, getGrades } from '../../Controller/ConfigController';
import { getCurrentUser } from '../../Controller/AuthController';
import SubjectDropdown from '../../components/SubjectDropdown';
import GradeDropdown from '../../components/GradeDropdown';

function PostVacancy() {
  const [form, setForm] = useState({ subject: '', grade: '', description: '', school_id: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [myVacancies, setMyVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  // For editing
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subs, grds, user, vacs] = await Promise.all([
        getSubjects(),
        getGrades(),
        getCurrentUser(),
        getMyVacancies()
      ]);
      setSubjects(subs);
      setGrades(grds);
      setMyVacancies(vacs);

      // Pre-fill form from user data ONLY if not editing
      if (!editingId) {
        setForm({
          subject: user.subject || '',
          grade: user.teacher_grade || '',
          description: '',
          school_id: user.school_id || ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      if (editingId) {
        await updateVacancy(editingId, form);
        setSuccess('Vacancy updated successfully!');
        setEditingId(null);
      } else {
        await postVacancy(form);
        setSuccess('Vacancy posted successfully!');
      }
      // Refresh list and reset form
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to save vacancy');
    }
  };

  const handleEdit = (vac) => {
    setEditingId(vac.id);
    setForm({
      subject: vac.subject,
      grade: vac.grade,
      description: vac.description,
      school_id: vac.school_id,
      status: vac.status
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setSuccess('');
    setError('');
    loadData(); // Re-fetch to reset form to user's default
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vacancy?")) return;
    try {
      await deleteVacancy(id);
      setMyVacancies(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleToggleStatus = async (vac) => {
    const newStatus = vac.status === 'open' ? 'paused' : 'open';
    try {
      await updateVacancy(vac.id, { ...vac, status: newStatus });
      setMyVacancies(prev => prev.map(v => v.id === vac.id ? { ...v, status: newStatus } : v));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Post/Edit Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            {editingId ? 'Edit Vacancy' : 'Post a Vacancy'}
          </h2>
          {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <GradeDropdown 
              name="grade" 
              value={form.grade} 
              onChange={handleChange} 
              required 
              grades={grades} 
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" 
            />
            
            <SubjectDropdown 
              name="subject" 
              value={form.subject} 
              onChange={handleChange} 
              required 
              subjects={subjects} 
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" 
            />

            <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" rows={4} required />
            
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
              {editingId ? 'Update Vacancy' : 'Post Vacancy'}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition mt-2">
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* My Vacancies List */}
        {myVacancies.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">My Posted Vacancies</h3>
            <div className="space-y-4">
              {myVacancies.map(vac => (
                <div key={vac.id} className="border border-gray-100 rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:shadow-md transition">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-lg text-blue-900">{vac.subject}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${vac.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {vac.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">Grade: {vac.grade} • {vac.school_name || 'No school attached'}</p>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border">{vac.description}</p>
                    
                    {/* Placeholder for requests */}
                    <div className="mt-3 text-xs text-blue-600 font-semibold flex items-center gap-2 cursor-pointer hover:underline">
                      📬 View Requests (Coming Soon)
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                    <button onClick={() => handleEdit(vac)} className="flex-1 sm:flex-none px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition">
                      Edit
                    </button>
                    <button onClick={() => handleToggleStatus(vac)} className="flex-1 sm:flex-none px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-semibold hover:bg-orange-100 transition">
                      {vac.status === 'open' ? 'Pause' : 'Resume'}
                    </button>
                    <button onClick={() => handleDelete(vac.id)} className="flex-1 sm:flex-none px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PostVacancy;

