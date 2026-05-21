/**
 * Thin data access helpers. Frontend pages call these to fetch published content.
 * Admin pages talk to Prisma directly (so they see drafts too).
 */
import 'server-only';
import { prisma } from '@/lib/db';
import type { Lang } from '@/lib/i18n';
import type { BlockNode } from '@/components/editor/BlockRenderer';

// ---------- RESEARCH ----------
export async function listPublishedResearch() {
  return prisma.researchArticle.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    include: { topic: true },
  });
}

export async function getResearchBySlug(slug: string) {
  return prisma.researchArticle.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: { topic: true, author: true },
  });
}

export async function listResearchSlugs() {
  const rows = await prisma.researchArticle.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

// ---------- NEWS ----------
export async function listPublishedNews() {
  return prisma.newsItem.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    include: { category: true },
  });
}

export async function getNewsBySlug(slug: string) {
  return prisma.newsItem.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: { category: true },
  });
}

export async function listNewsSlugs() {
  const rows = await prisma.newsItem.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

// ---------- TOPICS / CATEGORIES ----------
export async function listTopics() {
  return prisma.topic.findMany({ orderBy: { order: 'asc' } });
}

export async function listNewsCategories() {
  return prisma.newsCategory.findMany({ orderBy: { order: 'asc' } });
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
