interface Props {
  url: string;
  caption?: string;
}

/** Auto-detect YouTube / Vimeo URLs and embed via their iframe APIs; fall back to direct video tag for upload URLs. */
export default function VideoEmbed({ url, caption }: Props) {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  const vmMatch = url.match(/vimeo\.com\/(\d+)/);

  let src: string | null = null;
  if (ytMatch) src = `https://www.youtube.com/embed/${ytMatch[1]}`;
  else if (vmMatch) src = `https://player.vimeo.com/video/${vmMatch[1]}`;

  return (
    <figure style={{ margin: '24px 0' }}>
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 12 }}>
        {src ? (
          <iframe
            src={src}
            title={caption ?? 'Embedded video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        ) : (
          <video controls src={url} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        )}
      </div>
      {caption && <figcaption style={{ marginTop: 8, color: '#6b7280', fontSize: '.9rem' }}>{caption}</figcaption>}
    </figure>
  );
}
