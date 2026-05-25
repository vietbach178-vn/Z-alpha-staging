import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import TaxonomyForm from '@/components/admin/TaxonomyForm';

export const dynamic = 'force-dynamic';

const TONES = ['teal', 'blue', 'orange', 'red', 'purple'] as const;
type Tone = (typeof TONES)[number];

export default async function EditCategoryPage({ params }: PageProps<'/admin/categories/[id]'>) {
  const { id } = await params;
  const c = await prisma.newsCategory.findUnique({ where: { id } });
  if (!c) notFound();

  const tone = (TONES as readonly string[]).includes(c.tone) ? (c.tone as Tone) : 'blue';

  return (
    <div>
      <Link href="/admin/categories" style={{ color: '#64748b', fontSize: '.9rem', textDecoration: 'none', marginBottom: 16, display: 'inline-block' }}>← Quay lại danh sách</Link>
      <h1 style={{ margin: '0 0 24px', fontSize: '1.5rem' }}>Sửa danh mục</h1>
      <TaxonomyForm
        kind="category"
        initial={{
          id: c.id,
          slug: c.slug,
          labelVi: c.labelVi,
          labelEn: c.labelEn ?? '',
          tone,
          order: c.order,
        }}
      />
    </div>
  );
}
