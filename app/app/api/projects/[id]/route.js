export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDatabase } from '../../../../lib/mongodb';
import { getAdminSession } from '../../../../lib/auth';
import { ObjectId } from 'mongodb';

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
      order: body.order ? Number(body.order) : 0,
      updatedAt: new Date()
    };
    delete updateDoc._id;

    let query = { name: id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ name: id }, { _id: new ObjectId(id) }] };
    }

    const result = await db.collection('projects').updateOne(query, { $set: updateDoc });
    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to update project' }, { status: 500 });
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

    let query = { name: id };
    if (ObjectId.isValid(id)) {
      query = { $or: [{ name: id }, { _id: new ObjectId(id) }] };
    }

    const result = await db.collection('projects').deleteOne(query);
    return NextResponse.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Failed to delete project' }, { status: 500 });
  }
}
