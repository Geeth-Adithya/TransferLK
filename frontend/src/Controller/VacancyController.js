import api from '../services/api';

export const getVacancies = async (filters = {}) => {
  // Strip out empty / "All" sentinel values before sending
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) =>
      v && v !== '' && v !== 'All Provinces' && v !== 'All Districts' && v !== 'All Types' && v !== 'All'
    )
  );
  const response = await api.get('/vacancies', { params });
  return response.data;
};

export const getVacancyById = async (id) => {
  const response = await api.get(`/vacancies/${id}`);
  return response.data;
};

export const postVacancy = async (vacancyData) => {
  const response = await api.post('/vacancies', vacancyData);
  return response.data;
};

export const deleteVacancy = async (id) => {
  const response = await api.delete(`/vacancies/${id}`);
  return response.data;
};

export const getMyVacancies = async () => {
  const response = await api.get('/vacancies/me');
  return response.data;
};

export const updateVacancy = async (id, data) => {
  const response = await api.put(`/vacancies/${id}`, data);
  return response.data;
};

