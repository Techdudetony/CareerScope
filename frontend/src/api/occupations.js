import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  timeout: 10000,
});

export async function getOccupations({ search = '', limit = 25, offset = 0 } = {}) {
  const response = await api.get('/api/v1/occupations', {
    params: { search, limit, offset },
  });

  return response.data;
}

export async function getOccupation(code) {
  const response = await api.get(`/api/v1/occupations/${encodeURIComponent(code)}`);

  return response.data;
}

export async function getTopPayingOccupations(limit = 10, year = 2025) {
  const response = await api.get('api/v1/occupations/top-paying', {
    params: { limit, year },
  });

  return response.data;
}

export async function checkApiHealth() {
  const response = await api.get('/health');

  return response.data;
}
