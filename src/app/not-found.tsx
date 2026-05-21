import Link from 'next/link';
import { DEFAULT_LANG, getDictionary, t } from '@/lib/i18n';

export default async function NotFound() {
  const dict = await getDictionary(DEFAULT_LANG);
  return (
    <html>
      <body>
        <section className="section section--narrow">
          <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
            <h1>{t(dict, 'error.404title')}</h1>
            <p>{t(dict, 'error.404body')}</p>
            <p>
              <Link href={`/${DEFAULT_LANG}`} className="btn btn-primary">
                {t(dict, 'error.404cta')}
              </Link>
            </p>
          </div>
        </section>
      </body>
    </html>
  );
}
