import Link from 'next/link';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminTopicsList() {
  const topics = await prisma.topic.findMany({
    orderBy: [{ order: 'asc' }, { labelVi: 'asc' }],
    include: { _count: { select: { articles: true } } },
  });

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Chủ đề</h1>
        <Link href="/admin/topics/new" className="btn btn-primary">+ Tạo chủ đề mới</Link>
      </header>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f1f5f9', textAlign: 'left', fontSize: '.85rem', color: '#475569' }}>
            <tr>
              <th style={{ padding: '12px 16px' }}>Tên</th>
              <th style={{ padding: '12px 16px' }}>Slug</th>
              <th style={{ padding: '12px 16px' }}>Màu</th>
              <th style={{ padding: '12px 16px' }}>Số bài</th>
              <th style={{ padding: '12px 16px' }}>Thứ tự</th>
            </tr>
          </thead>
          <tbody>
            {topics.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Chưa có chủ đề. Bấm "Tạo chủ đề mới" để bắt đầu.</td></tr>
            ) : (
              topics.map((t) => (
                <tr key={t.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <Link href={`/admin/topics/${t.id}`} style={{ color: '#1d4ed8', textDecoration: 'none', fontWeight: 500 }}>
                      {t.labelVi}
                    </Link>
                    {t.labelEn && <div style={{ fontSize: '.75rem', color: '#94a3b8' }}>{t.labelEn}</div>}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '.85rem' }}>/{t.slug}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`topic-chip topic-chip--${t.tone}`}>{t.tone}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#475569' }}>{t._count.articles}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>{t.order}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
