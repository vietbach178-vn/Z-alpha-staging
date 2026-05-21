import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import ResearchForm from '@/components/admin/ResearchForm';

export const dynamic = 'force-dynamic';

export default async function EditResearchPage({ params }: PageProps<'/admin/research/[id]'>) {
  const { id } = await params;
  const [row, topics] = await Promise.all([
    prisma.researchArticle.findUnique({ where: { id } }),
    prisma.topic.findMany({ orderBy: { order: 'asc' } }),
  ]);
  if (!row) notFound();

  return (
    <div>
      <Link href="/admin/research" style={{ color: '#64748b', fontSize: '.9rem', textDecoration: 'none', marginBottom: 16, display: 'inline-block' }}>
        ← Quay lại danh sách
      </Link>
      <ResearchForm
        topics={topics.map((t) => ({ id: t.id, labelVi: t.labelVi }))}
        initial={{
          id: row.id,
          slug: row.slug,
          titleVi: row.titleVi,
          titleEn: row.titleEn ?? '',
          excerptVi: row.excerptVi ?? '',
          excerptEn: row.excerptEn ?? '',
          topicId: row.topicId ?? '',
          typeVi: row.typeVi ?? '',
          typeEn: row.typeEn ?? '',
          readingTime: row.readingTime ?? '',
          heroImage: row.heroImage ?? '',
          featured: row.featured,
          status: row.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
          bodyVi: (row.bodyVi as unknown[]) ?? [],
          bodyEn: (row.bodyEn as unknown[]) ?? null,
        }}
      />
    </div>
  );
}
