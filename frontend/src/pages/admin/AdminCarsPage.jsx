import { useState, useEffect } from 'react';
import carService from '../../services/carService';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminCarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    type: 'compact',
    pricePerDay: '',
    fuel: 'essence',
    transmission: 'manuel',
    seats: '5',
    description: '',
    images: '',
    availability: true
  });

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const data = await carService.getCars();
      setCars(data.data);
      setLoading(false);
    } catch (err) {
      toast.error('Erreur lors du chargement des voitures');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const carData = {
      ...formData,
      pricePerDay: parseFloat(formData.pricePerDay),
      seats: parseInt(formData.seats),
      images: formData.images ? formData.images.split(',').map(img => img.trim()) : []
    };

    try {
      if (editingCar) {
        await carService.updateCar(editingCar._id, carData);
        toast.success('Voiture mise à jour avec succès');
      } else {
        await carService.createCar(carData);
        toast.success('Voiture créée avec succès');
      }
      
      setShowModal(false);
      setEditingCar(null);
      resetForm();
      loadCars();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'opération');
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      brand: car.brand,
      model: car.model || '',
      type: car.type,
      pricePerDay: car.pricePerDay,
      fuel: car.fuel,
      transmission: car.transmission,
      seats: car.seats,
      description: car.description || '',
      images: car.images ? car.images.join(', ') : '',
      availability: car.availability
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette voiture?')) {
      return;
    }

    try {
      await carService.deleteCar(id);
      toast.success('Voiture supprimée avec succès');
      loadCars();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      brand: '',
      model: '',
      type: 'compact',
      pricePerDay: '',
      fuel: 'essence',
      transmission: 'manuel',
      seats: '5',
      description: '',
      images: '',
      availability: true
    });
  };

  const openCreateModal = () => {
    setEditingCar(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestion des Voitures</h2>
        <button onClick={openCreateModal} className="btn-primary flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Ajouter une voiture
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marque</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix/jour</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disponibilité</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cars.map(car => (
                <tr key={car._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{car.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{car.brand}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 capitalize">{car.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-primary-600">{car.pricePerDay} TND</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${car.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {car.availability ? 'Disponible' : 'Indisponible'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(car)}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(car._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">
                  {editingCar ? 'Modifier la voiture' : 'Ajouter une voiture'}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marque</label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                      <option value="compact">Compact</option>
                      <option value="suv">SUV</option>
                      <option value="berline">Berline</option>
                      <option value="break">Break</option>
                      <option value="utilitaire">Utilitaire</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix/jour (TND)</label>
                    <input
                      type="number"
                      name="pricePerDay"
                      value={formData.pricePerDay}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Carburant</label>
                    <select name="fuel" value={formData.fuel} onChange={handleChange} className="input-field">
                      <option value="essence">Essence</option>
                      <option value="diesel">Diesel</option>
                      <option value="electrique">Électrique</option>
                      <option value="hybride">Hybride</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                    <select name="transmission" value={formData.transmission} onChange={handleChange} className="input-field">
                      <option value="manuel">Manuel</option>
                      <option value="automatique">Automatique</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sièges</label>
                    <input
                      type="number"
                      name="seats"
                      value={formData.seats}
                      onChange={handleChange}
                      required
                      min="2"
                      max="9"
                      className="input-field"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="availability"
                        checked={formData.availability}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Disponible</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="input-field"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Images (URLs séparées par des virgules)
                  </label>
                  <textarea
                    name="images"
                    value={formData.images}
                    onChange={handleChange}
                    rows="2"
                    className="input-field"
                    placeholder="https://exemple.com/image1.jpg, https://exemple.com/image2.jpg"
                  ></textarea>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingCar ? 'Mettre à jour' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCarsPage;
