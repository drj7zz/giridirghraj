export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../lib/mongodb';
import { getAdminSession } from '../../../../lib/auth';
import { blogPosts as seedBlogs } from '../../../../lib/data';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const db = await getDatabase();
    if (!db) {
      const found = seedBlogs.find(b => b.id === id);
      return found ? NextResponse.json(found) : NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    let query = { id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ id }, { _id: new ObjectId(id) }] };
    }

    const blog = await db.collection('blogs').findOne(query);
    if (!blog) {
      const found = seedBlogs.find(b => b.id === id);
      return found ? NextResponse.json(found) : NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ ...blog, id: blog.id || blog._id.toString() });
  } catch (_error) {
    const found = seedBlogs.find(b => b.id === id);
    return found ? NextResponse.json(found) : NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'MongoDB Atlas is not configured.' }, { status: 503 });
    }

    const updateDoc = {
      ...body,
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map(t => t.trim()) : ['General']),
      updatedAt: new Date()
    };
    delete updateDoc._id;

    let query = { id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ id }, { _id: new ObjectId(id) }] };
    }

    const result = await db.collection('blogs').updateOne(query, { $set: updateDoc });
    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ error: 'MongoDB Atlas is not configured.' }, { status: 503 });
    }

    let query = { id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ id }, { _id: new ObjectId(id) }] };
    }

    const result = await db.collection('blogs').deleteOne(query);
    return NextResponse.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to delete blog' }, { status: 500 });
  }
}
