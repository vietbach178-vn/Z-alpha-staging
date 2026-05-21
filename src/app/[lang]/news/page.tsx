import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLang, getDictionary, t, type Lang } from '@/lib/i18n';
import { NEWS_CATEGORIES, getSortedNews } from '@/data/news-sample';
import NewsCard from '@/components/public/NewsCard';
import FilterToolbar from '@/components/public/FilterToolbar';
import Newsletter from '@/components/public/Newsletter';

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

  const items = getSortedNews();

  const chips = NEWS_CATEGORIES.map((cat) => ({
    id: cat.id,
    label: cat.label[lang],
    tone: cat.tone,
  }));

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

          <div className="research-grid-3" data-filter-grid>
            {items.map((item) => (
              <NewsCard key={item.id} item={item} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      <Newsletter dict={dict} muted />
    </>
  );
}
