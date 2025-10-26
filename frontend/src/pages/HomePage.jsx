import { Link } from 'react-router-dom';
import { Car, Shield, Clock, ThumbsUp } from 'lucide-react';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Louez votre voiture idéale avec ChedTri9
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Large choix de véhicules modernes, prix compétitifs et service de qualité.
              Réservez en quelques clics et partez à l'aventure.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/cars" className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200">
                Voir les voitures
              </Link>
              <Link to="/register" className="border-2 border-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-all duration-200">
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi choisir ChedTri9 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir ChedTri9?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Large choix</h3>
              <p className="text-gray-600">
                Plus de 25 véhicules disponibles de différentes catégories
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sécurité garantie</h3>
              <p className="text-gray-600">
                Tous nos véhicules sont assurés et entretenus régulièrement
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Réservation rapide</h3>
              <p className="text-gray-600">
                Réservez en quelques clics et confirmez avec PayPal
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prix compétitifs</h3>
              <p className="text-gray-600">
                Tarifs transparents et compétitifs pour tous les budgets
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à réserver votre voiture?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Parcourez notre catalogue et trouvez la voiture parfaite pour vos besoins.
            Inscription gratuite et paiement sécurisé.
          </p>
          <Link to="/cars" className="btn-primary inline-block text-lg py-3 px-10">
            Explorer le catalogue
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
