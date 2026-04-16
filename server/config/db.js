import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cryptoshield';

let db = null;
let client = null;

export async function connectMongoDB() {
  if (db) return db;
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('cryptoshield');
    console.log('✅  MongoDB connected');
    return db;
  } catch (err) {
    console.warn('⚠️  MongoDB not available — running in mock mode:', err.message);
    return null;
  }
}

export function getDB() {
  return db;
}

export async function closeMongoDB() {
  if (client) await client.close();
}
