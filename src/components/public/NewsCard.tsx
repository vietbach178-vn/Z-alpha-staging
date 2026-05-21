import Link from 'next/link';
import type { Lang } from '@/lib/i18n';
import { localizedHref } from '@/lib/i18n';
import { type NewsItem, getNewsCategoryById } from '@/data/news-sample';

interface Props { item: NewsItem; lang: Lang }

export default function NewsCard({ item, lang }: Props) {
  const cat = getNewsCategoryById(item.category);
  const catLabel = cat?.label[lang] ?? '';
  const catTone = cat?.tone ?? 'blue';

  const date = new Date(item.publishedAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const href = item.externalUrl ?? localizedHref(`news/${item.slug}`, lang);
  const isExternal = !!item.externalUrl;

  const searchCorpus = [
    item.title[lang], item.title.vi, item.title.en,
    item.excerpt[lang], item.excerpt.vi, item.excerpt.en,
    catLabel, item.source ?? '',
  ].join(' ').toLowerCase();

  const body = (
    <>
      <div className={`research-card-v2__media tone-${catTone}`}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="" loading="lazy" />
        ) : (
          <div className="research-card-v2__icon-stack" aria-hidden="true">
            <div className="t1"><i data-lucide="newspaper" className="icon-lg" /></div>
          </div>
        )}
      </div>

      <div className="research-card-v2__body">
        <div className="research-card-v2__meta">
          <span className={`topic-chip topic-chip--${catTone}`}>{catLabel}</span>
        </div>

        <h3 className="research-card-v2__title">{item.title[lang]}</h3>
        <p className="research-card-v2__excerpt">{item.excerpt[lang]}</p>

        <div className="research-card-v2__footer">
          <time className="research-card-v2__date">{date}</time>
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

  const commonProps = {
    className: 'research-card-v2',
    'data-card': 'true',
    'data-category': item.category,
    'data-search': searchCorpus,
  };

  return isExternal ? (
    <a {...commonProps} href={href} target="_blank" rel="noopener noreferrer">{body}</a>
  ) : (
    <Link {...commonProps} href={href}>{body}</Link>
  );
}
