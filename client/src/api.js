import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export const getSales = (params) => api.get('/sales', { params });
export const createSale = (data) => api.post('/sales', data);

export const getDashboard = () => api.get('/dashboard');
