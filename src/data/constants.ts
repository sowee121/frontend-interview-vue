export const CHAPTER_ORDER = [
  'javascript',
  'typescript',
  'html-css',
  'browser',
  'network',
  'performance',
  'engineering',
  'react',
  'vue2',
  'vue3',
  'scenario',
  'coding',
] as const

export type ChapterSlug = (typeof CHAPTER_ORDER)[number]
