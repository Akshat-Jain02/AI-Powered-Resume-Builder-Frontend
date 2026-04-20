import apiClient from './apiClient';

export const aiService = {
  analyzeSummary: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return apiClient.post('/api/ai/summary', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },
  
  getAtsScore: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return apiClient.post('/api/ai/ats/score', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },
};
