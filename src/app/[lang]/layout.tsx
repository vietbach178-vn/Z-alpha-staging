import { notFound } from 'next/navigation';
import { isLang, getDictionary, LANGS } from '@/lib/i18n';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      <a href="#main" className="skip-link">
        {lang === 'vi' ? 'Bỏ qua đến nội dung chính' : 'Skip to main content'}
      </a>
      <Header lang={lang} dict={dict} />
      <main id="main">{children}</main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
