import apiClient from './apiClient';

export const jobService = {
  uploadResume: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return apiClient.post('/api/job/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },
};
