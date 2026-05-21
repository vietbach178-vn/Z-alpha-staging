import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLang, getDictionary, t } from '@/lib/i18n';
import ContactForm from '@/components/public/ContactForm';

export async function generateMetadata({ params }: PageProps<'/[lang]/contact'>): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: t(dict, 'contact.metaTitle') };
}

export default async function ContactPage({ params }: PageProps<'/[lang]/contact'>) {
  const { lang: rawLang } = await params;
  if (!isLang(rawLang)) notFound();
  const lang = rawLang;
  const dict = await getDictionary(lang);
  const phoneHref = `tel:${t(dict, 'footer.phone').replace(/\s/g, '')}`;

  return (
    <>
      <section className="page-hero">
        <span className="glow glow-blue" />
        <span className="glow glow-teal" />
        <div className="container">
          <span className="hero-eyebrow">
            <i data-lucide="mail" className="icon-sm" />
            {t(dict, 'nav.contact')}
          </span>
          <h1>{t(dict, 'contact.title')}</h1>
          <p className="section-lead">
            {lang === 'vi'
              ? 'Nếu bạn có bất kỳ câu hỏi hoặc quan tâm nào liên quan đến Z & Alpha, vui lòng liên hệ với chúng tôi qua thông tin hoặc form bên cạnh.'
              : 'If you have any questions or concerns about Z & Alpha, please reach out via the info or the form on the side.'}
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 24 }}>
        <div className="container">
          <div className="contact-grid">
            <aside className="contact-info">
              <h2 className="contact-info__title">{lang === 'vi' ? 'Thông tin liên hệ' : 'Contact details'}</h2>

              <div className="contact-info__item">
                <div className="contact-info__icon"><i data-lucide="map-pin" className="icon-md" /></div>
                <div>
                  <p className="contact-info__label">{lang === 'vi' ? 'Địa chỉ' : 'Address'}</p>
                  <p className="contact-info__value">{t(dict, 'footer.address')}</p>
                </div>
              </div>

              <div className="contact-info__item">
                <div className="contact-info__icon"><i data-lucide="phone" className="icon-md" /></div>
                <div>
                  <p className="contact-info__label">{lang === 'vi' ? 'Điện thoại' : 'Phone'}</p>
                  <p className="contact-info__value"><a href={phoneHref}>{t(dict, 'footer.phone')}</a></p>
                </div>
              </div>

              <div className="contact-info__item">
                <div className="contact-info__icon"><i data-lucide="mail" className="icon-md" /></div>
                <div>
                  <p className="contact-info__label">Email</p>
                  <p className="contact-info__value"><a href={`mailto:${t(dict, 'footer.email')}`}>{t(dict, 'footer.email')}</a></p>
                </div>
              </div>
            </aside>

            <ContactForm lang={lang} />
          </div>
        </div>
      </section>
    </>
  );
}
