import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import TaxonomyForm from '@/components/admin/TaxonomyForm';

export const dynamic = 'force-dynamic';

const TONES = ['teal', 'blue', 'orange', 'red', 'purple'] as const;
type Tone = (typeof TONES)[number];

export default async function EditTopicPage({ params }: PageProps<'/admin/topics/[id]'>) {
  const { id } = await params;
  const t = await prisma.topic.findUnique({ where: { id } });
  if (!t) notFound();

  const tone = (TONES as readonly string[]).includes(t.tone) ? (t.tone as Tone) : 'blue';

  return (
    <div>
      <Link href="/admin/topics" style={{ color: '#64748b', fontSize: '.9rem', textDecoration: 'none', marginBottom: 16, display: 'inline-block' }}>← Quay lại danh sách</Link>
      <h1 style={{ margin: '0 0 24px', fontSize: '1.5rem' }}>Sửa chủ đề</h1>
      <TaxonomyForm
        kind="topic"
        initial={{
          id: t.id,
          slug: t.slug,
          labelVi: t.labelVi,
          labelEn: t.labelEn ?? '',
          tone,
          order: t.order,
        }}
      />
    </div>
  );
}
