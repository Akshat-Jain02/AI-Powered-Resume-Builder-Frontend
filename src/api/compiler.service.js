import apiClient from './apiClient';

export const compilerService = {
  compile: (code) => 
    apiClient.post('/api/compiler/compile', { code }, { responseType: 'blob' })
      .then(res => res.data),
};
