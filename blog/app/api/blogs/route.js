import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const mongoUri = process.env.MONGODB_URI;
const clientOptions = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000
};

const fallbackPosts = [
  {
    id: 'local-fallback-01',
    title: 'Ideas become things worth sharing',
    date: '2026-10-01',
    readTime: '4 min read',
    tags: ['Journal', 'Web', 'Product'],
    excerpt: 'A quick local fallback entry so the blog remains readable while the shared MongoDB connection is unavailable.',
    content: '## Local fallback\n\nThis entry exists so the blog can still render locally during database or hosting setup.\n\n- Keep the real article in MongoDB when available.\n- Use this as a temporary placeholder while the shared collection is unreachable.\n\n```bash\nnpm run dev:blog\n```'
  },
  {
    id: 'local-fallback-02',
    title: 'Research notes for production readiness',
    date: '2026-10-06',
    readTime: '3 min read',
    tags: ['Research', 'Deployment', 'System design'],
    excerpt: 'Environment-driven URLs, independent deploys, and a clean separation between portfolio and blog concerns.',
    content: '## Production checklist\n\n- Keep the portfolio app and blog app separate.\n- Use environment variables for public URLs.\n- Keep the database connection as the shared source of truth.\n\n**Outcome:** the app remains deployable without hardcoded links.'
  }
];

function databaseNameFromUri(uri) {
  const databasePath = uri.split('@').at(-1)?.split('?')[0]?.split('/')[1];
  return databasePath || 'portfolio';
}

async function getBlogsCollection() {
  if (!mongoUri || mongoUri.includes('<username>') || mongoUri.includes('<password>')) {
    throw new Error('MONGODB_URI is not configured.');
  }

  if (!globalThis.blogMongoClientPromise) {
    const client = new MongoClient(mongoUri, clientOptions);
    globalThis.blogMongoClientPromise = client.connect().catch((error) => {
      globalThis.blogMongoClientPromise = undefined;
      throw error;
    });
  }

  const client = await globalThis.blogMongoClientPromise;
  return client.db(databaseNameFromUri(mongoUri)).collection('blogs');
}

export async function GET() {
  try {
    const collection = await getBlogsCollection();
    const documents = await collection.find({})
      .project({ _id: 1, id: 1, title: 1, date: 1, readTime: 1, tags: 1, excerpt: 1, content: 1 })
      .sort({ date: -1, createdAt: -1 })
      .toArray();
    const data = documents.map((post) => ({
      id: post.id || post._id.toString(),
      title: post.title,
      date: post.date,
      readTime: post.readTime,
      tags: post.tags,
      excerpt: post.excerpt,
      content: post.content
    }));

    return NextResponse.json(
      { source: 'mongodb', data },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.warn('MongoDB unavailable; serving local fallback blog entries.', error?.message || error);
    return NextResponse.json(
      { source: 'fallback', data: fallbackPosts },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
