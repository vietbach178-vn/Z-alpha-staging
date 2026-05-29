import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import LibraryForm from '@/components/admin/LibraryForm';

export const dynamic = 'force-dynamic';

export default async function EditLibraryPage({ params }: PageProps<'/admin/library/[id]'>) {
  const { id } = await params;
  const row = await prisma.libraryItem.findUnique({ where: { id } });
  if (!row) notFound();

  return (
    <div>
      <Link href="/admin/library" style={{ color: '#64748b', fontSize: '.9rem', textDecoration: 'none', marginBottom: 16, display: 'inline-block' }}>
        ← Quay lại danh sách
      </Link>
      <LibraryForm
        initial={{
          id: row.id,
          slug: row.slug,
          titleVi: row.titleVi,
          titleEn: row.titleEn ?? '',
          descriptionVi: row.descriptionVi ?? '',
          descriptionEn: row.descriptionEn ?? '',
          thumbnailUrl: row.thumbnailUrl ?? '',
          fileUrl: row.fileUrl,
          fileName: row.fileName,
          fileSize: row.fileSize ?? undefined,
          fileMime: row.fileMime ?? undefined,
          category: row.category as 'BOOK' | 'REPORT' | 'REFERENCE',
          status: row.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
          order: row.order,
        }}
      />
    </div>
  );
}
