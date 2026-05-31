'use client';

import { BlockNoteSchema, defaultBlockSpecs } from '@blocknote/core';
import { createReactBlockSpec } from '@blocknote/react';
import StatHero from './blocks/StatHero';
import BarChart from './blocks/BarChart';
import EmotionGrid from './blocks/EmotionGrid';
import Callout from './blocks/Callout';
import FileDownload from './blocks/FileDownload';
import VideoEmbed from './blocks/VideoEmbed';

/**
 * BlockNote only ships built-in block types (paragraph, heading, lists, image,
 * video, divider, table…). Research articles, however, carry custom data blocks
 * — statHero, barChart, emotionGrid, callout, fileDownload — authored before the
 * editor existed (see scripts/migrate-72h.ts) and rendered on the public site by
 * BlockRenderer.
 *
 * If those types reach `useCreateBlockNote` unregistered, BlockNote throws while
 * parsing initialContent and the whole admin page crashes ("This page couldn't
 * load"). To keep them loadable AND round-trip them on save without data loss, we
 * register each as a custom block whose entire original `props` object is stored
 * in a single `data` string and shown as a read-only preview. The catch-all
 * `unsupportedBlock` does the same for any future/unknown type.
 *
 * Inline editing of these rich blocks is a v2 concern — for now they survive an
 * edit + save untouched, which is what matters.
 */

// Types BlockNote already understands — passed through verbatim.
const DEFAULT_TYPES = new Set(Object.keys(defaultBlockSpecs));

// Custom data blocks rendered as read-only previews. Each stores its full
// original props object as JSON in `data`.
export const CUSTOM_PREVIEW_TYPES = ['statHero', 'barChart', 'emotionGrid', 'callout', 'fileDownload'] as const;
type CustomPreviewType = (typeof CUSTOM_PREVIEW_TYPES)[number];

function parse(data: string): Record<string, unknown> {
  try {
    const v = JSON.parse(data || '{}');
    return v && typeof v === 'object' ? v : {};
  } catch {
    return {};
  }
}

function PreviewShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      contentEditable={false}
      style={{
        position: 'relative',
        border: '1px dashed #cbd5e1',
        borderRadius: 10,
        padding: '12px 12px 8px',
        margin: '8px 0',
        background: '#f8fafc',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: -9,
          left: 12,
          background: '#475569',
          color: '#fff',
          fontSize: '.65rem',
          fontWeight: 600,
          letterSpacing: '.02em',
          padding: '2px 8px',
          borderRadius: 6,
        }}
      >
        {label} · chỉ xem (sửa trong v2)
      </span>
      <div style={{ pointerEvents: 'none' }}>{children}</div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function renderPreview(type: CustomPreviewType, p: Record<string, any>): React.ReactNode {
  switch (type) {
    case 'statHero':
      return <StatHero badge={p.badge} cells={p.cells ?? []} />;
    case 'barChart':
      return <BarChart title={p.title ?? ''} sub={p.sub} titleAccent={p.titleAccent} bars={p.bars ?? []} />;
    case 'emotionGrid':
      return <EmotionGrid title={p.title} titleAccent={p.titleAccent} cards={p.cards ?? []} caption={p.caption} />;
    case 'callout':
      return <Callout tone={p.tone} body={p.body ?? ''} />;
    case 'fileDownload':
      return <FileDownload url={p.url ?? '#'} label={p.label} filename={p.filename} />;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const LABELS: Record<CustomPreviewType, string> = {
  statHero: 'Khối số liệu',
  barChart: 'Biểu đồ cột',
  emotionGrid: 'Lưới cảm xúc',
  callout: 'Ghi chú nổi bật',
  fileDownload: 'Tải file',
};

function makePreviewSpec(type: CustomPreviewType) {
  return createReactBlockSpec(
    { type, propSchema: { data: { default: '{}' } }, content: 'none' },
    {
      render: ({ block }) => (
        <PreviewShell label={LABELS[type]}>
          {renderPreview(type, parse((block.props as { data: string }).data))}
        </PreviewShell>
      ),
    },
  )();
}

// Catch-all for any block type neither built-in nor a known custom preview.
const unsupportedBlock = createReactBlockSpec(
  { type: 'unsupportedBlock', propSchema: { raw: { default: '{}' } }, content: 'none' },
  {
    render: ({ block }) => {
      const raw = parse((block.props as { raw: string }).raw);
      return (
        <PreviewShell label={`Khối "${(raw.type as string) ?? 'không rõ'}"`}>
          <p style={{ color: '#64748b', fontSize: '.85rem', margin: 0 }}>
            Khối nội dung này chưa hỗ trợ chỉnh sửa ở đây nhưng vẫn được giữ nguyên khi lưu.
          </p>
        </PreviewShell>
      );
    },
  },
)();

export const editorSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    statHero: makePreviewSpec('statHero'),
    barChart: makePreviewSpec('barChart'),
    emotionGrid: makePreviewSpec('emotionGrid'),
    callout: makePreviewSpec('callout'),
    fileDownload: makePreviewSpec('fileDownload'),
    unsupportedBlock,
  },
});

type RawBlock = { type?: string; props?: Record<string, unknown> };

/**
 * Stored block document → blocks BlockNote can parse. Custom data blocks are
 * folded into a single `data`/`raw` JSON string so the editor never sees an
 * unknown type (which would throw).
 */
export function toEditorBlocks(blocks: unknown[]): unknown[] {
  if (!Array.isArray(blocks)) return [];
  return blocks.map((b) => {
    const block = (b ?? {}) as RawBlock;
    const type = block.type;
    if (!type) return { type: 'unsupportedBlock', props: { raw: JSON.stringify(block) } };
    if ((CUSTOM_PREVIEW_TYPES as readonly string[]).includes(type)) {
      return { type, props: { data: JSON.stringify(block.props ?? {}) } };
    }
    if (DEFAULT_TYPES.has(type)) return block;
    return { type: 'unsupportedBlock', props: { raw: JSON.stringify(block) } };
  });
}

/**
 * BlockNote document → stored block document. Reverses toEditorBlocks: custom
 * preview blocks are expanded back to their original `{ type, props }` shape.
 */
export function fromEditorBlocks(blocks: unknown[]): unknown[] {
  if (!Array.isArray(blocks)) return [];
  return blocks.map((b) => {
    const block = (b ?? {}) as RawBlock;
    const type = block.type;
    if (type && (CUSTOM_PREVIEW_TYPES as readonly string[]).includes(type)) {
      const data = (block.props as { data?: string } | undefined)?.data ?? '{}';
      return { type, props: parse(data) };
    }
    if (type === 'unsupportedBlock') {
      const raw = (block.props as { raw?: string } | undefined)?.raw ?? '{}';
      return parse(raw);
    }
    return block;
  });
}
