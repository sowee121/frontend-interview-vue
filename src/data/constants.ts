export const CHAPTER_ORDER = [
  'javascript',
  'typescript',
  'html-css',
  'browser',
  'network',
  'performance',
  'engineering',
  'react',
  'vue',
  'scenario',
  'coding',
] as const

export type ChapterSlug = (typeof CHAPTER_ORDER)[number]
