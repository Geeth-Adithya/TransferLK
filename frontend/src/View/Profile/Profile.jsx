import { useState, useEffect } from 'react';
import { getCurrentUser, updateCurrentUser } from '../../Controller/AuthController';
import { getSubjects, getGrades } from '../../Controller/ConfigController';
import SchoolDropdown from '../../components/SchoolDropdown';
import SubjectDropdown from '../../components/SubjectDropdown';
import GradeDropdown from '../../components/GradeDropdown';

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

const inputCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition';
const selectCls = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white transition';

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 mb-1 block">
        {label}
      </label>
      {children}
    </div>
  );
}

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  
  const [subjectsList, setSubjectsList] = useState([]);
  const [gradesList, setGradesList] = useState([]);

  useEffect(() => {
    const initData = async () => {
      try {
        const [userData, subRes, gradeRes] = await Promise.all([
          getCurrentUser(),
          getSubjects(),
          getGrades()
        ]);
        setUser(userData);
        setFormData(userData);
        setSubjectsList(subRes.data || []);
        setGradesList(gradeRes.data || []);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCurrentUser(formData);
      // Refresh current user data after save
      const updatedUser = await getCurrentUser();
      setUser(updatedUser);
      setFormData(updatedUser);
      setIsEditing(false);
    } catch (err) {
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-20">Loading profile...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
  if (!user) return <div className="text-center mt-20">No user data found.</div>;

  // Derived lists for dropdowns
  const currentDistricts = formData.province ? (DISTRICTS_BY_PROVINCE[formData.province] || []) : [];
  const prefDistricts = formData.pref_province ? (DISTRICTS_BY_PROVINCE[formData.pref_province] || []) : [];

  const filteredGrades = formData.teaching_level && gradesList.length > 0
    ? gradesList.filter(g => {
        if (formData.teaching_level === 'Primary') return g.category === 'Primary';
        if (formData.teaching_level === 'Junior Secondary') return g.category === 'Junior Secondary';
        if (formData.teaching_level === 'O/L') return g.category === 'Senior Secondary';
        if (formData.teaching_level === 'A/L') return g.category === 'A/L';
        return true;
      })
    : gradesList;

  const filteredSubjects = formData.teaching_level && subjectsList.length > 0
    ? subjectsList.filter(s => s.level === formData.teaching_level)
    : subjectsList;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-blue-600 font-medium">{user.role === 'teacher' ? 'Teacher' : user.role}</p>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold mt-2 inline-block ${user.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                Account Status: {user.status ? user.status.toUpperCase() : 'PENDING'}
              </span>
            </div>
          </div>
          <div>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-blue-700 transition">
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { setIsEditing(false); setFormData(user); }} disabled={saving} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium shadow-sm hover:bg-green-700 transition">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Account Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Account Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold mb-1">Full Name</span> 
                {isEditing ? <input className={inputCls} value={formData.name || ''} onChange={(e) => handleChange('name', e.target.value)} /> : <span className="font-medium">{user.name}</span>}
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold mb-1">Email</span> 
                <span className="font-medium">{user.email} (Cannot be changed)</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold mb-1">Mobile Number</span> 
                {isEditing ? <input className={inputCls} value={formData.mobile || ''} onChange={(e) => handleChange('mobile', e.target.value)} /> : <span className="font-medium">{user.mobile || '-'}</span>}
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold mb-1">NIC</span> 
                {isEditing ? <input className={inputCls} value={formData.nic || ''} onChange={(e) => handleChange('nic', e.target.value)} /> : <span className="font-medium">{user.nic || '-'}</span>}
              </div>
            </div>
          </div>

          {/* Teacher Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Personal & Professional Info</h3>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs font-semibold mb-1">Teacher ID</span> 
                  {isEditing ? <input className={inputCls} value={formData.teacher_id || ''} onChange={(e) => handleChange('teacher_id', e.target.value)} /> : <span className="font-medium">{user.teacher_id || '-'}</span>}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs font-semibold mb-1">Date of Birth</span> 
                  {isEditing ? <input type="date" className={inputCls} value={formData.dob || ''} onChange={(e) => handleChange('dob', e.target.value)} /> : <span className="font-medium">{user.dob || '-'}</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs font-semibold mb-1">Gender</span> 
                  {isEditing ? (
                    <select className={selectCls} value={formData.gender || ''} onChange={(e) => handleChange('gender', e.target.value)}>
                      <option value="">Select Gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Prefer not to say</option>
                    </select>
                  ) : <span className="font-medium">{user.gender || '-'}</span>}
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs font-semibold mb-1">Years of Service</span> 
                  {isEditing ? <input type="number" className={inputCls} value={formData.years_of_service || ''} onChange={(e) => handleChange('years_of_service', e.target.value)} /> : <span className="font-medium">{user.years_of_service ?? '-'}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Current School */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 md:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Current School & Teaching Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold mb-1">Province</span>
                {isEditing ? (
                  <select className={selectCls} value={formData.province || ''} onChange={(e) => { handleChange('province', e.target.value); handleChange('district', ''); }}>
                    <option value="">Select Province</option>
                    {PROVINCES.map(p => <option key={p}>{p}</option>)}
                  </select>
                ) : <span className="font-medium">{user.province || '-'}</span>}
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold mb-1">District</span>
                {isEditing ? (
                  <select className={selectCls} value={formData.district || ''} onChange={(e) => handleChange('district', e.target.value)} disabled={!formData.province}>
                    <option value="">Select District</option>
                    {currentDistricts.map(d => <option key={d}>{d}</option>)}
                  </select>
                ) : <span className="font-medium">{user.district || '-'}</span>}
              </div>

              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold mb-1">Current School</span> 
                {isEditing ? (
                  <SchoolDropdown province={formData.province} district={formData.district} value={formData.current_school_name || ''} onChange={(e) => handleChange('current_school_name', e.target.value)} className={selectCls} />
                ) : <span className="font-medium text-blue-700">{user.current_school_name || '-'}</span>}
              </div>

              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold mb-1">School Type</span> 
                {isEditing ? (
                  <select className={selectCls} value={formData.school_type || ''} onChange={(e) => handleChange('school_type', e.target.value)}>
                    <option value="">Select Type</option>
                    <option>National</option>
                    <option>Provincial</option>
                    <option>Pirivena</option>
                    <option>International</option>
                  </select>
                ) : <span className="font-medium">{user.school_type || '-'}</span>}
              </div>

              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold mb-1">Position</span> 
                {isEditing ? (
                  <select className={selectCls} value={formData.position || ''} onChange={(e) => handleChange('position', e.target.value)}>
                    <option value="">Select Position</option>
                    {POSITIONS.map(p => <option key={p}>{p}</option>)}
                  </select>
                ) : <span className="font-medium">{user.position || '-'}</span>}
              </div>

              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold mb-1">Teaching Level</span> 
                {isEditing ? (
                  <select className={selectCls} value={formData.teaching_level || ''} onChange={(e) => { handleChange('teaching_level', e.target.value); handleChange('teacher_grade', ''); handleChange('subject', ''); }}>
                    <option value="">Select Level</option>
                    <option value="Primary">Primary (Grade 1-5)</option>
                    <option value="Junior Secondary">Junior Secondary (Grade 6-9)</option>
                    <option value="O/L">O/L (Grade 10-11)</option>
                    <option value="A/L">A/L (Grade 12-13)</option>
                  </select>
                ) : <span className="font-medium">{user.teaching_level || '-'}</span>}
              </div>

              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold mb-1">Teaching Grade</span> 
                {isEditing ? (
                  <GradeDropdown className={selectCls} value={formData.teacher_grade || ''} onChange={(e) => handleChange('teacher_grade', e.target.value)} grades={filteredGrades} placeholder="Select Grade" />
                ) : <span className="font-medium">{user.teacher_grade || '-'}</span>}
              </div>

              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold mb-1">Teaching Subject</span> 
                {isEditing ? (
                  <SubjectDropdown className={selectCls} value={formData.subject || ''} onChange={(e) => handleChange('subject', e.target.value)} subjects={filteredSubjects} placeholder="Select Subject" />
                ) : <span className="font-medium">{user.subject || '-'}</span>}
              </div>

            </div>
          </div>

          {/* Transfer Preferences */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 md:col-span-2">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Transfer Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
              
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold mb-1">Preferred Province</span> 
                {isEditing ? (
                  <select className={selectCls} value={formData.pref_province || ''} onChange={(e) => { handleChange('pref_province', e.target.value); handleChange('pref_district', ''); }}>
                    <option value="">Any Province</option>
                    {PROVINCES.map(p => <option key={p}>{p}</option>)}
                  </select>
                ) : <span className="font-medium">{user.pref_province || 'Any'}</span>}
              </div>

              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold mb-1">Preferred District</span> 
                {isEditing ? (
                  <select className={selectCls} value={formData.pref_district || ''} onChange={(e) => handleChange('pref_district', e.target.value)} disabled={!formData.pref_province}>
                    <option value="">Any District</option>
                    {prefDistricts.map(d => <option key={d}>{d}</option>)}
                  </select>
                ) : <span className="font-medium">{user.pref_district || 'Any'}</span>}
              </div>

              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold mb-1">Preferred School</span> 
                {isEditing ? (
                  <SchoolDropdown province={formData.pref_province} district={formData.pref_district} value={formData.pref_school || ''} onChange={(e) => handleChange('pref_school', e.target.value)} className={selectCls} />
                ) : <span className="font-medium text-blue-700">{user.pref_school || 'Any'}</span>}
              </div>

              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-semibold mb-1">Preferred Subject</span> 
                {isEditing ? (
                  <SubjectDropdown className={selectCls} value={formData.pref_subject || ''} onChange={(e) => handleChange('pref_subject', e.target.value)} subjects={filteredSubjects} placeholder="Same as current subject" />
                ) : <span className="font-medium">{user.pref_subject || 'Same as current'}</span>}
              </div>

            </div>
            
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs font-semibold mb-1">Reason for Transfer</span>
              {isEditing ? (
                <textarea className={inputCls + ' resize-none'} rows={3} value={formData.transfer_reason || ''} onChange={(e) => handleChange('transfer_reason', e.target.value)} />
              ) : (
                user.transfer_reason ? <p className="text-gray-700 bg-gray-50 p-3 rounded-lg border text-sm">{user.transfer_reason}</p> : <span className="font-medium">-</span>
              )}
            </div>
            
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Profile;
