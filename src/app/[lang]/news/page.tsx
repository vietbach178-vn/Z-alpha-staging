import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isLang, getDictionary, localizedHref, t, type Lang } from '@/lib/i18n';
import { listPublishedNews, listNewsCategories, pickL } from '@/lib/repos';
import FilterToolbar from '@/components/public/FilterToolbar';
import Newsletter from '@/components/public/Newsletter';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps<'/[lang]/news'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: t(dict, 'news.metaTitle') };
}

export default async function NewsIndexPage({ params }: PageProps<'/[lang]/news'>) {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) notFound();
  const lang = rawLang as Lang;
  const dict = await getDictionary(lang);

  const [items, categories] = await Promise.all([
    listPublishedNews(),
    listNewsCategories(),
  ]);

  const chips = categories.map((cat) => ({
    id: cat.slug,
    label: pickL(cat.labelVi, cat.labelEn, lang),
    tone: cat.tone,
  }));

  const fmtDate = (d: Date) =>
    d.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <>
      <section className="research-page-hero">
        <div className="container">
          <span className="hero-eyebrow">
            <i data-lucide="newspaper" className="icon-sm" />
            {t(dict, 'news.title')}
          </span>
          <h1 className="research-page-hero__title">{t(dict, 'news.title')}</h1>
          <p className="research-page-hero__lead">{t(dict, 'news.lead')}</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 32 }}>
        <div className="container">
          <Suspense fallback={null}>
            <FilterToolbar
              paramName="cat"
              chips={chips}
              dataAttr="data-category"
              dict={{
                filterAll: t(dict, 'news.filterAll'),
                searchPlaceholder: t(dict, 'news.searchPlaceholder'),
                searchLabel: t(dict, 'news.searchLabel'),
                filterLabel: t(dict, 'news.filterLabel'),
                noResults: t(dict, 'news.noResults'),
                clearFilters: t(dict, 'news.clearFilters'),
              }}
            />
          </Suspense>

          <div className="research-grid-3" data-filter-grid>
            {items.length === 0 ? (
              <p style={{ color: '#6b7280', gridColumn: '1 / -1' }}>
                {lang === 'vi' ? 'Chưa có tin tức nào.' : 'No news yet.'}
              </p>
            ) : (
              items.map((item) => {
                const title = pickL(item.titleVi, item.titleEn, lang);
                const excerpt = pickL(item.excerptVi, item.excerptEn, lang) ?? '';
                const catLabel = item.category ? pickL(item.category.labelVi, item.category.labelEn, lang) : '';
                const catTone = item.category?.tone ?? 'blue';
                const search = [item.titleVi, item.titleEn ?? '', item.excerptVi ?? '', item.excerptEn ?? '', catLabel, item.source ?? ''].join(' ').toLowerCase();
                const href = item.externalUrl ?? localizedHref(`news/${item.slug}`, lang);
                const isExternal = !!item.externalUrl;

                const inner = (
                  <>
                    <div className={`research-card-v2__media tone-${catTone}`}>
                      {item.heroImage ? (
                        <img src={item.heroImage} alt="" loading="lazy" />
                      ) : (
                        <div className="research-card-v2__icon-stack" aria-hidden="true">
                          <div className="t1"><i data-lucide="newspaper" className="icon-lg" /></div>
                        </div>
                      )}
                    </div>
                    <div className="research-card-v2__body">
                      <div className="research-card-v2__meta">
                        {item.category && (
                          <span className={`topic-chip topic-chip--${catTone}`}>{catLabel}</span>
                        )}
                      </div>
                      <h3 className="research-card-v2__title">{title}</h3>
                      <p className="research-card-v2__excerpt">{excerpt}</p>
                      <div className="research-card-v2__footer">
                        {item.publishedAt && (
                          <time className="research-card-v2__date">{fmtDate(item.publishedAt)}</time>
                        )}
                        {item.source && (
                          <>
                            <span className="research-card-v2__dot" aria-hidden="true">·</span>
                            <span className="research-card-v2__read">{item.source}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                );

                const cardProps = {
                  className: 'research-card-v2',
                  'data-card': 'true',
                  'data-category': item.category?.slug ?? '',
                  'data-search': search,
                };

                return isExternal ? (
                  <a key={item.id} {...cardProps} href={href} target="_blank" rel="noopener noreferrer">
                    {inner}
                  </a>
                ) : (
                  <Link key={item.id} {...cardProps} href={href}>
                    {inner}
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      <Newsletter dict={dict} muted />
    </>
  );
}
