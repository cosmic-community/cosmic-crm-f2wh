import { cosmic } from '@/lib/cosmic';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, metadata } = body;
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (metadata !== undefined) updateData.metadata = metadata;
    const response = await cosmic.objects.updateOne(id, updateData);
    return NextResponse.json({ success: true, object: response.object });
  } catch (error: unknown) {
    console.error('Error updating deal:', error);
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await cosmic.objects.deleteOne(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Error deleting deal:', error);
    return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 });
  }
}
