import { useEffect, useState } from 'react';
import { getSchools } from '../Controller/SchoolController';

function SchoolDropdown({ value, onChange, province, district, className }) {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    getSchools().then(setSchools);
  }, []);

  const isDistrictSelected = district && district !== 'All Districts';
  const isProvinceSelected = province && province !== 'All Provinces';

  const filteredSchools = schools.filter((s) => {
    if (isDistrictSelected) return s.district === district;
    if (isProvinceSelected) return s.province === province;
    return true;
  });

  return (
    <select value={value} onChange={onChange}
      className={className || "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"}>
      <option value="">
        {isDistrictSelected ? "Select a School" : isProvinceSelected ? "Select a School" : "All Schools / Select Province or District"}
      </option>
      {filteredSchools.map((s) => (
        <option key={s.id} value={s.name}>{s.name}</option>
      ))}
      <option value="Other">Other / Not Listed</option>
    </select>
  );
}

export default SchoolDropdown;

