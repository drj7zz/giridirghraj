import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000
};

// Derive the database name from the URI path so the URI is the single
// source of truth. Falls back to 'portfolio' if absent.
function dbNameFromUri(u) {
  try {
    const afterSlash = u.split('@')[1]?.split('?')[0]?.split('/')[1];
    return afterSlash || 'portfolio';
  } catch (_err) {
    return 'portfolio';
  }
}

let client;
let clientPromise;

if (uri && !uri.includes('<username>') && !uri.includes('<password>')) {
  try {
    if (process.env.NODE_ENV === 'development') {
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
      }
      clientPromise = global._mongoClientPromise;
    } else {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
  } catch (err) {
    console.warn('MongoDB client initialization failed:', err.message);
    clientPromise = null;
  }
} else {
  clientPromise = null;
}

/**
 * Returns the connected database. The DB name comes from MONGODB_URI
 * (e.g. /portfolio in the URI), so one env var controls everything.
 */
export async function getDatabase() {
  if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
    return null;
  }
  try {
    if (!clientPromise) {
      if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClientPromise) {
          client = new MongoClient(uri, options);
          global._mongoClientPromise = client.connect();
        }
        clientPromise = global._mongoClientPromise;
      } else {
        client = new MongoClient(uri, options);
        clientPromise = client.connect();
      }
    }
    const connectedClient = await clientPromise;
    return connectedClient.db(dbNameFromUri(uri));
  } catch (err) {
    console.warn('MongoDB connection unavailable (falling back to seed data):', err.message);
    clientPromise = null;
    if (global._mongoClientPromise) {
      global._mongoClientPromise = null;
    }
    return null;
  }
}

export default clientPromise;
