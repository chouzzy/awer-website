import { MongoClient } from 'mongodb';

if (!process.env.HELPAWER_DATABASE_URL) {
  throw new Error('Por favor, defina a HELPAWER_DATABASE_URL no .env');
}

const uri = process.env.HELPAWER_DATABASE_URL;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Preserva o client durante os reloads do Next.js (HMR)
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Em produção, é seguro instanciar direto
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Exportamos a promise para usar nas Server Actions
export default clientPromise;