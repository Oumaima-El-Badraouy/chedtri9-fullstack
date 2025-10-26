import axiosInstance from './axios';

// Service de gestion des réservations
const reservationService = {
  // Créer une réservation
  createReservation: async (reservationData) => {
    const response = await axiosInstance.post('/reservations', reservationData);
    return response.data;
  },

  // Obtenir toutes les réservations
  getReservations: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axiosInstance.get(`/reservations?${params}`);
    return response.data;
  },

  // Obtenir une réservation par ID
  getReservationById: async (id) => {
    const response = await axiosInstance.get(`/reservations/${id}`);
    return response.data;
  },

  // Mettre à jour une réservation
  updateReservation: async (id, reservationData) => {
    const response = await axiosInstance.put(`/reservations/${id}`, reservationData);
    return response.data;
  },

  // Annuler une réservation
  cancelReservation: async (id) => {
    const response = await axiosInstance.patch(`/reservations/${id}/cancel`);
    return response.data;
  },

  // Confirmer une réservation
  confirmReservation: async (id, paymentId) => {
    const response = await axiosInstance.patch(`/reservations/${id}/confirm`, { paymentId });
    return response.data;
  },

  // Supprimer une réservation (admin)
  deleteReservation: async (id) => {
    const response = await axiosInstance.delete(`/reservations/${id}`);
    return response.data;
  },

  // Obtenir les statistiques (admin)
  getStats: async () => {
    const response = await axiosInstance.get('/reservations/stats');
    return response.data;
  }
};

export default reservationService;
