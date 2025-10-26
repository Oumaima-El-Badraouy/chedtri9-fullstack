# ChedTri9 Frontend

Interface utilisateur React pour la plateforme de location de voitures ChedTri9.

## Technologies

- **React 18** - Bibliothèque UI
- **Vite** - Build tool et dev server
- **React Router v6** - Routing côté client
- **Tailwind CSS** - Framework CSS utility-first
- **Axios** - Client HTTP
- **Lucide React** - Icônes
- **date-fns** - Manipulation de dates
- **PayPal React SDK** - Intégration paiements

## Prérequis

- Node.js >= 16.x
- npm ou yarn

## Installation

```bash
cd frontend
npm install
```

## Configuration

1. Créer un fichier `.env` à partir de `.env.example`:

```bash
cp .env.example .env
```

2. Configurer les variables d'environnement:

```env
VITE_API_URL=http://localhost:3001/api
VITE_PAYPAL_CLIENT_ID=votre_paypal_client_id
```

## Démarrage

### Développement

```bash
npm run dev
```

L'application démarre sur `http://localhost:5173`

### Production

```bash
npm run build
npm run preview
```

## Structure du Projet

```
frontend/
├── public/
│   └── logo.png              # Logo ChedTri9
├── src/
│   ├── components/
│   │   ├── Header.jsx        # En-tête de navigation
│   │   ├── Footer.jsx        # Pied de page
│   │   └── ProtectedRoute.jsx # Routes protégées
│   ├── contexts/
│   │   └── AuthContext.jsx   # Contexte d'authentification
│   ├── pages/
│   │   ├── HomePage.jsx      # Page d'accueil
│   │   ├── LoginPage.jsx     # Connexion
│   │   ├── RegisterPage.jsx  # Inscription
│   │   ├── CarsPage.jsx      # Catalogue voitures
│   │   ├── CarDetailPage.jsx # Détails voiture
│   │   ├── ReservationPage.jsx # Réservation
│   │   ├── DashboardPage.jsx # Profil utilisateur
│   │   ├── MyReservationsPage.jsx # Mes réservations
│   │   └── AdminPage.jsx     # Panel admin
│   ├── services/
│   │   ├── axios.js          # Configuration Axios
│   │   ├── authService.js    # API authentification
│   │   ├── carService.js     # API voitures
│   │   ├── reservationService.js # API réservations
│   │   └── paymentService.js # API paiements
│   ├── config/
│   │   └── api.js            # Configuration API
│   ├── App.jsx               # Composant racine
│   ├── main.jsx              # Point d'entrée
│   └── index.css             # Styles globaux
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Pages

### Publiques

- `/` - Page d'accueil
- `/cars` - Catalogue de voitures avec filtres
- `/cars/:id` - Détails d'une voiture
- `/login` - Connexion
- `/register` - Inscription

### Protégées (Authentification requise)

- `/dashboard` - Profil utilisateur
- `/my-reservations` - Mes réservations
- `/reservation/:carId` - Processus de réservation

### Admin (Rôle admin requis)

- `/admin` - Tableau de bord administrateur
- `/admin/cars` - Gestion des voitures
- `/admin/reservations` - Gestion des réservations
- `/admin/users` - Gestion des utilisateurs

## Fonctionnalités

- Authentification JWT avec contexte React
- Catalogue de voitures avec filtres avancés
- Processus de réservation en plusieurs étapes
- Profil utilisateur éditable
- Historique des réservations
- Panel d'administration pour les admins
- Interface responsive (mobile + desktop)
- Routes protégées basées sur les rôles

## Thème et Design

L'application utilise Tailwind CSS avec un thème personnalisé :

- Couleur primaire: Bleu (#3b82f6)
- Police: Inter
- Design moderne et épuré
- Composants réutilisables (btn-primary, btn-secondary, card, input-field)

## Gestion d'État

- **AuthContext**: Gestion de l'authentification et de l'utilisateur courant
- **localStorage**: Persistance du token JWT et des données utilisateur
- **React Hooks**: useState, useEffect, useContext pour la gestion d'état locale

## API et Services

Tous les appels API passent par des services dédiés :

- **authService**: Inscription, connexion, profil
- **carService**: CRUD voitures, filtres
- **reservationService**: CRUD réservations
- **paymentService**: Intégration PayPal

Axios est configuré avec des intercepteurs pour :
- Ajouter automatiquement le token JWT aux requêtes
- Rediriger vers /login en cas d'erreur 401

## Développement

### Ajout d'une nouvelle page

1. Créer le composant dans `src/pages/`
2. Ajouter la route dans `src/App.jsx`
3. Mettre à jour la navigation dans `Header.jsx` si nécessaire

### Ajout d'un nouveau service API

1. Créer le service dans `src/services/`
2. Importer et utiliser `axiosInstance` pour les requêtes
3. Gérer les erreurs avec try/catch

## Production

Pour déployer en production:

1. Configurer les variables d'environnement de production
2. Build l'application: `npm run build`
3. Le dossier `dist/` contient les fichiers optimisés
4. Déployer sur un service d'hébergement (Vercel, Netlify, etc.)

## Support

Pour toute question, contacter l'équipe ChedTri9.

## Licence

MIT
