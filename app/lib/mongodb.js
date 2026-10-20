import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  // Vercel serverless functions are short-lived and often cold-start under load,
  // so keep connection attempts bounded — a hung connect would blow the timeout.
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  // Small pool: serverless scales by creating more instances, not bigger pools.
  maxPoolSize: 10,
  minPoolSize: 0,
  // Reuse idle sockets instead of reopening them on every invocation.
  maxIdleTimeMS: 60000,
  retryWrites: true
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

function hasPlaceholder(u) {
  return !u || u.includes('<username>') || u.includes('<password>');
}

// IMPORTANT: the client promise is cached on `globalThis` in EVERY environment,
// not just development. Vercel reuses the same Node process across invocations,
// so caching globally prevents a new connection per request — the usual cause of
// "too many connections" errors on serverless.
let client = globalThis._mongoClient || null;
let clientPromise = globalThis._mongoClientPromise || null;

if (!hasPlaceholder(uri) && !clientPromise) {
  try {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
    globalThis._mongoClient = client;
    globalThis._mongoClientPromise = clientPromise;
    // Prevent an unhandled rejection from crashing the function if the first
    // connect fails before getDatabase() awaits it.
    clientPromise.catch(() => {});
  } catch (err) {
    console.warn('MongoDB client initialization failed:', err.message);
    clientPromise = null;
    globalThis._mongoClientPromise = null;
  }
}

/**
 * Returns the connected database. The DB name comes from MONGODB_URI
 * (e.g. /portfolio in the URI), so one env var controls everything.
 */
export async function getDatabase() {
  if (hasPlaceholder(uri)) {
    return null;
  }
  try {
    if (!clientPromise) {
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
      globalThis._mongoClient = client;
      globalThis._mongoClientPromise = clientPromise;
      clientPromise.catch(() => {});
    }
    const connectedClient = await clientPromise;
    return connectedClient.db(dbNameFromUri(uri));
  } catch (err) {
    console.warn('MongoDB connection unavailable (falling back to seed data):', err.message);
    // Drop the failed promise so the next request can retry a fresh connect.
    clientPromise = null;
    globalThis._mongoClientPromise = null;
    return null;
  }
}

export default clientPromise;
