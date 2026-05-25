'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveTopic, deleteTopic } from '@/app/admin/topics/actions';
import { saveCategory, deleteCategory } from '@/app/admin/categories/actions';

const TONES = ['teal', 'blue', 'orange', 'red', 'purple'] as const;
type Tone = (typeof TONES)[number];

interface Initial {
  id?: string;
  slug: string;
  labelVi: string;
  labelEn: string;
  tone: Tone;
  order: number;
}

interface Props {
  kind: 'topic' | 'category';
  initial: Initial;
}

export default function TaxonomyForm({ kind, initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<Initial>(initial);
  const [error, setError] = useState<{ field?: string; message: string } | null>(null);

  const save = kind === 'topic' ? saveTopic : saveCategory;
  const remove = kind === 'topic' ? deleteTopic : deleteCategory;
  const listUrl = kind === 'topic' ? '/admin/topics' : '/admin/categories';
  const noun = kind === 'topic' ? 'chủ đề' : 'danh mục';

  function set<K extends keyof Initial>(key: K, val: Initial[K]) {
    setState((s) => ({ ...s, [key]: val }));
  }

  function submit() {
    if (!state.labelVi.trim()) {
      setError({ field: 'labelVi', message: 'Tên VI bắt buộc' });
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await save({
        id: state.id,
        slug: state.slug,
        labelVi: state.labelVi,
        labelEn: state.labelEn,
        tone: state.tone,
        order: state.order,
      });
      if (!res.ok) {
        setError({ field: res.field, message: res.error });
        return;
      }
      router.push(listUrl);
    });
  }

  function onDelete() {
    if (!state.id) return;
    if (!confirm(`Xóa ${noun} này?`)) return;
    setError(null);
    startTransition(async () => {
      const res = await remove(state.id!);
      if (!res.ok) {
        setError({ message: res.error });
        return;
      }
      router.push(listUrl);
    });
  }

  return (
    <div style={{ maxWidth: 640 }}>
      {error && error.field !== 'labelVi' && error.field !== 'slug' && (
        <div style={{ background: '#fef2f2', color: '#b91c1c', padding: 10, borderRadius: 6, fontSize: '.9rem', marginBottom: 16 }}>
          {error.message}
        </div>
      )}

      <Field label="Tên (VI)" required>
        <input
          type="text"
          value={state.labelVi}
          onChange={(e) => set('labelVi', e.target.value)}
          placeholder="VD: Mạng xã hội"
        />
        {error?.field === 'labelVi' && (
          <p style={{ color: '#b91c1c', fontSize: '.85rem', margin: '4px 0 0' }}>{error.message}</p>
        )}
      </Field>

      <Field label="Tên (EN)">
        <input
          type="text"
          value={state.labelEn}
          onChange={(e) => set('labelEn', e.target.value)}
          placeholder="VD: Social media"
        />
      </Field>

      <Field label="Slug (URL)">
        <input
          type="text"
          value={state.slug}
          onChange={(e) => set('slug', e.target.value)}
          placeholder="auto từ tên VI"
        />
        {error?.field === 'slug' && (
          <p style={{ color: '#b91c1c', fontSize: '.85rem', margin: '4px 0 0' }}>{error.message}</p>
        )}
      </Field>

      <Field label="Màu (tone)">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={state.tone} onChange={(e) => set('tone', e.target.value as Tone)}>
            {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <span className={`topic-chip topic-chip--${state.tone}`}>{state.labelVi || 'Preview'}</span>
        </div>
      </Field>

      <Field label="Thứ tự (order)">
        <input
          type="number"
          value={state.order}
          onChange={(e) => set('order', Number(e.target.value) || 0)}
        />
        <small style={{ color: '#94a3b8', fontSize: '.75rem' }}>Số nhỏ hơn hiện trước trong filter chip.</small>
      </Field>

      <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
        <button type="button" onClick={submit} disabled={pending} className="btn btn-primary">
          {pending ? 'Đang lưu…' : 'Lưu'}
        </button>
        <button type="button" onClick={() => router.push(listUrl)} className="btn btn-outline">
          Hủy
        </button>
        {state.id && (
          <button
            type="button"
            onClick={onDelete}
            disabled={pending}
            style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid #fecaca', color: '#b91c1c', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: '.9rem' }}
          >
            Xóa
          </button>
        )}
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', padding: 16, borderRadius: 12, border: '1px solid #e5e7eb', marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#475569', marginBottom: 8 }}>
        {label} {required && <span style={{ color: '#b91c1c' }}>*</span>}
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</div>
    </div>
  );
}
