import Link from 'next/link';
import { prisma } from '@/lib/db';
import NewsForm from '@/components/admin/NewsForm';

export const dynamic = 'force-dynamic';

export default async function NewNewsPage() {
  const categories = await prisma.newsCategory.findMany({ orderBy: { order: 'asc' } });
  return (
    <div>
      <Link href="/admin/news" style={{ color: '#64748b', fontSize: '.9rem', textDecoration: 'none', marginBottom: 16, display: 'inline-block' }}>← Quay lại danh sách</Link>
      <NewsForm
        categories={categories.map((c) => ({ id: c.id, labelVi: c.labelVi }))}
        initial={{ slug: '', titleVi: '', titleEn: '', excerptVi: '', excerptEn: '', categoryId: '', source: '', externalUrl: '', heroImage: '', status: 'DRAFT', bodyVi: [], bodyEn: [] }}
      />
    </div>
  );
}
