'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteMedia } from '@/app/admin/media/actions';

interface Asset {
  id: string;
  url: string;
  type: string;
  filename: string;
  sizeBytes: number;
}

interface Props {
  assets: Asset[];
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaGallery({ assets }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function onUploadFiles(files: FileList) {
    setError(null);
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.set('file', file);
        fd.set('prefix', 'media');
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        if (!res.ok) {
          const j = await res.json().catch(() => ({ error: 'Upload thất bại' }));
          throw new Error(j.error || 'Upload thất bại');
        }
      }
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload thất bại');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function onDelete(id: string, filename: string) {
    if (!confirm(`Xóa file "${filename}"? Không khôi phục được.`)) return;
    setError(null);
    startTransition(async () => {
      const res = await deleteMedia(id);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.refresh();
    });
  }

  async function onCopy(asset: Asset) {
    try {
      await navigator.clipboard.writeText(asset.url);
      setCopiedId(asset.id);
      setTimeout(() => setCopiedId((c) => (c === asset.id ? null : c)), 1500);
    } catch {
      setError('Không copy được URL');
    }
  }

  return (
    <div>
      <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,video/*,application/pdf"
          onChange={(e) => { if (e.target.files?.length) onUploadFiles(e.target.files); }}
          disabled={uploading}
          style={{ flex: 1 }}
        />
        {uploading && <span style={{ color: '#64748b', fontSize: '.9rem' }}>Đang upload…</span>}
      </div>

      {error && (
        <div style={{ background: '#fef2f2', color: '#b91c1c', padding: 10, borderRadius: 6, fontSize: '.9rem', marginBottom: 16 }}>
          {error}
        </div>
      )}

      {assets.length === 0 ? (
        <div style={{ background: '#fff', border: '1px dashed #e5e7eb', borderRadius: 12, padding: 48, textAlign: 'center', color: '#94a3b8' }}>
          Chưa có file nào. Upload ở trên để bắt đầu.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {assets.map((a) => (
            <div key={a.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ aspectRatio: '4/3', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {a.type === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.url} alt={a.filename} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: '#94a3b8' }}>
                    <i data-lucide={a.type === 'video' ? 'video' : a.type === 'pdf' ? 'file-text' : 'file'} className="icon-lg" />
                    <span style={{ fontSize: '.75rem', textTransform: 'uppercase' }}>{a.type}</span>
                  </div>
                )}
              </div>
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                <div style={{ fontSize: '.85rem', fontWeight: 500, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={a.filename}>
                  {a.filename}
                </div>
                <div style={{ fontSize: '.75rem', color: '#94a3b8' }}>{formatBytes(a.sizeBytes)}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 'auto' }}>
                  <button
                    type="button"
                    onClick={() => onCopy(a)}
                    style={{ flex: 1, background: '#f1f5f9', border: '1px solid #e5e7eb', padding: '6px 8px', borderRadius: 6, cursor: 'pointer', fontSize: '.8rem', color: '#1e293b' }}
                  >
                    {copiedId === a.id ? '✓ Đã copy' : 'Copy URL'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(a.id, a.filename)}
                    disabled={pending}
                    style={{ background: 'transparent', border: '1px solid #fecaca', color: '#b91c1c', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontSize: '.8rem' }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
