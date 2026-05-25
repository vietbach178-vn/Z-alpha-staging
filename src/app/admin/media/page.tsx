import { prisma } from '@/lib/db';
import MediaGallery from '@/components/admin/MediaGallery';

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  const assets = await prisma.asset.findMany({ orderBy: { uploadedAt: 'desc' } });

  return (
    <div>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Thư viện</h1>
        <p style={{ color: '#64748b', fontSize: '.9rem', marginTop: 4 }}>Upload và quản lý ảnh/video/PDF dùng trong bài.</p>
      </header>

      <MediaGallery
        assets={assets.map((a) => ({
          id: a.id,
          url: a.url,
          type: a.type,
          filename: a.filename,
          sizeBytes: a.sizeBytes,
        }))}
      />
    </div>
  );
}
