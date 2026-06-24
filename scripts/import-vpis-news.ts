/* One-off: scrape the OLD Z&Alpha site (vpis.edu.vn) news section and import
   every article into this site's DB. Idempotent by slug (upsert).

   - Crawls /tin-tuc?page=1..5, collects article cards.
   - Fetches each detail page, converts the HTML body into BlockNote blocks.
   - Re-hosts the hero + every in-body image on Vercel Blob (the source SSL cert
     is expired and the old site is being decommissioned).
   - Infers category from the title, parses a publish date from the body prose.
   - Skips articles already present in the DB (matched by normalized title) and
     collapses numeric-prefixed slug duplicates.

   The source is HTTPS with an EXPIRED certificate, so all fetches go through
   `curl -k` (Node fetch would reject the cert).

   Usage:
     READ:  tsx scripts/import-vpis-news.ts          (no DB writes, no uploads)
     WRITE: tsx scripts/import-vpis-news.ts --write  (uploads images + upserts)
   DATABASE_URL + BLOB_READ_WRITE_TOKEN must be set (loaded from .env). */
import 'dotenv/config';
import { execFileSync } from 'node:child_process';
import * as cheerio from 'cheerio';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import { uploadAsset } from '../src/lib/storage';

const BASE = 'https://vpis.edu.vn';
const PAGES = [1, 2, 3, 4, 5];
const WRITE = process.argv.includes('--write');

// Page-1 articles that already exist in the prod DB as richer, bilingual,
// hand-curated entries (imported via scripts/import-news.ts). Skip the raw
// scrape so we don't duplicate or downgrade them. Matched by source slug
// because the curated titles differ slightly (e.g. VTV: "và" vs "và tới").
const SKIP_SLUGS = new Set([
  'ban-tin-vtv-ve-hoi-thao-mang-xa-hoi-va-toi-suc-khoe-tam-than-cua-thanh-thieu-nien-tai-viet-nam',
  'thong-cao-bao-chi-mang-xa-hoi-va-suc-khoe-tam-than-cua-thanh-thieu-nien-viet-nam',
  'nghien-mang-xa-hoi-gay-ra-cac-tac-dong-tieu-cuc-cho-suc-khoe-tam-than',
  'mat-trai-cua-mang-xa-hoi-gay-anh-huong-tieu-cuc-den-suc-khoe-tam-than',
]);

// ---- block helpers (same shapes as scripts/import-news.ts / BlockRenderer) ----
const p = (text: string) => ({ type: 'paragraph', content: [{ type: 'text', text }] });
const h = (text: string, level: 2 | 3 | 4 = 2) => ({ type: 'heading', props: { level }, content: [{ type: 'text', text }] });
const quote = (text: string) => ({ type: 'quote', content: [{ type: 'text', text }] });
const video = (url: string) => ({ type: 'video', props: { url } });
const divider = () => ({ type: 'divider' });
const bullet = (text: string) => ({ type: 'bulletListItem', content: [{ type: 'text', text }] });
const numbered = (text: string) => ({ type: 'numberedListItem', content: [{ type: 'text', text }] });
const image = (url: string, alt = '') => ({ type: 'image', props: { url, alt } });

