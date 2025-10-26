import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Car from '../models/Car.js';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connecté');
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

// Charger les données des voitures
const loadCarsData = () => {
  const carsDataPath = join(__dirname, '..', '..', '..', 'data', 'cars_seed_data.json');
  const carsData = JSON.parse(fs.readFileSync(carsDataPath, 'utf-8'));
  
  // Transformer les données pour correspondre au schéma
  return carsData.map(car => ({
    name: car.name,
    brand: car.brand,
    model: car.name.split(' ').slice(1).join(' '),
    type: car.type.toLowerCase(),
    pricePerDay: car.price_per_day,
    fuel: car.fuel.toLowerCase(),
    transmission: car.transmission.toLowerCase() === 'manuelle' ? 'manuel' : car.transmission.toLowerCase(),
    seats: car.seats,
    images: car.images || [],
    description: car.description,
    features: [
      `${car.fuel}`,
      `${car.transmission}`,
      `${car.seats} places`,
      car.type
    ],
    availability: car.available !== undefined ? car.available : true,
    location: 'Tunis, Tunisie'
  }));
};

// Seed des voitures
const seedCars = async () => {
  try {
    // Supprimer les voitures existantes
    await Car.deleteMany({});
    console.log('Anciennes voitures supprimées');

    // Charger et insérer les nouvelles voitures
    const carsData = loadCarsData();
    await Car.insertMany(carsData);
    console.log(`${carsData.length} voitures insérées avec succès`);
  } catch (error) {
    console.error('Erreur lors du seed des voitures:', error);
  }
};

// Créer un utilisateur admin par défaut
const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@chedtri9.com' });
    
    if (!adminExists) {
      await User.create({
        email: 'admin@chedtri9.com',
        password: 'admin123',
        name: 'Administrateur ChedTri9',
        role: 'admin',
        phone: '+216 12 345 678',
        address: 'Tunis, Tunisie',
        isActive: true
      });
      console.log('Compte admin créé avec succès');
      console.log('Email: admin@chedtri9.com');
      console.log('Mot de passe: admin123');
    } else {
      console.log('Compte admin existe déjà');
    }
  } catch (error) {
    console.error('Erreur lors de la création du compte admin:', error);
  }
};

// Créer un utilisateur test par défaut
const createTestUser = async () => {
  try {
    const userExists = await User.findOne({ email: 'user@chedtri9.com' });
    
    if (!userExists) {
      await User.create({
        email: 'user@chedtri9.com',
        password: 'user123',
        name: 'Utilisateur Test',
        role: 'user',
        phone: '+216 98 765 432',
        address: 'Tunis, Tunisie',
        isActive: true
      });
      console.log('Compte utilisateur test créé avec succès');
      console.log('Email: user@chedtri9.com');
      console.log('Mot de passe: user123');
    } else {
      console.log('Compte utilisateur test existe déjà');
    }
  } catch (error) {
    console.error('Erreur lors de la création du compte utilisateur test:', error);
  }
};

// Fonction principale
const seedDatabase = async () => {
  await connectDB();
  
  console.log('\n=== Début du seed de la base de données ===\n');
  
  await seedCars();
  await createAdminUser();
  await createTestUser();
  
  console.log('\n=== Seed terminé avec succès ===\n');
  
  process.exit(0);
};

// Exécuter le seed
seedDatabase();
