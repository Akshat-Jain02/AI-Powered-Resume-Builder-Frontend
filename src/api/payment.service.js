import apiClient from './apiClient';

export const paymentService = {
  getPlans: () => 
    apiClient.get('/api/payment/plans').then(res => res.data),

  createOrder: (planType) => 
    apiClient.post('/api/payment/create-order', { planType }).then(res => res.data),

  verifyPayment: (data) => 
    apiClient.post('/api/payment/verify', data).then(res => res.data),

  getCredits: () => 
    apiClient.get('/api/payment/credits').then(res => res.data),

  checkCredits: (required = 1) => 
    apiClient.get(`/api/payment/credits/check?required=${required}`).then(res => res.data),

  getPaymentHistory: () => 
    apiClient.get('/api/payment/history').then(res => res.data),

  getTransactionHistory: () => 
    apiClient.get('/api/payment/transactions').then(res => res.data),
};
