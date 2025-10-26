# Guide de Démarrage Rapide - ChedTri9

Ce guide vous aidera à démarrer rapidement avec l'application ChedTri9.

## Installation en 5 Minutes

### 1. Configuration MongoDB Atlas (2 minutes)

1. Allez sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créez un compte gratuit
3. Créez un cluster M0 (gratuit)
4. Créez un utilisateur de base de données (ex: `chedtri9admin`)
5. Autorisez l'accès depuis n'importe où (Network Access > Add IP Address > 0.0.0.0/0)
6. Obtenez la chaîne de connexion (Connect > Connect your application)

Votre URI ressemblera à:
```
mongodb+srv://chedtri9admin:VotreMotDePasse@cluster0.xxxxx.mongodb.net/chedtri9?retryWrites=true&w=majority
```

### 2. Configuration PayPal (2 minutes)

1. Allez sur [PayPal Developer](https://developer.paypal.com)
2. Connectez-vous avec votre compte PayPal
3. Allez dans Dashboard > My Apps & Credentials
4. Sous "Sandbox", créez une nouvelle app
5. Copiez le **Client ID** et le **Secret**

### 3. Installation du Projet (1 minute)

```bash
# Aller dans le dossier
cd chedtri9-fullstack

# Installer les dépendances backend
cd backend
npm install

# Installer les dépendances frontend
cd ../frontend
npm install
```

### 4. Configuration des Variables d'Environnement

#### Backend (`backend/.env`)

```env
MONGODB_URI=mongodb+srv://chedtri9admin:VotreMotDePasse@cluster0.xxxxx.mongodb.net/chedtri9?retryWrites=true&w=majority
PORT=3001
NODE_ENV=development
JWT_SECRET=chedtri9_secret_key_super_secure_changez_moi_en_production
JWT_EXPIRE=7d
PAYPAL_CLIENT_ID=votre_paypal_client_id_ici
PAYPAL_CLIENT_SECRET=votre_paypal_secret_ici
PAYPAL_MODE=sandbox
FRONTEND_URL=http://localhost:5173
```

#### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3001/api
VITE_PAYPAL_CLIENT_ID=votre_paypal_client_id_ici
```

### 5. Seed de la Base de Données

```bash
cd backend
npm run seed
```

Cela créera:
- 25 voitures avec données complètes
- Compte admin: `admin@chedtri9.com` / `admin123`
- Compte utilisateur: `user@chedtri9.com` / `user123`

### 6. Démarrage de l'Application

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

Le backend démarre sur http://localhost:3001

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

Le frontend démarre sur http://localhost:5173

## Test de l'Application

### 1. Page d'Accueil
Ouvrez http://localhost:5173 dans votre navigateur

### 2. Connexion Admin
- Cliquez sur "Connexion"
- Email: `admin@chedtri9.com`
- Mot de passe: `admin123`
- Accédez au panel d'administration via le menu

### 3. Connexion Utilisateur
- Déconnectez-vous
- Connectez-vous avec: `user@chedtri9.com` / `user123`
- Parcourez le catalogue de voitures
- Créez une réservation

### 4. Inscription
- Créez un nouveau compte utilisateur
- Testez le processus complet de réservation

## Troubleshooting

### Erreur de connexion MongoDB

- Vérifiez que votre IP est autorisée dans MongoDB Atlas
- Vérifiez que l'URI est correct dans `.env`
- Vérifiez que le mot de passe ne contient pas de caractères spéciaux (ou qu'ils sont encodés)

### Le frontend ne se connecte pas au backend

- Vérifiez que le backend est démarré sur le port 3001
- Vérifiez `VITE_API_URL` dans `frontend/.env`
- Ouvrez la console du navigateur pour voir les erreurs

### Erreur PayPal

- Vérifiez que les credentials PayPal sont corrects
- Assurez-vous d'être en mode `sandbox` pour le développement
- L'intégration PayPal est configurée mais nécessite une implémentation complète côté frontend

## Prochaines Étapes

1. **Personnaliser l'application**
   - Modifier les couleurs dans `tailwind.config.js`
   - Ajouter votre logo dans `frontend/public/`
   - Modifier le texte de la page d'accueil

2. **Ajouter des voitures**
   - Connectez-vous en tant qu'admin
   - Utilisez l'interface admin pour gérer les voitures

3. **Déployer en production**
   - Backend: Heroku, Railway ou Render
   - Frontend: Vercel ou Netlify
   - Configurez les variables d'environnement de production

## Commandes Utiles

```bash
# Backend
npm run dev      # Développement avec nodemon
npm start        # Production
npm run seed     # Seed base de données

# Frontend
npm run dev      # Développement
npm run build    # Build production
npm run preview  # Prévisualiser build
```

## Support

- **Documentation**: Voir README.md dans chaque dossier
- **MongoDB**: https://docs.mongodb.com/
- **PayPal**: https://developer.paypal.com/docs/
- **React**: https://react.dev/
- **Express**: https://expressjs.com/

## Ressources

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- PayPal Developer: https://developer.paypal.com
- Tailwind CSS: https://tailwindcss.com
- React Router: https://reactrouter.com

Bon développement avec ChedTri9!
