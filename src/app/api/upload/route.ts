import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { uploadAsset } from '@/lib/storage';
import { prisma } from '@/lib/db';

const TYPE_BY_MIME = (mime: string): 'image' | 'video' | 'pdf' | 'other' => {
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime === 'application/pdf') return 'pdf';
  return 'other';
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error: 'Vercel Blob chưa được cấu hình. Vào https://vercel.com/<team>/z-alpha-staging/stores → Connect blob store → pull env vars.',
      },
      { status: 503 }
    );
  }

  const formData = await req.formData();
  const file = formData.get('file');
  const prefix = String(formData.get('prefix') ?? 'misc');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file field' }, { status: 400 });
  }

  try {
    const blob = await uploadAsset(file, `${prefix}/${file.name}`);
    const asset = await prisma.asset.create({
      data: {
        url: blob.url,
        type: TYPE_BY_MIME(file.type),
        filename: file.name,
        sizeBytes: file.size,
      },
    });
    return NextResponse.json({ url: blob.url, id: asset.id });
  } catch (err) {
    console.error('Upload error', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
