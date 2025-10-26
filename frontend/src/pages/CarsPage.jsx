import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import carService from '../services/carService';
import { Search, Filter, Fuel, Users, Car as CarIcon } from 'lucide-react';

const CarsPage = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    fuel: '',
    transmission: ''
  });

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const data = await carService.getCars();
      setCars(data.data);
      setFilteredCars(data.data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des voitures');
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
    applyFilters({ ...filters, [name]: value });
  };

  const applyFilters = (currentFilters) => {
    let result = cars;

    if (currentFilters.search) {
      result = result.filter(car =>
        car.name.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
        car.brand.toLowerCase().includes(currentFilters.search.toLowerCase())
      );
    }

    if (currentFilters.type) {
      result = result.filter(car => car.type === currentFilters.type);
    }

    if (currentFilters.brand) {
      result = result.filter(car => car.brand === currentFilters.brand);
    }

    if (currentFilters.fuel) {
      result = result.filter(car => car.fuel === currentFilters.fuel);
    }

    if (currentFilters.transmission) {
      result = result.filter(car => car.transmission === currentFilters.transmission);
    }

    if (currentFilters.minPrice) {
      result = result.filter(car => car.pricePerDay >= parseFloat(currentFilters.minPrice));
    }

    if (currentFilters.maxPrice) {
      result = result.filter(car => car.pricePerDay <= parseFloat(currentFilters.maxPrice));
    }

    setFilteredCars(result);
  };

  const resetFilters = () => {
    const emptyFilters = {
      search: '',
      type: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      fuel: '',
      transmission: ''
    };
    setFilters(emptyFilters);
    setFilteredCars(cars);
  };

  const uniqueBrands = [...new Set(cars.map(car => car.brand))];
  const uniqueTypes = [...new Set(cars.map(car => car.type))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Catalogue de Voitures</h1>
        <p className="text-gray-600">Trouvez la voiture parfaite pour vos besoins</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Filtres */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtres
          </h2>
          <button onClick={resetFilters} className="text-sm text-primary-600 hover:text-primary-700">
            Réinitialiser
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Nom ou marque..."
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Tous les types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marque
            </label>
            <select
              name="brand"
              value={filters.brand}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Toutes les marques</option>
              {uniqueBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carburant
            </label>
            <select
              name="fuel"
              value={filters.fuel}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Tous</option>
              <option value="essence">Essence</option>
              <option value="diesel">Diesel</option>
              <option value="electrique">Électrique</option>
              <option value="hybride">Hybride</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transmission
            </label>
            <select
              name="transmission"
              value={filters.transmission}
              onChange={handleFilterChange}
              className="input-field"
            >
              <option value="">Toutes</option>
              <option value="manuel">Manuelle</option>
              <option value="automatique">Automatique</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix min (TND/jour)
            </label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="0"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix max (TND/jour)
            </label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="1000"
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="mb-4">
        <p className="text-gray-600">
          {filteredCars.length} voiture{filteredCars.length > 1 ? 's' : ''} trouvée{filteredCars.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Liste des voitures */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map(car => (
          <Link key={car._id} to={`/cars/${car._id}`} className="card overflow-hidden">
            <div className="relative h-48 bg-gray-200">
              {car.images && car.images[0] ? (
                <img
                  src={car.images[0]}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <CarIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
              {!car.availability && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="text-white font-semibold">Non disponible</span>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{car.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{car.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Fuel className="w-4 h-4 mr-1" />
                  {car.fuel}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {car.seats} places
                </div>
                <div>
                  {car.transmission}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-primary-600">{car.pricePerDay} TND</span>
                  <span className="text-gray-600 text-sm">/jour</span>
                </div>
                <button className="btn-primary text-sm">
                  Voir détails
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center py-12">
          <CarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Aucune voiture trouvée avec ces critères</p>
          <button onClick={resetFilters} className="mt-4 text-primary-600 hover:text-primary-700 font-medium">
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};

export default CarsPage;
