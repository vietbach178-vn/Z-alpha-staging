import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLang, getDictionary, localizedHref, t, type Lang } from '@/lib/i18n';
import { getResearchBySlug, listResearchSlugs, pickBody, pickL } from '@/lib/repos';
import BlockRenderer from '@/components/editor/BlockRenderer';
import Newsletter from '@/components/public/Newsletter';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const slugs = await listResearchSlugs();
  return slugs.flatMap((slug) => [
    { lang: 'vi', slug },
    { lang: 'en', slug },
  ]);
}

export async function generateMetadata({ params }: PageProps<'/[lang]/activities/research/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};
  const row = await getResearchBySlug(slug);
  if (!row) return {};
  return {
    title: pickL(row.seoTitleVi ?? row.titleVi, row.seoTitleEn ?? row.titleEn, lang),
    description: pickL(row.seoDescVi ?? row.excerptVi, row.seoDescEn ?? row.excerptEn, lang) ?? undefined,
    openGraph: {
      images: row.seoOgImage ? [row.seoOgImage] : row.heroImage ? [row.heroImage] : undefined,
    },
  };
}

export default async function ResearchDetailPage({ params }: PageProps<'/[lang]/activities/research/[slug]'>) {
  const { lang: rawLang, slug } = await params;
  if (!isLang(rawLang)) notFound();
  const lang = rawLang as Lang;
  const dict = await getDictionary(lang);

  const row = await getResearchBySlug(slug);
  if (!row) notFound();

  const title = pickL(row.titleVi, row.titleEn, lang);
  const typeLabel = pickL(row.typeVi, row.typeEn, lang);
  const blocks = pickBody(row, lang);
  const attachments = row.attachments ?? [];

  const formatSize = (bytes: number | null | undefined) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const langBadge = (l: 'VI' | 'EN' | 'OTHER') => {
    if (l === 'VI') return t(dict, 'research.langVi');
    if (l === 'EN') return t(dict, 'research.langEn');
    return t(dict, 'research.langOther');
  };

  const Downloads = () => attachments.length > 0 ? (
    <section className="research-downloads" aria-labelledby="downloads-heading">
      <div className="research-downloads__head">
        <span className="research-downloads__pip" aria-hidden="true">
          <i data-lucide="download" className="icon-sm" />
        </span>
        <div>
          <h2 id="downloads-heading" className="research-downloads__title">
            {t(dict, 'research.downloadSection')}
          </h2>
          <p className="research-downloads__lead">{t(dict, 'research.downloadLead')}</p>
        </div>
      </div>
      <ul className="research-downloads__list">
        {attachments.map((att) => {
          const label = pickL(att.labelVi, att.labelEn, lang) ?? att.fileName;
          const size = formatSize(att.fileSize);
          return (
            <li key={att.id} className="research-downloads__item">
              <span className="research-downloads__icon" aria-hidden="true">
                <i data-lucide="file-text" className="icon-md" />
              </span>
              <div className="research-downloads__meta">
                <p className="research-downloads__name">{label}</p>
                <p className="research-downloads__sub">
                  <span className="research-downloads__badge">{langBadge(att.language)}</span>
                  {size && <span>{size}</span>}
                </p>
              </div>
              <a
                href={att.fileUrl}
                download={att.fileName}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                {t(dict, 'research.downloadButton')}
                <i data-lucide="download" className="icon-sm" />
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  ) : null;

  return (
    <>
      <article className="research-article">
        <div className="container">
          <Link href={localizedHref('activities/research', lang)} className="research-back">
            <i data-lucide="arrow-left" className="icon-sm" />
            {lang === 'vi' ? 'Quay lại nghiên cứu' : 'Back to research'}
          </Link>

          <header className="research-article__head">
            {typeLabel && (
              <span className="research-article__type">
                <i data-lucide="file-text" className="icon-sm" />
                {typeLabel}
              </span>
            )}
            <h1 className="research-article__title">{title}</h1>
            {row.publishedAt && (
              <p className="research-article__meta">
                <span>
                  {row.publishedAt.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
                    year: 'numeric', month: 'long',
                  })}
                </span>
                {row.author && (
                  <>
                    <span className="dot">・</span>
                    <span>{lang === 'vi' ? 'Tác giả' : 'Author'}: {row.author.name}</span>
                  </>
                )}
              </p>
            )}
          </header>

          <Downloads />

          <BlockRenderer blocks={blocks} />

          <Downloads />

          <div className="research-article__cta">
            <Link href={localizedHref('activities/research', lang)} className="btn btn-outline">
              <i data-lucide="arrow-left" className="icon-sm" />
              {lang === 'vi' ? 'Xem tất cả nghiên cứu' : 'View all research'}
            </Link>
          </div>
        </div>
      </article>

      <Newsletter dict={dict} muted />
    </>
  );
}
