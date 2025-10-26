import axiosInstance from './axios';

// Service de gestion des voitures
const carService = {
  // Obtenir toutes les voitures avec filtres
  getCars: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axiosInstance.get(`/cars?${params}`);
    return response.data;
  },

  // Obtenir une voiture par ID
  getCarById: async (id) => {
    const response = await axiosInstance.get(`/cars/${id}`);
    return response.data;
  },

  // Créer une voiture (admin)
  createCar: async (carData) => {
    const response = await axiosInstance.post('/cars', carData);
    return response.data;
  },

  // Mettre à jour une voiture (admin)
  updateCar: async (id, carData) => {
    const response = await axiosInstance.put(`/cars/${id}`, carData);
    return response.data;
  },

  // Supprimer une voiture (admin)
  deleteCar: async (id) => {
    const response = await axiosInstance.delete(`/cars/${id}`);
    return response.data;
  },

  // Obtenir les types de voitures
  getCarTypes: async () => {
    const response = await axiosInstance.get('/cars/types');
    return response.data;
  },

  // Obtenir les marques de voitures
  getCarBrands: async () => {
    const response = await axiosInstance.get('/cars/brands');
    return response.data;
  }
};

export default carService;
