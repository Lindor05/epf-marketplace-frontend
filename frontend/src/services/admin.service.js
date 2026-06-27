import api from './api';

// Stats
export const getAdminStats    = ()          => api.get('/admin/stats');

// Utilisateurs
export const getAdminUsers    = (params)    => api.get('/admin/users', { params });
export const suspendUser      = (id)        => api.post(`/admin/users/${id}/suspend`);
export const reactivateUser   = (id)        => api.post(`/admin/users/${id}/activate`);

// Produits (moderation)
export const getAllProducts    = (params)    => api.get('/admin/products', { params });
export const forceProductStatus = (id, s)  => api.patch(`/admin/products/${id}/status`, { status: s });
export const forceDeleteProduct = (id)     => api.delete(`/admin/products/${id}/force`);

// Coupons
export const getCoupons       = ()          => api.get('/admin/coupons');
export const createCoupon     = (data)      => api.post('/admin/coupons', data);
export const updateCoupon     = (id, data)  => api.put(`/admin/coupons/${id}`, data);
export const deleteCoupon     = (id)        => api.delete(`/admin/coupons/${id}`);
