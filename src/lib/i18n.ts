import viDict from './dictionaries/vi.json';
import enDict from './dictionaries/en.json';

export const LANGS = ['vi', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'vi';

const dicts = { vi: viDict, en: enDict } as const;

/** Async loader so we mirror the canonical Next 16 i18n shape ({ dictionaries.ts }). */
export async function getDictionary(lang: Lang) {
  return dicts[lang] ?? dicts[DEFAULT_LANG];
}

/**
 * Synchronous translator. Pass in the loaded dictionary so components don't
 * have to be async. Supports {placeholder} interpolation.
 *
 *   const dict = await getDictionary(lang);
 *   <Header label={t(dict, 'nav.research')} />
 */
export function t(
  dict: Awaited<ReturnType<typeof getDictionary>>,
  path: string,
  vars?: Record<string, string | number>
): string {
  const parts = path.split('.');
  let cur: unknown = dict;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as object)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return path;
    }
  }
  let out = typeof cur === 'string' ? cur : path;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.replaceAll(`{${k}}`, String(v));
    }
  }
  return out;
}

/** /<lang>/<path> — adds locale prefix. */
export function localizedHref(path: string, lang: Lang) {
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `/${lang}${clean ? `/${clean}` : ''}`;
}

/** Swap the locale segment in a pathname: /vi/research/foo → /en/research/foo */
export function swapLang(pathname: string, toLang: Lang) {
  return pathname.replace(/^\/(vi|en)(\/|$)/, `/${toLang}$2`);
}

export function isLang(s: string): s is Lang {
  return (LANGS as readonly string[]).includes(s);
}
