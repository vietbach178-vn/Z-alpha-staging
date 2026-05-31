import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLang, getDictionary, localizedHref, type Lang } from '@/lib/i18n';
import { getNewsBySlug, listNewsSlugs, pickBody, pickL } from '@/lib/repos';
import BlockRenderer from '@/components/editor/BlockRenderer';
import ContactCta from '@/components/public/ContactCta';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const slugs = await listNewsSlugs();
  return slugs.flatMap((slug) => [
    { lang: 'vi', slug },
    { lang: 'en', slug },
  ]);
}

export async function generateMetadata({ params }: PageProps<'/[lang]/news/[slug]'>): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};
  const row = await getNewsBySlug(slug);
  if (!row) return {};
  return {
    title: pickL(row.titleVi, row.titleEn, lang),
    description: pickL(row.excerptVi, row.excerptEn, lang) ?? undefined,
    openGraph: { images: row.heroImage ? [row.heroImage] : undefined },
  };
}

export default async function NewsDetailPage({ params }: PageProps<'/[lang]/news/[slug]'>) {
  const { lang: rawLang, slug } = await params;
  if (!isLang(rawLang)) notFound();
  const lang = rawLang as Lang;
  const dict = await getDictionary(lang);

  const row = await getNewsBySlug(slug);
  if (!row) notFound();

  const title = pickL(row.titleVi, row.titleEn, lang);
  const blocks = pickBody(row, lang);
  const catLabel = row.category ? pickL(row.category.labelVi, row.category.labelEn, lang) : null;

  return (
    <>
      <article className="research-article">
        <div className="container container--narrow" style={{ maxWidth: 760, marginInline: 'auto' }}>
          <Link href={localizedHref('news', lang)} className="research-back">
            <i data-lucide="arrow-left" className="icon-sm" />
            {lang === 'vi' ? 'Quay lại tin tức' : 'Back to news'}
          </Link>

          <header className="research-article__head">
            {catLabel && row.category && (
              <span className={`topic-chip topic-chip--${row.category.tone}`}>{catLabel}</span>
            )}
            <h1 className="research-article__title">{title}</h1>
            {row.publishedAt && (
              <p className="research-article__meta">
                <span>
                  {row.publishedAt.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
                {row.source && (
                  <>
                    <span className="dot">・</span>
                    <span>{row.source}</span>
                  </>
                )}
              </p>
            )}
            {row.heroImage && (
              <img src={row.heroImage} alt={title} className="article__hero" style={{ width: '100%', borderRadius: 12, margin: '1.5rem 0 2rem' }} />
            )}
          </header>

          <BlockRenderer blocks={blocks} />

          <div className="research-article__cta">
            <Link href={localizedHref('news', lang)} className="btn btn-outline">
              <i data-lucide="arrow-left" className="icon-sm" />
              {lang === 'vi' ? 'Xem tất cả tin tức' : 'View all news'}
            </Link>
          </div>
        </div>
      </article>

      <ContactCta dict={dict} lang={lang} muted />
    </>
  );
}
