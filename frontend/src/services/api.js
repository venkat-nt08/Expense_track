import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getExpenses = (skip = 0, limit = 100) => api.get(`/expenses/?skip=${skip}&limit=${limit}`);
export const createExpense = (expense) => api.post('/expenses/', expense);
export const updateExpense = (id, expense) => api.put(`/expenses/${id}`, expense);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
export const getCategories = () => api.get('/expenses/categories/');
export const createCategory = (category) => api.post('/expenses/categories/', category);
export const getMonthlyReport = (year, month) => api.get(`/reports/monthly/${year}/${month}`);
export const getProfile = () => api.get('/profile/');
export const updateProfile = (data) => api.put('/profile/', data);

export default api;
