import Link from 'next/link';
import { prisma } from '@/lib/db';
import ResearchForm from '@/components/admin/ResearchForm';

export const dynamic = 'force-dynamic';

export default async function NewResearchPage() {
  const topics = await prisma.topic.findMany({ orderBy: { order: 'asc' } });

  return (
    <div>
      <Link href="/admin/research" style={{ color: '#64748b', fontSize: '.9rem', textDecoration: 'none', marginBottom: 16, display: 'inline-block' }}>
        ← Quay lại danh sách
      </Link>
      <ResearchForm
        topics={topics.map((t) => ({ id: t.id, labelVi: t.labelVi }))}
        initial={{
          slug: '',
          titleVi: '',
          titleEn: '',
          excerptVi: '',
          excerptEn: '',
          topicId: '',
          typeVi: '',
          typeEn: '',
          readingTime: '',
          heroImage: '',
          featured: false,
          status: 'DRAFT',
          bodyVi: [],
          bodyEn: [],
        }}
      />
    </div>
  );
}
