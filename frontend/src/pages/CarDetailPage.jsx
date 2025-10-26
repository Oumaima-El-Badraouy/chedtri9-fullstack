import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import carService from '../services/carService';
import { Fuel, Users, Cog, MapPin, ArrowLeft, Calendar } from 'lucide-react';

const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadCar();
  }, [id]);

  const loadCar = async () => {
    try {
      const data = await carService.getCarById(id);
      setCar(data.data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement de la voiture');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error || 'Voiture non trouvée'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="card overflow-hidden mb-4">
            <img
              src={car.images && car.images[selectedImage] ? car.images[selectedImage] : '/placeholder-car.png'}
              alt={car.name}
              className="w-full h-96 object-cover"
            />
          </div>
          {car.images && car.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {car.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`card overflow-hidden ${selectedImage === index ? 'ring-2 ring-primary-600' : ''}`}
                >
                  <img
                    src={image}
                    alt={`${car.name} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Détails */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{car.name}</h1>
          <p className="text-gray-600 mb-6">{car.description}</p>

          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600 text-sm">Prix par jour</p>
                <p className="text-4xl font-bold text-primary-600">{car.pricePerDay} TND</p>
              </div>
              <div className={`px-4 py-2 rounded-lg ${car.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {car.availability ? 'Disponible' : 'Non disponible'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <Fuel className="w-5 h-5 mr-2 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Carburant</p>
                  <p className="font-semibold">{car.fuel}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Cog className="w-5 h-5 mr-2 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Transmission</p>
                  <p className="font-semibold">{car.transmission}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Places</p>
                  <p className="font-semibold">{car.seats} personnes</p>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Localisation</p>
                  <p className="font-semibold">{car.location}</p>
                </div>
              </div>
            </div>

            {car.availability ? (
              <Link
                to={`/reservation/${car._id}`}
                className="btn-primary w-full text-center block"
              >
                <Calendar className="w-5 h-5 inline mr-2" />
                Réserver maintenant
              </Link>
            ) : (
              <button disabled className="btn-secondary w-full opacity-50 cursor-not-allowed">
                Non disponible
              </button>
            )}
          </div>

          {car.features && car.features.length > 0 && (
            <div className="card p-6">
              <h3 className="text-xl font-semibold mb-4">Caractéristiques</h3>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feature, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;
