'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateContactStatus, deleteContact } from '@/app/admin/contacts/actions';

type Status = 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';

interface Props { id: string; currentStatus: Status; }

const NEXT_STATUS_LABEL: Record<Status, string> = {
  NEW:      'Đánh dấu đã đọc',
  READ:     'Đánh dấu đã phản hồi',
  REPLIED:  'Lưu trữ',
  ARCHIVED: 'Mở lại',
};
const NEXT_STATUS: Record<Status, Status> = {
  NEW: 'READ',
  READ: 'REPLIED',
  REPLIED: 'ARCHIVED',
  ARCHIVED: 'READ',
};

export default function ContactDetailActions({ id, currentStatus }: Props) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const onAdvance = () => {
    startTransition(async () => {
      await updateContactStatus(id, NEXT_STATUS[currentStatus]);
      router.refresh();
    });
  };

  const onDelete = () => {
    if (!confirm('Xoá tin nhắn này vĩnh viễn?')) return;
    startTransition(async () => {
      await deleteContact(id);
    });
  };

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <button type="button" onClick={onAdvance} disabled={pending} className="btn btn-primary">
        {pending ? 'Đang lưu…' : NEXT_STATUS_LABEL[currentStatus]}
      </button>
      <button type="button" onClick={onDelete} disabled={pending} style={{
        appearance: 'none', background: '#fee2e2', color: '#b91c1c',
        border: '1px solid #fecaca', borderRadius: 8, padding: '10px 16px',
        fontWeight: 600, cursor: 'pointer',
      }}>
        Xoá
      </button>
    </div>
  );
}
