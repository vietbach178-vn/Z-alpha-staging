'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveLibrary, deleteLibrary } from '@/app/admin/library/actions';

type Category = 'BOOK' | 'REPORT' | 'REFERENCE';
type Status = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

interface Initial {
  id?: string;
  slug: string;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  thumbnailUrl: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  fileMime?: string;
  category: Category;
  status: Status;
  order: number;
}

interface Props { initial: Initial; }

const formatSize = (b?: number) => {
  if (!b) return '';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
};

export default function LibraryForm({ initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>('vi');
  const [state, setState] = useState<Initial>(initial);
  const [error, setError] = useState<{ field?: string; message: string } | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);

  function set<K extends keyof Initial>(key: K, val: Initial[K]) {
    setState((s) => ({ ...s, [key]: val }));
  }

  async function upload(file: File, prefix: string): Promise<{ url: string } | null> {
    const fd = new FormData();
    fd.set('file', file);
    fd.set('prefix', prefix);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const json = await res.json();
    if (!res.ok || !json.url) {
      setError({ message: json.error || 'Upload failed' });
      return null;
    }
    return { url: json.url };
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploadingFile(true);
    try {
      const res = await upload(file, `library/files`);
      if (res) {
        set('fileUrl', res.url);
        set('fileName', file.name);
        set('fileSize', file.size);
        set('fileMime', file.type || undefined);
      }
    } finally {
      setUploadingFile(false);
      e.target.value = '';
    }
  }

  async function onPickThumb(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploadingThumb(true);
    try {
      const res = await upload(file, `library/thumbs`);
      if (res) set('thumbnailUrl', res.url);
    } finally {
      setUploadingThumb(false);
      e.target.value = '';
    }
  }

  function submit(status: Status) {
    if (!state.titleVi.trim()) {
      setError({ field: 'titleVi', message: 'Tiêu đề VI bắt buộc' });
      setActiveLang('vi');
      return;
    }
    if (!state.fileUrl) {
      setError({ field: 'fileUrl', message: 'Cần upload file chính trước' });
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await saveLibrary({
        id: state.id,
        slug: state.slug,
        titleVi: state.titleVi,
        titleEn: state.titleEn,
        descriptionVi: state.descriptionVi,
        descriptionEn: state.descriptionEn,
        thumbnailUrl: state.thumbnailUrl,
        fileUrl: state.fileUrl,
        fileName: state.fileName,
        fileSize: state.fileSize,
        fileMime: state.fileMime,
        category: state.category,
        status,
        order: state.order,
      });
      if (!res.ok) {
        setError({ field: res.field, message: res.error });
        return;
      }
      router.push('/admin/library');
    });
  }

  function onDelete() {
    if (!state.id) return;
    if (!confirm('Xoá mục thư viện này? File đã upload sẽ không bị xoá khỏi blob.')) return;
    startTransition(async () => {
      await deleteLibrary(state.id!);
    });
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
      <div>
        <h1 style={{ margin: '0 0 16px', fontSize: '1.75rem' }}>
          {state.id ? 'Sửa mục thư viện' : 'Tạo mục thư viện mới'}
        </h1>

        <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid #e5e7eb' }}>
          {(['vi', 'en'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setActiveLang(l)}
              style={{
                appearance: 'none',
                background: 'none',
                border: 'none',
                padding: '10px 16px',
                fontWeight: 600,
                color: activeLang === l ? '#0f172a' : '#94a3b8',
                borderBottom: activeLang === l ? '2px solid #14b8a6' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              {l === 'vi' ? 'Tiếng Việt' : 'English'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {activeLang === 'vi' ? (
            <>
              <Field label="Tiêu đề VI *">
                <input
                  value={state.titleVi}
                  onChange={(e) => set('titleVi', e.target.value)}
                  placeholder="Ví dụ: Báo cáo MXH & sức khỏe tâm thần 2026"
                />
                {error?.field === 'titleVi' && <p style={{ color: '#b91c1c', fontSize: 13, margin: 0 }}>{error.message}</p>}
              </Field>
              <Field label="Mô tả ngắn (VI)">
                <textarea
                  value={state.descriptionVi}
                  onChange={(e) => set('descriptionVi', e.target.value)}
                  rows={4}
                  placeholder="Mô tả ngắn 1-3 câu hiển thị trên card thư viện"
                />
              </Field>
            </>
          ) : (
            <>
              <Field label="Title EN">
                <input value={state.titleEn} onChange={(e) => set('titleEn', e.target.value)} />
              </Field>
              <Field label="Description (EN)">
                <textarea value={state.descriptionEn} onChange={(e) => set('descriptionEn', e.target.value)} rows={4} />
              </Field>
            </>
          )}
        </div>
      </div>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb' }}>
          {error && error.field !== 'titleVi' && (
            <div style={{ background: '#fef2f2', color: '#b91c1c', padding: 8, borderRadius: 6, fontSize: '.85rem', marginBottom: 8 }}>
              {error.message}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button type="button" onClick={() => submit('PUBLISHED')} disabled={pending} className="btn btn-primary">
              {pending ? 'Đang lưu…' : 'Xuất bản'}
            </button>
            <button type="button" onClick={() => submit('DRAFT')} disabled={pending} className="btn btn-outline">
              Lưu nháp
            </button>
            {state.id && (
              <button type="button" onClick={onDelete} disabled={pending} style={{
                appearance: 'none', background: '#fee2e2', color: '#b91c1c',
                border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px',
                fontWeight: 600, cursor: 'pointer',
              }}>
                Xoá
              </button>
            )}
          </div>
        </div>

        <Field label="Phân loại">
          <select
            value={state.category}
            onChange={(e) => set('category', e.target.value as Category)}
          >
            <option value="REPORT">Báo cáo</option>
            <option value="BOOK">Sách</option>
            <option value="REFERENCE">Tài liệu tham khảo</option>
          </select>
        </Field>

        <Field label="Slug (tự động nếu để trống)">
          <input value={state.slug} onChange={(e) => set('slug', e.target.value)} placeholder="/library/..." />
          {error?.field === 'slug' && <p style={{ color: '#b91c1c', fontSize: 13, margin: 0 }}>{error.message}</p>}
        </Field>

        <Field label="Thứ tự hiển thị">
          <input
            type="number"
            value={state.order}
            onChange={(e) => set('order', Number(e.target.value) || 0)}
          />
        </Field>

        <Field label="File chính *">
          {state.fileUrl ? (
            <div style={{ fontSize: 13, color: '#0f172a', wordBreak: 'break-word' }}>
              <div style={{ fontWeight: 600 }}>{state.fileName}</div>
              <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>
                {formatSize(state.fileSize)} {state.fileMime ? `· ${state.fileMime}` : ''}
              </div>
              <a href={state.fileUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 6, color: '#2563eb', fontSize: 12.5 }}>
                Xem file
              </a>
            </div>
          ) : (
            <p style={{ margin: 0, color: '#94a3b8', fontSize: 13 }}>Chưa upload file</p>
          )}
          <label style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', background: '#f0fdfa', border: '1px dashed #99f6e4',
            borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#0f766e',
            fontWeight: 600, marginTop: 8,
          }}>
            <input type="file" onChange={onPickFile} disabled={uploadingFile}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.epub,.xls,.xlsx,application/pdf"
              style={{ fontSize: 12 }} />
            <span>{uploadingFile ? 'Đang upload…' : (state.fileUrl ? 'Thay file' : 'Chọn file')}</span>
          </label>
          {error?.field === 'fileUrl' && <p style={{ color: '#b91c1c', fontSize: 13, margin: 0 }}>{error.message}</p>}
        </Field>

        <Field label="Thumbnail (tuỳ chọn)">
          {state.thumbnailUrl && (
            <img src={state.thumbnailUrl} alt="" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 8 }} />
          )}
          <label style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', background: '#eff6ff', border: '1px dashed #bfdbfe',
            borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#1d4ed8',
            fontWeight: 600,
          }}>
            <input type="file" onChange={onPickThumb} disabled={uploadingThumb}
              accept="image/*" style={{ fontSize: 12 }} />
            <span>{uploadingThumb ? 'Đang upload…' : (state.thumbnailUrl ? 'Thay ảnh' : 'Chọn ảnh')}</span>
          </label>
          {state.thumbnailUrl && (
            <button type="button" onClick={() => set('thumbnailUrl', '')} style={{
              appearance: 'none', background: 'none', border: 'none',
              color: '#b91c1c', fontSize: 12.5, cursor: 'pointer', padding: 0,
            }}>
              Xoá ảnh
            </button>
          )}
        </Field>
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb' }}>
      <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#475569', marginBottom: 8 }}>{label}</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
    </div>
  );
}
