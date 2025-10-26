import { useState, useEffect } from 'react';
import reservationService from '../../services/reservationService';
import { Calendar, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadReservations();
    loadStats();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await reservationService.getReservations();
      setReservations(data.data);
      setLoading(false);
    } catch (err) {
      toast.error('Erreur lors du chargement des réservations');
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await reservationService.getStats();
      setStats(data.data);
    } catch (err) {
      console.error('Erreur stats:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation?')) {
      return;
    }

    try {
      await reservationService.deleteReservation(id);
      toast.success('Réservation supprimée avec succès');
      loadReservations();
      loadStats();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await reservationService.updateReservation(id, { status: newStatus });
      toast.success('Statut mis à jour avec succès');
      loadReservations();
      loadStats();
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
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

  const filteredReservations = reservations.filter(res => {
    if (filter === 'all') return true;
    return res.status === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestion des Réservations</h2>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="card p-4">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-2xl font-bold">{stats.totalReservations}</div>
          </div>
          <div className="card p-4">
            <div className="text-sm text-gray-600">En attente</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingReservations}</div>
          </div>
          <div className="card p-4">
            <div className="text-sm text-gray-600">Confirmées</div>
            <div className="text-2xl font-bold text-green-600">{stats.confirmedReservations}</div>
          </div>
          <div className="card p-4">
            <div className="text-sm text-gray-600">Annulées</div>
            <div className="text-2xl font-bold text-red-600">{stats.cancelledReservations}</div>
          </div>
          <div className="card p-4">
            <div className="text-sm text-gray-600">Revenus</div>
            <div className="text-2xl font-bold text-primary-600">{stats.totalRevenue} TND</div>
          </div>
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
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voiture</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReservations.map(reservation => (
                <tr key={reservation._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {reservation.userId?.name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {reservation.userId?.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {reservation.carId?.name || 'Voiture supprimée'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(reservation.startDate), 'dd/MM/yyyy')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(reservation.endDate), 'dd/MM/yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-primary-600">
                      {reservation.totalPrice} TND
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(reservation.status)}`}>
                      {getStatusLabel(reservation.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {reservation.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(reservation._id, 'confirmed')}
                          className="text-green-600 hover:text-green-900 mr-3"
                          title="Confirmer"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(reservation._id, 'cancelled')}
                          className="text-red-600 hover:text-red-900 mr-3"
                          title="Annuler"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {reservation.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(reservation._id, 'completed')}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Marquer comme terminée"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(reservation._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Supprimer"
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

      {filteredReservations.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Aucune réservation trouvée</p>
        </div>
      )}
    </div>
  );
};

export default AdminReservationsPage;
