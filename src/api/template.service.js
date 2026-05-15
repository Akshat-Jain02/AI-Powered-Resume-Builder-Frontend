import apiClient from './apiClient';

export const templateService = {
  getAll: () => 
    apiClient.get('/api/templates').then(res => res.data),
    
  getById: (id) => 
    apiClient.get(`/api/templates/${id}`).then(res => res.data),
    
  getByCategory: (cat) => 
    apiClient.get(`/api/templates/category/${encodeURIComponent(cat)}`).then(res => res.data),
    
  getTop: () => 
    apiClient.get('/api/templates/top').then(res => res.data),
    
  incrementUsage: (id) => 
    apiClient.post(`/api/templates/${id}/usage`).then(res => res.data),
    
  getImageUrl: (id) => `${apiClient.defaults.baseURL}/api/templates/${id}/image`,
    
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/api/templates/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => res.data);
  },
};
