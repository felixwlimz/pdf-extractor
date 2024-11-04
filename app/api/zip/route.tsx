import { zipUploadsDirectory } from '@/lib/zipHelper';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { uploadsDir } = await req.json();

  if (!uploadsDir) {
    return NextResponse.json({ error: 'uploadsDir is required' }, { status: 400 });
  }

  try {
    const zipPath = await zipUploadsDirectory(uploadsDir);
    return NextResponse.json({ message: 'Zip created successfully', zipPath });
  } catch (error) {
    console.error('Zipping error:', error);
    return NextResponse.json({ error: 'Failed to create zip file' }, { status: 500 });
  }
}