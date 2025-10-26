import { useState, useEffect } from 'react';
import reservationService from '../services/reservationService';
import { Calendar, Car, MapPin, CreditCard, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const MyReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await reservationService.getReservations();
      setReservations(data.data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des réservations');
      setLoading(false);
    }
  };

  const handleCancelReservation = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) {
      return;
    }

    try {
      await reservationService.cancelReservation(id);
      toast.success('Réservation annulée avec succès');
      loadReservations();
    } catch (err) {
      toast.error('Erreur lors de l\'annulation de la réservation');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmée';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulée';
      case 'completed':
        return 'Terminée';
      default:
        return status;
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    if (filter === 'all') return true;
    return reservation.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mes Réservations</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          En attente
        </button>
        <button
          onClick={() => setFilter('confirmed')}
          className={`px-4 py-2 rounded-lg ${filter === 'confirmed' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Confirmées
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Terminées
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 rounded-lg ${filter === 'cancelled' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Annulées
        </button>
      </div>

      {/* Liste des réservations */}
      {filteredReservations.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Aucune réservation trouvée</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map(reservation => (
            <div key={reservation._id} className="card p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">
                      {reservation.carId?.name || 'Voiture non disponible'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                      {getStatusLabel(reservation.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {format(new Date(reservation.startDate), 'dd/MM/yyyy')} - {format(new Date(reservation.endDate), 'dd/MM/yyyy')}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{reservation.pickupLocation}</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <CreditCard className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-primary-600">{reservation.totalPrice} TND</span>
                    </div>

                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Créée le {format(new Date(reservation.createdAt), 'dd/MM/yyyy')}</span>
                    </div>
                  </div>

                  {reservation.paymentId && (
                    <div className="mt-4 text-sm text-gray-600">
                      Paiement ID: {reservation.paymentId}
                    </div>
                  )}
                </div>

                {reservation.status === 'pending' && (
                  <div className="mt-4 md:mt-0 md:ml-4">
                    <button
                      onClick={() => handleCancelReservation(reservation._id)}
                      className="btn-secondary text-red-600 hover:bg-red-50"
                    >
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservationsPage;
