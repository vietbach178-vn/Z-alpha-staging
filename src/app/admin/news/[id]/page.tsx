import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import NewsForm from '@/components/admin/NewsForm';

export const dynamic = 'force-dynamic';

export default async function EditNewsPage({ params }: PageProps<'/admin/news/[id]'>) {
  const { id } = await params;
  const [row, categories] = await Promise.all([
    prisma.newsItem.findUnique({ where: { id } }),
    prisma.newsCategory.findMany({ orderBy: { order: 'asc' } }),
  ]);
  if (!row) notFound();

  return (
    <div>
      <Link href="/admin/news" style={{ color: '#64748b', fontSize: '.9rem', textDecoration: 'none', marginBottom: 16, display: 'inline-block' }}>← Quay lại danh sách</Link>
      <NewsForm
        categories={categories.map((c) => ({ id: c.id, labelVi: c.labelVi }))}
        initial={{
          id: row.id,
          slug: row.slug,
          titleVi: row.titleVi,
          titleEn: row.titleEn ?? '',
          excerptVi: row.excerptVi ?? '',
          excerptEn: row.excerptEn ?? '',
          categoryId: row.categoryId ?? '',
          source: row.source ?? '',
          externalUrl: row.externalUrl ?? '',
          heroImage: row.heroImage ?? '',
          status: row.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
          bodyVi: (row.bodyVi as unknown[]) ?? [],
          bodyEn: (row.bodyEn as unknown[]) ?? null,
        }}
      />
    </div>
  );
}