// ---- fetch via curl -k (expired cert on source) ----
function curlText(url: string): string {
  return execFileSync('curl', ['-sk', '--max-time', '45', '-A', 'Mozilla/5.0', url], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
}
function curlBuf(url: string): Buffer {
  return execFileSync('curl', ['-sk', '--max-time', '45', '-A', 'Mozilla/5.0', url], {
    maxBuffer: 64 * 1024 * 1024,
  });
}

const absUrl = (src: string): string => {
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('//')) return 'https:' + src;
  if (src.startsWith('/')) return BASE + src;
  return BASE + '/' + src.replace(/^\.?\//, '');
};

// Normalize any YouTube/Vimeo URL to the canonical form VideoEmbed understands
// (it only matches youtube.com/watch?v= , youtu.be/ , vimeo.com/<id>).
const normVideo = (src: string): string => {
  const yt = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/watch?v=${yt[1]}`;
  const vm = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://vimeo.com/${vm[1]}`;
  return src;
};

const slugFromHref = (href: string): string =>
  href.replace(/^https?:\/\/[^/]+\//i, '').replace(/[?#].*$/, '').replace(/\/+$/, '');

const norm = (s: string): string =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, ' ').trim();

const cleanText = ($el: cheerio.Cheerio<any>): string =>
  $el.text().replace(/\s+/g, ' ').trim();

// ---- category inference from title ----
function inferCategory(title: string): 'announcement' | 'press' | 'event' | 'article' {
  const t = title.toLowerCase();
  if (/thông cáo|báo chí|vtv|bản tin|đưa tin|press/.test(t)) return 'press';
  if (/hội thảo|tọa đàm|toạ đàm|diễn đàn|workshop|roundtable|lễ |ra mắt|công bố|sự kiện|giải thưởng|cuộc thi|khóa học|khoá học|training/.test(t)) return 'event';
  if (/thông báo|thư mời|nghị quyết|tuyển/.test(t)) return 'announcement';
  return 'article';
}

// ---- publish date: first d.m.yyyy / d/m/yyyy in body prose ----
function parseDate(bodyText: string): { iso: string; fallback: boolean } {
  const m = bodyText.match(/(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})/);
  if (m) {
    const d = +m[1], mo = +m[2], y = +m[3];
    if (mo >= 1 && mo <= 12 && d >= 1 && d <= 31 && y >= 2010 && y <= 2030) {
      return { iso: new Date(Date.UTC(y, mo - 1, d)).toISOString(), fallback: false };
    }
  }
  return { iso: '', fallback: true };
}

// ---- crawl listing pages ----
interface Card { slug: string; url: string; title: string; thumb: string; excerpt: string }

function crawlListing(): Card[] {
  const cards: Card[] = [];
  const seenSlug = new Set<string>();
  for (const page of PAGES) {
    const html = curlText(`${BASE}/tin-tuc?page=${page}`);
    const $ = cheerio.load(html);
    $('article.item-lastest-news').each((_, el) => {
      const $el = $(el);
      const href = $el.find('a').first().attr('href') || $el.find('.title-news').parent('a').attr('href') || '';
      if (!href) return;
      const url = absUrl(href);
      const slug = slugFromHref(url);
      if (!slug || seenSlug.has(slug)) return;
      seenSlug.add(slug);
      cards.push({
        slug,
        url,
        title: cleanText($el.find('.title-news')),
        thumb: $el.find('img').first().attr('src') || '',
        excerpt: cleanText($el.find('.news-text-container p').first()) || cleanText($el.find('p').first()),
      });
    });
    console.log(`  page ${page}: ${$('article.item-lastest-news').length} cards`);
  }
  return cards;
}

