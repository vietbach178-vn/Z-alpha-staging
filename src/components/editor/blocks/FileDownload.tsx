interface Props {
  url: string;
  label?: string;
  filename?: string;
}

export default function FileDownload({ url, label, filename }: Props) {
  return (
    <a
      href={url}
      download={filename}
      className="btn btn-outline"
      style={{ margin: '16px 0', display: 'inline-flex', gap: 8 }}
    >
      <i data-lucide="download" className="icon-sm" />
      {label ?? 'Tải file'}
    </a>
  );
}
