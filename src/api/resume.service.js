import apiClient from './apiClient';

export const resumeService = {
  generate: (data) => 
    apiClient.post('/api/resume/generate', data, { responseType: 'blob' }).then(res => res.data),

  save: (data) => 
    apiClient.post('/api/resume/save', data).then(res => res.data),

  saveAndDownload: (data) => 
    apiClient.post('/api/resume/save-and-download', data, { responseType: 'blob' }).then(res => res.data),

  getSaved: () => 
    apiClient.get('/api/resume/saved').then(res => res.data),

  getSavedById: (id) => 
    apiClient.get(`/api/resume/saved/${id}`).then(res => res.data),

  getSavedData: (id) => 
    apiClient.get(`/api/resume/saved/${id}/data`).then(res => res.data),

  downloadSaved: (id) => 
    apiClient.get(`/api/resume/saved/${id}/download`, { responseType: 'blob' }).then(res => res.data),

  deleteSaved: (id) => 
    apiClient.delete(`/api/resume/saved/${id}`).then(res => res.data),

  getTemplates: () => 
    apiClient.get('/api/resume/templates').then(res => res.data),
};
