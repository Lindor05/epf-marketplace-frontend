import api from './api';

export const getMyProducts  = (params) => api.get('/products/my-products', { params });
export const getProduct     = (id)     => api.get(`/products/${id}`);
export const createProduct  = (fd)     => api.post('/products', fd, {
headers: { 'Content-Type': 'multipart/form-data' },
});
// Pour la mise a jour : Laravel attend _method=PUT dans le FormData
export const updateProduct  = (id, fd) => api.post(`/products/${id}`, fd, {
headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteProduct  = (id)     => api.delete(`/products/${id}`);
export const getSellerOrders = ()      => api.get('/seller/orders');
export const getDashboard    = ()      => api.get('/seller/dashboard');
export const getStatistics   = ()      => api.get('/seller/statistics');
