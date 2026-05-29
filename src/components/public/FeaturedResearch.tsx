import Link from 'next/link';
import type { Lang } from '@/lib/i18n';
import { localizedHref, t, getDictionary } from '@/lib/i18n';
import { type ResearchItem, getTopicById } from '@/data/research-sample';

interface Props {
  items: ResearchItem[];
  lang: Lang;
  dict: Awaited<ReturnType<typeof getDictionary>>;
}

export default function FeaturedResearch({ items, lang, dict }: Props) {
  const [hero, ...rest] = items.slice(0, 4);
  const sides = rest.slice(0, 3);

  if (!hero) return null;

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric', month: 'long',
    });

  const topicOf = (id: string) => {
    const topic = getTopicById(id);
    return { label: topic?.label[lang] ?? '', tone: topic?.tone ?? 'blue' };
  };

  return (
    <div className={`featured-research-grid ${sides.length === 0 ? 'is-hero-only' : ''}`}>
      {/* HERO */}
      <Link href={localizedHref(`activities/research/${hero.slug}`, lang)} className="featured-hero-card">
        <div className={`featured-hero-card__media tone-${topicOf(hero.topicId).tone}`}>
          {hero.imageUrl ? (
            <img src={hero.imageUrl} alt="" />
          ) : (
            <div className="featured-hero-card__icon-stack" aria-hidden="true">
              <div className="t1"><i data-lucide="users" className="icon-xl" /></div>
              <div className="t3"><i data-lucide="brain" className="icon-lg" /></div>
              <div className="t2"><i data-lucide="message-circle-off" className="icon-lg" /></div>
            </div>
          )}
        </div>
        <div className="featured-hero-card__body">
          <span className={`topic-chip topic-chip--${topicOf(hero.topicId).tone}`}>
            {topicOf(hero.topicId).label}
          </span>
          <h3 className="featured-hero-card__title">{hero.title[lang]}</h3>
          <p className="featured-hero-card__excerpt">{hero.excerpt[lang]}</p>
          <div className="featured-hero-card__footer">
            <time>{fmtDate(hero.publishedAt)}</time>
            <span className="dot" aria-hidden="true">·</span>
            <span>{hero.readingTime} {t(dict, 'research.minRead')}</span>
            <span className="featured-hero-card__cta">
              {t(dict, 'common.readMoreInline')}
              <i data-lucide="arrow-right" className="icon-sm" />
            </span>
          </div>
        </div>
      </Link>

      {/* SIDE STACK */}
      {sides.length > 0 && (
        <div className="featured-side-stack">
          {sides.map((item) => (
            <Link key={item.id} href={localizedHref(`activities/research/${item.slug}`, lang)} className="featured-side-card">
              <div className={`featured-side-card__media tone-${topicOf(item.topicId).tone}`}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" loading="lazy" />
                ) : (
                  <div className="featured-side-card__placeholder" aria-hidden="true">
                    <i data-lucide="file-text" className="icon-lg" />
                  </div>
                )}
              </div>
              <div className="featured-side-card__body">
                <span className={`topic-chip topic-chip--${topicOf(item.topicId).tone}`}>
                  {topicOf(item.topicId).label}
                </span>
                <h4 className="featured-side-card__title">{item.title[lang]}</h4>
                <p className="featured-side-card__excerpt">{item.excerpt[lang]}</p>
                <div className="featured-side-card__footer">
                  <time>{fmtDate(item.publishedAt)}</time>
                  <span className="dot" aria-hidden="true">·</span>
                  <span>{item.readingTime} {t(dict, 'research.minRead')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
