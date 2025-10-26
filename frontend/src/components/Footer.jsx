import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">ChedTri9</h3>
            <p className="text-sm">
              Votre partenaire de confiance pour la location de voitures en Tunisie.
              Des véhicules modernes à des prix compétitifs.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Liens Rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/cars" className="hover:text-white transition-colors">
                  Catalogue de voitures
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Mon compte
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Créer un compte
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                +216 12 345 678
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                contact@chedtri9.com
              </li>
              <li className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Tunis, Tunisie
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>2025 ChedTri9. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
