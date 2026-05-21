interface Props {
  tone?: 'info' | 'warn' | 'success' | 'quote';
  body: string;
}

const TONE_BG: Record<string, string> = {
  info: '#dbeafe',
  warn: '#fef3c7',
  success: '#dcfce7',
  quote: '#f3f4f6',
};
const TONE_FG: Record<string, string> = {
  info: '#1e40af',
  warn: '#92400e',
  success: '#166534',
  quote: '#374151',
};

export default function Callout({ tone = 'info', body }: Props) {
  return (
    <aside
      className="callout"
      style={{
        background: TONE_BG[tone],
        color: TONE_FG[tone],
        padding: '16px 20px',
        borderRadius: 12,
        margin: '24px 0',
        borderLeft: `4px solid ${TONE_FG[tone]}`,
      }}
    >
      {body}
    </aside>
  );
}
