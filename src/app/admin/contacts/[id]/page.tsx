import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import ContactDetailActions from '@/components/admin/ContactDetailActions';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  NEW: 'Mới', READ: 'Đã đọc', REPLIED: 'Đã phản hồi', ARCHIVED: 'Lưu trữ',
};
const AUDIENCE_LABEL: Record<string, string> = {
  STUDENT: 'Học sinh, sinh viên',
  SCHOOL: 'Nhà trường / cơ sở giáo dục',
  GOVERNMENT: 'Chính phủ / nhà hoạch định chính sách',
  OTHER: 'Khác',
};

export default async function AdminContactDetail({ params }: PageProps<'/admin/contacts/[id]'>) {
  const { id } = await params;
  const row = await prisma.contactSubmission.findUnique({ where: { id } });
  if (!row) notFound();

  // Auto-mark as READ on first view if currently NEW
  if (row.status === 'NEW') {
    await prisma.contactSubmission.update({ where: { id }, data: { status: 'READ' } });
    row.status = 'READ';
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <Link href="/admin/contacts" style={{ color: '#64748b', fontSize: '.9rem', textDecoration: 'none', marginBottom: 16, display: 'inline-block' }}>
        ← Quay lại danh sách
      </Link>

      <header style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
            {row.isUrgent && '🚨 '}Tin nhắn từ {row.fullName}
          </h1>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '.9rem' }}>
            <a href={`mailto:${row.email}`} style={{ color: '#1d4ed8', textDecoration: 'none' }}>{row.email}</a>
            {' '}· <span>{AUDIENCE_LABEL[row.audience]}</span>
          </p>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '.85rem' }}>
            {row.createdAt.toLocaleString('vi-VN')} · Trạng thái:{' '}
            <strong>{STATUS_LABEL[row.status]}</strong>
            {row.isUrgent && <span style={{ color: '#b91c1c', marginLeft: 8 }}>· KHẨN</span>}
          </p>
        </div>
      </header>

      <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 16 }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#64748b', margin: '0 0 12px' }}>
          Nội dung
        </h2>
        <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 15.5, lineHeight: 1.7, color: '#0f172a' }}>
          {row.message}
        </p>
      </section>

      <section style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 13, color: '#475569' }}>
        <p style={{ margin: '0 0 4px' }}><strong>Phản hồi qua email:</strong></p>
        <a href={`mailto:${row.email}?subject=Re: Liên hệ với Z & Alpha`} className="btn btn-outline" style={{ marginTop: 6 }}>
          📧 Trả lời {row.email}
        </a>
        {row.ipAddress && <p style={{ margin: '12px 0 0', color: '#94a3b8', fontSize: 12 }}>IP: {row.ipAddress}</p>}
        {row.userAgent && <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: 12, wordBreak: 'break-all' }}>UA: {row.userAgent}</p>}
      </section>

      <ContactDetailActions id={row.id} currentStatus={row.status as 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED'} />
    </div>
  );
}
