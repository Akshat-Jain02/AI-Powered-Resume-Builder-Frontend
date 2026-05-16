import apiClient from './apiClient';

export const compilerService = {
  compile: (code, files = null) => 
    apiClient.post('/api/compiler/compile', { code, files }, { responseType: 'blob' })
      .then(res => res.data),
};
