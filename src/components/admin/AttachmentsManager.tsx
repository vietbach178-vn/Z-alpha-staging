'use client';

import { useState, useTransition } from 'react';
import {
  createAttachment,
  deleteAttachment,
  updateAttachment,
} from '@/app/admin/research/attachments-actions';

interface Attachment {
  id: string;
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  fileMime: string | null;
  language: 'VI' | 'EN' | 'OTHER';
  labelVi: string | null;
  labelEn: string | null;
  order: number;
}

interface Props {
  articleId: string;
  initial: Attachment[];
}

const formatSize = (b: number | null) => {
  if (!b) return '';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
};

export default function AttachmentsManager({ articleId, initial }: Props) {
  const [items, setItems] = useState<Attachment[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingLang, setPendingLang] = useState<'VI' | 'EN' | 'OTHER'>('VI');
  const [pendingLabelVi, setPendingLabelVi] = useState('');
  const [pendingLabelEn, setPendingLabelEn] = useState('');
  const [, startTransition] = useTransition();

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('prefix', `research-attachments/${articleId}`);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Upload failed');

      const created = await createAttachment({
        articleId,
        fileUrl: data.url,
        fileName: file.name,
        fileSize: file.size,
        fileMime: file.type || undefined,
        language: pendingLang,
        labelVi: pendingLabelVi || undefined,
        labelEn: pendingLabelEn || undefined,
      });
      if (!created.ok) throw new Error(created.error);

      setItems((cur) => [
        ...cur,
        {
          id: `tmp-${Date.now()}`,
          fileUrl: data.url,
          fileName: file.name,
          fileSize: file.size,
          fileMime: file.type || null,
          language: pendingLang,
          labelVi: pendingLabelVi || null,
          labelEn: pendingLabelEn || null,
          order: cur.length,
        },
      ]);
      setPendingLabelVi('');
      setPendingLabelEn('');
      e.target.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onDelete = (id: string) => {
    if (!confirm('Xoá file đính kèm này?')) return;
    startTransition(async () => {
      const res = await deleteAttachment(id);
      if (res.ok) setItems((cur) => cur.filter((i) => i.id !== id));
      else setError(res.error);
    });
  };

  const onUpdateLang = (id: string, language: 'VI' | 'EN' | 'OTHER') => {
    startTransition(async () => {
      const res = await updateAttachment({ id, language });
      if (res.ok) setItems((cur) => cur.map((i) => (i.id === id ? { ...i, language } : i)));
      else setError(res.error);
    });
  };

  return (
    <div className="att-mgr">
      <h3 className="att-mgr__title">File đính kèm (Tải về)</h3>
      <p className="att-mgr__lead">Upload các file PDF/doc người đọc có thể tải xuống từ trang chi tiết bài nghiên cứu.</p>

      {items.length > 0 && (
        <ul className="att-mgr__list">
          {items.map((att) => (
            <li key={att.id} className="att-mgr__item">
              <div className="att-mgr__meta">
                <p className="att-mgr__name">{att.fileName}</p>
                <p className="att-mgr__sub">
                  {formatSize(att.fileSize)}
                  {att.fileMime ? ` · ${att.fileMime}` : ''}
                </p>
              </div>
              <select
                value={att.language}
                onChange={(e) => onUpdateLang(att.id, e.target.value as 'VI' | 'EN' | 'OTHER')}
                className="att-mgr__select"
                aria-label="Ngôn ngữ"
              >
                <option value="VI">VI</option>
                <option value="EN">EN</option>
                <option value="OTHER">Khác</option>
              </select>
              <a href={att.fileUrl} target="_blank" rel="noopener noreferrer" className="att-mgr__view">
                Xem
              </a>
              <button type="button" onClick={() => onDelete(att.id)} className="att-mgr__delete">
                Xoá
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="att-mgr__upload">
        <div className="att-mgr__form-row">
          <label>
            <span>Ngôn ngữ file</span>
            <select value={pendingLang} onChange={(e) => setPendingLang(e.target.value as 'VI' | 'EN' | 'OTHER')}>
              <option value="VI">Tiếng Việt</option>
              <option value="EN">English</option>
              <option value="OTHER">Khác</option>
            </select>
          </label>
          <label>
            <span>Nhãn VI (tuỳ chọn)</span>
            <input value={pendingLabelVi} onChange={(e) => setPendingLabelVi(e.target.value)} placeholder="VD: Báo cáo đầy đủ" />
          </label>
          <label>
            <span>Nhãn EN (tuỳ chọn)</span>
            <input value={pendingLabelEn} onChange={(e) => setPendingLabelEn(e.target.value)} placeholder="VD: Full report" />
          </label>
        </div>
        <label className="att-mgr__file-input">
          <input type="file" onChange={onPickFile} disabled={uploading} accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,application/pdf" />
          <span>{uploading ? 'Đang tải lên…' : 'Chọn file để upload'}</span>
        </label>
        {error && <p className="att-mgr__error">{error}</p>}
      </div>
    </div>
  );
}
