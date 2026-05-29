import Link from 'next/link';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const CAT_LABEL: Record<string, string> = {
  BOOK: 'Sách',
  REPORT: 'Báo cáo',
  REFERENCE: 'Tài liệu tham khảo',
};
const CAT_TONE: Record<string, string> = {
  BOOK: 'teal',
  REPORT: 'blue',
  REFERENCE: 'orange',
};

export default async function AdminLibraryList() {
  const items = await prisma.libraryItem.findMany({
    orderBy: [{ order: 'asc' }, { updatedAt: 'desc' }],
  });

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Thư viện</h1>
        <Link href="/admin/library/new" className="btn btn-primary">+ Tạo mục mới</Link>
      </header>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f1f5f9', textAlign: 'left', fontSize: '.85rem', color: '#475569' }}>
            <tr>
              <th style={{ padding: '12px 16px' }}>Tiêu đề</th>
              <th style={{ padding: '12px 16px' }}>Phân loại</th>
              <th style={{ padding: '12px 16px' }}>Trạng thái</th>
              <th style={{ padding: '12px 16px' }}>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Chưa có mục nào. Bấm "Tạo mục mới" để bắt đầu.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <Link href={`/admin/library/${item.id}`} style={{ color: '#1d4ed8', textDecoration: 'none', fontWeight: 500 }}>
                      {item.titleVi}
                    </Link>
                    <div style={{ fontSize: '.75rem', color: '#94a3b8' }}>/{item.slug}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span className={`topic-chip topic-chip--${CAT_TONE[item.category]}`}>
                      {CAT_LABEL[item.category]}
                    </span>
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
