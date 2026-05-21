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

export async function generateMetadata({ params }: PageProps<'/[lang]/research/[slug]'>): Promise<Metadata> {
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

export default async function ResearchDetailPage({ params }: PageProps<'/[lang]/research/[slug]'>) {
  const { lang: rawLang, slug } = await params;
  if (!isLang(rawLang)) notFound();
  const lang = rawLang as Lang;
  const dict = await getDictionary(lang);

  const row = await getResearchBySlug(slug);
  if (!row) notFound();

  const title = pickL(row.titleVi, row.titleEn, lang);
  const typeLabel = pickL(row.typeVi, row.typeEn, lang);
  const blocks = pickBody(row, lang);

  return (
    <>
      <article className="research-article">
        <div className="container">
          <Link href={localizedHref('research', lang)} className="research-back">
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

          <BlockRenderer blocks={blocks} />

          <div className="research-article__cta">
            <Link href={localizedHref('research', lang)} className="btn btn-outline">
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
