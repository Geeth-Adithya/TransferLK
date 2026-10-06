// VacancyModel.js - Defines the structure of a Vacancy

const VacancyModel = {
  id: null,
  school_id: null,
  subject: '',
  grade: '',
  description: '',
  postedBy: null, // user_id
  postedAt: null,
  status: 'open', // 'open' | 'closed'
};

export default VacancyModel;

