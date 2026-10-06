import api from '../services/api';

export const getSubjects = async () => {
  const response = await api.get('/subjects');
  return response.data;
};

export const getGrades = async () => {
  const response = await api.get('/grades');
  return response.data;
};

