import Link from 'next/link';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesList() {
  const cats = await prisma.newsCategory.findMany({
    orderBy: [{ order: 'asc' }, { labelVi: 'asc' }],
    include: { _count: { select: { items: true } } },
  });

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Danh mục</h1>
        <Link href="/admin/categories/new" className="btn btn-primary">+ Tạo danh mục mới</Link>
      </header>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f1f5f9', textAlign: 'left', fontSize: '.85rem', color: '#475569' }}>
            <tr>
              <th style={{ padding: '12px 16px' }}>Tên</th>
              <th style={{ padding: '12px 16px' }}>Slug</th>
              <th style={{ padding: '12px 16px' }}>Màu</th>
              <th style={{ padding: '12px 16px' }}>Số tin</th>
              <th style={{ padding: '12px 16px' }}>Thứ tự</th>
            </tr>
          </thead>
          <tbody>
            {cats.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Chưa có danh mục. Bấm "Tạo danh mục mới" để bắt đầu.</td></tr>
            ) : (
              cats.map((c) => (
                <tr key={c.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <Link href={`/admin/categories/${c.id}`} style={{ color: '#1d4ed8', textDecoration: 'none', fontWeight: 500 }}>
                      {c.labelVi}
                    </Link>
                    {c.labelEn && <div style={{ fontSize: '.75rem', color: '#94a3b8' }}>{c.labelEn}</div>}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '.85rem' }}>/{c.slug}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`topic-chip topic-chip--${c.tone}`}>{c.tone}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#475569' }}>{c._count.items}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b' }}>{c.order}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
