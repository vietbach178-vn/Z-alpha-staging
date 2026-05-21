import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLang, getDictionary, t, type Lang } from '@/lib/i18n';
import { TOPICS, getFeaturedItems, getNonFeaturedItems } from '@/data/research-sample';
import ResearchCard from '@/components/public/ResearchCard';
import FeaturedResearch from '@/components/public/FeaturedResearch';
import FilterToolbar from '@/components/public/FilterToolbar';
import Newsletter from '@/components/public/Newsletter';

export async function generateMetadata({ params }: PageProps<'/[lang]/research'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: t(dict, 'research.metaTitle') };
}

export default async function ResearchIndexPage({ params }: PageProps<'/[lang]/research'>) {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) notFound();
  const lang = rawLang as Lang;
  const dict = await getDictionary(lang);

  const featured = getFeaturedItems();
  const rest = getNonFeaturedItems();

  const chips = TOPICS.map((topic) => ({
    id: topic.id,
    label: topic.label[lang],
    tone: topic.tone,
  }));

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

      {featured.length > 0 && (
        <section className="section" style={{ paddingTop: 32 }}>
          <div className="container">
            <div className="research-section-head">
              <span className="research-section-eyebrow">
                <i data-lucide="star" className="icon-sm" />
                {t(dict, 'research.featuredHeading')}
              </span>
            </div>
            <FeaturedResearch items={featured} lang={lang} dict={dict} />
          </div>
        </section>
      )}

      <section className="section" id="all-research" style={{ paddingTop: 32 }}>
        <div className="container">
          <div className="research-section-head">
            <h2 className="research-section-title">{t(dict, 'research.allHeading')}</h2>
          </div>

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

          <div className="research-grid-3" data-filter-grid>
            {rest.map((item) => (
              <ResearchCard key={item.id} item={item} lang={lang} dict={dict} />
            ))}
          </div>
        </div>
      </section>

      <Newsletter dict={dict} muted />
    </>
  );
}
