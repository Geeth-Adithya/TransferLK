import React from 'react';

function SubjectDropdown({ value, onChange, subjects, className, name, required, placeholder = "Select Subject" }) {
  // Group subjects by category
  const validSubjects = Array.isArray(subjects) ? subjects : [];
  const grouped = validSubjects.reduce((acc, subject) => {
    const cat = subject.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(subject);
    return acc;
  }, {});

  return (
    <select 
      name={name} 
      value={value} 
      onChange={onChange} 
      className={className}
      required={required}
    >
      <option value="">{placeholder}</option>
      {/* Render General subjects first without optgroup if preferred, but optgroup is fine too */}
      {grouped['General'] && grouped['General'].map(s => (
        <option key={s.id || s.name} value={s.name}>{s.name}</option>
      ))}
      
      {/* Render other categories as optgroups */}
      {Object.keys(grouped).filter(cat => cat !== 'General').sort().map(cat => (
        <optgroup key={cat} label={cat}>
          {grouped[cat].map(s => (
            <option key={s.id || s.name} value={s.name}>{s.name}</option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

export default SubjectDropdown;
