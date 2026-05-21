/**
 * Scrape https://z-alpha.org/vi/news (index + each detail page) into NewsItem rows.
 *
 * Strategy:
 *   1. Fetch the index page, extract all article links + index-card metadata.
 *   2. For each article, fetch the detail page; parse the main body into our
 *      BlockNode shape (paragraphs + headings + lists + quotes + images).
 *   3. Repeat for /en/news (same slugs => merge titleEn/bodyEn into existing rows).
 *   4. upsert by slug.
 *
 * Run: npx tsx scripts/scrape-news.ts
 */

import 'dotenv/config';
import * as cheerio from 'cheerio';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import type { BlockNode, InlineRun } from '../src/components/editor/BlockRenderer';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const BASE = 'https://z-alpha.org';

interface ScrapedCard {
  url: string;          // full URL
  slug: string;         // last path segment
  title: string;
  excerpt: string;
  publishedAt?: Date;
  heroImage?: string;
}

interface ScrapedDetail {
  title: string;
  body: BlockNode[];
  heroImage?: string;
}

function extractText($el: cheerio.Cheerio<any>): InlineRun[] {
  // Flatten inner text into a single text run; bold/em are folded for now.
  const txt = $el.text().trim().replace(/\s+/g, ' ');
  if (!txt) return [];
  return [{ type: 'text', text: txt }];
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X) Z-AlphaMigration/1.0' },
  });
  if (!res.ok) throw new Error(`Fetch ${url} → ${res.status}`);
  return res.text();
}

async function scrapeIndex(locale: 'vi' | 'en'): Promise<ScrapedCard[]> {
  const html = await fetchHtml(`${BASE}/${locale}/news`);
  const $ = cheerio.load(html);
  const cards: ScrapedCard[] = [];

  // Try a few common card selectors — the Astro site likely uses .news-card, .card, etc.
  $('a').each((_, el) => {
    const $a = $(el);
    const href = $a.attr('href') ?? '';
    if (!href.includes(`/${locale}/news/`)) return;
    // Filter out anchors that are nav links or same as the index itself
    if (href.endsWith(`/${locale}/news`) || href.endsWith(`/${locale}/news/`)) return;

    const slug = href.split('/').filter(Boolean).pop() ?? '';
    if (!slug || slug === 'news') return;

    // Look for nearest h-tag inside the link for title
    const titleEl = $a.find('h1,h2,h3,h4').first();
    const title = titleEl.text().trim() || $a.text().trim().split('\n')[0]?.trim() || slug;
    const excerpt = $a.find('p').first().text().trim();
    const img = $a.find('img').first().attr('src');

    // Dedup by slug
    if (cards.some((c) => c.slug === slug)) return;

    cards.push({
      url: href.startsWith('http') ? href : `${BASE}${href.startsWith('/') ? '' : '/'}${href}`,
      slug,
      title,
      excerpt,
      heroImage: img ? (img.startsWith('http') ? img : `${BASE}${img.startsWith('/') ? '' : '/'}${img}`) : undefined,
    });
  });

  return cards;
}

async function scrapeDetail(url: string): Promise<ScrapedDetail> {
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  // Locate the main article container
  const $article = $('article, main, .post, .article, .news-article').first();
  const root = $article.length ? $article : $('body');

  const titleEl = root.find('h1').first();
  const title = titleEl.text().trim();

  const heroImage =
    root.find('img').first().attr('src') ||
    $('meta[property="og:image"]').attr('content') ||
    undefined;

  const body: BlockNode[] = [];

  // Walk known content elements in order. Skip the h1 (used as title), header bars, nav.
  root.find('h1, h2, h3, h4, p, ul, ol, blockquote, img, figure').each((_, el) => {
    const $el = $(el);
    // Skip the first h1 we used as title
    if (el === titleEl[0]) return;
    // Skip if inside footer/header/nav
    if ($el.closest('header, footer, nav').length) return;

    const tag = el.tagName?.toLowerCase();
    if (tag === 'p') {
      const txt = $el.text().trim();
      if (txt) body.push({ type: 'paragraph', content: [{ type: 'text', text: txt }] });
    } else if (tag === 'h2' || tag === 'h3' || tag === 'h4') {
      const lvl = tag === 'h2' ? 2 : tag === 'h3' ? 3 : 4;
      const txt = $el.text().trim();
      if (txt) body.push({ type: 'heading', props: { level: lvl }, content: [{ type: 'text', text: txt }] });
    } else if (tag === 'ul') {
      $el.children('li').each((_, li) => {
        const txt = $(li).text().trim();
        if (txt) body.push({ type: 'bulletListItem', content: [{ type: 'text', text: txt }] });
      });
    } else if (tag === 'ol') {
      $el.children('li').each((_, li) => {
        const txt = $(li).text().trim();
        if (txt) body.push({ type: 'numberedListItem', content: [{ type: 'text', text: txt }] });
      });
    } else if (tag === 'blockquote') {
      const txt = $el.text().trim();
      if (txt) body.push({ type: 'quote', content: [{ type: 'text', text: txt }] });
    } else if (tag === 'img' || tag === 'figure') {
      const $img = tag === 'img' ? $el : $el.find('img').first();
      const src = $img.attr('src');
      if (src) {
        const fullSrc = src.startsWith('http') ? src : `${BASE}${src.startsWith('/') ? '' : '/'}${src}`;
        const cap = $el.find('figcaption').first().text().trim() || $img.attr('alt') || undefined;
        body.push({ type: 'image', props: { url: fullSrc, alt: $img.attr('alt') ?? '', caption: cap } });
      }
    }
  });

  return { title, body, heroImage };
}

