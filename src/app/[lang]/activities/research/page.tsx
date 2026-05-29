import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { isLang, getDictionary, localizedHref, t, type Lang } from '@/lib/i18n';
import { listPublishedResearch, listTopics, pickL } from '@/lib/repos';
import FilterToolbar from '@/components/public/FilterToolbar';
import Newsletter from '@/components/public/Newsletter';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps<'/[lang]/activities/research'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: t(dict, 'research.metaTitle') };
}

const fmtDate = (iso: Date, lang: Lang) =>
  iso.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long' });

export default async function ResearchIndexPage({ params }: PageProps<'/[lang]/activities/research'>) {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) notFound();
  const lang = rawLang as Lang;
  const dict = await getDictionary(lang);

  const [allItems, topics] = await Promise.all([
    listPublishedResearch(),
    listTopics(),
  ]);

  const featured = allItems.filter((a) => a.featured).slice(0, 4);
  const rest = allItems.filter((a) => !a.featured);

  const chips = topics.map((topic) => ({
    id: topic.slug,
    label: pickL(topic.labelVi, topic.labelEn, lang),
    tone: topic.tone,
  }));

  const [hero, ...sideFeatured] = featured;

  return (
    <>
      <section className="research-page-hero">
        <div className="container">
          <span className="hero-eyebrow">
            <i data-lucide="microscope" className="icon-sm" />
            {t(dict, 'research.title')}
          </span>
          <h1 className="research-page-hero__title">{t(dict, 'research.title')}</h1>
          <p className="research-page-hero__lead">{t(dict, 'research.lead')}</p>
        </div>
      </section>

      {hero && (
        <section className="section" style={{ paddingTop: 32 }}>
          <div className="container">
            <div className="research-section-head">
              <span className="research-section-eyebrow">
                <i data-lucide="star" className="icon-sm" />
                {t(dict, 'research.featuredHeading')}
              </span>
            </div>

            <div className={`featured-research-grid ${sideFeatured.length === 0 ? 'is-hero-only' : ''}`}>
              <Link href={localizedHref(`activities/research/${hero.slug}`, lang)} className="featured-hero-card">
                <div className={`featured-hero-card__media tone-${hero.topic?.tone ?? 'blue'}`}>
                  {hero.heroImage ? (
                    <img src={hero.heroImage} alt="" />
                  ) : (
                    <div className="featured-hero-card__icon-stack" aria-hidden="true">
                      <div className="t1"><i data-lucide="users" className="icon-xl" /></div>
                      <div className="t3"><i data-lucide="brain" className="icon-lg" /></div>
                      <div className="t2"><i data-lucide="message-circle-off" className="icon-lg" /></div>
                    </div>
                  )}
                </div>
                <div className="featured-hero-card__body">
                  {hero.topic && (
                    <span className={`topic-chip topic-chip--${hero.topic.tone}`}>
                      {pickL(hero.topic.labelVi, hero.topic.labelEn, lang)}
                    </span>
                  )}
                  <h3 className="featured-hero-card__title">{pickL(hero.titleVi, hero.titleEn, lang)}</h3>
                  <p className="featured-hero-card__excerpt">{pickL(hero.excerptVi, hero.excerptEn, lang)}</p>
                  <div className="featured-hero-card__footer">
                    {hero.publishedAt && <time>{fmtDate(hero.publishedAt, lang)}</time>}
                    {hero.readingTime && (
                      <>
                        <span className="dot" aria-hidden="true">·</span>
                        <span>{hero.readingTime} {t(dict, 'research.minRead')}</span>
                      </>
                    )}
                    <span className="featured-hero-card__cta">
                      {t(dict, 'common.readMoreInline')}
                      <i data-lucide="arrow-right" className="icon-sm" />
                    </span>
                  </div>
                </div>
              </Link>

              {sideFeatured.length > 0 && (
                <div className="featured-side-stack">
                  {sideFeatured.map((item) => (
                    <Link key={item.id} href={localizedHref(`activities/research/${item.slug}`, lang)} className="featured-side-card">
                      <div className={`featured-side-card__media tone-${item.topic?.tone ?? 'blue'}`}>
                        {item.heroImage ? (
                          <img src={item.heroImage} alt="" loading="lazy" />
                        ) : (
                          <div className="featured-side-card__placeholder" aria-hidden="true">
                            <i data-lucide="file-text" className="icon-lg" />
                          </div>
                        )}
                      </div>
                      <div className="featured-side-card__body">
                        {item.topic && (
                          <span className={`topic-chip topic-chip--${item.topic.tone}`}>
                            {pickL(item.topic.labelVi, item.topic.labelEn, lang)}
                          </span>
                        )}
                        <h4 className="featured-side-card__title">{pickL(item.titleVi, item.titleEn, lang)}</h4>
                        <p className="featured-side-card__excerpt">{pickL(item.excerptVi, item.excerptEn, lang)}</p>
                        <div className="featured-side-card__footer">
                          {item.publishedAt && <time>{fmtDate(item.publishedAt, lang)}</time>}
                          {item.readingTime && (
                            <>
                              <span className="dot" aria-hidden="true">·</span>
                              <span>{item.readingTime} {t(dict, 'research.minRead')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="section" id="all-research" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="research-section-head">
            <h2 className="research-section-title">{t(dict, 'research.allHeading')}</h2>
          </div>

          <Suspense fallback={null}>
            <FilterToolbar
              paramName="topic"
              chips={chips}
              dataAttr="data-topic"
              dict={{
                filterAll: t(dict, 'research.filterAll'),
                searchPlaceholder: t(dict, 'research.searchPlaceholder'),
                searchLabel: t(dict, 'research.searchLabel'),
                filterLabel: t(dict, 'research.filterLabel'),
                noResults: t(dict, 'research.noResults'),
                clearFilters: t(dict, 'research.clearFilters'),
              }}
            />
          </Suspense>

          <div className="research-grid-3" data-filter-grid>
            {rest.length === 0 ? (
              <p style={{ color: '#6b7280', gridColumn: '1 / -1' }}>
                {lang === 'vi' ? 'Chưa có bài nghiên cứu nào ngoài bài nổi bật.' : 'No more articles beyond featured.'}
              </p>
            ) : (
              rest.map((item) => {
                const title = pickL(item.titleVi, item.titleEn, lang);
                const excerpt = pickL(item.excerptVi, item.excerptEn, lang) ?? '';
                const topicLabel = item.topic ? pickL(item.topic.labelVi, item.topic.labelEn, lang) : '';
                const search = [item.titleVi, item.titleEn ?? '', item.excerptVi ?? '', item.excerptEn ?? '', topicLabel]
                  .join(' ').toLowerCase();
                return (
                  <Link
                    key={item.id}
                    href={localizedHref(`activities/research/${item.slug}`, lang)}
                    className="research-card-v2"
                    data-card="true"
                    data-topic={item.topic?.slug ?? ''}
                    data-search={search}
                  >
                    <div className={`research-card-v2__media tone-${item.topic?.tone ?? 'blue'}`}>
                      {item.heroImage ? (
                        <img src={item.heroImage} alt="" loading="lazy" />
                      ) : (
                        <div className="research-card-v2__icon-stack" aria-hidden="true">
                          <div className="t1"><i data-lucide="users" className="icon-lg" /></div>
                          <div className="t3"><i data-lucide="brain" className="icon-md" /></div>
                          <div className="t2"><i data-lucide="message-circle-off" className="icon-md" /></div>
                        </div>
                      )}
                    </div>
                    <div className="research-card-v2__body">
                      <div className="research-card-v2__meta">
                        {item.topic && (
                          <span className={`topic-chip topic-chip--${item.topic.tone}`}>{topicLabel}</span>
                        )}
                      </div>
                      <h3 className="research-card-v2__title">{title}</h3>
                      <p className="research-card-v2__excerpt">{excerpt}</p>
                      <div className="research-card-v2__footer">
                        {item.publishedAt && (
                          <time className="research-card-v2__date">{fmtDate(item.publishedAt, lang)}</time>
                        )}
                        {item.readingTime && (
                          <>
                            <span className="research-card-v2__dot" aria-hidden="true">·</span>
                            <span className="research-card-v2__read">{item.readingTime} {t(dict, 'research.minRead')}</span>
                          </>
                        )}
                      </div>
                    </div>
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
