import Link from 'next/link';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminResearchList() {
  const items = await prisma.researchArticle.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { topic: true },
  });

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Bài nghiên cứu</h1>
        <Link href="/admin/research/new" className="btn btn-primary">+ Tạo bài mới</Link>
      </header>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f1f5f9', textAlign: 'left', fontSize: '.85rem', color: '#475569' }}>
            <tr>
              <th style={{ padding: '12px 16px' }}>Tiêu đề</th>
              <th style={{ padding: '12px 16px' }}>Chủ đề</th>
              <th style={{ padding: '12px 16px' }}>Trạng thái</th>
              <th style={{ padding: '12px 16px' }}>Nổi bật</th>
              <th style={{ padding: '12px 16px' }}>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Chưa có bài. Bấm "Tạo bài mới" để bắt đầu.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <Link href={`/admin/research/${item.id}`} style={{ color: '#1d4ed8', textDecoration: 'none', fontWeight: 500 }}>
                      {item.titleVi}
                    </Link>
                    <div style={{ fontSize: '.75rem', color: '#94a3b8' }}>/{item.slug}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {item.topic && (
                      <span className={`topic-chip topic-chip--${item.topic.tone}`}>{item.topic.labelVi}</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: 999,
                      fontSize: '.75rem',
                      fontWeight: 600,
                      background: item.status === 'PUBLISHED' ? '#dcfce7' : item.status === 'DRAFT' ? '#fef3c7' : '#fee2e2',
                      color: item.status === 'PUBLISHED' ? '#166534' : item.status === 'DRAFT' ? '#92400e' : '#b91c1c',
                    }}>
                      {item.status === 'PUBLISHED' ? 'Đã xuất bản' : item.status === 'DRAFT' ? 'Nháp' : 'Lưu trữ'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>{item.featured ? '★' : ''}</td>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '.85rem' }}>
                    {item.updatedAt.toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