// ---- parse a detail page into { heroSrc, blocks, dateText } ----
function parseDetail(url: string): { heroSrc: string; blocks: any[]; dateText: string } {
  const html = curlText(url);
  const $ = cheerio.load(html);
  let container = $('#primary .lastest-news-detail').first();
  if (!container.length) container = $('.lastest-news-detail').first();
  if (!container.length) container = $('#primary .content.block-content').first();

  const heroSrc = container.find('img').first().attr('src') || '';
  const heroAbs = heroSrc ? absUrl(heroSrc) : '';

  const blocks: any[] = [];
  const seenImg = new Set<string>();
  if (heroAbs) seenImg.add(heroAbs);

  const pushImg = ($img: cheerio.Cheerio<any>) => {
    const src = $img.attr('src');
    if (!src) return;
    const abs = absUrl(src);
    if (seenImg.has(abs)) return;
    seenImg.add(abs);
    blocks.push(image(abs, $img.attr('alt') || ''));
  };

  const walk = (el: cheerio.Cheerio<any>) => {
    el.children().each((_, c) => {
      const node = c as any;
      const tag = (node.tagName || '').toLowerCase();
      const $c = $(c);
      const cls = $c.attr('class') || '';
      if (cls.includes('copyright')) return;
      // footer address block (only a google-maps link, no prose)
      if ($c.find('a[href*="google.com/maps"]').length && !cleanText($c).length) return;

      switch (tag) {
        case 'p': {
          $c.find('img').each((_, im) => pushImg($(im)));
          $c.find('iframe').each((_, fr) => {
            const s = $(fr).attr('src') || '';
            if (/youtube|youtu\.be|vimeo/.test(s)) blocks.push(video(normVideo(s)));
          });
          const txt = cleanText($c);
          if (txt) blocks.push(p(txt));
          break;
        }
        case 'h1': case 'h2': case 'h3': case 'h4': {
          const txt = cleanText($c);
          if (txt) blocks.push(h(txt, tag === 'h4' ? 4 : tag === 'h3' ? 3 : 2));
          break;
        }
        case 'blockquote': {
          const t = cleanText($c);
          if (t) blocks.push(quote(t));
          break;
        }
        case 'hr':
          blocks.push(divider());
          break;
        case 'ul':
          $c.children('li').each((_, li) => { const t = cleanText($(li)); if (t) blocks.push(bullet(t)); });
          break;
        case 'ol':
          $c.children('li').each((_, li) => { const t = cleanText($(li)); if (t) blocks.push(numbered(t)); });
          break;
        case 'img':
          pushImg($c);
          break;
        case 'figure':
          $c.find('img').each((_, im) => pushImg($(im)));
          break;
        case 'iframe': {
          const s = $c.attr('src') || '';
          if (/youtube|youtu\.be|vimeo/.test(s)) blocks.push(video(normVideo(s)));
          break;
        }
        case 'div': case 'section': case 'article': case 'main': case 'span': case 'center':
          walk($c);
          break;
        default: {
          const t = cleanText($c);
          if (t) blocks.push(p(t));
        }
      }
    });
  };
  walk(container);

  return { heroSrc: heroAbs, blocks, dateText: cleanText(container) };
}

