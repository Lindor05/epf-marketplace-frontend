import api from './api';

export const register      = (data) => api.post('/auth/register', data);
export const getMe         = ()     => api.get('/auth/me');
export const updateProfile = (data) => api.put('/auth/profile', data, {
headers: { 'Content-Type': 'multipart/form-data' },
});
