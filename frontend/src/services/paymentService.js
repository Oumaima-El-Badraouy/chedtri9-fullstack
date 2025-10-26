import axiosInstance from './axios';

// Service de gestion des paiements PayPal
const paymentService = {
  // Créer un ordre PayPal
  createOrder: async (amount, currency = 'EUR', description = 'Location de voiture ChedTri9') => {
    const response = await axiosInstance.post('/payments/create-order', {
      amount,
      currency,
      description
    });
    return response.data;
  },

  // Capturer un paiement PayPal
  captureOrder: async (orderId) => {
    const response = await axiosInstance.post('/payments/capture-order', { orderId });
    return response.data;
  },

  // Obtenir les détails d'un ordre
  getOrderDetails: async (orderId) => {
    const response = await axiosInstance.get(`/payments/order/${orderId}`);
    return response.data;
  },

  // Rembourser un paiement (admin)
  refundPayment: async (captureId, amount, currency = 'EUR', note) => {
    const response = await axiosInstance.post('/payments/refund', {
      captureId,
      amount,
      currency,
      note
    });
    return response.data;
  }
};

export default paymentService;
