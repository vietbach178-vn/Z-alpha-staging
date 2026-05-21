'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { saveNews, deleteNews } from '@/app/admin/news/actions';

const BlockEditor = dynamic(() => import('@/components/editor/BlockEditor'), { ssr: false });

interface Category { id: string; labelVi: string }
interface Initial {
  id?: string;
  slug: string;
  titleVi: string;
  titleEn: string;
  excerptVi: string;
  excerptEn: string;
  categoryId: string;
  source: string;
  externalUrl: string;
  heroImage: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  bodyVi: unknown[];
  bodyEn: unknown[] | null;
}

export default function NewsForm({ categories, initial }: { categories: Category[]; initial: Initial }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [activeLang, setActiveLang] = useState<'vi' | 'en'>('vi');
  const [state, setState] = useState<Initial>(initial);
  const [error, setError] = useState<{ field?: string; message: string } | null>(null);

  function set<K extends keyof Initial>(key: K, val: Initial[K]) {
    setState((s) => ({ ...s, [key]: val }));
  }

  function submit(status: 'DRAFT' | 'PUBLISHED') {
    if (!state.titleVi.trim()) {
      setError({ field: 'titleVi', message: 'Tiêu đề VI bắt buộc' });
      setActiveLang('vi');
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await saveNews({
        id: state.id,
        slug: state.slug,
        titleVi: state.titleVi,
        titleEn: state.titleEn,
        excerptVi: state.excerptVi,
        excerptEn: state.excerptEn,
        categoryId: state.categoryId,
        source: state.source,
        externalUrl: state.externalUrl,
        heroImage: state.heroImage,
        status,
        bodyVi: state.bodyVi,
        bodyEn: state.bodyEn,
      });
      if (!res.ok) {
        setError({ field: res.field, message: res.error });
        return;
      }
      router.push('/admin/news');
    });
  }

  async function onUploadHero(file: File) {
    const fd = new FormData();
    fd.set('file', file);
    fd.set('prefix', 'news/hero');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const json = await res.json();
    if (json.url) set('heroImage', json.url);
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
      <div>
        <header style={{ marginBottom: 24 }}>
          <input
            type="text"
            placeholder={activeLang === 'vi' ? 'Tiêu đề (VI)' : 'Title (EN)'}
            value={activeLang === 'vi' ? state.titleVi : state.titleEn}
            onChange={(e) => set(activeLang === 'vi' ? 'titleVi' : 'titleEn', e.target.value)}
            style={{ width: '100%', fontSize: '2rem', fontWeight: 700, border: 'none', outline: 'none', padding: '8px 0', background: 'transparent' }}
          />
          {error?.field === 'titleVi' && activeLang === 'vi' && (
            <p style={{ color: '#b91c1c', fontSize: '.85rem', margin: '4px 0 0' }}>{error.message}</p>
          )}
          <textarea
            placeholder={activeLang === 'vi' ? 'Mô tả ngắn (VI)…' : 'Short description (EN)…'}
            rows={2}
            value={activeLang === 'vi' ? state.excerptVi : state.excerptEn}
            onChange={(e) => set(activeLang === 'vi' ? 'excerptVi' : 'excerptEn', e.target.value)}
            style={{ width: '100%', border: 'none', outline: 'none', fontSize: '1rem', color: '#475569', resize: 'vertical', padding: '4px 0', background: 'transparent' }}
          />
        </header>

        <div style={{ display: 'flex', gap: 4, marginBottom: 12, borderBottom: '1px solid #e5e7eb' }}>
          {(['vi', 'en'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setActiveLang(l)}
              style={{ padding: '8px 16px', background: 'transparent', border: 'none', borderBottom: activeLang === l ? '2px solid #1d4ed8' : '2px solid transparent', cursor: 'pointer', fontWeight: activeLang === l ? 700 : 400, color: activeLang === l ? '#1d4ed8' : '#64748b' }}
            >
              {l === 'vi' ? 'Tiếng Việt' : 'English'}
            </button>
          ))}
        </div>

        <BlockEditor
          key={activeLang}
          initialContent={activeLang === 'vi' ? state.bodyVi : (state.bodyEn ?? [])}
          onChange={(blocks) => {
            if (activeLang === 'vi') set('bodyVi', blocks);
            else set('bodyEn', blocks);
          }}
        />
      </div>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb' }}>
          {error && error.field !== 'titleVi' && (
            <div style={{ background: '#fef2f2', color: '#b91c1c', padding: 8, borderRadius: 6, fontSize: '.85rem', marginBottom: 8 }}>
              {error.message}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button type="button" onClick={() => submit('PUBLISHED')} disabled={pending} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              {pending ? 'Đang lưu…' : 'Xuất bản'}
            </button>
            <button type="button" onClick={() => submit('DRAFT')} disabled={pending} className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              Lưu nháp
            </button>
            {state.id && (
              <button
                type="button"
                onClick={() => { if (confirm('Xóa tin này?')) startTransition(async () => { await deleteNews(state.id!); }); }}
                style={{ background: 'transparent', border: '1px solid #fecaca', color: '#b91c1c', padding: '8px', borderRadius: 8, cursor: 'pointer', fontSize: '.85rem' }}
              >
                Xóa
              </button>
            )}
          </div>
        </div>

        <Field label="Slug (URL)">
          <input type="text" value={state.slug} onChange={(e) => set('slug', e.target.value)} placeholder="auto từ tiêu đề" />
        </Field>

        <Field label="Loại tin">
          <select value={state.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
            <option value="">(Chưa chọn)</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.labelVi}</option>)}
          </select>
        </Field>

        <Field label="Nguồn (hiện dưới ngày)">
          <input type="text" value={state.source} onChange={(e) => set('source', e.target.value)} placeholder="VD: Báo Tuổi Trẻ" />
        </Field>

        <Field label="Link bài gốc (nếu có)">
          <input type="url" value={state.externalUrl} onChange={(e) => set('externalUrl', e.target.value)} placeholder="https://..." />
          <small style={{ color: '#94a3b8', fontSize: '.75rem' }}>Nếu có → card list sẽ link thẳng ra ngoài thay vì trang chi tiết.</small>
        </Field>

        <Field label="Ảnh bìa">
          {state.heroImage ? (
            <div>
              <img src={state.heroImage} alt="" style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
              <button type="button" onClick={() => set('heroImage', '')} style={{ fontSize: '.8rem', color: '#b91c1c', background: 'transparent', border: 'none', cursor: 'pointer' }}>Xóa ảnh</button>
            </div>
          ) : (
            <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUploadHero(f); }} />
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
