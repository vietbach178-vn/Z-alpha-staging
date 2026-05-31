'use client';

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { useEffect, useState } from 'react';
import { editorSchema, toEditorBlocks, fromEditorBlocks } from './editorSchema';

interface Props {
  initialContent?: unknown[];
  onChange?: (blocks: unknown[]) => void;
  className?: string;
}

/**
 * BlockNote editor — uses the built-in block schema (paragraph, heading, lists,
 * image, table, etc.). Custom blocks (StatHero, BarChart, EmotionGrid) are
 * scheduled for v2 — for now editors can author rich text + headings + lists +
 * images here; visual data blocks are migrated automatically and rendered via
 * BlockRenderer on the frontend.
 */
export default function BlockEditor({ initialContent, onChange, className }: Props) {
  const editor = useCreateBlockNote({
    schema: editorSchema,
    initialContent: Array.isArray(initialContent) && initialContent.length > 0
      ? (toEditorBlocks(initialContent) as never)
      : undefined,
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ minHeight: 300, background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: 8 }} />;

  return (
    <div className={className} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 8, background: '#fff', minHeight: 400 }}>
      <BlockNoteView
        editor={editor}
        onChange={() => {
          onChange?.(fromEditorBlocks(editor.document as unknown as unknown[]));
        }}
        theme="light"
      />
    </div>
  );
}
