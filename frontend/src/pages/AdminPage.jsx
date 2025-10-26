import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Car, Calendar, Users, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import reservationService from '../services/reservationService';
import carService from '../services/carService';
import axiosInstance from '../services/axios';

// Import des composants admin
import AdminCarsPage from './admin/AdminCarsPage';
import AdminReservationsPage from './admin/AdminReservationsPage';
import AdminUsersPage from './admin/AdminUsersPage';

// Dashboard admin
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCars: 0,
    totalReservations: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [carsData, reservationsData, usersData] = await Promise.all([
        carService.getCars(),
        reservationService.getStats(),
        axiosInstance.get('/admin/users')
      ]);

      setStats({
        totalCars: carsData.count || 0,
        totalReservations: reservationsData.data?.totalReservations || 0,
        totalUsers: usersData.data?.count || 0,
        totalRevenue: reservationsData.data?.totalRevenue || 0
      });
      setLoading(false);
    } catch (err) {
      console.error('Erreur chargement stats:', err);
      setLoading(false);
    }
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
      <h2 className="text-2xl font-bold mb-6">Tableau de bord administrateur</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Voitures</p>
              <p className="text-3xl font-bold">{stats.totalCars}</p>
            </div>
            <Car className="w-12 h-12 text-primary-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Réservations</p>
              <p className="text-3xl font-bold">{stats.totalReservations}</p>
            </div>
            <Calendar className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Utilisateurs</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <Users className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Revenus</p>
              <p className="text-3xl font-bold">{stats.totalRevenue}</p>
              <p className="text-xs text-gray-500">TND</p>
            </div>
            <BarChart3 className="w-12 h-12 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="mt-8 card p-6">
        <h3 className="text-xl font-semibold mb-4">Bienvenue dans le panel d'administration</h3>
        <p className="text-gray-600 mb-4">
          Utilisez le menu de navigation pour gérer les voitures, les réservations et les utilisateurs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/cars" className="p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
            <Car className="w-8 h-8 text-primary-600 mb-2" />
            <h4 className="font-semibold text-primary-900">Gérer les voitures</h4>
            <p className="text-sm text-primary-700">Ajouter, modifier ou supprimer des voitures</p>
          </Link>

          <Link to="/admin/reservations" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Calendar className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-semibold text-green-900">Gérer les réservations</h4>
            <p className="text-sm text-green-700">Voir et gérer toutes les réservations</p>
          </Link>

          <Link to="/admin/users" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-semibold text-blue-900">Gérer les utilisateurs</h4>
            <p className="text-sm text-blue-700">Administrer les comptes utilisateurs</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Tableau de bord', icon: BarChart3 },
    { path: '/admin/cars', label: 'Voitures', icon: Car },
    { path: '/admin/reservations', label: 'Réservations', icon: Calendar },
    { path: '/admin/users', label: 'Utilisateurs', icon: Users }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Administration</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Menu de navigation */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <nav className="space-y-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenu */}
        <div className="lg:col-span-3">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/cars" element={<AdminCarsPage />} />
            <Route path="/reservations" element={<AdminReservationsPage />} />
            <Route path="/users" element={<AdminUsersPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
