import Link from 'next/link';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  NEW: 'Mới',
  READ: 'Đã đọc',
  REPLIED: 'Đã phản hồi',
  ARCHIVED: 'Lưu trữ',
};
const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  NEW:      { bg: '#dcfce7', fg: '#166534' },
  READ:     { bg: '#dbeafe', fg: '#1d4ed8' },
  REPLIED:  { bg: '#f3e8ff', fg: '#6d28d9' },
  ARCHIVED: { bg: '#f1f5f9', fg: '#475569' },
};
const AUDIENCE_LABEL: Record<string, string> = {
  STUDENT: 'Học sinh, SV',
  SCHOOL: 'Nhà trường',
  GOVERNMENT: 'Chính phủ',
  OTHER: 'Khác',
};

export default async function AdminContactsList() {
  const items = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const newCount = items.filter((i) => i.status === 'NEW').length;

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.75rem' }}>Liên hệ</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '.95rem' }}>
            {items.length} tin nhắn — {newCount} chưa đọc
          </p>
        </div>
      </header>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f1f5f9', textAlign: 'left', fontSize: '.85rem', color: '#475569' }}>
            <tr>
              <th style={{ padding: '12px 16px' }}>Trạng thái</th>
              <th style={{ padding: '12px 16px' }}>Người gửi</th>
              <th style={{ padding: '12px 16px' }}>Đối tượng</th>
              <th style={{ padding: '12px 16px' }}>Tin nhắn</th>
              <th style={{ padding: '12px 16px' }}>Nhận lúc</th>
              <th style={{ padding: '12px 16px' }}></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Chưa có tin nhắn nào.</td></tr>
            ) : (
              items.map((item) => {
                const style = STATUS_STYLE[item.status];
                return (
                  <tr key={item.id} style={{ borderTop: '1px solid #f1f5f9', background: item.status === 'NEW' ? '#fefce8' : undefined }}>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '2px 10px', borderRadius: 999,
                        fontSize: '.75rem', fontWeight: 600,
                        background: style.bg, color: style.fg,
                      }}>
                        {item.isUrgent && '🚨 '}{STATUS_LABEL[item.status]}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '.95rem' }}>{item.fullName}</div>
                      <a href={`mailto:${item.email}`} style={{ color: '#1d4ed8', textDecoration: 'none', fontSize: '.85rem' }}>{item.email}</a>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '2px 8px', borderRadius: 999,
                        fontSize: '.72rem', fontWeight: 600,
                        background: '#f1f5f9', color: '#475569',
                      }}>
                        {AUDIENCE_LABEL[item.audience]}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', maxWidth: 320, color: '#475569', fontSize: '.9rem' }}>
                      {item.message.length > 80 ? `${item.message.slice(0, 80)}…` : item.message}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '.85rem', whiteSpace: 'nowrap' }}>
                      {item.createdAt.toLocaleString('vi-VN')}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <Link href={`/admin/contacts/${item.id}`} style={{ color: '#1d4ed8', fontSize: '.85rem', fontWeight: 600, textDecoration: 'none' }}>
                        Xem
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
