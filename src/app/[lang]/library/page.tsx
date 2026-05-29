import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { isLang, getDictionary, t, type Lang } from '@/lib/i18n';
import { listPublishedLibrary, pickL } from '@/lib/repos';
import FilterToolbar from '@/components/public/FilterToolbar';
import Newsletter from '@/components/public/Newsletter';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps<'/[lang]/library'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: t(dict, 'library.metaTitle') };
}

const formatSize = (bytes: number | null) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const CATEGORY_ICON: Record<'BOOK' | 'REPORT' | 'REFERENCE', string> = {
  BOOK: 'book-open',
  REPORT: 'file-text',
  REFERENCE: 'bookmark',
};
const CATEGORY_TONE: Record<'BOOK' | 'REPORT' | 'REFERENCE', 'teal' | 'blue' | 'orange'> = {
  BOOK: 'teal',
  REPORT: 'blue',
  REFERENCE: 'orange',
};

export default async function LibraryPage({ params }: PageProps<'/[lang]/library'>) {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) notFound();
  const lang = rawLang as Lang;
  const dict = await getDictionary(lang);

  const items = await listPublishedLibrary();

  const chips = [
    { id: 'BOOK',      label: t(dict, 'library.categoryBook'),      tone: 'teal' },
    { id: 'REPORT',    label: t(dict, 'library.categoryReport'),    tone: 'blue' },
    { id: 'REFERENCE', label: t(dict, 'library.categoryReference'), tone: 'orange' },
  ];

  return (
    <>
      <section className="page-hero">
        <span className="glow glow-orange" />
        <div className="container">
          <span className="hero-eyebrow">
            <i data-lucide="library" className="icon-sm" />
            {t(dict, 'nav.library')}
          </span>
          <h1>{t(dict, 'library.title')}</h1>
          <p className="section-lead">{t(dict, 'library.lead')}</p>
        </div>
      </section>

      <section className="section" id="all-library">
        <div className="container">
          <Suspense fallback={null}>
            <FilterToolbar
              paramName="category"
              chips={chips}
              dataAttr="data-category"
              dict={{
                filterAll: t(dict, 'library.filterAll'),
                searchPlaceholder: t(dict, 'common.search'),
                searchLabel: t(dict, 'common.search'),
                filterLabel: t(dict, 'library.filterLabel'),
                noResults: t(dict, 'library.noResults'),
                clearFilters: lang === 'vi' ? 'Xoá bộ lọc' : 'Clear filters',
              }}
            />
          </Suspense>

          <div className="research-grid-3" data-filter-grid>
            {items.length === 0 ? (
              <div className="research-empty" style={{ gridColumn: '1 / -1' }}>
                <i data-lucide="library" className="icon-lg" />
                <p>{t(dict, 'library.comingSoonNote')}</p>
              </div>
            ) : (
              items.map((item) => {
                const title = pickL(item.titleVi, item.titleEn, lang);
                const desc = pickL(item.descriptionVi, item.descriptionEn, lang) ?? '';
                const cat = item.category as 'BOOK' | 'REPORT' | 'REFERENCE';
                const tone = CATEGORY_TONE[cat];
                const iconName = CATEGORY_ICON[cat];
                const catLabel =
                  cat === 'BOOK'   ? t(dict, 'library.categoryBook') :
                  cat === 'REPORT' ? t(dict, 'library.categoryReport') :
                                     t(dict, 'library.categoryReference');
                const search = [item.titleVi, item.titleEn ?? '', item.descriptionVi ?? '', item.descriptionEn ?? '', catLabel]
                  .join(' ').toLowerCase();
                return (
                  <article
                    key={item.id}
                    className="library-card"
                    data-card="true"
                    data-category={cat}
                    data-search={search}
                  >
                    <div className={`library-card__media tone-${tone}`}>
                      {item.thumbnailUrl ? (
                        <img src={item.thumbnailUrl} alt="" loading="lazy" />
                      ) : (
                        <div className="library-card__icon" aria-hidden="true">
                          <i data-lucide={iconName} className="icon-xl" />
                        </div>
                      )}
                    </div>
                    <div className="library-card__body">
                      <span className={`topic-chip topic-chip--${tone}`}>{catLabel}</span>
                      <h3 className="library-card__title">{title}</h3>
                      {desc && <p className="library-card__excerpt">{desc}</p>}
                      <div className="library-card__footer">
                        <span className="library-card__meta">
                          {formatSize(item.fileSize)}
                        </span>
                        <a
                          href={item.fileUrl}
                          download={item.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          aria-label={`${t(dict, 'library.download')}: ${title}`}
                        >
                          {t(dict, 'library.download')}
                          <i data-lucide="download" className="icon-sm" />
                        </a>
                      </div>
                    </div>
                  </article>
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
