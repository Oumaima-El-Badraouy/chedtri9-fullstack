import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import carService from '../services/carService';
import reservationService from '../services/reservationService';
import paymentService from '../services/paymentService';
import { Calendar, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { toast } from 'react-toastify';

const ReservationPage = () => {
  const { carId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reservationId, setReservationId] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const dayAfterTomorrow = format(addDays(new Date(), 2), 'yyyy-MM-dd');

  const [formData, setFormData] = useState({
    startDate: tomorrow,
    endDate: dayAfterTomorrow,
    pickupLocation: 'Tunis, Tunisie',
    dropoffLocation: 'Tunis, Tunisie'
  });

  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  useEffect(() => {
    loadCar();
  }, [carId]);

  const loadCar = async () => {
    try {
      const data = await carService.getCarById(carId);
      setCar(data.data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement de la voiture');
      setLoading(false);
    }
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const days = differenceInDays(new Date(formData.endDate), new Date(formData.startDate));
    return days > 0 ? days : 0;
  };

  const calculateTotal = () => {
    if (!car) return 0;
    return car.pricePerDay * calculateDays();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const createReservation = async () => {
    const days = calculateDays();
    if (days <= 0) {
      toast.error('La date de fin doit être après la date de début');
      return null;
    }

    setError('');
    setSubmitting(true);

    try {
      const reservationData = {
        carId: car._id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalPrice: calculateTotal(),
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
        customerInfo: {
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      };

      const response = await reservationService.createReservation(reservationData);
      setReservationId(response.data._id);
      toast.success('Réservation créée ! Procédez au paiement.');
      return response.data._id;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erreur lors de la création de la réservation';
      setError(errorMsg);
      toast.error(errorMsg);
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayPalCreateOrder = async () => {
    try {
      // Créer la réservation d'abord
      const newReservationId = await createReservation();
      if (!newReservationId) {
        throw new Error('Impossible de créer la réservation');
      }

      // Créer l'ordre PayPal
      const orderData = await paymentService.createOrder(
        calculateTotal(),
        'EUR',
        `Location voiture ${car.name} - ChedTri9`
      );

      return orderData.data.orderId;
    } catch (err) {
      toast.error('Erreur lors de la création de l\'ordre PayPal');
      throw err;
    }
  };

  const handlePayPalApprove = async (data) => {
    try {
      // Capturer le paiement
      const captureData = await paymentService.captureOrder(data.orderID);

      // Confirmer la réservation
      await reservationService.confirmReservation(
        reservationId,
        captureData.data.captureId
      );

      setPaymentSuccess(true);
      toast.success('Paiement réussi ! Votre réservation est confirmée.');

      // Rediriger après 2 secondes
      setTimeout(() => {
        navigate('/my-reservations');
      }, 2000);
    } catch (err) {
      toast.error('Erreur lors de la confirmation du paiement');
      console.error('PayPal approval error:', err);
    }
  };

  const handlePayPalError = (err) => {
    console.error('PayPal Error:', err);
    toast.error('Erreur PayPal. Veuillez réessayer.');
  };

  const handlePayPalCancel = () => {
    toast.warning('Paiement annulé');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">Paiement réussi !</h2>
            <p className="text-green-700">
              Votre réservation a été confirmée. Vous allez être redirigé vers vos réservations...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Réservation</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-6">Détails de la réservation</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date de début
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={tomorrow}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date de fin
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Lieu de prise en charge
                </label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Lieu de restitution
                </label>
                <input
                  type="text"
                  name="dropoffLocation"
                  value={formData.dropoffLocation}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              {/* PayPal Buttons */}
              {paypalClientId && calculateDays() > 0 ? (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Paiement</h3>
                  <PayPalScriptProvider options={{ 
                    "client-id": paypalClientId,
                    currency: "EUR"
                  }}>
                    <PayPalButtons
                      style={{ layout: "vertical" }}
                      disabled={submitting}
                      createOrder={handlePayPalCreateOrder}
                      onApprove={handlePayPalApprove}
                      onError={handlePayPalError}
                      onCancel={handlePayPalCancel}
                    />
                  </PayPalScriptProvider>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                  {!paypalClientId 
                    ? 'Configuration PayPal manquante. Veuillez configurer VITE_PAYPAL_CLIENT_ID.'
                    : 'Veuillez sélectionner des dates valides.'}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Récapitulatif */}
        <div>
          <div className="card p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Récapitulatif</h3>

            {car && (
              <div className="space-y-4">
                <div className="flex items-center">
                  <img
                    src={car.images && car.images[0] ? car.images[0] : '/placeholder-car.png'}
                    alt={car.name}
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <p className="font-semibold">{car.name}</p>
                    <p className="text-sm text-gray-600">{car.type}</p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix par jour</span>
                    <span className="font-semibold">{car.pricePerDay} TND</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre de jours</span>
                    <span className="font-semibold">{calculateDays()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {calculateTotal()} TND
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  <p className="font-medium mb-1">Information</p>
                  <p>Le paiement sera traité via PayPal de manière sécurisée.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
