import Link from 'next/link';
import LibraryForm from '@/components/admin/LibraryForm';

export const dynamic = 'force-dynamic';

export default function NewLibraryPage() {
  return (
    <div>
      <Link href="/admin/library" style={{ color: '#64748b', fontSize: '.9rem', textDecoration: 'none', marginBottom: 16, display: 'inline-block' }}>
        ← Quay lại danh sách
      </Link>
      <LibraryForm
        initial={{
          slug: '',
          titleVi: '',
          titleEn: '',
          descriptionVi: '',
          descriptionEn: '',
          thumbnailUrl: '',
          fileUrl: '',
          fileName: '',
          fileSize: undefined,
          fileMime: undefined,
          category: 'REPORT',
          status: 'DRAFT',
          order: 0,
        }}
      />
    </div>
  );
}
