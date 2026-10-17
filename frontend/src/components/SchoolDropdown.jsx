import { useEffect, useState } from 'react';
import { getSchools } from '../Controller/SchoolController';

function SchoolDropdown({ name, value, onChange, province, district, className }) {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    getSchools()
      .then(res => setSchools(Array.isArray(res) ? res : []))
      .catch(err => {
        console.error("Failed to load schools", err);
        setSchools([]);
      });
  }, []);

  const isDistrictSelected = district && district !== 'All Districts';
  const isProvinceSelected = province && province !== 'All Provinces';

  const filteredSchools = (Array.isArray(schools) ? schools : [])
    .filter((s) => {
      if (isDistrictSelected) return s.district === district;
      if (isProvinceSelected) return s.province === province;
      return true;
    })
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  return (
    <select name={name} value={value} onChange={onChange}
      className={className || "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"}>
      <option value="">
        {isDistrictSelected ? "Select a School" : isProvinceSelected ? "Select a School" : "All Schools / Select Province or District"}
      </option>
      {value && value !== 'Other' && !filteredSchools.some(s => s.name === value) && (
        <option value={value}>{value}</option>
      )}
      {filteredSchools.map((s) => (
        <option key={s.id} value={s.name}>
          {s.name}{s.city ? ` (${s.city})` : ''}
        </option>
      ))}
      <option value="Other">Other / Not Listed</option>
    </select>
  );
}

export default SchoolDropdown;

