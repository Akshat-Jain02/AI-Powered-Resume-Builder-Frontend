import apiClient from './apiClient';

export const adminService = {
  // Template Management
  getAllTemplates: () => apiClient.get('/api/templates/admin').then(res => res.data),
  getTemplateById: (id) => apiClient.get(`/api/templates/admin/${id}`).then(res => res.data),
  toggleTemplate: (id) => apiClient.patch(`/api/templates/admin/${id}/toggle`).then(res => res.data),

  // User Management
  getAllUsers: () => apiClient.get('/api/admin/users').then(res => res.data),
  getUserStats: () => apiClient.get('/api/admin/users/stats').then(res => res.data),
  promoteUser: (id) => apiClient.post(`/api/admin/users/${id}/promote`).then(res => res.data),
  demoteUser: (id) => apiClient.post(`/api/admin/users/${id}/demote`).then(res => res.data),
  banUser: (id) => apiClient.post(`/api/admin/users/${id}/ban`).then(res => res.data),
  unbanUser: (id) => apiClient.post(`/api/admin/users/${id}/unban`).then(res => res.data),
  deleteUser: (id) => apiClient.delete(`/api/admin/users/${id}`).then(res => res.data),

  // Resume Management
  getAllResumes: () => apiClient.get('/api/resume/admin/all').then(res => res.data),
  getResumesByUser: (username) => 
    apiClient.get(`/api/resume/admin/user/${encodeURIComponent(username)}`).then(res => res.data),
  deleteResume: (id) => apiClient.delete(`/api/resume/admin/${id}`).then(res => res.data),
  getResumeStats: () => apiClient.get('/api/resume/admin/stats').then(res => res.data),

  // Payment Management
  getAllPayments: () => apiClient.get('/api/payment/admin/payments').then(res => res.data),
  getPaymentsByUser: (username) => 
    apiClient.get(`/api/payment/admin/payments/user/${encodeURIComponent(username)}`).then(res => res.data),
  getAllCredits: () => apiClient.get('/api/payment/admin/credits').then(res => res.data),
  adjustCredits: (username, amount, reason) => 
    apiClient.post(`/api/payment/admin/credits/${encodeURIComponent(username)}/adjust`, { amount, reason }).then(res => res.data),
  getPaymentStats: () => apiClient.get('/api/payment/admin/stats').then(res => res.data),
};
