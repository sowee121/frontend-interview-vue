import type { ChapterDef } from '@/types/qa-content'

import { CHAPTER_ORDER, type ChapterSlug } from '@/data/constants'
import { chapterPayloads } from '@/data/qa/registry'

export type { ChapterDef, TocItem } from '@/types/qa-content'
export { CHAPTER_ORDER, type ChapterSlug }

export const chapters: ChapterDef[] = CHAPTER_ORDER.map((slug) => {
  const p = chapterPayloads[slug]
  return {
    slug: p.slug,
    title: p.title,
    documentTitle: p.documentTitle,
    description: p.description,
    toc: p.items.map((i) => ({ id: i.id, label: i.navLabel })),
  }
})

export const chaptersBySlug: Record<string, ChapterDef> = Object.fromEntries(
  chapters.map((c) => [c.slug, c]),
)

export function getChapterNeighbors(slug: string): {
  prev: ChapterDef | undefined
  next: ChapterDef | undefined
} {
  const i = CHAPTER_ORDER.indexOf(slug as ChapterSlug)
  if (i === -1) return { prev: undefined, next: undefined }
  return {
    prev: i > 0 ? chaptersBySlug[CHAPTER_ORDER[i - 1]!] : undefined,
    next: i < CHAPTER_ORDER.length - 1 ? chaptersBySlug[CHAPTER_ORDER[i + 1]!] : undefined,
  }
}
