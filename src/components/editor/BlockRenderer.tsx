import StatHero from './blocks/StatHero';
import BarChart from './blocks/BarChart';
import EmotionGrid from './blocks/EmotionGrid';
import Callout from './blocks/Callout';
import VideoEmbed from './blocks/VideoEmbed';
import FileDownload from './blocks/FileDownload';

/**
 * Block-document shape. Inspired by BlockNote's document structure but kept
 * independent so we control rendering. Each block has:
 *   { type, props?, content?, children? }
 *
 * - "paragraph", "heading", "bulletListItem", "numberedListItem" — content[] = inline text runs
 * - "image", "video", "callout", "divider", "statHero", "barChart", "emotionGrid", "fileDownload"
 *   — props carry the data
 */
export interface InlineRun {
  type: 'text';
  text: string;
  styles?: { bold?: boolean; italic?: boolean; underline?: boolean };
}

export type BlockNode =
  | { type: 'paragraph'; content?: InlineRun[] }
  | { type: 'heading'; props?: { level?: 1 | 2 | 3 | 4 }; content?: InlineRun[] }
  | { type: 'bulletListItem'; content?: InlineRun[] }
  | { type: 'numberedListItem'; content?: InlineRun[] }
  | { type: 'quote'; content?: InlineRun[] }
  | { type: 'divider' }
  | { type: 'image'; props: { url: string; alt?: string; caption?: string } }
  | { type: 'video'; props: { url: string; caption?: string } }
  | { type: 'callout'; props: { tone?: 'info' | 'warn' | 'success' | 'quote'; body: string } }
  | { type: 'fileDownload'; props: { url: string; label?: string; filename?: string } }
  | { type: 'statHero'; props: { badge?: string; cells: { value: string; labelStrong: string; labelSpan?: string; unit?: string }[] } }
  | {
      type: 'barChart';
      props: {
        title: string;
        sub?: string;
        titleAccent?: 'red';
        bars: { labelStrong: string; labelSpan?: string; value: number; color?: 'blue' | 'red' | 'orange' | 'teal' }[];
      };
    }
  | {
      type: 'emotionGrid';
      props: {
        title?: string;
        titleAccent?: 'red';
        cards: { emoji: string; label: string; sub?: string; tone?: 'red' | 'blue' | 'teal' | 'orange' }[];
        caption?: string;
      };
    };

function renderInline(content?: InlineRun[]) {
  if (!content) return null;
  return content.map((run, i) => {
    let el: React.ReactNode = run.text;
    if (run.styles?.bold) el = <strong key={i}>{el}</strong>;
    if (run.styles?.italic) el = <em key={i}>{el}</em>;
    if (run.styles?.underline) el = <u key={i}>{el}</u>;
    return <span key={i}>{el}</span>;
  });
}

function renderBlock(block: BlockNode, key: number): React.ReactNode {
  switch (block.type) {
    case 'paragraph':
      return <p key={key}>{renderInline(block.content)}</p>;

    case 'heading': {
      const level = block.props?.level ?? 2;
      const Tag = (`h${level}` as 'h1' | 'h2' | 'h3' | 'h4');
      return <Tag key={key}>{renderInline(block.content)}</Tag>;
    }

    case 'bulletListItem':
      return <li key={key}>{renderInline(block.content)}</li>;

    case 'numberedListItem':
      return <li key={key}>{renderInline(block.content)}</li>;

    case 'quote':
      return (
        <blockquote key={key} style={{ borderLeft: '4px solid #2563eb', padding: '8px 16px', margin: '16px 0', color: '#374151' }}>
          {renderInline(block.content)}
        </blockquote>
      );

    case 'divider':
      return <hr key={key} style={{ margin: '32px 0', border: 0, borderTop: '1px solid #e5e7eb' }} />;

    case 'image':
      return (
        <figure key={key} style={{ margin: '24px 0' }}>
          <img src={block.props.url} alt={block.props.alt ?? ''} style={{ maxWidth: '100%', borderRadius: 12 }} />
          {block.props.caption && (
            <figcaption style={{ marginTop: 8, color: '#6b7280', fontSize: '.9rem' }}>{block.props.caption}</figcaption>
          )}
        </figure>
      );

    case 'video':
      return <VideoEmbed key={key} {...block.props} />;

    case 'callout':
      return <Callout key={key} {...block.props} />;

    case 'fileDownload':
      return <FileDownload key={key} {...block.props} />;

    case 'statHero':
      return <StatHero key={key} {...block.props} />;

    case 'barChart':
      return <BarChart key={key} {...block.props} />;

    case 'emotionGrid':
      return <EmotionGrid key={key} {...block.props} />;

    default:
      return null;
  }
}

interface Props {
  blocks: BlockNode[];
}

/**
 * Render an array of blocks. Groups consecutive list items into a single <ul> / <ol>.
 */
export default function BlockRenderer({ blocks }: Props) {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  const out: React.ReactNode[] = [];
  let listBuffer: BlockNode[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    const items = listBuffer.map((b, i) => renderBlock(b, i));
    out.push(
      listType === 'ol'
        ? <ol key={`l-${out.length}`}>{items}</ol>
        : <ul key={`l-${out.length}`}>{items}</ul>
    );
    listBuffer = [];
    listType = null;
  };

  blocks.forEach((block, i) => {
    if (block.type === 'bulletListItem') {
      if (listType !== 'ul') flushList();
      listType = 'ul';
      listBuffer.push(block);
    } else if (block.type === 'numberedListItem') {
      if (listType !== 'ol') flushList();
      listType = 'ol';
      listBuffer.push(block);
    } else {
      flushList();
      out.push(renderBlock(block, i));
    }
  });
  flushList();

  return <>{out}</>;
}
