import { NextRequest, NextResponse } from 'next/server';
import { LANGS, DEFAULT_LANG } from '@/lib/i18n';

const PUBLIC_FILE = /\.(.*)$/;

function getPreferredLocale(req: NextRequest): string {
  // Honor cookie first, then Accept-Language, then default.
  const fromCookie = req.cookies.get('NEXT_LOCALE')?.value;
  if (fromCookie && (LANGS as readonly string[]).includes(fromCookie)) return fromCookie;

  const accept = req.headers.get('accept-language') ?? '';
  for (const part of accept.split(',')) {
    const code = part.split(';')[0].trim().toLowerCase();
    if (code.startsWith('vi')) return 'vi';
    if (code.startsWith('en')) return 'en';
  }
  return DEFAULT_LANG;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next internals, API routes, admin routes, and static files.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/assets') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Already has a locale segment — let it through.
  const hasLocale = (LANGS as readonly string[]).some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return NextResponse.next();

  // Root or any non-locale path → redirect to preferred locale + same suffix.
  const target = req.nextUrl.clone();
  const locale = getPreferredLocale(req);
  target.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(target);
}

export const config = {
  matcher: ['/((?!_next|api|admin|assets|.*\\..*).*)'],
};
