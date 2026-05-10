import apiClient from './apiClient';

export const authService = {
  register: (data) => apiClient.post('/api/auth/register', data).then(res => res.data),
  
  login: (data) => apiClient.post('/api/auth/signin', data).then(res => res.data),
  
  forgotPassword: (email) => apiClient.post('/api/auth/forgot-password', { email }).then(res => res.data),
  
  resetPassword: (token, password) => 
    apiClient.post(`/api/auth/reset-password?token=${encodeURIComponent(token)}`, { password }).then(res => res.data),
    
  googleLogin: () => { 
    window.location.href = `${apiClient.defaults.baseURL}/oauth2/authorization/google`; 
  },
  
  githubLogin: () => { 
    window.location.href = `${apiClient.defaults.baseURL}/oauth2/authorization/github`; 
  },
};
