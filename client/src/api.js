import axios from 'axios';
import { demoCategories, demoProducts, demoSales, demoDashboard } from './demoData';

const api = axios.create({ baseURL: '/api' });

// Wrap API calls: if backend is unreachable, return demo data instead
const withDemo = (apiFn, demoValue) => async (...args) => {
  try {
    return await apiFn(...args);
  } catch {
    return { data: typeof demoValue === 'function' ? demoValue(...args) : demoValue };
  }
};

export const getProducts = withDemo(
  (params) => api.get('/products', { params }),
  (params) => {
    let list = demoProducts;
    if (params?.search) list = list.filter(p => p.name.toLowerCase().includes(params.search.toLowerCase()));
    if (params?.category) list = list.filter(p => p.category_id === Number(params.category));
    if (params?.low_stock) list = list.filter(p => p.stock <= p.low_stock_threshold);
    return list;
  }
);
export const getProduct = withDemo((id) => api.get(`/products/${id}`), (id) => demoProducts.find(p => p.id === Number(id)));
export const createProduct = withDemo((data) => api.post('/products', data), (data) => ({ ...data, id: Date.now() }));
export const updateProduct = withDemo((id, data) => api.put(`/products/${id}`, data), (id, data) => data);
export const deleteProduct = withDemo((id) => api.delete(`/products/${id}`), (_id) => null);

export const getCategories = withDemo(() => api.get('/categories'), demoCategories);
export const createCategory = withDemo((data) => api.post('/categories', data), (data) => ({ ...data, id: Date.now() }));
export const deleteCategory = withDemo((id) => api.delete(`/categories/${id}`), () => null);

export const getSales = withDemo(() => api.get('/sales'), demoSales);
export const createSale = withDemo((data) => api.post('/sales', data), (data) => ({ ...data, id: Date.now() }));

export const getDashboard = withDemo(() => api.get('/dashboard'), demoDashboard);