function guessCategory(title: string): string {
  const t = title.toLowerCase();
  if (/thông cáo|press release|báo chí/.test(t)) return 'press';
  if (/sự kiện|event|workshop|toạ đàm|hội thảo|panel/.test(t)) return 'event';
  if (/thông báo|announcement|chiêu mộ|open call|recruit/.test(t)) return 'announcement';
  return 'article';
}

async function main() {
  console.log('Scraping z-alpha.org news…');

  const viCards = await scrapeIndex('vi');
  console.log(`  Index VI: ${viCards.length} cards`);

  let enCards: ScrapedCard[] = [];
  try {
    enCards = await scrapeIndex('en');
    console.log(`  Index EN: ${enCards.length} cards`);
  } catch {
    console.log('  Index EN: not available (skip)');
  }

  // Fetch all categories so we can attach
  const categories = await prisma.newsCategory.findMany();
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

  let inserted = 0;
  let updated = 0;

  for (const card of viCards) {
    let detailVi: ScrapedDetail;
    try {
      detailVi = await scrapeDetail(card.url);
    } catch (err) {
      console.error(`  ! Skip ${card.slug}: ${(err as Error).message}`);
      continue;
    }

    const enMatch = enCards.find((c) => c.slug === card.slug);
    let detailEn: ScrapedDetail | undefined;
    if (enMatch) {
      try {
        detailEn = await scrapeDetail(enMatch.url);
      } catch { /* swallow */ }
    }

    const categorySlug = guessCategory(card.title);
    const cat = categoryBySlug.get(categorySlug);

    const result = await prisma.newsItem.upsert({
      where: { slug: card.slug },
      update: {
        titleVi: detailVi.title || card.title,
        titleEn: detailEn?.title ?? null,
        excerptVi: card.excerpt || undefined,
        excerptEn: enMatch?.excerpt ?? null,
        bodyVi: detailVi.body as never,
        bodyEn: (detailEn?.body ?? null) as never,
        heroImage: detailVi.heroImage ?? card.heroImage ?? null,
        categoryId: cat?.id ?? null,
        status: 'PUBLISHED',
        publishedAt: card.publishedAt ?? new Date(),
      },
      create: {
        slug: card.slug,
        titleVi: detailVi.title || card.title,
        titleEn: detailEn?.title ?? null,
        excerptVi: card.excerpt || undefined,
        excerptEn: enMatch?.excerpt ?? null,
        bodyVi: detailVi.body as never,
        bodyEn: (detailEn?.body ?? null) as never,
        heroImage: detailVi.heroImage ?? card.heroImage ?? null,
        categoryId: cat?.id ?? null,
        status: 'PUBLISHED',
        publishedAt: card.publishedAt ?? new Date(),
      },
    });

    if (result.createdAt.getTime() === result.updatedAt.getTime()) inserted++;
    else updated++;

    console.log(`  ✓ ${card.slug}: ${detailVi.body.length} blocks${detailEn ? ' + EN' : ''}`);
  }

  console.log(`Done — inserted ${inserted}, updated ${updated}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
