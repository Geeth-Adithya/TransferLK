import { useState, useEffect } from 'react';
import { postVacancy, getMyVacancies, deleteVacancy, updateVacancy } from '../../Controller/VacancyController';
import { getSubjects } from '../../Controller/ConfigController';
import { getCurrentUser } from '../../Controller/AuthController';
import SubjectDropdown from '../../components/SubjectDropdown';
import SchoolDropdown from '../../components/SchoolDropdown';
import { PROVINCES, DISTRICTS_BY_PROVINCE } from '../../utils/locations';

function PostVacancy() {
  const [form, setForm] = useState({ 
    subject: '', 
    teaching_grade: '', 
    specific_grade: '', 
    pref_province: '', 
    pref_district: '', 
    pref_school: '', 
    description: '', 
    school_id: '' 
  });
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [subjects, setSubjects] = useState([]);
  const [myVacancies, setMyVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  // For editing
  const [editingId, setEditingId] = useState(null);

  const TEACHING_GRADES = ['1-5', '6-9', '10-11', '12-13'];

  const loadData = async () => {
    try {
      setLoading(true);
      const [subs, user, vacs] = await Promise.all([
        getSubjects(),
        getCurrentUser(),
        getMyVacancies()
      ]);
      setSubjects(Array.isArray(subs) ? subs : []);
      setMyVacancies(Array.isArray(vacs) ? vacs : []);

      // Pre-fill form from user data ONLY if not editing
      if (!editingId) {
        setForm({
          subject: user.subject || '',
          teaching_grade: '',
          specific_grade: '',
          pref_province: user.pref_province || '',
          pref_district: user.pref_district || '',
          pref_school: user.pref_school || '',
          description: user.transfer_reason || '',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'pref_province') {
        next.pref_district = '';
        next.pref_school = '';
      }
      if (name === 'pref_district') {
        next.pref_school = '';
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      if (editingId) {
        await updateVacancy(editingId, form);
        setSuccess('Transfer Request updated successfully!');
        setEditingId(null);
      } else {
        await postVacancy(form);
        setSuccess('Transfer Request posted successfully!');
      }
      // Refresh list and reset form
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to save transfer request');
    }
  };

  const handleEdit = (vac) => {
    setEditingId(vac.id);
    setForm({
      subject: vac.subject,
      teaching_grade: vac.teaching_grade,
      specific_grade: vac.specific_grade || '',
      pref_province: vac.pref_province || '',
      pref_district: vac.pref_district || '',
      pref_school: vac.pref_school || '',
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
    if (!window.confirm("Are you sure you want to delete this transfer request?")) return;
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );

  const districts = form.pref_province ? (DISTRICTS_BY_PROVINCE[form.pref_province] || []) : [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white pt-14 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 relative overflow-hidden page-enter">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-3 sm:mb-4 anim-slide-up">
            Manage Transfer Requests
          </h1>
          <p className="text-blue-100 text-xs sm:text-base md:text-lg max-w-2xl mx-auto anim-slide-up anim-delay-1 px-2">
            Post your transfer requirements or manage your existing requests.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto -mt-10 sm:-mt-12 px-3 sm:px-4 space-y-6 sm:space-y-8 relative z-20">
        
        {/* Post/Edit Form */}
        <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl w-full mx-auto border border-gray-100 anim-scale-in anim-delay-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            {editingId ? 'Edit Transfer Request' : 'Post a Transfer Request'}
          </h2>
          {success && <p className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-6 border border-green-200 font-medium">{success}</p>}
          {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-200 font-medium">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Subject and Grades */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
              <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4">Teaching Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Subject</label>
                  <SubjectDropdown 
                    name="subject" 
                    value={form.subject} 
                    onChange={handleChange} 
                    required 
                    subjects={subjects} 
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white hover:bg-gray-50" 
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Teaching Grade Category</label>
                  <select
                    name="teaching_grade"
                    value={form.teaching_grade}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white hover:bg-gray-50"
                  >
                    <option value="">Select Grades</option>
                    {TEACHING_GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Specific Grade (Optional)</label>
                  <input type="text" name="specific_grade" placeholder="E.g., Grade 6 only" value={form.specific_grade} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white hover:bg-gray-50" />
                </div>
              </div>
            </div>

            {/* Transfer Preferences */}
            <div className="bg-blue-50/30 p-5 rounded-xl border border-blue-50 space-y-4">
              <h3 className="font-semibold text-blue-800 border-b border-blue-100 pb-2 mb-4">Transfer Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Preferred Province</label>
                  <select name="pref_province" value={form.pref_province} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white hover:bg-gray-50">
                    <option value="">Any Province</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Preferred District</label>
                  <select name="pref_district" value={form.pref_district} onChange={handleChange} disabled={!form.pref_province}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:opacity-70">
                    <option value="">Any District</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Preferred School (Optional)</label>
                  <SchoolDropdown 
                    name="pref_school"
                    value={form.pref_school} 
                    onChange={handleChange} 
                    province={form.pref_province}
                    district={form.pref_district}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white hover:bg-gray-50 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Description / Reason</label>
              <textarea name="description" placeholder="E.g., Looking for a mutual transfer to Kandy area to be close to family..." value={form.description} onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white hover:bg-gray-50" rows={4} required />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-md hover:shadow-lg active:scale-[0.98]">
                {editingId ? 'Update Request' : 'Post Request'}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="flex-1 sm:flex-none sm:w-1/3 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-all font-bold active:scale-[0.98]">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* My Vacancies List */}
        {myVacancies.length > 0 && (
          <div className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 anim-slide-up anim-delay-3">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-100 flex items-center gap-2">
              My Posted Transfer Requests
            </h3>
            <div className="space-y-4">
              {myVacancies.map((vac, idx) => (
                <div key={vac.id} className={`border border-gray-100 bg-gray-50 rounded-xl p-4 sm:p-6 flex flex-col lg:flex-row gap-4 sm:gap-6 items-start lg:items-center justify-between hover:shadow-md hover:border-blue-200 transition-all anim-slide-up anim-delay-${Math.min((idx % 8) + 4, 12)}`}>
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-lg text-blue-900">{vac.subject}</h4>
                      <span className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wide ${vac.status === 'open' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                        {vac.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="font-semibold text-gray-800">Grades:</span> {vac.teaching_grade} 
                        {vac.specific_grade && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-semibold">{vac.specific_grade}</span>}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="font-semibold text-gray-800">Current:</span> {vac.school_name || 'N/A'}
                      </p>
                      
                      {(vac.pref_province || vac.pref_district) && (
                        <p className="text-sm text-gray-600 flex items-center gap-2 md:col-span-2 mt-1 bg-amber-50 p-2 rounded-lg border border-amber-100">
                          <span className="font-semibold text-amber-800">Prefers:</span> 
                          {vac.pref_school ? vac.pref_school : `${vac.pref_district || 'Any'}, ${vac.pref_province || 'Any'}`}
                        </p>
                      )}
                    </div>

                    <div className="text-sm text-gray-700 bg-white p-4 rounded-xl border border-gray-100 shadow-sm leading-relaxed">
                      {vac.description}
                    </div>
                    
                    {/* Placeholder for requests */}
                    <div className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 font-semibold cursor-pointer hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                      View Responses (Coming Soon)
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-32 shrink-0">
                    <button onClick={() => handleEdit(vac)} className="flex-1 lg:w-full px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-all shadow-sm">
                      Edit
                    </button>
                    <button onClick={() => handleToggleStatus(vac)} className="flex-1 lg:w-full px-4 py-2 bg-white border border-orange-200 text-orange-700 rounded-lg text-sm font-semibold hover:bg-orange-50 transition-all shadow-sm">
                      {vac.status === 'open' ? 'Pause' : 'Resume'}
                    </button>
                    <button onClick={() => handleDelete(vac.id)} className="flex-1 lg:w-full px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-all shadow-sm">
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
