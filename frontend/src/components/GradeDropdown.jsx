import React from 'react';

function GradeDropdown({ value, onChange, grades, className, name, required, placeholder = "Select Grade" }) {
  // We want to preserve the array order given by the backend (which is ordered by ID).
  // So we collect categories in order of appearance.
  const categories = [];
  const grouped = grades.reduce((acc, grade) => {
    const cat = grade.category || 'General';
    if (!acc[cat]) {
      acc[cat] = [];
      categories.push(cat);
    }
    acc[cat].push(grade);
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
      
      {categories.map(cat => {
        // If it's general or other, maybe don't group it, but for grades it's fine to group everything or group "Other"
        if (cat === 'General' || cat === 'Other') {
          return grouped[cat].map(g => (
            <option key={g.id || g.name} value={g.name}>{g.name}</option>
          ));
        }
        return (
          <optgroup key={cat} label={cat}>
            {grouped[cat].map(g => (
              <option key={g.id || g.name} value={g.name}>{g.name}</option>
            ))}
          </optgroup>
        );
      })}
    </select>
  );
}

export default GradeDropdown;

