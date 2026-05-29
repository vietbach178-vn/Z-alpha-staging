/**
 * Thin data access helpers. Frontend pages call these to fetch published content.
 * Admin pages talk to Prisma directly (so they see drafts too).
 *
 * Public read paths fall back to an empty list when the database is unreachable,
 * so the public site renders an empty state instead of a 500. Admin code paths
 * should keep calling Prisma directly and surface the real error.
 */
import 'server-only';
import { prisma } from '@/lib/db';
import type { Lang } from '@/lib/i18n';
import type { BlockNode } from '@/components/editor/BlockRenderer';

function isConnError(err: unknown): boolean {
  const e = err as { code?: string; message?: string } | null;
  if (!e) return false;
  if (e.code === 'ECONNREFUSED' || e.code === 'P1001' || e.code === 'P1017') return true;
  return typeof e.message === 'string' && /ECONNREFUSED|Can't reach database/i.test(e.message);
}

async function safeRead<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (isConnError(err)) {
      console.warn(`[repos] ${label}: database unreachable, returning empty result`);
      return fallback;
    }
    throw err;
  }
}

// ---------- RESEARCH ----------
export async function listPublishedResearch() {
  const query = () => prisma.researchArticle.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    include: { topic: true },
  });
  type Rows = Awaited<ReturnType<typeof query>>;
  return safeRead<Rows>('listPublishedResearch', query, [] as Rows);
}

export async function getResearchBySlug(slug: string) {
  const query = () => prisma.researchArticle.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: {
      topic: true,
      author: true,
      attachments: { orderBy: { order: 'asc' } },
    },
  });
  type Row = Awaited<ReturnType<typeof query>>;
  return safeRead<Row>('getResearchBySlug', query, null as Row);
}

export async function listResearchSlugs() {
  return safeRead(
    'listResearchSlugs',
    async () => {
      const rows = await prisma.researchArticle.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true },
      });
      return rows.map((r) => r.slug);
    },
    [] as string[],
  );
}

// ---------- NEWS ----------
export async function listPublishedNews() {
  const query = () => prisma.newsItem.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    include: { category: true },
  });
  type Rows = Awaited<ReturnType<typeof query>>;
  return safeRead<Rows>('listPublishedNews', query, [] as Rows);
}

export async function getNewsBySlug(slug: string) {
  const query = () => prisma.newsItem.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: { category: true },
  });
  type Row = Awaited<ReturnType<typeof query>>;
  return safeRead<Row>('getNewsBySlug', query, null as Row);
}

export async function listNewsSlugs() {
  return safeRead(
    'listNewsSlugs',
    async () => {
      const rows = await prisma.newsItem.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true },
      });
      return rows.map((r) => r.slug);
    },
    [] as string[],
  );
}

// ---------- LIBRARY ----------
export async function listPublishedLibrary() {
  const query = () => prisma.libraryItem.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
  });
  type Rows = Awaited<ReturnType<typeof query>>;
  return safeRead<Rows>('listPublishedLibrary', query, [] as Rows);
}

// ---------- TOPICS / CATEGORIES ----------
export async function listTopics() {
  return safeRead(
    'listTopics',
    () => prisma.topic.findMany({ orderBy: { order: 'asc' } }),
    [] as Awaited<ReturnType<typeof prisma.topic.findMany>>,
  );
}

export async function listNewsCategories() {
  return safeRead(
    'listNewsCategories',
    () => prisma.newsCategory.findMany({ orderBy: { order: 'asc' } }),
    [] as Awaited<ReturnType<typeof prisma.newsCategory.findMany>>,
  );
}

// ---------- SHAPING ----------
type ResearchRow = Awaited<ReturnType<typeof getResearchBySlug>>;
type NewsRow = Awaited<ReturnType<typeof getNewsBySlug>>;

/** Pull the localized body field as BlockNode[]. */
export function pickBody(row: ResearchRow | NewsRow, lang: Lang): BlockNode[] {
  if (!row) return [];
  const body = lang === 'vi' ? row.bodyVi : (row.bodyEn ?? row.bodyVi);
  if (!body) return [];
  return body as unknown as BlockNode[];
}

/** Localized scalar pick. */
export function pickL<T>(viVal: T, enVal: T | null | undefined, lang: Lang): T {
  return (lang === 'en' ? enVal : viVal) ?? viVal;
}
