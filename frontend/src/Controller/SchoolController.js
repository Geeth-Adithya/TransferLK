import api from '../services/api';

export const getSchools = async () => {
  const response = await api.get('/schools');
  return response.data;
};

export const getSchoolById = async (id) => {
  const response = await api.get(`/schools/${id}`);
  return response.data;
};

