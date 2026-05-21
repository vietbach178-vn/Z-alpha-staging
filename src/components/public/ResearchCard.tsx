import Link from 'next/link';
import type { Lang } from '@/lib/i18n';
import { localizedHref, t, getDictionary } from '@/lib/i18n';
import { type ResearchItem, getTopicById } from '@/data/research-sample';

interface Props { item: ResearchItem; lang: Lang; dict: Awaited<ReturnType<typeof getDictionary>> }

export default function ResearchCard({ item, lang, dict }: Props) {
  const topic = getTopicById(item.topicId);
  const topicLabel = topic?.label[lang] ?? '';
  const topicTone = topic?.tone ?? 'blue';

  const date = new Date(item.publishedAt).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric', month: 'long',
  });

  const searchCorpus = [
    item.title[lang], item.title.vi, item.title.en,
    item.excerpt[lang], item.excerpt.vi, item.excerpt.en,
    topicLabel,
  ].join(' ').toLowerCase();

  return (
    <Link
      href={localizedHref(`research/${item.slug}`, lang)}
      className="research-card-v2"
      data-card="true"
      data-topic={item.topicId}
      data-search={searchCorpus}
    >
      <div className="research-card-v2__media">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="" loading="lazy" />
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
          <span className={`topic-chip topic-chip--${topicTone}`}>{topicLabel}</span>
        </div>

        <h3 className="research-card-v2__title">{item.title[lang]}</h3>
        <p className="research-card-v2__excerpt">{item.excerpt[lang]}</p>

        <div className="research-card-v2__footer">
          <time className="research-card-v2__date">{date}</time>
          <span className="research-card-v2__dot" aria-hidden="true">·</span>
          <span className="research-card-v2__read">{item.readingTime} {t(dict, 'research.minRead')}</span>
        </div>
      </div>
    </Link>
  );
}