// ---- image re-hosting (cache by source URL) ----
const blobCache = new Map<string, string>();
async function rehost(srcAbs: string, slug: string, idx: number): Promise<string | null> {
  if (!srcAbs) return null;
  if (blobCache.has(srcAbs)) return blobCache.get(srcAbs)!;
  try {
    const buf = curlBuf(encodeURI(srcAbs)); // encode spaces etc. in legacy filenames
    if (!buf.length) return null;
    const extMatch = srcAbs.match(/\.(jpe?g|png|gif|webp|svg)(?:[?#].*)?$/i);
    const ext = (extMatch ? extMatch[1] : 'jpg').toLowerCase();
    const res = await uploadAsset(buf, `news/${slug}/${idx}.${ext}`);
    blobCache.set(srcAbs, res.url);
    return res.url;
  } catch (e) {
    console.warn(`    ! image failed: ${srcAbs} (${(e as Error).message})`);
    return null;
  }
}

async function main() {
  if (WRITE && !/^vercel_blob_rw_/.test(process.env.BLOB_READ_WRITE_TOKEN ?? '')) {
    console.error(
      'ERROR: BLOB_READ_WRITE_TOKEN is missing/invalid in .env.\n' +
      'Image upload to Vercel Blob will fail. Set a real token (vercel_blob_rw_...) and re-run.\n' +
      'Get it from: Vercel project → Storage → Blob → .env.local snippet.',
    );
    process.exit(1);
  }
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const cats = await prisma.newsCategory.findMany();
  const catBySlug = new Map(cats.map((c) => [c.slug, c.id]));

  const existing = await prisma.newsItem.findMany({ select: { titleVi: true, slug: true } });
  const existingTitles = new Set(existing.map((e) => norm(e.titleVi)));

  console.log(`Mode: ${WRITE ? 'WRITE' : 'DRY-RUN'}`);
  console.log(`Categories: ${cats.map((c) => c.slug).join(', ')}`);
  console.log(`Existing news in DB: ${existing.length}`);
  console.log('Crawling listing pages...');

  const cards = crawlListing();
  console.log(`Collected ${cards.length} unique article links.\n`);

  // Collapse numeric-prefixed slug duplicates by normalized title (prefer clean slug).
  const byTitle = new Map<string, Card>();
  for (const c of cards) {
    const key = norm(c.title);
    const prev = byTitle.get(key);
    if (!prev) { byTitle.set(key, c); continue; }
    const prevNum = /^\d+-/.test(prev.slug);
    const curNum = /^\d+-/.test(c.slug);
    if (prevNum && !curNum) byTitle.set(key, c); // replace numeric with clean
  }
  const unique = [...byTitle.values()];

  // Fallback dates (for articles with no parseable date) preserve listing order:
  // earlier in the list = newer. Anchor a day before the oldest real date we see,
  // so placeholders never outrank dated articles.
  const FALLBACK_ANCHOR = Date.UTC(2016, 0, 1);

  let created = 0, updated = 0, skipped = 0;
  for (let idx = 0; idx < unique.length; idx++) {
    const card = unique[idx];
    if (SKIP_SLUGS.has(card.slug)) {
      console.log(`- SKIP (curated version already in DB): ${card.slug}`);
      skipped++;
      continue;
    }
    const titleKey = norm(card.title);
    if (existingTitles.has(titleKey)) {
      console.log(`- SKIP (already in DB): ${card.title}`);
      skipped++;
      continue;
    }

    let detail: { heroSrc: string; blocks: any[]; dateText: string };
    try {
      detail = parseDetail(card.url);
    } catch (e) {
      console.log(`- ERROR fetching ${card.slug}: ${(e as Error).message}`);
      continue;
    }

    const category = inferCategory(card.title);
    const categoryId = catBySlug.get(category) ?? null;
    const { iso, fallback } = parseDate(detail.dateText);
    const publishedAt = fallback
      ? new Date(FALLBACK_ANCHOR - idx * 86400000).toISOString()
      : iso;
    const imgCount = detail.blocks.filter((b) => b.type === 'image').length + (detail.heroSrc ? 1 : 0);

    console.log(
      `- ${card.slug}\n    [${category}${categoryId ? '' : ' MISSING'}] blocks=${detail.blocks.length} imgs=${imgCount} ` +
      `date=${publishedAt.slice(0, 10)}${fallback ? ' (FALLBACK)' : ''}`,
    );

    if (!WRITE) continue;

    // Re-host hero + body images.
    let heroUrl: string | null = null;
    let imgIdx = 0;
    if (detail.heroSrc) heroUrl = await rehost(detail.heroSrc, card.slug, imgIdx++);
    for (const b of detail.blocks) {
      if (b.type === 'image') {
        const newUrl = await rehost(b.props.url, card.slug, imgIdx++);
        if (newUrl) b.props.url = newUrl;
        else b.props.__drop = true;
      }
    }
    const blocks = detail.blocks.filter((b) => !(b.type === 'image' && b.props.__drop));

    const excerpt = (card.excerpt || cleanText(cheerio.load(`<x>${detail.blocks.find((b) => b.type === 'paragraph')?.content?.[0]?.text || ''}</x>`)('x'))).slice(0, 280);

    const content = {
      titleVi: card.title,
      titleEn: null,
      excerptVi: excerpt,
      excerptEn: null,
      bodyVi: blocks as object,
      bodyEn: null as unknown as object,
      source: 'Z & Alpha (vpis.edu.vn)',
      status: 'PUBLISHED' as const,
      publishedAt: new Date(publishedAt),
    };
    const wasThere = existing.some((e) => e.slug === card.slug);
    // On update, also backfill heroImage/categoryId (set hero only when we have
    // one, so a failed upload never wipes an existing image).
    const update = { ...content, categoryId, ...(heroUrl ? { heroImage: heroUrl } : {}) };
    await prisma.newsItem.upsert({
      where: { slug: card.slug },
      update,
      create: { ...content, slug: card.slug, heroImage: heroUrl, categoryId },
    });
    if (wasThere) updated++; else created++;
    console.log(`    -> ${wasThere ? 'updated' : 'created'} (hero=${heroUrl ? 'yes' : 'no'})`);
  }

  console.log(`\nDone. ${WRITE ? `created=${created} updated=${updated} ` : ''}skipped=${skipped} of ${unique.length} unique.`);
  if (!WRITE) console.log('(dry-run — re-run with --write to upload images and upsert)');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
