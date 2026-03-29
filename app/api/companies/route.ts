import { cosmic } from '@/lib/cosmic';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, metadata } = body;
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    const response = await cosmic.objects.insertOne({
      type: 'companies',
      title,
      metadata: metadata || {},
    });
    return NextResponse.json({ success: true, object: response.object });
  } catch (error: unknown) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}
